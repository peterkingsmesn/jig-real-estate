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

interface LanguageSettings {
  locale: string;
  name: string;
  nativeName: string;
  isRTL: boolean;
  dateFormat: string;
  timeFormat: string;
  currency: {
    code: string;
    symbol: string;
    decimals: number;
  };
  numberFormat: {
    decimal: string;
    thousands: string;
  };
}

// 에러 코드 정의
const ErrorCodes = {
  VALIDATION_ERROR: 'DATA_001',
  INTERNAL_SERVER_ERROR: 'SERVER_001',
  NOT_FOUND: 'DATA_002',
} as const;

const supportedLocales: Record<string, LanguageSettings> = {
  'en': {
    locale: 'en',
    name: 'English',
    nativeName: 'English',
    isRTL: false,
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12',
    currency: {
      code: 'PHP',
      symbol: '₱',
      decimals: 2
    },
    numberFormat: {
      decimal: '.',
      thousands: ','
    }
  },
  'ko': {
    locale: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    isRTL: false,
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24',
    currency: {
      code: 'PHP',
      symbol: '₱',
      decimals: 2
    },
    numberFormat: {
      decimal: '.',
      thousands: ','
    }
  },
  'zh': {
    locale: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    isRTL: false,
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24',
    currency: {
      code: 'PHP',
      symbol: '₱',
      decimals: 2
    },
    numberFormat: {
      decimal: '.',
      thousands: ','
    }
  },
  'ja': {
    locale: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    isRTL: false,
    dateFormat: 'YYYY/MM/DD',
    timeFormat: '24',
    currency: {
      code: 'PHP',
      symbol: '₱',
      decimals: 2
    },
    numberFormat: {
      decimal: '.',
      thousands: ','
    }
  },
  'tl': {
    locale: 'tl',
    name: 'Filipino',
    nativeName: 'Filipino',
    isRTL: false,
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12',
    currency: {
      code: 'PHP',
      symbol: '₱',
      decimals: 2
    },
    numberFormat: {
      decimal: '.',
      thousands: ','
    }
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { locale } = req.query;

  if (!locale || typeof locale !== 'string') {
    return res.status(400).json({
      success: false,
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Locale parameter is required'
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/language/[locale]'
    } as ApiErrorResponse);
  }

  try {
    switch (req.method) {
      case 'GET':
        return await handleGetLanguageSettings(req, res, locale);
      default:
        return res.status(405).json({
          success: false,
          error: {
            code: 'METHOD_NOT_ALLOWED',
            message: 'Method not allowed'
          },
          timestamp: new Date().toISOString(),
          path: req.url || '/api/language/[locale]'
        } as ApiErrorResponse);
    }
  } catch (error) {
    console.error('Language API error:', error);
    
    return res.status(500).json({
      success: false,
      error: {
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: 'Failed to process request'
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/language/[locale]'
    } as ApiErrorResponse);
  }
}

async function handleGetLanguageSettings(req: NextApiRequest, res: NextApiResponse, locale: string) {
  const languageSettings = supportedLocales[locale.toLowerCase()];

  if (!languageSettings) {
    return res.status(404).json({
      success: false,
      error: {
        code: ErrorCodes.NOT_FOUND,
        message: `Language '${locale}' is not supported`,
        details: { 
          locale,
          supportedLocales: Object.keys(supportedLocales)
        }
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/language/[locale]'
    } as ApiErrorResponse);
  }

  res.status(200).json({
    success: true,
    data: languageSettings,
    message: `Language settings for '${locale}' retrieved successfully`
  } as ApiResponse<LanguageSettings>);
}