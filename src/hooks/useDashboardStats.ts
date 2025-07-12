import { useState, useEffect } from 'react';

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

interface RecentActivity {
  id: string;
  type: 'property' | 'user' | 'inquiry' | 'system';
  message: string;
  time: string;
  status: 'pending' | 'urgent' | 'success' | 'info';
}

export function useDashboardStats(dateRange: string = '7days') {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    activeProperties: 0,
    totalUsers: 0,
    newUsers: 0,
    totalInquiries: 0,
    newInquiries: 0,
    monthlyRevenue: 0,
    revenueGrowth: 0
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 통계 데이터 가져오기
      const statsResponse = await fetch(`/api/admin/dashboard/stats?range=${dateRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!statsResponse.ok) {
        throw new Error('Failed to fetch stats');
      }

      const statsData = await statsResponse.json();
      setStats(statsData.data);

      // 최근 활동 가져오기
      const activitiesResponse = await fetch('/api/admin/dashboard/activities', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!activitiesResponse.ok) {
        throw new Error('Failed to fetch activities');
      }

      const activitiesData = await activitiesResponse.json();
      setRecentActivities(activitiesData.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      // 개발 중에는 임시 데이터 사용
      setStats({
        totalProperties: 156,
        activeProperties: 134,
        totalUsers: 892,
        newUsers: 23,
        totalInquiries: 45,
        newInquiries: 12,
        monthlyRevenue: 2450000,
        revenueGrowth: 15.2
      });
      
      setRecentActivities([
        { id: '1', type: 'property', message: '새로운 매물이 등록되었습니다', time: '2분 전', status: 'pending' },
        { id: '2', type: 'user', message: '새로운 사용자가 가입했습니다', time: '15분 전', status: 'info' },
        { id: '3', type: 'inquiry', message: '매물 문의가 들어왔습니다', time: '1시간 전', status: 'urgent' },
        { id: '4', type: 'property', message: '매물이 승인되었습니다', time: '2시간 전', status: 'success' },
        { id: '5', type: 'system', message: '시스템 백업이 완료되었습니다', time: '3시간 전', status: 'info' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    stats,
    recentActivities,
    isLoading,
    error,
    refresh: fetchDashboardData
  };
}