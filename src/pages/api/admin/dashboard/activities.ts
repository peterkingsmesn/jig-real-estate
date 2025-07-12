import { NextApiRequest, NextApiResponse } from 'next';
import { requireRole } from '@/lib/auth';
import { createSuccessResponse, createErrorResponse, ApiError, ErrorCodes } from '@/types/api';

interface RecentActivity {
  id: string;
  type: 'property' | 'user' | 'inquiry' | 'system';
  message: string;
  time: string;
  status: 'pending' | 'urgent' | 'success' | 'info';
  metadata?: {
    userId?: string;
    propertyId?: string;
    inquiryId?: string;
  };
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    const error = new ApiError(
      'Method not allowed',
      ErrorCodes.VALIDATION_ERROR,
      405
    );
    return res.status(405).json(
      createErrorResponse(error, req.url || '/api/admin/dashboard/activities')
    );
  }

  try {
    const activities = await getRecentActivities();
    
    return res.status(200).json(
      createSuccessResponse(activities, 'Recent activities retrieved successfully')
    );
  } catch (error: any) {
    const apiError = new ApiError(
      error.message || 'Failed to retrieve activities',
      ErrorCodes.INTERNAL_SERVER_ERROR,
      500
    );
    
    return res.status(500).json(
      createErrorResponse(apiError, req.url || '/api/admin/dashboard/activities')
    );
  }
};

async function getRecentActivities(): Promise<RecentActivity[]> {
  // 실제 환경에서는 데이터베이스에서 최근 활동 조회
  // 현재는 모의 데이터
  
  const now = Date.now();
  
  return [
    {
      id: 'activity_1',
      type: 'property',
      message: '새로운 매물이 등록되었습니다',
      time: getRelativeTime(now - 2 * 60 * 1000), // 2분 전
      status: 'pending',
      metadata: { propertyId: 'prop_123' }
    },
    {
      id: 'activity_2',
      type: 'user',
      message: '새로운 사용자가 가입했습니다',
      time: getRelativeTime(now - 15 * 60 * 1000), // 15분 전
      status: 'info',
      metadata: { userId: 'user_456' }
    },
    {
      id: 'activity_3',
      type: 'inquiry',
      message: '매물 문의가 들어왔습니다',
      time: getRelativeTime(now - 60 * 60 * 1000), // 1시간 전
      status: 'urgent',
      metadata: { inquiryId: 'inq_789', propertyId: 'prop_111' }
    },
    {
      id: 'activity_4',
      type: 'property',
      message: '매물이 승인되었습니다',
      time: getRelativeTime(now - 2 * 60 * 60 * 1000), // 2시간 전
      status: 'success',
      metadata: { propertyId: 'prop_222' }
    },
    {
      id: 'activity_5',
      type: 'system',
      message: '시스템 백업이 완료되었습니다',
      time: getRelativeTime(now - 3 * 60 * 60 * 1000), // 3시간 전
      status: 'info'
    },
    {
      id: 'activity_6',
      type: 'user',
      message: '사용자가 프로필을 업데이트했습니다',
      time: getRelativeTime(now - 4 * 60 * 60 * 1000), // 4시간 전
      status: 'info',
      metadata: { userId: 'user_333' }
    },
    {
      id: 'activity_7',
      type: 'property',
      message: '매물 가격이 수정되었습니다',
      time: getRelativeTime(now - 5 * 60 * 60 * 1000), // 5시간 전
      status: 'info',
      metadata: { propertyId: 'prop_444' }
    },
    {
      id: 'activity_8',
      type: 'inquiry',
      message: '문의에 답변이 완료되었습니다',
      time: getRelativeTime(now - 6 * 60 * 60 * 1000), // 6시간 전
      status: 'success',
      metadata: { inquiryId: 'inq_555' }
    }
  ];
}

function getRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (days > 0) return `${days}일 전`;
  if (hours > 0) return `${hours}시간 전`;
  if (minutes > 0) return `${minutes}분 전`;
  return '방금 전';
}

// 관리자 권한 필요
export default requireRole('admin', 'super_admin')(handler);