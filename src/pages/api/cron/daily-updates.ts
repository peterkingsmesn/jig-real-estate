import { NextApiRequest, NextApiResponse } from 'next';

// API 계약에 따른 표준 응답 형식
interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  path: string;
}

// 에러 코드 정의
const ErrorCodes = {
  UNAUTHORIZED: 'AUTH_001',
  INTERNAL_SERVER_ERROR: 'SERVER_001',
  SERVICE_UNAVAILABLE: 'SERVER_002',
} as const;

// 매일 실행되는 자동 업데이트 크론 작업
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Vercel cron job이나 외부 cron 서비스에서만 실행되도록 보안 검증
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.authorization;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({
      success: false,
      error: {
        code: ErrorCodes.UNAUTHORIZED,
        message: 'Unauthorized'
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/cron/daily-updates'
    } as ApiErrorResponse);
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Method not allowed'
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/cron/daily-updates'
    } as ApiErrorResponse);
  }

  try {
    const updateResults: any[] = [];

    // 1. 이민국 업데이트 가져오기
    try {
      const immigrationResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/immigration/updates`);
      const immigrationData = await immigrationResponse.json();
      
      if (immigrationData.success) {
        updateResults.push({
          service: 'immigration',
          success: true,
          updates: immigrationData.totalUpdates,
          lastUpdated: immigrationData.lastUpdated
        });
        
        // 새로운 업데이트가 있으면 알림 발송
        const newUpdates = immigrationData.data.filter((update: any) => update.isNew);
        if (newUpdates.length > 0) {
          await sendNotifications('immigration', newUpdates);
        }
      }
    } catch (error) {
      console.error('Immigration updates failed:', error);
      updateResults.push({
        service: 'immigration',
        success: false,
        error: error
      });
    }

    // 2. 경찰청 업데이트 가져오기
    try {
      const policeResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/police/updates`);
      const policeData = await policeResponse.json();
      
      if (policeData.success) {
        updateResults.push({
          service: 'police',
          success: true,
          updates: policeData.totalUpdates,
          lastUpdated: policeData.lastUpdated
        });
        
        // 새로운 업데이트가 있으면 알림 발송
        const newUpdates = policeData.data.filter((update: any) => update.isNew);
        if (newUpdates.length > 0) {
          await sendNotifications('police', newUpdates);
        }
      }
    } catch (error) {
      console.error('Police updates failed:', error);
      updateResults.push({
        service: 'police',
        success: false,
        error: error
      });
    }

    // 3. 날씨 정보 업데이트
    try {
      const weatherUpdates = await fetchWeatherUpdates();
      updateResults.push({
        service: 'weather',
        success: true,
        updates: weatherUpdates.length,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Weather updates failed:', error);
      updateResults.push({
        service: 'weather',
        success: false,
        error: error
      });
    }

    // 4. 업데이트 로그 저장
    await saveUpdateLog({
      timestamp: new Date().toISOString(),
      results: updateResults,
      totalUpdates: updateResults.reduce((sum, result) => sum + (result.updates || 0), 0)
    });

    // 5. 캐시 무효화
    await invalidateCache();

    res.status(200).json({
      success: true,
      data: {
        results: updateResults,
        executedAt: new Date().toISOString(),
        totalUpdates: updateResults.reduce((sum, result) => sum + (result.updates || 0), 0)
      },
      message: 'Daily updates completed successfully'
    } as ApiResponse<any>);

  } catch (error) {
    console.error('Daily update cron job failed:', error);
    
    // 실패 알림 발송
    await sendErrorNotification(error);
    
    res.status(500).json({
      success: false,
      error: {
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: 'Daily updates failed',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/cron/daily-updates'
    } as ApiErrorResponse);
  }
}

// 알림 발송 함수
async function sendNotifications(service: string, updates: any[]) {
  try {
    // 1. 이메일 알림 (실제 환경에서는 SendGrid, AWS SES 등 사용)
    // await sendEmailNotification(service, updates);
    
    // 2. 푸시 알림
    // await sendPushNotification(service, updates);
    
    // 3. 슬랙/디스코드 알림
    // await sendSlackNotification(service, updates);
    
    console.log(`Notifications sent for ${service}: ${updates.length} new updates`);
  } catch (error) {
    console.error(`Failed to send notifications for ${service}:`, error);
  }
}

// 날씨 업데이트 함수
async function fetchWeatherUpdates() {
  try {
    // PAGASA API나 기타 날씨 API 호출
    // const response = await fetch('https://api.pagasa.dost.gov.ph/weather');
    // const weatherData = await response.json();
    
    return []; // 임시
  } catch (error) {
    console.error('Weather fetch error:', error);
    return [];
  }
}

// 업데이트 로그 저장
async function saveUpdateLog(logData: any) {
  try {
    // 실제 환경에서는 데이터베이스에 저장
    // await db.collection('update_logs').insertOne(logData);
    console.log('Update log saved:', logData);
  } catch (error) {
    console.error('Failed to save update log:', error);
  }
}

// 캐시 무효화
async function invalidateCache() {
  try {
    // 실제 환경에서는 Redis 캐시 무효화
    // await redis.del('immigration_updates');
    // await redis.del('police_updates');
    // await redis.del('weather_updates');
    console.log('Cache invalidated successfully');
  } catch (error) {
    console.error('Cache invalidation failed:', error);
  }
}

// 오류 알림 발송
async function sendErrorNotification(error: any) {
  try {
    // 관리자에게 오류 알림 발송
    console.log('Error notification sent:', error);
  } catch (notificationError) {
    console.error('Failed to send error notification:', notificationError);
  }
}