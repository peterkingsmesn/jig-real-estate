# 프로덕션 환경 설정 가이드

## 🔐 필수 환경변수 설정

프로덕션 환경에서는 다음 환경변수들을 반드시 안전한 값으로 변경해야 합니다:

### 1. JWT 관련
```bash
# 강력한 랜덤 문자열로 변경 (최소 32자 이상 권장)
JWT_SECRET=your-super-secure-jwt-secret-key-change-this
REFRESH_TOKEN_SECRET=your-super-secure-refresh-token-secret-change-this

# 생성 예시 (Node.js):
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. 데이터베이스
```bash
# MongoDB Atlas 또는 자체 호스팅 MongoDB URL
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/philippines-portal?retryWrites=true&w=majority

# Redis (캐싱용) - Redis Cloud 또는 자체 호스팅
REDIS_URL=redis://username:password@your-redis-host:6379
```

### 3. 사이트 설정
```bash
# 실제 도메인으로 변경
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Google Analytics (선택사항)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 4. 보안 설정
```bash
# Cron 작업 보안키 (랜덤 문자열)
CRON_SECRET=your-cron-secret-key-change-this

# Rate Limiting 설정
RATE_LIMIT_WINDOW=900000  # 15분 (밀리초)
RATE_LIMIT_MAX_REQUESTS=100  # 최대 요청 수

# 이미지 업로드 설정
MAX_FILE_SIZE=5242880  # 5MB
```

## 🚀 배포 체크리스트

### 1. 환경변수 설정
- [ ] 모든 시크릿 키를 안전한 랜덤 값으로 변경
- [ ] 데이터베이스 연결 정보 설정
- [ ] 도메인 정보 업데이트

### 2. 데이터베이스 준비
- [ ] MongoDB 인스턴스 생성 및 연결 테스트
- [ ] 필요한 인덱스 생성
- [ ] 백업 정책 설정
- [ ] Redis 인스턴스 설정 (선택사항)

### 3. 보안 설정
- [ ] HTTPS 인증서 설정
- [ ] CORS 정책 검토 및 설정
- [ ] Rate limiting 설정 확인
- [ ] 환경변수가 코드에 노출되지 않도록 확인

### 4. 성능 최적화
- [ ] Next.js 프로덕션 빌드 실행
- [ ] 이미지 최적화 설정 확인
- [ ] 캐싱 정책 설정
- [ ] CDN 설정 (선택사항)

### 5. 모니터링
- [ ] Google Analytics 설정
- [ ] 에러 로깅 시스템 구축
- [ ] 성능 모니터링 도구 설정
- [ ] 알림 설정 (서버 다운, 에러율 증가 등)

## 📦 배포 명령어

### Vercel 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 프로덕션 배포
vercel --prod
```

### 자체 서버 배포
```bash
# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm run start
```

### PM2를 사용한 프로세스 관리
```bash
# PM2 설치
npm install -g pm2

# 앱 시작
pm2 start npm --name "philippines-portal" -- start

# 로그 확인
pm2 logs philippines-portal

# 재시작
pm2 restart philippines-portal
```

## 🔒 추가 보안 권장사항

1. **정기적인 의존성 업데이트**
   ```bash
   npm audit
   npm audit fix
   ```

2. **환경변수 관리**
   - 절대 환경변수를 Git에 커밋하지 마세요
   - 팀원들과 안전하게 공유하려면 1Password, Doppler 등 사용

3. **백업 정책**
   - 데이터베이스 일일 백업
   - 이미지 파일 백업
   - 설정 파일 백업

4. **모니터링**
   - 비정상적인 트래픽 감지
   - 에러율 모니터링
   - 서버 리소스 사용량 모니터링

## 📞 문제 발생 시

1. 로그 확인
2. 환경변수 설정 재확인
3. 데이터베이스 연결 상태 확인
4. 네트워크 방화벽 설정 확인