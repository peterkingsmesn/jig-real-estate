import { useState, useEffect, useCallback } from 'react';

interface AutoUpdate {
  id: string;
  category: string;
  title: string;
  titleKo: string;
  titleTl: string;
  content: string;
  contentKo: string;
  contentTl: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  isNew: boolean;
  source: string;
  region?: string;
  attachments: string[];
  relatedLinks: string[];
  lastUpdated: string;
}

interface UpdatesResponse {
  success: boolean;
  data: AutoUpdate[];
  cached: boolean;
  lastUpdated: string;
  totalUpdates: number;
}

interface UseAutoUpdatesProps {
  service: 'immigration' | 'police' | 'weather';
  autoRefresh?: boolean;
  refreshInterval?: number; // 밀리초
}

export const useAutoUpdates = ({ 
  service, 
  autoRefresh = true, 
  refreshInterval = 5 * 60 * 1000 // 5분 기본값
}: UseAutoUpdatesProps) => {
  const [updates, setUpdates] = useState<AutoUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 업데이트 가져오기 함수
  const fetchUpdates = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await fetch(`/api/${service}/updates`);
      const data: UpdatesResponse = await response.json();

      if (data.success) {
        setUpdates(data.data);
        setLastUpdated(data.lastUpdated);
        
        // 새로운 업데이트가 있으면 브라우저 알림
        if (autoRefresh && !isManualRefresh) {
          const newUpdates = data.data.filter(update => update.isNew);
          if (newUpdates.length > 0) {
            showBrowserNotification(service, newUpdates.length);
          }
        }
      } else {
        setError('Failed to fetch updates');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [service, autoRefresh]);

  // 수동 새로고침
  const refreshUpdates = useCallback(() => {
    fetchUpdates(true);
  }, [fetchUpdates]);

  // 브라우저 알림
  const showBrowserNotification = useCallback((service: string, count: number) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const serviceName = service === 'immigration' ? 'Immigration' : 'Police';
      new Notification(`${serviceName} Updates`, {
        body: `${count} new update(s) available`,
        icon: '/icons/notification-icon.png',
        badge: '/icons/badge-icon.png'
      });
    }
  }, []);

  // 알림 권한 요청
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }, []);

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  // 자동 새로고침 설정
  useEffect(() => {
    if (!autoRefresh) return;

    const intervalId = setInterval(() => {
      fetchUpdates();
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [autoRefresh, refreshInterval, fetchUpdates]);

  // 페이지 포커스 시 업데이트 확인
  useEffect(() => {
    const handleFocus = () => {
      if (autoRefresh) {
        fetchUpdates();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [autoRefresh, fetchUpdates]);

  // 온라인 상태 변경 시 업데이트 확인
  useEffect(() => {
    const handleOnline = () => {
      if (autoRefresh) {
        fetchUpdates();
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [autoRefresh, fetchUpdates]);

  return {
    updates,
    loading,
    error,
    lastUpdated,
    isRefreshing,
    refreshUpdates,
    requestNotificationPermission
  };
};

// 실시간 업데이트 상태를 관리하는 컨텍스트 훅
export const useUpdateStatus = () => {
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : true);
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updateLastSync = useCallback(() => {
    setLastSync(new Date().toISOString());
  }, []);

  return {
    isOnline,
    lastSync,
    updateLastSync
  };
};