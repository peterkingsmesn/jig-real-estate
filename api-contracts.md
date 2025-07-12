# API 표준 계약 및 규격

## 기본 API 설계 원칙

### 1. RESTful API 표준 준수
- HTTP 메서드 의미적 사용 (GET, POST, PUT, DELETE)
- 일관된 URL 패턴
- 적절한 HTTP 상태 코드 사용
- JSON 형식 데이터 교환

### 2. 응답 형식 표준화
```typescript
// 성공 응답
interface ApiResponse<T> {
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

// 에러 응답
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
```

## 매물 관련 API

### 1. 매물 조회 API
```typescript
// GET /api/properties
// 쿼리 파라미터
interface PropertyQuery {
  page?: number;        // 페이지 번호 (기본값: 1)
  limit?: number;       // 페이지 크기 (기본값: 20)
  region?: string;      // 지역 필터
  type?: 'house' | 'condo' | 'village';  // 유형 필터
  minPrice?: number;    // 최소 가격
  maxPrice?: number;    // 최대 가격
  bedrooms?: number;    // 침실 수
  bathrooms?: number;   // 욕실 수
  furnished?: boolean;  // 가구 포함 여부
  sortBy?: 'price' | 'date' | 'popularity';
  order?: 'asc' | 'desc';
  language?: 'ko' | 'zh' | 'ja' | 'en';
}

// 응답 데이터
interface PropertyListResponse {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}
```

### 2. 매물 상세 조회 API
```typescript
// GET /api/properties/:id
interface PropertyDetailResponse {
  property: PropertyDetail;
  relatedProperties: Property[];
  viewCount: number;
}
```

### 3. 매물 등록 API (관리자)
```typescript
// POST /api/admin/properties
interface CreatePropertyRequest {
  basicInfo: {
    title: string;
    description: string;
    type: 'house' | 'condo' | 'village';
    region: string;
    address: string;
    price: number;
    currency: 'PHP';
    deposit: number;
  };
  details: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    floor: number;
    furnished: boolean;
    amenities: string[];
  };
  location: {
    latitude: number;
    longitude: number;
    address: string;
    landmark?: string;
  };
  contact: {
    whatsapp?: string;
    telegram?: string;
    email?: string;
    phone?: string;
  };
  images: string[];  // 업로드된 이미지 URL들
  translations: {
    ko?: { title: string; description: string; };
    zh?: { title: string; description: string; };
    ja?: { title: string; description: string; };
    en?: { title: string; description: string; };
  };
}
```

## 이미지 업로드 API

### 1. 이미지 업로드
```typescript
// POST /api/upload/images
// Content-Type: multipart/form-data
interface ImageUploadRequest {
  files: File[];
  propertyId?: string;
  category: 'property' | 'thumbnail' | 'temp';
}

interface ImageUploadResponse {
  images: {
    id: string;
    url: string;
    thumbnailUrl: string;
    originalName: string;
    size: number;
    width: number;
    height: number;
  }[];
}
```

### 2. 이미지 삭제
```typescript
// DELETE /api/upload/images/:id
interface ImageDeleteResponse {
  deleted: boolean;
  message: string;
}
```

## 인증 관련 API

### 1. 관리자 로그인
```typescript
// POST /api/auth/login
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'super_admin';
  };
  expiresIn: number;
}
```

### 2. 토큰 갱신
```typescript
// POST /api/auth/refresh
interface RefreshTokenRequest {
  refreshToken: string;
}

interface RefreshTokenResponse {
  token: string;
  expiresIn: number;
}
```

## 데이터 모델 타입 정의

### 1. 매물 (Property)
```typescript
interface Property {
  id: string;
  title: string;
  description: string;
  type: 'house' | 'condo' | 'village';
  region: string;
  address: string;
  price: number;
  currency: 'PHP';
  deposit: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  floor?: number;
  furnished: boolean;
  amenities: string[];
  images: PropertyImage[];
  location: Location;
  contact: ContactInfo;
  translations: PropertyTranslations;
  status: 'active' | 'inactive' | 'rented';
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
}

interface PropertyImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  alt: string;
  order: number;
  isMain: boolean;
}

interface Location {
  latitude: number;
  longitude: number;
  address: string;
  landmark?: string;
  district?: string;
  city: string;
  province: string;
}

interface ContactInfo {
  whatsapp?: string;
  telegram?: string;
  email?: string;
  phone?: string;
  contactName?: string;
}

interface PropertyTranslations {
  ko?: { title: string; description: string; };
  zh?: { title: string; description: string; };
  ja?: { title: string; description: string; };
  en?: { title: string; description: string; };
}
```

### 2. 사용자 (User)
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}
```

## 에러 코드 정의

### 1. 일반적인 에러 코드
```typescript
const ErrorCodes = {
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
} as const;
```

## API 버전 관리

### 1. URL 기반 버전 관리
```
/api/v1/properties
/api/v1/auth
/api/v1/upload
```

### 2. 헤더 기반 버전 관리
```
Accept: application/json; version=1
API-Version: v1
```

## 보안 고려사항

### 1. 인증 헤더
```
Authorization: Bearer <JWT_TOKEN>
```

### 2. CORS 설정
```typescript
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
};
```

### 3. Rate Limiting
```typescript
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // 최대 요청 수
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
};
```

## 성능 최적화

### 1. 캐싱 전략
```typescript
// Redis 캐싱
const cacheConfig = {
  propertyList: { ttl: 300 }, // 5분
  propertyDetail: { ttl: 600 }, // 10분
  userProfile: { ttl: 900 }, // 15분
};
```

### 2. 페이지네이션
```typescript
const paginationConfig = {
  defaultLimit: 20,
  maxLimit: 100,
  defaultPage: 1,
};
```

### 3. 데이터베이스 최적화
- 적절한 인덱스 설정
- 쿼리 최적화
- 연결 풀 관리
- 읽기 전용 레플리카 활용