require('dotenv').config({ path: '.env.local' });

function checkOAuthConfig() {
  console.log('🔍 OAuth 설정 검사 중...\n');
  
  const required = [
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
  ];
  
  const optional = [
    'FACEBOOK_CLIENT_ID',
    'FACEBOOK_CLIENT_SECRET'
  ];
  
  let hasErrors = false;
  
  // 필수 설정 검사
  console.log('📋 필수 설정:');
  required.forEach(key => {
    const value = process.env[key];
    if (!value) {
      console.log(`❌ ${key}: 설정되지 않음`);
      hasErrors = true;
    } else if (value.includes('your-') || value.includes('여기에_')) {
      console.log(`⚠️  ${key}: 기본값으로 설정됨 - 실제 값으로 변경 필요`);
      hasErrors = true;
    } else {
      console.log(`✅ ${key}: 설정됨 (${value.substring(0, 10)}...)`);
    }
  });
  
  console.log('\n📋 선택적 설정:');
  optional.forEach(key => {
    const value = process.env[key];
    if (!value) {
      console.log(`⚪ ${key}: 설정되지 않음`);
    } else if (value.includes('your-') || value.includes('여기에_')) {
      console.log(`⚠️  ${key}: 기본값으로 설정됨`);
    } else {
      console.log(`✅ ${key}: 설정됨 (${value.substring(0, 10)}...)`);
    }
  });
  
  // 구체적인 설정 검사
  console.log('\n🔍 상세 검사:');
  
  // NEXTAUTH_URL 검사
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  if (nextAuthUrl) {
    if (nextAuthUrl === 'http://localhost:3005') {
      console.log('✅ NEXTAUTH_URL: 개발 환경 설정 올바름');
    } else {
      console.log(`⚠️  NEXTAUTH_URL: ${nextAuthUrl} (프로덕션 환경인가요?)`);
    }
  }
  
  // NEXTAUTH_SECRET 검사
  const nextAuthSecret = process.env.NEXTAUTH_SECRET;
  if (nextAuthSecret) {
    if (nextAuthSecret.length < 32) {
      console.log('❌ NEXTAUTH_SECRET: 32자 이상이어야 합니다');
      hasErrors = true;
    } else {
      console.log('✅ NEXTAUTH_SECRET: 길이 적절함');
    }
  }
  
  // Google Client ID 검사
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  if (googleClientId) {
    if (googleClientId.endsWith('.apps.googleusercontent.com')) {
      console.log('✅ GOOGLE_CLIENT_ID: Google 형식 올바름');
    } else {
      console.log('❌ GOOGLE_CLIENT_ID: Google OAuth Client ID 형식이 아닙니다');
      console.log('   올바른 형식: 1234567890-abcdefg.apps.googleusercontent.com');
      hasErrors = true;
    }
  }
  
  // Google Client Secret 검사
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (googleClientSecret) {
    if (googleClientSecret.startsWith('GOCSPX-')) {
      console.log('✅ GOOGLE_CLIENT_SECRET: Google 형식 올바름');
    } else {
      console.log('❌ GOOGLE_CLIENT_SECRET: Google OAuth Client Secret 형식이 아닙니다');
      console.log('   올바른 형식: GOCSPX-abcdefghijklmnop');
      hasErrors = true;
    }
  }
  
  console.log('\n📝 결과:');
  if (hasErrors) {
    console.log('❌ OAuth 설정에 문제가 있습니다. 위의 오류들을 수정해주세요.');
    console.log('\n🔧 해결 방법:');
    console.log('1. Google Cloud Console에서 OAuth 클라이언트 생성');
    console.log('2. .env.local 파일에 올바른 값 설정');
    console.log('3. 서버 재시작 (npm run dev)');
    console.log('\n📚 자세한 가이드: OAUTH_SETUP.md 참조');
  } else {
    console.log('✅ 모든 OAuth 설정이 올바릅니다!');
    console.log('\n🚀 테스트 방법:');
    console.log('1. 브라우저에서 로그인 페이지 접속');
    console.log('2. Google 로그인 버튼 클릭');
    console.log('3. 정상 로그인 되는지 확인');
  }
  
  console.log('\n🔍 디버그 API: http://localhost:3005/api/debug/oauth');
}

checkOAuthConfig();