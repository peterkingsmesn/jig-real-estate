import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { ApiResponse, ApiErrorResponse } from '@/types/api';
import { ErrorCodes, createSuccessResponse, createErrorResponse, ApiError } from '@/types/api';
import { logError, logUserAction, logInfo } from '@/utils/logger';

// 로그인 요청 인터페이스
interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 응답 인터페이스
interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'super_admin';
  };
  expiresIn: number;
}

// 사용자 인터페이스
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
  password: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    const error = new ApiError(
      'Method not allowed',
      ErrorCodes.VALIDATION_ERROR,
      405
    );
    return res.status(405).json(
      createErrorResponse(error, req.url || '/api/auth/login')
    );
  }

  try {
    // Rate limiting 검사 (실제 환경에서는 Redis 등 사용)
    const rateLimitResult = await checkRateLimit(req);
    if (!rateLimitResult.success) {
      const error = new ApiError(
        'Too many login attempts. Please try again later.',
        ErrorCodes.RATE_LIMIT_EXCEEDED,
        429,
        { retryAfter: rateLimitResult.retryAfter }
      );
      return res.status(429).json(
        createErrorResponse(error, req.url || '/api/auth/login')
      );
    }

    // 요청 데이터 검증
    const validationResult = validateLoginRequest(req.body);
    if (!validationResult.success) {
      const error = new ApiError(
        validationResult.message || 'Validation failed',
        ErrorCodes.VALIDATION_ERROR,
        400,
        validationResult.details
      );
      return res.status(400).json(
        createErrorResponse(error, req.url || '/api/auth/login')
      );
    }

    const { email, password }: LoginRequest = req.body;

    // 사용자 조회
    const user = await getUserByEmail(email);
    
    if (!user) {
      const error = new ApiError(
        'Invalid email or password',
        ErrorCodes.INVALID_CREDENTIALS,
        401
      );
      return res.status(401).json(
        createErrorResponse(error, req.url || '/api/auth/login')
      );
    }

    // 계정 활성화 상태 확인
    if (!user.isActive) {
      const error = new ApiError(
        'Account is deactivated',
        ErrorCodes.UNAUTHORIZED,
        401
      );
      return res.status(401).json(
        createErrorResponse(error, req.url || '/api/auth/login')
      );
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      // 로그인 실패 로그
      await logLoginAttempt(email, req, false);
      
      const error = new ApiError(
        'Invalid email or password',
        ErrorCodes.INVALID_CREDENTIALS,
        401
      );
      return res.status(401).json(
        createErrorResponse(error, req.url || '/api/auth/login')
      );
    }

    // JWT 토큰 생성
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret';
    
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = jwt.sign(tokenPayload, jwtSecret, { expiresIn: '1h' });
    const refreshToken = jwt.sign(tokenPayload, refreshSecret, { expiresIn: '7d' });

    // 마지막 로그인 시간 업데이트
    await updateLastLogin(user.id);
    
    // 로그인 성공 로그
    await logLoginAttempt(email, req, true);

    // 성공 응답
    const response: LoginResponse = {
      token: accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      expiresIn: 3600 // 1시간 (초 단위)
    };

    const successResponse = createSuccessResponse(
      response,
      'Login successful'
    );
    res.status(200).json(successResponse);

  } catch (error) {
    logError('Error during login', error, { 
      method: req.method, 
      path: req.url,
      email: req.body?.email 
    });
    
    const apiError = error instanceof ApiError 
      ? error 
      : new ApiError('Internal server error', ErrorCodes.INTERNAL_SERVER_ERROR, 500);
    
    return res.status(apiError.statusCode).json(
      createErrorResponse(apiError, req.url || '/api/auth/login')
    );
  }
}

// Rate limiting 검사
async function checkRateLimit(req: NextApiRequest): Promise<{
  success: boolean;
  retryAfter?: number;
}> {
  // 실제 환경에서는 Redis 등을 사용한 rate limiting
  // const clientIp = req.ip || req.connection.remoteAddress;
  // const key = `login_attempts:${clientIp}`;
  // const attempts = await redis.get(key);
  
  // 간단한 메모리 기반 rate limiting (실제로는 Redis 사용 권장)
  // 여기서는 항상 성공으로 처리
  return { success: true };
}

// 로그인 요청 검증
function validateLoginRequest(data: Record<string, unknown>): {
  success: boolean;
  message?: string;
  details?: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  // 이메일 검증
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (typeof data.email !== 'string') {
    errors.email = 'Email must be a string';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Invalid email format';
  }

  // 비밀번호 검증
  if (!data.password) {
    errors.password = 'Password is required';
  } else if (typeof data.password !== 'string') {
    errors.password = 'Password must be a string';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
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

// 이메일 형식 검증
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 이메일로 사용자 조회
async function getUserByEmail(email: string): Promise<User | null> {
  // 실제 환경에서는 데이터베이스에서 조회
  // const user = await db.collection('users').findOne({ email, role: { $in: ['admin', 'super_admin'] } });
  
  // 현재는 모의 데이터 사용
  const mockUsers = await getMockUsers();
  return mockUsers.find(user => user.email === email) || null;
}

// 마지막 로그인 시간 업데이트
async function updateLastLogin(userId: string): Promise<void> {
  // 실제 환경에서는 데이터베이스 업데이트
  // await db.collection('users').updateOne(
  //   { id: userId },
  //   { $set: { lastLoginAt: new Date().toISOString() } }
  // );
  logInfo(`Last login updated for user ${userId}`, { userId, type: 'login_update' });
}

// 로그인 시도 로그
async function logLoginAttempt(email: string, req: NextApiRequest, success: boolean): Promise<void> {
  // 실제 환경에서는 로그 시스템에 기록
  // await db.collection('login_logs').insertOne({
  //   email,
  //   ip: req.ip || req.connection.remoteAddress,
  //   userAgent: req.headers['user-agent'],
  //   success,
  //   timestamp: new Date().toISOString()
  // });
  
  logUserAction(`Login attempt: ${success ? 'SUCCESS' : 'FAILED'}`, undefined, { 
    email, 
    success, 
    ip: (req as any).ip || (req as any).connection?.remoteAddress,
    userAgent: req.headers['user-agent']
  });
}

// 모의 사용자 데이터
async function getMockUsers(): Promise<User[]> {
  // 실제 비밀번호는 bcrypt로 해시된 상태
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const hashedSuperPassword = await bcrypt.hash('superadmin123', 10);
  
  return [
    {
      id: 'admin_001',
      email: 'admin@jigkorea.com',
      name: 'Admin User',
      role: 'admin',
      password: hashedPassword,
      avatar: '/images/admin-avatar.jpg',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: new Date().toISOString(),
      lastLoginAt: '2023-07-09T15:30:00.000Z',
      isActive: true
    },
    {
      id: 'superadmin_001',
      email: 'superadmin@jigkorea.com',
      name: 'Super Admin',
      role: 'super_admin',
      password: hashedSuperPassword,
      avatar: '/images/superadmin-avatar.jpg',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: new Date().toISOString(),
      lastLoginAt: '2023-07-09T12:00:00.000Z',
      isActive: true
    },
    {
      id: 'admin_002',
      email: 'admin2@jigkorea.com',
      name: 'Admin User 2',
      role: 'admin',
      password: hashedPassword,
      createdAt: '2023-02-01T00:00:00.000Z',
      updatedAt: new Date().toISOString(),
      isActive: false // 비활성화된 계정
    }
  ];
}