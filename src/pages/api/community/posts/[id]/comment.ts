import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateRequest } from '@/lib/auth';
import { createSuccessResponse, createErrorResponse, ApiError, ErrorCodes } from '@/types/api';

interface Comment {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  isLiked: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    const error = new ApiError(
      'Method not allowed',
      ErrorCodes.VALIDATION_ERROR,
      405
    );
    return res.status(405).json(
      createErrorResponse(error, req.url || '/api/community/posts/[id]/comment')
    );
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    const error = new ApiError(
      'Invalid post ID',
      ErrorCodes.VALIDATION_ERROR,
      400
    );
    return res.status(400).json(
      createErrorResponse(error, req.url || '/api/community/posts/[id]/comment')
    );
  }

  try {
    if (req.method === 'GET') {
      // 댓글 목록 조회
      const comments = await getComments(id);
      return res.status(200).json(
        createSuccessResponse(comments, 'Comments retrieved successfully')
      );
    } else {
      // 댓글 작성
      const user = await authenticateRequest(req);
      const { content } = req.body;

      if (!content || typeof content !== 'string' || content.trim().length === 0) {
        const error = new ApiError(
          'Comment content is required',
          ErrorCodes.VALIDATION_ERROR,
          400
        );
        return res.status(400).json(
          createErrorResponse(error, req.url || '/api/community/posts/[id]/comment')
        );
      }

      const comment = await createComment(id, user.id, content);
      return res.status(201).json(
        createSuccessResponse(comment, 'Comment created successfully')
      );
    }
  } catch (error: any) {
    const apiError = new ApiError(
      error.message || 'Failed to process comment',
      ErrorCodes.INTERNAL_SERVER_ERROR,
      500
    );
    
    return res.status(500).json(
      createErrorResponse(apiError, req.url || '/api/community/posts/[id]/comment')
    );
  }
}

async function getComments(postId: string): Promise<Comment[]> {
  // 실제 환경에서는 데이터베이스 조회
  // 현재는 모의 데이터
  return [
    {
      id: 'comment_1',
      postId,
      author: {
        id: 'user_1',
        name: 'Jane Doe',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop'
      },
      content: 'Great post! Very helpful information.',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
      likes: 5,
      isLiked: false
    }
  ];
}

async function createComment(postId: string, userId: string, content: string): Promise<Comment> {
  // 실제 환경에서는 데이터베이스에 저장
  const now = new Date().toISOString();
  
  return {
    id: 'comment_' + Date.now(),
    postId,
    author: {
      id: userId,
      name: 'Current User',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
    },
    content,
    createdAt: now,
    updatedAt: now,
    likes: 0,
    isLiked: false
  };
}