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

interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isRTL: boolean;
  isDefault: boolean;
}

// 에러 코드 정의
const ErrorCodes = {
  VALIDATION_ERROR: 'DATA_001',
  INTERNAL_SERVER_ERROR: 'SERVER_001',
} as const;

const supportedLanguages: SupportedLanguage[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    isRTL: false,
    isDefault: true
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    isRTL: false,
    isDefault: false
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    isRTL: false,
    isDefault: false
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    isRTL: false,
    isDefault: false
  },
  {
    code: 'tl',
    name: 'Filipino',
    nativeName: 'Filipino',
    flag: '🇵🇭',
    isRTL: false,
    isDefault: false
  }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return await handleGetLanguages(req, res);
      default:
        return res.status(405).json({
          success: false,
          error: {
            code: 'METHOD_NOT_ALLOWED',
            message: 'Method not allowed'
          },
          timestamp: new Date().toISOString(),
          path: req.url || '/api/language'
        } as ApiErrorResponse);
    }
  } catch (error) {
    console.error('Languages API error:', error);
    
    return res.status(500).json({
      success: false,
      error: {
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: 'Failed to process request'
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/language'
    } as ApiErrorResponse);
  }
}

async function handleGetLanguages(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    success: true,
    data: supportedLanguages,
    message: 'Supported languages retrieved successfully'
  } as ApiResponse<SupportedLanguage[]>);
}