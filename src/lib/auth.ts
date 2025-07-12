import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextApiRequest } from 'next';

export interface JWTPayload {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'super_admin';
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'super_admin';
  avatar?: string;
}

export class AuthError extends Error {
  constructor(public message: string, public statusCode: number = 401) {
    super(message);
    this.name = 'AuthError';
  }
}

export function generateAccessToken(payload: JWTPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign(payload, secret, { expiresIn: '1h' });
}

export function generateRefreshToken(payload: JWTPayload): string {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) {
    throw new Error('REFRESH_TOKEN_SECRET is not defined');
  }
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): JWTPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  try {
    return jwt.verify(token, secret) as JWTPayload;
  } catch (error) {
    throw new AuthError('Invalid or expired token');
  }
}

export function verifyRefreshToken(token: string): JWTPayload {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) {
    throw new Error('REFRESH_TOKEN_SECRET is not defined');
  }
  
  try {
    return jwt.verify(token, secret) as JWTPayload;
  } catch (error) {
    throw new AuthError('Invalid or expired refresh token');
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function extractTokenFromHeader(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

export async function authenticateRequest(req: NextApiRequest): Promise<AuthUser> {
  const token = extractTokenFromHeader(req);
  if (!token) {
    throw new AuthError('No authentication token provided');
  }
  
  const payload = verifyAccessToken(token);
  
  // 실제 환경에서는 DB에서 사용자 정보 조회
  // const user = await getUserById(payload.id);
  // if (!user) throw new AuthError('User not found');
  
  // 임시로 payload 기반으로 사용자 정보 반환
  return {
    id: payload.id,
    email: payload.email,
    name: payload.email.split('@')[0],
    role: payload.role
  };
}

export function requireAuth(handler: Function) {
  return async (req: NextApiRequest, res: any) => {
    try {
      const user = await authenticateRequest(req);
      (req as any).user = user;
      return handler(req, res);
    } catch (error) {
      if (error instanceof AuthError) {
        return res.status(error.statusCode).json({
          success: false,
          error: {
            code: 'AUTHENTICATION_FAILED',
            message: error.message
          }
        });
      }
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred'
        }
      });
    }
  };
}

export function requireRole(...roles: string[]) {
  return (handler: Function) => {
    return requireAuth(async (req: any, res: any) => {
      const user = req.user as AuthUser;
      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'INSUFFICIENT_PERMISSIONS',
            message: 'You do not have permission to access this resource'
          }
        });
      }
      return handler(req, res);
    });
  };
}