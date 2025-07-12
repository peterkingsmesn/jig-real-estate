import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getPendingProperties } from '../properties/submit';

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

    // 관리자 권한 확인 (실제로는 세션에서 role 확인)
    // if (session.user?.role !== 'admin') {
    //   return res.status(403).json({
    //     success: false,
    //     error: { code: 'FORBIDDEN', message: 'Admin access required' }
    //   });
    // }

    const pendingProperties = getPendingProperties().filter(p => p.status === 'pending');

    return res.status(200).json({
      success: true,
      data: {
        properties: pendingProperties,
        total: pendingProperties.length
      }
    });

  } catch (error) {
    console.error('Error fetching pending properties:', error);
    
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch pending properties'
      }
    });
  }
}