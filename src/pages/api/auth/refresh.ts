import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

// API 계약에 따른 표준 응답 형식
interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  path: string;
}

// 토큰 갱신 요청 인터페이스
interface RefreshTokenRequest {
  refreshToken: string;
}

// 토큰 갱신 응답 인터페이스
interface RefreshTokenResponse {
  token: string;
  expiresIn: number;
}

// 에러 코드 정의
const ErrorCodes = {
  VALIDATION_ERROR: 'DATA_001',
  INVALID_TOKEN: 'AUTH_002',
  TOKEN_EXPIRED: 'AUTH_003',
  UNAUTHORIZED: 'AUTH_001',
  INTERNAL_SERVER_ERROR: 'SERVER_001',
} as const;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Method not allowed'
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/auth/refresh'
    } as ApiErrorResponse);
  }

  try {
    // 요청 데이터 검증
    const validationResult = validateRefreshRequest(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: ErrorCodes.VALIDATION_ERROR,
          message: validationResult.message,
          details: validationResult.details
        },
        timestamp: new Date().toISOString(),
        path: req.url || '/api/auth/refresh'
      } as ApiErrorResponse);
    }

    const { refreshToken }: RefreshTokenRequest = req.body;

    // 리프레시 토큰 검증
    const tokenValidationResult = await validateRefreshToken(refreshToken);
    if (!tokenValidationResult.success) {
      return res.status(tokenValidationResult.status || 401).json({
        success: false,
        error: tokenValidationResult.error,
        timestamp: new Date().toISOString(),
        path: req.url || '/api/auth/refresh'
      } as ApiErrorResponse);
    }

    const decoded = tokenValidationResult.decoded;

    // 사용자 존재 및 활성 상태 확인
    const userValidationResult = await validateUser(decoded.id);
    if (!userValidationResult.success) {
      return res.status(401).json({
        success: false,
        error: {
          code: ErrorCodes.UNAUTHORIZED,
          message: userValidationResult.message
        },
        timestamp: new Date().toISOString(),
        path: req.url || '/api/auth/refresh'
      } as ApiErrorResponse);
    }

    // 새로운 액세스 토큰 생성
    const newAccessToken = await generateNewAccessToken({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    });

    // 토큰 갱신 로그
    await logTokenRefresh(decoded.id, req);

    // 성공 응답
    const response: RefreshTokenResponse = {
      token: newAccessToken,
      expiresIn: 3600 // 1시간 (초 단위)
    };

    res.status(200).json({
      success: true,
      data: response,
      message: 'Token refreshed successfully'
    } as ApiResponse<RefreshTokenResponse>);

  } catch (error) {
    console.error('Error refreshing token:', error);
    
    return res.status(500).json({
      success: false,
      error: {
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: 'Internal server error'
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/auth/refresh'
    } as ApiErrorResponse);
  }
}

// 리프레시 요청 검증
function validateRefreshRequest(data: any): {
  success: boolean;
  message?: string;
  details?: any;
} {
  const errors: any = {};

  // 리프레시 토큰 검증
  if (!data.refreshToken) {
    errors.refreshToken = 'Refresh token is required';
  } else if (typeof data.refreshToken !== 'string') {
    errors.refreshToken = 'Refresh token must be a string';
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: 'Validation failed',
      details: errors
    };
  }

  return { success: true };
}

// 리프레시 토큰 검증
async function validateRefreshToken(refreshToken: string): Promise<{
  success: boolean;
  status?: number;
  error?: any;
  decoded?: any;
}> {
  try {
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret';
    
    // JWT 토큰 검증
    const decoded = jwt.verify(refreshToken, refreshSecret) as any;
    
    // 토큰이 블랙리스트에 있는지 확인 (실제 환경에서)
    const isBlacklisted = await isTokenBlacklisted(refreshToken);
    if (isBlacklisted) {
      return {
        success: false,
        status: 401,
        error: {
          code: ErrorCodes.INVALID_TOKEN,
          message: 'Token has been revoked'
        }
      };
    }

    return {
      success: true,
      decoded
    };

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return {
        success: false,
        status: 401,
        error: {
          code: ErrorCodes.TOKEN_EXPIRED,
          message: 'Refresh token has expired'
        }
      };
    } else if (error instanceof jwt.JsonWebTokenError) {
      return {
        success: false,
        status: 401,
        error: {
          code: ErrorCodes.INVALID_TOKEN,
          message: 'Invalid refresh token'
        }
      };
    }
    
    throw error;
  }
}

// 사용자 유효성 검증
async function validateUser(userId: string): Promise<{
  success: boolean;
  message?: string;
}> {
  // 실제 환경에서는 데이터베이스에서 사용자 조회
  // const user = await db.collection('users').findOne({ id: userId });
  
  // 현재는 모의 검증
  const mockUsers = [
    { id: 'admin_001', isActive: true },
    { id: 'superadmin_001', isActive: true },
    { id: 'admin_002', isActive: false }
  ];
  
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    return {
      success: false,
      message: 'User not found'
    };
  }
  
  if (!user.isActive) {
    return {
      success: false,
      message: 'User account is deactivated'
    };
  }
  
  return { success: true };
}

// 새로운 액세스 토큰 생성
async function generateNewAccessToken(payload: {
  id: string;
  email: string;
  role: string;
}): Promise<string> {
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  
  return jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
}

// 토큰 블랙리스트 확인
async function isTokenBlacklisted(token: string): Promise<boolean> {
  // 실제 환경에서는 Redis나 데이터베이스에서 확인
  // const isBlacklisted = await redis.sismember('blacklisted_tokens', token);
  // return isBlacklisted === 1;
  
  // 현재는 항상 false 반환
  return false;
}

// 토큰 갱신 로그
async function logTokenRefresh(userId: string, req: NextApiRequest): Promise<void> {
  // 실제 환경에서는 로그 시스템에 기록
  // await db.collection('token_refresh_logs').insertOne({
  //   userId,
  //   ip: req.ip || req.connection.remoteAddress,
  //   userAgent: req.headers['user-agent'],
  //   timestamp: new Date().toISOString()
  // });
  
  console.log(`Token refreshed for user ${userId}`);
}