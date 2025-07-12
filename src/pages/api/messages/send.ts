import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

interface MessageData {
  toEmail: string;
  subject: string;
  content: string;
  fromUserId: string;
  fromUserName: string;
  fromUserEmail: string;
}

// 임시 메시지 저장소 (실제로는 데이터베이스 사용)
let messages: any[] = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
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

    const { toEmail, subject, content } = req.body;

    // 유효성 검사
    if (!toEmail || !content) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Recipient email and content are required' }
      });
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(toEmail)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid email format' }
      });
    }

    // 자기 자신에게 보내는지 확인
    if (toEmail === session.user?.email) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Cannot send message to yourself' }
      });
    }

    const messageData: MessageData = {
      toEmail,
      subject: subject || '(제목 없음)',
      content,
      fromUserId: session.user?.email || '',
      fromUserName: session.user?.name || '',
      fromUserEmail: session.user?.email || ''
    };

    // 메시지 생성
    const newMessage = {
      id: `msg_${Date.now()}`,
      ...messageData,
      isRead: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 임시 저장 (실제로는 데이터베이스에 저장)
    messages.push(newMessage);

    console.log(`새 메시지: ${messageData.fromUserName} → ${messageData.toEmail}`);
    console.log(`제목: ${messageData.subject}`);

    return res.status(200).json({
      success: true,
      data: {
        messageId: newMessage.id,
        message: 'Message sent successfully'
      }
    });

  } catch (error) {
    console.error('Error sending message:', error);
    
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to send message'
      }
    });
  }
}

// 메시지 조회 함수들 (다른 API에서 사용)
export function getMessagesForUser(userEmail: string) {
  return messages.filter(msg => 
    msg.toEmail === userEmail || msg.fromUserEmail === userEmail
  );
}

export function getConversationBetweenUsers(user1Email: string, user2Email: string) {
  return messages.filter(msg => 
    (msg.fromUserEmail === user1Email && msg.toEmail === user2Email) ||
    (msg.fromUserEmail === user2Email && msg.toEmail === user1Email)
  ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function markMessageAsRead(messageId: string) {
  const messageIndex = messages.findIndex(msg => msg.id === messageId);
  if (messageIndex !== -1) {
    messages[messageIndex].isRead = true;
    messages[messageIndex].updatedAt = new Date().toISOString();
    return messages[messageIndex];
  }
  return null;
}