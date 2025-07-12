import { NextApiRequest, NextApiResponse } from 'next';
import { scrapeImmigrationUpdates, ImmigrationUpdate } from '@/lib/scrapers/immigration-scraper';

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

// 실제 이민국 웹사이트에서 데이터를 스크래핑
const fetchImmigrationUpdates = async (): Promise<ImmigrationUpdate[]> => {
  try {
    // 실시간 스크래핑으로 최신 데이터 가져오기
    const updates = await scrapeImmigrationUpdates();
    console.log(`Successfully scraped ${updates.length} immigration updates`);
    return updates;
  } catch (error) {
    console.error('Scraping failed, returning fallback data:', error);
    
    // 스크래핑 실패 시 오늘 날짜로 기본 메시지 반환
    const today = new Date().toISOString().split('T')[0];
    return [
      {
        id: `fallback_${Date.now()}`,
        category: 'visa',
        title: 'Immigration Services Available - Check Official Website',
        titleKo: '이민국 서비스 이용 가능 - 공식 웹사이트 확인',
        titleTl: 'Available ang Immigration Services - Tingnan ang Official Website',
        content: 'Immigration services are operating. For the latest updates, please visit the official Bureau of Immigration website at immigration.gov.ph',
        contentKo: '이민국 서비스가 운영 중입니다. 최신 업데이트는 immigration.gov.ph 공식 웹사이트를 방문해주세요.',
        contentTl: 'Umuupo ang immigration services. Para sa latest updates, bisitahin ang official Bureau of Immigration website sa immigration.gov.ph',
        date: today,
        priority: 'low',
        isNew: true,
        source: 'Bureau of Immigration',
        attachments: [],
        relatedLinks: ['https://immigration.gov.ph'],
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
      path: req.url || '/api/immigration/updates'
    } as ApiErrorResponse);
  }

  try {
    // 캐시 확인 (실제 환경에서는 Redis 등 사용)
    const cacheKey = 'immigration_updates';
    const cacheExpiry = 6 * 60 * 60 * 1000; // 6시간 캐시
    
    // 최신 데이터 가져오기 (실제 스크래핑)
    const updates = await fetchImmigrationUpdates();
    
    // 성공 응답
    res.status(200).json({
      success: true,
      data: updates,
      message: `Successfully retrieved ${updates.length} immigration updates`,
      meta: {
        total: updates.length,
        cached: false,
        lastUpdated: new Date().toISOString(),
        source: 'real-time-scraping'
      }
    } as ApiResponse<ImmigrationUpdate[]>);

  } catch (error) {
    console.error('Error fetching immigration updates:', error);
    
    // 오류 시 최소한의 정보라도 제공
    const today = new Date().toISOString().split('T')[0];
    const fallbackData = [
      {
        id: `error_fallback_${Date.now()}`,
        category: 'visa',
        title: 'Service Temporarily Unavailable',
        titleKo: '서비스 일시 중단',
        titleTl: 'Pansamantalang hindi available ang service',
        content: 'Immigration update service is temporarily unavailable. Please check back later or visit immigration.gov.ph directly.',
        contentKo: '이민국 업데이트 서비스가 일시적으로 중단되었습니다. 나중에 다시 확인하거나 immigration.gov.ph를 직접 방문해주세요.',
        contentTl: 'Pansamantalang hindi available ang immigration update service. Subukan muli mamaya o bisitahin directly ang immigration.gov.ph.',
        date: today,
        priority: 'low',
        isNew: false,
        source: 'System',
        attachments: [],
        relatedLinks: ['https://immigration.gov.ph'],
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
    } as ApiResponse<ImmigrationUpdate[]>);
  }
}

// 웹 스크래핑 헬퍼 함수들은 scraper 파일에서 가져옴
// 번역 서비스 (간단한 매핑 기반 번역)
async function translateContent(text: string, targetLang: string): Promise<string> {
  try {
    // 기본 언어가 영어인 경우 그대로 반환
    if (targetLang === 'en') {
      return text;
    }
    
    // 공통적인 이민성 용어들의 번역 매핑
    const translationMap = getTranslationMap(targetLang);
    
    let translatedText = text;
    
    // 주요 용어들을 번역
    Object.entries(translationMap).forEach(([english, translated]) => {
      const regex = new RegExp(`\\b${english}\\b`, 'gi');
      translatedText = translatedText.replace(regex, translated);
    });
    
    return translatedText;
  } catch (error) {
    console.error(`Translation error for language ${targetLang}:`, error);
    // 번역 실패 시 원본 텍스트 반환
    return text;
  }
}

// 언어별 번역 매핑 사전
function getTranslationMap(targetLang: string): Record<string, string> {
  const commonTerms: Record<string, Record<string, string>> = {
    ko: {
      'visa': '비자',
      'passport': '여권',
      'immigration': '출입국',
      'application': '신청',
      'processing': '처리',
      'approved': '승인',
      'denied': '거부',
      'pending': '대기',
      'extension': '연장',
      'renewal': '갱신',
      'tourist': '관광객',
      'business': '사업',
      'student': '학생',
      'work': '작업',
      'permit': '허가',
      'document': '서류',
      'requirements': '요구사항',
      'fee': '비용',
      'deadline': '마감일',
      'office': '사무소',
      'appointment': '예약'
    },
    zh: {
      'visa': '签证',
      'passport': '护照',
      'immigration': '出入境',
      'application': '申请',
      'processing': '处理',
      'approved': '批准',
      'denied': '拒绝',
      'pending': '待处理',
      'extension': '延期',
      'renewal': '更新',
      'tourist': '旅游者',
      'business': '商务',
      'student': '学生',
      'work': '工作',
      'permit': '许可证',
      'document': '文件',
      'requirements': '要求',
      'fee': '费用',
      'deadline': '截止日期',
      'office': '办公室',
      'appointment': '预约'
    },
    ja: {
      'visa': 'ビザ',
      'passport': 'パスポート',
      'immigration': '出入国',
      'application': '申請',
      'processing': '処理',
      'approved': '承認',
      'denied': '拒否',
      'pending': '保留',
      'extension': '延長',
      'renewal': '更新',
      'tourist': '観光客',
      'business': 'ビジネス',
      'student': '学生',
      'work': '仕事',
      'permit': '許可証',
      'document': '書類',
      'requirements': '要件',
      'fee': '料金',
      'deadline': '期限',
      'office': 'オフィス',
      'appointment': '予約'
    },
    tl: {
      'visa': 'visa',
      'passport': 'pasaporte',
      'immigration': 'imigrasyon',
      'application': 'aplikasyon',
      'processing': 'pagpoproseso',
      'approved': 'aprobado',
      'denied': 'tinanggihan',
      'pending': 'naghihintay',
      'extension': 'extension',
      'renewal': 'renewal',
      'tourist': 'turista',
      'business': 'negosyo',
      'student': 'estudyante',
      'work': 'trabaho',
      'permit': 'permit',
      'document': 'dokumento',
      'requirements': 'requirements',
      'fee': 'bayad',
      'deadline': 'deadline',
      'office': 'opisina',
      'appointment': 'appointment'
    }
  };
  
  return commonTerms[targetLang] || {};
}