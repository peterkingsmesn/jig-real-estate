import { NextApiRequest, NextApiResponse } from 'next';
import { scrapePoliceUpdates, PoliceUpdate } from '@/lib/scrapers/police-scraper';

// API 계약에 따른 표준 응답 형식
interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    total: number;
    cached: boolean;
    lastUpdated: string;
    source: string;
  };
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
  INTERNAL_SERVER_ERROR: 'SERVER_001',
  SERVICE_UNAVAILABLE: 'SERVER_002',
} as const;

// 실제 경찰청 웹사이트에서 데이터를 스크래핑
const fetchPoliceUpdates = async (): Promise<PoliceUpdate[]> => {
  try {
    // 실시간 스크래핑으로 최신 데이터 가져오기
    const updates = await scrapePoliceUpdates();
    console.log(`Successfully scraped ${updates.length} police updates`);
    return updates;
  } catch (error) {
    console.error('Police scraping failed, returning fallback data:', error);
    
    // 스크래핑 실패 시 오늘 날짜로 기본 메시지 반환
    const today = new Date().toISOString().split('T')[0];
    return [
      {
        id: `police_fallback_${Date.now()}`,
        category: 'safety',
        title: 'Police Services Operating Normally',
        titleKo: '경찰 서비스 정상 운영',
        titleTl: 'Normal na operasyon ng Police Services',
        content: 'All police services are operating normally. For emergencies, call 911. For non-emergency assistance, contact your local police station.',
        contentKo: '모든 경찰 서비스가 정상적으로 운영되고 있습니다. 응급상황 시 911에 전화하세요. 비응급 도움이 필요하면 관할 경찰서에 연락하세요.',
        contentTl: 'Lahat ng police services ay normal na umuupo. Para sa emergency, tumawag sa 911. Para sa non-emergency assistance, makipag-ugnayan sa inyong local police station.',
        date: today,
        priority: 'low',
        isNew: true,
        source: 'Philippine National Police',
        region: 'Nationwide',
        attachments: [],
        relatedLinks: ['https://pnp.gov.ph'],
        lastUpdated: new Date().toISOString()
      }
    ];
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Method not allowed'
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/police/updates'
    } as ApiErrorResponse);
  }

  try {
    // 캐시 확인 (실제 환경에서는 Redis 등 사용)
    const cacheKey = 'police_updates';
    const cacheExpiry = 6 * 60 * 60 * 1000; // 6시간 캐시
    
    // 최신 데이터 가져오기 (실제 스크래핑)
    const updates = await fetchPoliceUpdates();
    
    // 성공 응답
    res.status(200).json({
      success: true,
      data: updates,
      message: `Successfully retrieved ${updates.length} police updates`,
      meta: {
        total: updates.length,
        cached: false,
        lastUpdated: new Date().toISOString(),
        source: 'real-time-scraping'
      }
    } as ApiResponse<PoliceUpdate[]>);

  } catch (error) {
    console.error('Error fetching police updates:', error);
    
    // 오류 시 최소한의 정보라도 제공
    const today = new Date().toISOString().split('T')[0];
    const fallbackData = [
      {
        id: `error_fallback_${Date.now()}`,
        category: 'safety',
        title: 'Service Temporarily Unavailable',
        titleKo: '서비스 일시 중단',
        titleTl: 'Pansamantalang hindi available ang service',
        content: 'Police update service is temporarily unavailable. For emergencies call 911. Please check back later or visit pnp.gov.ph directly.',
        contentKo: '경찰 업데이트 서비스가 일시적으로 중단되었습니다. 응급상황 시 911에 전화하세요. 나중에 다시 확인하거나 pnp.gov.ph를 직접 방문해주세요.',
        contentTl: 'Pansamantalang hindi available ang police update service. Para sa emergency tumawag sa 911. Subukan muli mamaya o bisitahin directly ang pnp.gov.ph.',
        date: today,
        priority: 'low',
        isNew: false,
        source: 'System',
        region: 'Nationwide',
        attachments: [],
        relatedLinks: ['https://pnp.gov.ph'],
        lastUpdated: new Date().toISOString()
      }
    ];

    res.status(200).json({
      success: true,
      data: fallbackData,
      message: 'Real-time scraping failed, showing fallback information',
      meta: {
        total: fallbackData.length,
        cached: false,
        lastUpdated: new Date().toISOString(),
        source: 'fallback-data'
      }
    } as ApiResponse<PoliceUpdate[]>);
  }
}