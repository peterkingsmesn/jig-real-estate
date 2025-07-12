import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface LoginData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { redirect } = router.query;
  const { login, loginWithGoogle, loginWithFacebook } = useAuth();
  
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(formData.email, formData.password);
      // AuthContext에서 리다이렉트 처리
    } catch (err: any) {
      setError(err.message || '로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      await loginWithGoogle();
      // AuthContext에서 리다이렉트 처리
    } catch (err: any) {
      setError(err.message || 'Google 로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      await loginWithFacebook();
      // AuthContext에서 리다이렉트 처리
    } catch (err: any) {
      setError(err.message || 'Facebook 로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(''); // 입력 시 에러 메시지 클리어
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col">
      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[980px] mx-auto">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-16">
            {/* 왼쪽: 브랜드 소개 */}
            <div className="text-center lg:text-left lg:flex-1 lg:pt-16">
              <h1 className="text-[#1877f2] text-5xl lg:text-6xl font-bold mb-4">
                JIG
              </h1>
              <p className="text-xl lg:text-2xl text-gray-800 leading-relaxed max-w-md">
                JIG에서 안전한 중고거래를 시작하세요. 믿을 수 있는 이웃과 함께하는 따뜻한 거래 플랫폼입니다.
              </p>
            </div>

            {/* 오른쪽: 로그인 폼 */}
            <div className="w-full max-w-[396px]">
              <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-3">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] placeholder-gray-500"
                      placeholder="이메일 주소"
                      required
                      autoFocus
                    />
                    
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] placeholder-gray-500"
                      placeholder="비밀번호"
                      required
                    />
                  </div>

                  {/* 에러 메시지 */}
                  {error && (
                    <div className="mt-3 text-sm text-red-600 text-center">
                      {error}
                    </div>
                  )}

                  {/* 로그인 버튼 */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-4 py-3 px-4 bg-[#1877f2] text-white text-xl font-bold rounded-md hover:bg-[#166fe5] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? '로그인 중...' : '로그인'}
                  </button>

                  {/* 비밀번호 찾기 */}
                  <div className="text-center mt-4">
                    <Link href="/auth/forgot-password" className="text-sm text-[#1877f2] hover:underline">
                      비밀번호를 잊으셨나요?
                    </Link>
                  </div>

                  {/* 구분선 */}
                  <div className="my-5 border-t border-gray-300"></div>

                  {/* Google 로그인 버튼 */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full mb-3 py-3 px-4 bg-white text-gray-700 text-base font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google로 계속하기
                  </button>

                  {/* Facebook 로그인 버튼 */}
                  <button
                    type="button"
                    onClick={handleFacebookLogin}
                    disabled={isLoading}
                    className="w-full mb-3 py-3 px-4 bg-[#1877f2] text-white text-base font-medium rounded-md border border-[#1877f2] hover:bg-[#166fe5] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook으로 계속하기
                  </button>

                  {/* 회원가입 버튼 */}
                  <div className="text-center">
                    <Link 
                      href="/auth/signup" 
                      className="inline-block py-3 px-8 bg-[#42b72a] text-white text-base font-bold rounded-md hover:bg-[#36a420] transition-colors"
                    >
                      새 계정 만들기
                    </Link>
                  </div>
                </form>
              </div>

              {/* OAuth 안내 */}
              <div className="mt-6 text-center text-xs text-gray-500">
                <p>Google 또는 Facebook 계정으로 간편하게 로그인하세요</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 푸터 */}
      <footer className="bg-white py-6 px-4">
        <div className="max-w-[980px] mx-auto">
          {/* 언어 선택 */}
          <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-600 mb-4">
            <button className="hover:underline font-semibold">한국어</button>
            <button className="hover:underline">English</button>
            <button className="hover:underline">日本語</button>
            <button className="hover:underline">中文(简体)</button>
            <button className="hover:underline">中文(台灣)</button>
            <button className="hover:underline">Español</button>
            <button className="hover:underline">Français</button>
            <button className="hover:underline">Deutsch</button>
            <button className="hover:underline">Português</button>
            <button className="hover:underline">Italiano</button>
            <button className="hover:underline bg-gray-100 px-2 py-1 rounded">+</button>
          </div>

          <div className="border-t border-gray-300 pt-4">
            {/* 하단 링크들 */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-gray-600 mb-4">
              <Link href="#" className="hover:underline">회원가입</Link>
              <Link href="#" className="hover:underline">로그인</Link>
              <Link href="#" className="hover:underline">Messenger</Link>
              <Link href="#" className="hover:underline">JIG Lite</Link>
              <Link href="#" className="hover:underline">동영상</Link>
              <Link href="#" className="hover:underline">장소</Link>
              <Link href="#" className="hover:underline">게임</Link>
              <Link href="#" className="hover:underline">Marketplace</Link>
              <Link href="#" className="hover:underline">Meta Pay</Link>
              <Link href="#" className="hover:underline">Meta Store</Link>
              <Link href="#" className="hover:underline">Meta Quest</Link>
              <Link href="#" className="hover:underline">Instagram</Link>
              <Link href="#" className="hover:underline">Threads</Link>
              <Link href="#" className="hover:underline">기부 캠페인</Link>
              <Link href="#" className="hover:underline">서비스</Link>
              <Link href="#" className="hover:underline">투표 정보 센터</Link>
              <Link href="#" className="hover:underline">개인정보처리방침</Link>
              <Link href="#" className="hover:underline">개인정보 보호 센터</Link>
              <Link href="#" className="hover:underline">그룹</Link>
              <Link href="#" className="hover:underline">정보</Link>
              <Link href="#" className="hover:underline">광고 만들기</Link>
              <Link href="#" className="hover:underline">페이지 만들기</Link>
              <Link href="#" className="hover:underline">개발자</Link>
              <Link href="#" className="hover:underline">채용 정보</Link>
              <Link href="#" className="hover:underline">쿠키</Link>
              <Link href="#" className="hover:underline">광고 선택</Link>
              <Link href="#" className="hover:underline">이용 약관</Link>
              <Link href="#" className="hover:underline">고객 센터</Link>
              <Link href="#" className="hover:underline">연락처 업로드 및 비사용자</Link>
              <Link href="#" className="hover:underline">설정</Link>
            </div>

            {/* 저작권 */}
            <div className="text-center text-xs text-gray-600">
              JIG © 2025
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}