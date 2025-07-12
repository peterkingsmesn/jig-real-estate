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
    const {
      receiverId,
      subject,
      content,
      senderName
    } = req.body;

    // 입력값 검증
    if (!receiverId || !subject || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 새 메시지 생성
    const message = await prisma.message.create({
      data: {
        senderId: req.headers['user-id'] as string || 'anonymous',
        senderName: senderName || 'Anonymous User',
        receiverId,
        subject,
        content,
        read: false
      }
    });

    return res.status(201).json({
      success: true,
      message: '메시지가 전송되었습니다.',
      messageId: message.id
    });
  } catch (error) {
    console.error('Send message error:', error);
    return res.status(500).json({ 
      error: '메시지 전송 중 오류가 발생했습니다.' 
    });
  }
}