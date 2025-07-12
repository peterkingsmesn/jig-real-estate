import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateRequest } from '@/lib/auth';
import { createSuccessResponse, createErrorResponse, ApiError, ErrorCodes } from '@/types/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    const error = new ApiError(
      'Method not allowed',
      ErrorCodes.VALIDATION_ERROR,
      405
    );
    return res.status(405).json(
      createErrorResponse(error, req.url || '/api/auth/verify')
    );
  }

  try {
    const user = await authenticateRequest(req);
    
    return res.status(200).json(
      createSuccessResponse({ user }, 'Token verified successfully')
    );
  } catch (error: any) {
    const apiError = new ApiError(
      error.message || 'Token verification failed',
      ErrorCodes.UNAUTHORIZED,
      401
    );
    
    return res.status(401).json(
      createErrorResponse(apiError, req.url || '/api/auth/verify')
    );
  }
}