import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid property ID' });
  }

  try {
    // 좋아요 수 증가
    const property = await prisma.property.update({
      where: { id },
      data: {
        likes: {
          increment: 1
        }
      }
    });

    return res.status(200).json({
      success: true,
      likes: property.likes
    });
  } catch (error) {
    console.error('Like property error:', error);
    
    // 프로퍼티가 없는 경우
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    return res.status(500).json({ error: 'Failed to like property' });
  }
}