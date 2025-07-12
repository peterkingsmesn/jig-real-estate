import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { rejectProperty } from '../properties/submit';

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

    // 관리자 권한 확인 (실제로는 세션에서 role 확인)
    // if (session.user?.role !== 'admin') {
    //   return res.status(403).json({
    //     success: false,
    //     error: { code: 'FORBIDDEN', message: 'Admin access required' }
    //   });
    // }

    const { propertyId, reason } = req.body;

    if (!propertyId) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Property ID is required' }
      });
    }

    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Rejection reason is required' }
      });
    }

    const rejectedProperty = rejectProperty(propertyId, reason);

    if (!rejectedProperty) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Property not found' }
      });
    }

    // 실제 환경에서는 거부 사유를 이메일로 등록자에게 알림
    console.log(`매물 거부됨: ${rejectedProperty.title} (ID: ${propertyId}), 사유: ${reason}`);

    return res.status(200).json({
      success: true,
      data: {
        property: rejectedProperty,
        message: 'Property rejected successfully'
      }
    });

  } catch (error) {
    console.error('Error rejecting property:', error);
    
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to reject property'
      }
    });
  }
}