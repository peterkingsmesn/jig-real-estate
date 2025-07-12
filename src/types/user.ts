// 사용자 및 인증 관련 타입 정의

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  whatsappNumber?: string;
  telegramUsername?: string;
  
  // 프로필 정보
  avatar?: string;
  bio?: string;
  nationality?: string;
  languages: string[]; // ['en', 'ko', 'zh', 'ja']
  
  // 위치 정보
  currentLocation?: {
    regionId: string;
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  // 계정 상태
  accountStatus: 'pending' | 'verified' | 'suspended' | 'banned';
  emailVerified: boolean;
  phoneVerified: boolean;
  identityVerified: boolean;
  
  // 인증 정보
  verification: {
    governmentId?: {
      type: 'passport' | 'drivers_license' | 'national_id';
      number: string;
      imageUrl?: string;
      verified: boolean;
      verifiedAt?: string;
    };
    facebookProfile?: {
      profileUrl: string;
      verified: boolean;
      verifiedAt?: string;
    };
    googleAccount?: {
      email: string;
      verified: boolean;
      verifiedAt?: string;
    };
  };
  
  // 평점 시스템
  rating: {
    average: number; // 0-5
    count: number;
    asPropertyOwner?: number;
    asTenant?: number;
    asBuyer?: number;
    asSeller?: number;
  };
  
  // 거래 통계
  transactionStats: {
    totalListings: number;
    successfulDeals: number;
    reportedCount: number;
    joinedAt: string;
    lastActiveAt: string;
  };
  
  // 권한
  role: 'user' | 'property_owner' | 'agent' | 'admin';
  permissions: string[];
  
  // 설정
  preferences: {
    language: string;
    currency: 'PHP' | 'USD' | 'KRW' | 'CNY' | 'JPY';
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      newMessages: boolean;
      newListings: boolean;
      priceChanges: boolean;
    };
    privacy: {
      showPhoneNumber: boolean;
      showEmail: boolean;
      allowDirectContact: boolean;
    };
  };
  
  // 보안
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    loginHistory: LoginRecord[];
    reportHistory: ReportRecord[];
  };
}

export interface LoginRecord {
  id: string;
  ipAddress: string;
  location?: string;
  device: string;
  browser: string;
  loginAt: string;
  success: boolean;
}

export interface ReportRecord {
  id: string;
  reportedUserId: string;
  reason: 'fraud' | 'spam' | 'inappropriate' | 'fake_listing' | 'scam' | 'other';
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  reportedAt: string;
  resolvedAt?: string;
}

// 회원가입 폼 데이터
export interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  nationality: string;
  currentRegion: string;
  agreedToTerms: boolean;
  agreedToPrivacy: boolean;
  marketingConsent?: boolean;
}

// 로그인 폼 데이터
export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// 신원 인증 단계
export interface VerificationStep {
  step: number;
  title: string;
  titleKo: string;
  description: string;
  descriptionKo: string;
  required: boolean;
  completed: boolean;
  type: 'email' | 'phone' | 'government_id' | 'social_profile' | 'address_proof';
}

// 인증 프로세스 상태
export interface VerificationProcess {
  userId: string;
  currentStep: number;
  totalSteps: number;
  steps: VerificationStep[];
  overallProgress: number; // 0-100
  estimatedTimeToComplete: string; // "5-10 minutes"
  benefits: string[]; // 인증 완료 시 얻는 혜택들
  startedAt: string;
  completedAt?: string;
}

// 사기 방지 관련
export interface SecurityCheck {
  id: string;
  userId: string;
  type: 'new_device' | 'suspicious_location' | 'multiple_reports' | 'fake_documents';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  action: 'monitor' | 'require_verification' | 'temporary_suspend' | 'permanent_ban';
  triggerValue: SecurityTriggerValue;
  checkedAt: string;
  resolvedAt?: string;
  adminNotes?: string;
}

// 보안 체크 트리거 값의 타입
export interface SecurityTriggerValue {
  deviceInfo?: {
    userAgent: string;
    ipAddress: string;
    fingerprint: string;
  };
  location?: {
    country: string;
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  reportCount?: number;
  reportDetails?: string[];
  documentIssues?: {
    type: string;
    description: string;
    severity: 'minor' | 'major' | 'critical';
  }[];
  metadata?: Record<string, string | number | boolean>;
}

// 신뢰도 점수 계산 요소
export interface TrustScore {
  userId: string;
  score: number; // 0-100
  factors: {
    emailVerified: number; // +10
    phoneVerified: number; // +15
    governmentIdVerified: number; // +25
    socialProfileLinked: number; // +10
    addressProofProvided: number; // +15
    positiveReviews: number; // +0-20
    successfulTransactions: number; // +0-15
    accountAge: number; // +0-10 (months)
    reportsAgainst: number; // -5 per report
    suspiciousActivity: number; // -10 to -50
  };
  lastCalculated: string;
  tier: 'new' | 'basic' | 'trusted' | 'verified' | 'premium';
}

// 사용자 권한 시스템
export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'listing' | 'messaging' | 'admin' | 'moderation';
}

export const USER_PERMISSIONS = {
  // 기본 사용자 권한
  VIEW_LISTINGS: 'view_listings',
  CONTACT_OWNERS: 'contact_owners',
  SAVE_FAVORITES: 'save_favorites',
  
  // 검증된 사용자 권한
  CREATE_LISTINGS: 'create_listings',
  SEND_MESSAGES: 'send_messages',
  ACCESS_PREMIUM_FEATURES: 'access_premium_features',
  
  // 신뢰받는 사용자 권한
  INSTANT_MESSAGING: 'instant_messaging',
  PRIORITY_SUPPORT: 'priority_support',
  BULK_OPERATIONS: 'bulk_operations',
  
  // 에이전트/소유자 권한
  MANAGE_MULTIPLE_LISTINGS: 'manage_multiple_listings',
  ACCESS_ANALYTICS: 'access_analytics',
  FEATURED_LISTINGS: 'featured_listings',
  
  // 관리자 권한
  MODERATE_USERS: 'moderate_users',
  MANAGE_REPORTS: 'manage_reports',
  ACCESS_ADMIN_PANEL: 'access_admin_panel',
  SYSTEM_SETTINGS: 'system_settings'
};

// 사용자 등급별 혜택
export const USER_TIER_BENEFITS = {
  new: {
    name: 'New User',
    nameKo: '신규 사용자',
    maxListings: 1,
    canContact: false,
    canMessage: false,
    features: ['view_listings', 'save_favorites']
  },
  basic: {
    name: 'Basic User',
    nameKo: '기본 사용자',
    maxListings: 3,
    canContact: true,
    canMessage: true,
    features: ['view_listings', 'save_favorites', 'contact_owners', 'send_messages']
  },
  trusted: {
    name: 'Trusted User',
    nameKo: '신뢰 사용자',
    maxListings: 10,
    canContact: true,
    canMessage: true,
    features: ['all_basic_features', 'instant_messaging', 'priority_support']
  },
  verified: {
    name: 'Verified User',
    nameKo: '인증 사용자',
    maxListings: 25,
    canContact: true,
    canMessage: true,
    features: ['all_trusted_features', 'premium_listings', 'analytics']
  },
  premium: {
    name: 'Premium User',
    nameKo: '프리미엄 사용자',
    maxListings: 100,
    canContact: true,
    canMessage: true,
    features: ['all_verified_features', 'featured_listings', 'bulk_operations']
  }
};