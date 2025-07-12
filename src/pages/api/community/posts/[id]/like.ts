import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateRequest } from '@/lib/auth';
import { createSuccessResponse, createErrorResponse, ApiError, ErrorCodes } from '@/types/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    const error = new ApiError(
      'Method not allowed',
      ErrorCodes.VALIDATION_ERROR,
      405
    );
    return res.status(405).json(
      createErrorResponse(error, req.url || '/api/community/posts/[id]/like')
    );
  }

  try {
    const user = await authenticateRequest(req);
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      const error = new ApiError(
        'Invalid post ID',
        ErrorCodes.VALIDATION_ERROR,
        400
      );
      return res.status(400).json(
        createErrorResponse(error, req.url || '/api/community/posts/[id]/like')
      );
    }

    if (req.method === 'POST') {
      // 좋아요 추가
      const result = await likePost(id, user.id);
      return res.status(200).json(
        createSuccessResponse(result, 'Post liked successfully')
      );
    } else {
      // 좋아요 취소
      const result = await unlikePost(id, user.id);
      return res.status(200).json(
        createSuccessResponse(result, 'Post unliked successfully')
      );
    }
  } catch (error: any) {
    const apiError = new ApiError(
      error.message || 'Failed to process like',
      ErrorCodes.INTERNAL_SERVER_ERROR,
      500
    );
    
    return res.status(500).json(
      createErrorResponse(apiError, req.url || '/api/community/posts/[id]/like')
    );
  }
}

async function likePost(postId: string, userId: string) {
  // 실제 환경에서는 데이터베이스 업데이트
  // 현재는 모의 응답
  return {
    postId,
    userId,
    liked: true,
    totalLikes: 24 // 임시 값
  };
}

async function unlikePost(postId: string, userId: string) {
  // 실제 환경에서는 데이터베이스 업데이트
  // 현재는 모의 응답
  return {
    postId,
    userId,
    liked: false,
    totalLikes: 23 // 임시 값
  };
}