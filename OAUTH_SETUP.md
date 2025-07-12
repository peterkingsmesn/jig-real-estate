# OAuth 설정 가이드

## 🚨 401 오류: invalid_client 해결 방법

이 오류는 Google OAuth 클라이언트 설정 문제입니다. 아래 단계를 정확히 따라하세요.

## Google OAuth 설정 (자세한 단계)

### 1단계: Google Cloud Console 설정
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. **새 프로젝트 생성**:
   - 프로젝트 이름: `Philippines Portal` (또는 원하는 이름)
   - 조직: 개인 계정 사용

### 2단계: OAuth 동의 화면 설정 (중요!)
1. **APIs & Services > OAuth consent screen** 클릭
2. **User Type**: External 선택 → Create
3. **App information** 입력:
   - App name: `Philippines Portal`
   - User support email: 본인 이메일
   - Developer contact information: 본인 이메일
4. **Scopes**: 기본값 그대로 (Skip 가능)
5. **Test users**: Skip 가능
6. **Summary**: Create

### 3단계: Credentials 생성
1. **APIs & Services > Credentials** 클릭
2. **+ CREATE CREDENTIALS > OAuth client ID** 클릭
3. **Application type**: Web application 선택
4. **Name**: `Philippines Portal Web Client`
5. **Authorized JavaScript origins**:
   ```
   http://localhost:3005
   ```
6. **Authorized redirect URIs**:
   ```
   http://localhost:3005/api/auth/callback/google
   ```
7. **CREATE** 클릭

### 4단계: 클라이언트 ID 복사
- **Client ID**: `1234567890-abcdefghijklmnop.apps.googleusercontent.com` 형태
- **Client Secret**: `GOCSPX-abcdefghijklmnop` 형태

## Facebook OAuth 설정

1. [Facebook Developers](https://developers.facebook.com/) 접속
2. "My Apps" > "Create App" 선택
3. "Consumer" 타입 선택
4. 앱 정보 입력 후 생성
5. "Facebook Login" 제품 추가
6. Settings > Basic에서:
   - App ID 복사
   - App Secret 복사 (Show 버튼 클릭)
7. Facebook Login > Settings에서:
   - Valid OAuth Redirect URIs:
     - `http://localhost:3005/api/auth/callback/facebook` (개발용)
     - `https://yourdomain.com/api/auth/callback/facebook` (프로덕션용)
8. App ID와 App Secret을 `.env.local`에 추가:
   ```
   FACEBOOK_CLIENT_ID=your-app-id-here
   FACEBOOK_CLIENT_SECRET=your-app-secret-here
   ```

## 환경변수 설정 (.env.local)

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3005
NEXTAUTH_SECRET=your-nextauth-secret-key-here-32-chars-min

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret

# MongoDB
DATABASE_URL=mongodb://localhost:27017/philippines-portal
```

## NEXTAUTH_SECRET 생성

터미널에서 다음 명령어로 안전한 시크릿 키 생성:

```bash
openssl rand -base64 32
```

## 문제 해결

### "Configuration" 오류
- OAuth 클라이언트 ID와 시크릿이 올바르게 설정되었는지 확인
- 환경변수가 제대로 로드되는지 확인 (`console.log(process.env.GOOGLE_CLIENT_ID)`)

### "OAuthAccountNotLinked" 오류
- 같은 이메일로 다른 제공자(Google/Facebook)로 이미 가입한 경우
- 해결: 기존에 사용한 로그인 방법 사용

### "CallbackURL" 오류
- Authorized redirect URIs가 올바르게 설정되었는지 확인
- NEXTAUTH_URL이 올바른지 확인

## 프로덕션 배포 시 주의사항

1. HTTPS 사용 필수
2. NEXTAUTH_URL을 프로덕션 URL로 변경
3. OAuth redirect URIs를 프로덕션 URL로 업데이트
4. 강력한 NEXTAUTH_SECRET 사용