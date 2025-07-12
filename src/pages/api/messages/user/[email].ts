import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
// import { getConversationBetweenUsers, markMessageAsRead } from '../send';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { otherUserEmail } = req.query;

  if (req.method === 'GET') {
    return await handleGetConversation(req, res, otherUserEmail as string);
  } else if (req.method === 'PUT') {
    return await handleMarkAsRead(req, res, otherUserEmail as string);
  } else {
    return res.status(405).json({ 
      success: false, 
      error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' } 
    });
  }
}

async function handleGetConversation(req: NextApiRequest, res: NextApiResponse, otherUserEmail: string) {
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

    if (!otherUserEmail) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Other user email is required' }
      });
    }

    // 두 사용자 간의 대화 내역 가져오기
    // TODO: Implement database query for conversation
    const conversation: any[] = [];

    return res.status(200).json({
      success: true,
      data: {
        messages: conversation,
        total: conversation.length
      }
    });

  } catch (error) {
    console.error('Error fetching conversation:', error);
    
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch conversation'
      }
    });
  }
}

async function handleMarkAsRead(req: NextApiRequest, res: NextApiResponse, otherUserEmail: string) {
  try {
    const session = await getSession({ req });
    
    if (!session) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      });
    }

    const { messageId } = req.body;

    if (!messageId) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Message ID is required' }
      });
    }

    // TODO: Implement mark as read in database
    const updatedMessage = { id: messageId, read: true };

    if (!updatedMessage) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Message not found' }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        message: updatedMessage
      }
    });

  } catch (error) {
    console.error('Error marking message as read:', error);
    
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to mark message as read'
      }
    });
  }
}