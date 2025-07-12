import { NextApiRequest, NextApiResponse } from 'next';
import { requireRole } from '@/lib/auth';
import { createSuccessResponse, createErrorResponse, ApiError, ErrorCodes } from '@/types/api';

interface DashboardStats {
  totalProperties: number;
  activeProperties: number;
  totalUsers: number;
  newUsers: number;
  totalInquiries: number;
  newInquiries: number;
  monthlyRevenue: number;
  revenueGrowth: number;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    const error = new ApiError(
      'Method not allowed',
      ErrorCodes.VALIDATION_ERROR,
      405
    );
    return res.status(405).json(
      createErrorResponse(error, req.url || '/api/admin/dashboard/stats')
    );
  }

  try {
    const { range = '7days' } = req.query;
    
    // 날짜 범위 검증
    if (!['7days', '30days', '90days'].includes(range as string)) {
      const error = new ApiError(
        'Invalid date range',
        ErrorCodes.VALIDATION_ERROR,
        400
      );
      return res.status(400).json(
        createErrorResponse(error, req.url || '/api/admin/dashboard/stats')
      );
    }

    const stats = await getDashboardStats(range as string);
    
    return res.status(200).json(
      createSuccessResponse(stats, 'Dashboard stats retrieved successfully')
    );
  } catch (error: any) {
    const apiError = new ApiError(
      error.message || 'Failed to retrieve stats',
      ErrorCodes.INTERNAL_SERVER_ERROR,
      500
    );
    
    return res.status(500).json(
      createErrorResponse(apiError, req.url || '/api/admin/dashboard/stats')
    );
  }
};

async function getDashboardStats(range: string): Promise<DashboardStats> {
  // 실제 환경에서는 데이터베이스에서 통계 계산
  // 현재는 날짜 범위에 따른 모의 데이터
  
  const multiplier = range === '7days' ? 1 : range === '30days' ? 4 : 12;
  
  return {
    totalProperties: 156,
    activeProperties: 134,
    totalUsers: 892,
    newUsers: 23 * multiplier,
    totalInquiries: 45 * multiplier,
    newInquiries: 12 * multiplier,
    monthlyRevenue: 2450000,
    revenueGrowth: range === '7days' ? 15.2 : range === '30days' ? 12.8 : 18.5
  };
}

// 관리자 권한 필요
export default requireRole('admin', 'super_admin')(handler);