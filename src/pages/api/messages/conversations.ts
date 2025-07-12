import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getMessagesForUser } from './send';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' } 
    });
  }

  try {
    const session = await getSession({ req });
    
    if (!session) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      });
    }

    const userEmail = session.user?.email;
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'User email not found' }
      });
    }

    // 사용자의 모든 메시지 가져오기
    const userMessages = getMessagesForUser(userEmail);

    // 대화 상대별로 그룹핑
    const conversationMap = new Map();

    userMessages.forEach(message => {
      const otherUserEmail = message.fromUserEmail === userEmail 
        ? message.toEmail 
        : message.fromUserEmail;
      
      const otherUserName = message.fromUserEmail === userEmail
        ? '알 수 없는 사용자' // 실제로는 사용자 정보를 데이터베이스에서 조회
        : message.fromUserName;

      if (!conversationMap.has(otherUserEmail)) {
        conversationMap.set(otherUserEmail, {
          user: {
            email: otherUserEmail,
            name: otherUserName,
            image: null // 실제로는 사용자 프로필 이미지
          },
          messages: [],
          unreadCount: 0,
          lastMessageAt: message.createdAt
        });
      }

      const conversation = conversationMap.get(otherUserEmail);
      conversation.messages.push(message);
      
      // 받은 메시지 중 읽지 않은 것 카운트
      if (message.toEmail === userEmail && !message.isRead) {
        conversation.unreadCount++;
      }

      // 최신 메시지 시간 업데이트
      if (new Date(message.createdAt) > new Date(conversation.lastMessageAt)) {
        conversation.lastMessageAt = message.createdAt;
      }
    });

    // 대화 목록을 배열로 변환하고 최신순으로 정렬
    const conversations = Array.from(conversationMap.values())
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
      .map(conv => ({
        user: conv.user,
        lastMessage: conv.messages[conv.messages.length - 1],
        unreadCount: conv.unreadCount
      }));

    return res.status(200).json({
      success: true,
      data: {
        conversations,
        total: conversations.length
      }
    });

  } catch (error) {
    console.error('Error fetching conversations:', error);
    
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch conversations'
      }
    });
  }
}