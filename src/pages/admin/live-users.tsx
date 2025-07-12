import { useState, useEffect } from 'react';
import FacebookLayout from '@/components/layout/FacebookLayout';
import SEOHead from '@/components/seo/SEOHead';
import { Users, RefreshCw, Eye } from 'lucide-react';

interface LoginAttempt {
  email: string;
  name: string;
  image?: string;
  provider: string;
  timestamp: string;
}

export default function LiveUsersPage() {
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 실시간으로 로그인 시도를 확인하는 함수
  const checkLoginAttempts = async () => {
    setIsRefreshing(true);
    try {
      // 브라우저 localStorage에서 로그인 기록 가져오기
      const stored = localStorage.getItem('login_attempts');
      if (stored) {
        setLoginAttempts(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load login attempts:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    checkLoginAttempts();
    
    // 5초마다 자동 새로고침
    const interval = setInterval(checkLoginAttempts, 5000);
    return () => clearInterval(interval);
  }, []);

  // 로그인 기록을 localStorage에 저장하는 함수 (개발자 도구에서 실행용)
  const addLoginAttempt = (user: any) => {
    const attempt: LoginAttempt = {
      email: user.email,
      name: user.name,
      image: user.image,
      provider: 'google',
      timestamp: new Date().toISOString()
    };
    
    const existing = JSON.parse(localStorage.getItem('login_attempts') || '[]');
    const updated = [attempt, ...existing.slice(0, 9)]; // 최신 10개만 유지
    localStorage.setItem('login_attempts', JSON.stringify(updated));
    setLoginAttempts(updated);
  };

  // 전역 함수로 등록 (개발자 도구에서 사용)
  useEffect(() => {
    (window as any).addLoginAttempt = addLoginAttempt;
  }, []);

  return (
    <>
      <SEOHead
        title="실시간 로그인 모니터 - 필직 (Phil Jig)"
        description="실시간으로 로그인한 사용자를 확인합니다"
        keywords="admin, users, login, monitor"
        type="website"
        locale="ko"
      />

      <FacebookLayout section="admin">
        <main className="py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                <Users className="inline-block h-8 w-8 mr-2" />
                실시간 로그인 모니터
              </h1>
              <p className="text-gray-600">
                Google 로그인한 사용자들을 실시간으로 확인할 수 있습니다.
              </p>
            </div>
            
            <button
              onClick={checkLoginAttempts}
              disabled={isRefreshing}
              className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                isRefreshing ? 'opacity-50' : ''
              }`}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              새로고침
            </button>
          </div>

          {/* 로그인 시도 목록 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">최근 로그인 ({loginAttempts.length})</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {loginAttempts.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg mb-2">아직 로그인한 사용자가 없습니다</p>
                  <p className="text-sm">Google 로그인을 시도해보세요!</p>
                </div>
              ) : (
                loginAttempts.map((attempt, index) => (
                  <div key={index} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {attempt.image ? (
                          <img
                            className="h-12 w-12 rounded-full"
                            src={attempt.image}
                            alt={attempt.name}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="h-6 w-6 text-gray-500" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-medium text-gray-900 truncate">
                          {attempt.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {attempt.email}
                        </p>
                      </div>
                      
                      <div className="flex-shrink-0 text-right">
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {attempt.provider}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(attempt.timestamp).toLocaleString('ko-KR')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 사용 방법 안내 */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              💡 사용 방법
            </h3>
            <div className="text-blue-800 space-y-2">
              <p>1. <strong>Google 로그인 테스트:</strong> /login 페이지에서 Google 로그인</p>
              <p>2. <strong>자동 기록:</strong> 로그인하면 자동으로 여기에 표시됩니다</p>
              <p>3. <strong>실시간 업데이트:</strong> 5초마다 자동으로 새로고침됩니다</p>
            </div>
          </div>

          {/* 개발자 도구 */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🔧 개발자 도구
            </h3>
            <div className="text-gray-700 space-y-2 text-sm">
              <p><strong>수동 추가:</strong> 브라우저 개발자 도구에서 다음 실행:</p>
              <code className="block bg-gray-100 p-2 rounded text-xs">
                addLoginAttempt(&#123;email: 'test@example.com', name: '테스트 사용자', image: null&#125;)
              </code>
            </div>
          </div>
        </main>
      </FacebookLayout>
    </>
  );
}