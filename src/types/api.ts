// API 표준 응답 타입들
export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
  path: string;
}

// Weather 관련 타입들
export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  pressure: number;
  description: string;
  icon: string;
  uvIndex: number;
  visibility: number;
  forecast: WeatherForecast[];
  alerts?: WeatherAlert[];
}

export interface WeatherForecast {
  date: string;
  high: number;
  low: number;
  description: string;
  icon: string;
  chanceOfRain: number;
}

export interface WeatherAlert {
  type: string;
  level: string;
  title: string;
  description: string;
  validUntil: string;
}

// Error Codes
export const ErrorCodes = {
  // 인증 관련
  UNAUTHORIZED: 'AUTH_001',
  INVALID_TOKEN: 'AUTH_002',
  TOKEN_EXPIRED: 'AUTH_003',
  INVALID_CREDENTIALS: 'AUTH_004',
  
  // 권한 관련
  FORBIDDEN: 'PERM_001',
  INSUFFICIENT_PERMISSIONS: 'PERM_002',
  
  // 데이터 관련
  VALIDATION_ERROR: 'DATA_001',
  RESOURCE_NOT_FOUND: 'DATA_002',
  DUPLICATE_RESOURCE: 'DATA_003',
  
  // 파일 업로드 관련
  FILE_TOO_LARGE: 'FILE_001',
  INVALID_FILE_TYPE: 'FILE_002',
  UPLOAD_FAILED: 'FILE_003',
  
  // 서버 관련
  INTERNAL_SERVER_ERROR: 'SERVER_001',
  SERVICE_UNAVAILABLE: 'SERVER_002',
  RATE_LIMIT_EXCEEDED: 'SERVER_003',
  
  // 네트워크 관련
  NETWORK_ERROR: 'NETWORK_001',
  TIMEOUT_ERROR: 'NETWORK_002',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

// API 에러 핸들링 유틸리티
export class ApiError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number = 500,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

// API 응답 생성 헬퍼 함수들
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  meta?: ApiResponse<T>['meta']
): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    meta,
  };
}

export function createErrorResponse(
  error: ApiError | Error,
  path: string
): ApiErrorResponse {
  const isApiError = error instanceof ApiError;
  
  return {
    success: false,
    error: {
      code: isApiError ? error.code : ErrorCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
      details: isApiError ? error.details : undefined,
    },
    timestamp: new Date().toISOString(),
    path,
  };
}