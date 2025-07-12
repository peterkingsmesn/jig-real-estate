# 필리핀 부동산 렌탈 웹사이트 파일 구조

## 전체 프로젝트 구조

```
philippines-rental/
├── README.md
├── workflow.md
├── file-structure.md
├── api-contracts.md
├── package.json
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
│
├── frontend/                     # 프론트엔드 (React/Next.js)
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── logo.png
│   │   └── locales/             # 다국어 파일
│   │       ├── ko.json
│   │       ├── zh.json
│   │       ├── ja.json
│   │       └── en.json
│   │
│   ├── src/
│   │   ├── components/          # 재사용 가능한 컴포넌트
│   │   │   ├── common/          # 공통 컴포넌트
│   │   │   │   ├── Header/
│   │   │   │   │   ├── Header.tsx
│   │   │   │   │   ├── Header.module.css
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Footer/
│   │   │   │   ├── Loading/
│   │   │   │   ├── Modal/
│   │   │   │   └── LanguageSelector/
│   │   │   │
│   │   │   ├── property/        # 매물 관련 컴포넌트
│   │   │   │   ├── PropertyCard/
│   │   │   │   ├── PropertyList/
│   │   │   │   ├── PropertyDetail/
│   │   │   │   ├── PropertyFilter/
│   │   │   │   ├── PropertySearch/
│   │   │   │   └── PropertyGallery/
│   │   │   │
│   │   │   ├── map/             # 지도 관련 컴포넌트
│   │   │   │   ├── GoogleMap/
│   │   │   │   ├── LocationMarker/
│   │   │   │   └── LocationPicker/
│   │   │   │
│   │   │   └── admin/           # 관리자 전용 컴포넌트
│   │   │       ├── AdminHeader/
│   │   │       ├── PropertyForm/
│   │   │       ├── ImageUploader/
│   │   │       ├── Dashboard/
│   │   │       └── PropertyManager/
│   │   │
│   │   ├── pages/               # 페이지 컴포넌트
│   │   │   ├── Home/
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── Home.module.css
│   │   │   │   └── index.ts
│   │   │   ├── PropertyList/
│   │   │   ├── PropertyDetail/
│   │   │   ├── Search/
│   │   │   └── admin/
│   │   │       ├── Login/
│   │   │       ├── Dashboard/
│   │   │       ├── PropertyManagement/
│   │   │       └── Settings/
│   │   │
│   │   ├── hooks/               # 커스텀 훅
│   │   │   ├── useProperties.ts
│   │   │   ├── useAuth.ts
│   │   │   ├── useLanguage.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   └── useImageUpload.ts
│   │   │
│   │   ├── services/            # API 서비스
│   │   │   ├── api.ts          # 기본 API 설정
│   │   │   ├── propertyService.ts
│   │   │   ├── authService.ts
│   │   │   ├── uploadService.ts
│   │   │   └── mapService.ts
│   │   │
│   │   ├── store/               # 상태 관리
│   │   │   ├── index.ts
│   │   │   ├── propertySlice.ts
│   │   │   ├── authSlice.ts
│   │   │   ├── languageSlice.ts
│   │   │   └── filterSlice.ts
│   │   │
│   │   ├── utils/               # 유틸리티 함수
│   │   │   ├── constants.ts
│   │   │   ├── helpers.ts
│   │   │   ├── validation.ts
│   │   │   ├── formatters.ts
│   │   │   └── i18n.ts
│   │   │
│   │   ├── types/               # TypeScript 타입 정의
│   │   │   ├── property.ts
│   │   │   ├── user.ts
│   │   │   ├── api.ts
│   │   │   └── common.ts
│   │   │
│   │   ├── styles/              # 글로벌 스타일
│   │   │   ├── globals.css
│   │   │   ├── variables.css
│   │   │   └── components.css
│   │   │
│   │   └── templates/           # 템플릿 파일
│   │       ├── property/
│   │       │   ├── house-template.json
│   │       │   ├── condo-template.json
│   │       │   └── village-template.json
│   │       └── admin/
│   │           ├── quick-input-template.json
│   │           └── facebook-import-template.json
│   │
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                      # 백엔드 API 서버
│   ├── src/
│   │   ├── controllers/         # 컨트롤러
│   │   │   ├── propertyController.ts
│   │   │   ├── authController.ts
│   │   │   ├── uploadController.ts
│   │   │   └── adminController.ts
│   │   │
│   │   ├── services/            # 비즈니스 로직
│   │   │   ├── propertyService.ts
│   │   │   ├── authService.ts
│   │   │   ├── uploadService.ts
│   │   │   ├── emailService.ts
│   │   │   └── cacheService.ts
│   │   │
│   │   ├── models/              # 데이터 모델
│   │   │   ├── Property.ts
│   │   │   ├── User.ts
│   │   │   ├── Image.ts
│   │   │   └── Location.ts
│   │   │
│   │   ├── routes/              # API 라우트
│   │   │   ├── index.ts
│   │   │   ├── properties.ts
│   │   │   ├── auth.ts
│   │   │   ├── upload.ts
│   │   │   └── admin.ts
│   │   │
│   │   ├── middleware/          # 미들웨어
│   │   │   ├── auth.ts
│   │   │   ├── validation.ts
│   │   │   ├── rateLimit.ts
│   │   │   ├── cors.ts
│   │   │   └── errorHandler.ts
│   │   │
│   │   ├── utils/               # 유틸리티
│   │   │   ├── database.ts
│   │   │   ├── logger.ts
│   │   │   ├── jwt.ts
│   │   │   ├── imageProcessor.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── config/              # 설정 파일
│   │   │   ├── database.ts
│   │   │   ├── redis.ts
│   │   │   ├── cloudinary.ts
│   │   │   └── env.ts
│   │   │
│   │   └── types/               # TypeScript 타입
│   │       ├── property.ts
│   │       ├── user.ts
│   │       ├── api.ts
│   │       └── config.ts
│   │
│   ├── tests/                   # 테스트 파일
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   │
│   ├── migrations/              # 데이터베이스 마이그레이션
│   ├── seeds/                   # 초기 데이터
│   ├── package.json
│   └── tsconfig.json
│
├── database/                    # 데이터베이스 관련
│   ├── schema.sql
│   ├── migrations/
│   ├── seeds/
│   └── backup/
│
├── uploads/                     # 업로드된 파일 (개발용)
│   ├── properties/
│   ├── temp/
│   └── thumbnails/
│
├── docs/                        # 문서
│   ├── api/
│   │   ├── properties.md
│   │   ├── auth.md
│   │   └── upload.md
│   ├── deployment/
│   └── user-guide/
│
├── scripts/                     # 유틸리티 스크립트
│   ├── deploy.sh
│   ├── backup.sh
│   ├── seed-data.ts
│   └── image-optimization.ts
│
└── tools/                       # 개발 도구
    ├── facebook-helper/         # 페이스북 반자동 도구
    │   ├── extension/           # 브라우저 확장
    │   └── bookmarklet/         # 북마클릿
    └── admin-tools/
        ├── bulk-import/
        └── image-batch/
```

## 주요 설계 원칙

### 1. 모듈화 및 재사용성
- 각 컴포넌트는 독립적으로 동작
- 공통 기능은 utils, hooks로 분리
- 타입 정의는 별도 파일로 관리

### 2. 책임 분리
- 컨트롤러: 요청/응답 처리
- 서비스: 비즈니스 로직
- 모델: 데이터 구조
- 미들웨어: 공통 처리

### 3. 확장성 고려
- 새로운 기능 추가 시 기존 코드 수정 최소화
- 플러그인 방식으로 기능 확장 가능
- 설정 파일을 통한 환경별 관리

### 4. 유지보수성
- 명확한 폴더 구조
- 일관된 네이밍 컨벤션
- 충분한 문서화
- 테스트 코드 포함