// 로깅 유틸리티
// 개발/프로덕션 환경에 따른 로그 레벨 관리

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export interface LogContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  action?: string;
  component?: string;
  [key: string]: unknown;
}

class Logger {
  private logLevel: LogLevel;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.logLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.WARN;
    
    // 환경 변수로 로그 레벨 오버라이드 가능
    const envLogLevel = process.env.LOG_LEVEL;
    if (envLogLevel) {
      this.logLevel = LogLevel[envLogLevel.toUpperCase() as keyof typeof LogLevel] ?? this.logLevel;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel;
  }

  private formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] ${level}: ${message}${contextStr}`;
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;

    const errorInfo = error instanceof Error 
      ? { message: error.message, stack: error.stack }
      : error;
    
    const fullContext = { ...context, error: errorInfo };
    console.error(this.formatMessage('ERROR', message, fullContext));
  }

  warn(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    console.warn(this.formatMessage('WARN', message, context));
  }

  info(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    console.info(this.formatMessage('INFO', message, context));
  }

  debug(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    console.log(this.formatMessage('DEBUG', message, context));
  }

  // API 호출 전용 로깅
  apiCall(method: string, url: string, context?: LogContext): void {
    this.debug(`API Call: ${method} ${url}`, { 
      ...context, 
      type: 'api_call' 
    });
  }

  // 에러 응답 전용 로깅
  apiError(method: string, url: string, statusCode: number, error: unknown, context?: LogContext): void {
    this.error(`API Error: ${method} ${url} - ${statusCode}`, error, {
      ...context,
      type: 'api_error',
      statusCode
    });
  }

  // 성능 측정 로깅
  performance(operation: string, duration: number, context?: LogContext): void {
    this.info(`Performance: ${operation} took ${duration}ms`, {
      ...context,
      type: 'performance',
      duration
    });
  }

  // 사용자 액션 로깅
  userAction(action: string, userId?: string, context?: LogContext): void {
    this.info(`User Action: ${action}`, {
      ...context,
      type: 'user_action',
      userId
    });
  }
}

// 싱글톤 인스턴스
const logger = new Logger();

export default logger;

// 편의를 위한 직접 함수들
export const logError = (message: string, error?: Error | unknown, context?: LogContext) => 
  logger.error(message, error, context);

export const logWarn = (message: string, context?: LogContext) => 
  logger.warn(message, context);

export const logInfo = (message: string, context?: LogContext) => 
  logger.info(message, context);

export const logDebug = (message: string, context?: LogContext) => 
  logger.debug(message, context);

export const logApiCall = (method: string, url: string, context?: LogContext) => 
  logger.apiCall(method, url, context);

export const logApiError = (method: string, url: string, statusCode: number, error: unknown, context?: LogContext) => 
  logger.apiError(method, url, statusCode, error, context);

export const logPerformance = (operation: string, duration: number, context?: LogContext) => 
  logger.performance(operation, duration, context);

export const logUserAction = (action: string, userId?: string, context?: LogContext) => 
  logger.userAction(action, userId, context);