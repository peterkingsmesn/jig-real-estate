import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid message ID' });
  }

  try {
    // 메시지를 읽음으로 표시
    const message = await prisma.message.update({
      where: { id },
      data: {
        read: true
      }
    });

    return res.status(200).json({
      success: true,
      message
    });
  } catch (error) {
    console.error('Mark message as read error:', error);
    
    // 메시지가 없는 경우
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    return res.status(500).json({ error: 'Failed to mark message as read' });
  }
}