import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, content, category, tags } = req.body;
    
    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const post = await prisma.communityPost.create({
      data: {
        title,
        content,
        category,
        tags: tags || [],
        authorId: req.headers['user-id'] as string || 'anonymous',
        authorName: req.headers['user-name'] as string || 'Anonymous User'
      }
    });

    return res.status(201).json({ 
      success: true,
      message: '게시글이 작성되었습니다.',
      postId: post.id
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ error: 'Failed to create post' });
  }
}