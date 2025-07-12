import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import FacebookLayout from '@/components/layout/FacebookLayout';
import SEOHead from '@/components/seo/SEOHead';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Copy,
  ExternalLink
} from 'lucide-react';

interface OAuthStatus {
  google: {
    clientId: string;
    clientSecret: string;
    length: number;
  };
  facebook: {
    clientId: string;
    clientSecret: string;
    length: number;
  };
  nextAuth: {
    url: string;
    secret: string;
  };
  environment: string;
  timestamp: string;
}

export default function OAuthStatusPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [oauthStatus, setOauthStatus] = useState<OAuthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  // 권한 확인
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  // OAuth 상태 가져오기
  useEffect(() => {
    const fetchOAuthStatus = async () => {
      try {
        const response = await fetch('/api/debug/oauth');
        const data = await response.json();
        setOauthStatus(data);
      } catch (error) {
        console.error('Failed to fetch OAuth status:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user.role === 'admin') {
      fetchOAuthStatus();
    }
  }, [session]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusIcon = (isSet: boolean, isValid: boolean = true) => {
    if (!isSet) return <XCircle className="h-5 w-5 text-red-500" />;
    if (!isValid) return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  };

  const getStatusText = (isSet: boolean, isValid: boolean = true) => {
    if (!isSet) return '설정되지 않음';
    if (!isValid) return '형식 오류';
    return '올바르게 설정됨';
  };

  if (status === 'loading' || loading) {
    return <div>Loading...</div>;
  }

  if (!session || session.user.role !== 'admin') {
    return <div>Access denied</div>;
  }

  return (
    <>
      <SEOHead
        title="OAuth 설정 상태 - 필직 Admin"
        description="OAuth 설정 확인 페이지"
        keywords="admin, oauth, configuration"
        type="website"
        locale="ko"
      />

      <FacebookLayout section="admin">
        <main className="py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              OAuth 설정 상태
            </h1>
            <p className="text-gray-600">
              Google과 Facebook OAuth 설정을 확인하고 문제를 진단합니다.
            </p>
          </div>

          {oauthStatus && (
            <div className="space-y-6">
              {/* Google OAuth */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-6 h-6 mr-2" />
                  Google OAuth
                </h2>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(
                        oauthStatus.google.clientId !== 'NOT_SET',
                        oauthStatus.google.clientId.includes('.apps.googleusercontent.com')
                      )}
                      <div>
                        <div className="font-medium">Client ID</div>
                        <div className="text-sm text-gray-500">
                          {oauthStatus.google.clientId === 'NOT_SET' ? 
                            '설정되지 않음' : 
                            `${oauthStatus.google.clientId} (${oauthStatus.google.length}자)`
                          }
                        </div>
                      </div>
                    </div>
                    <div className="text-sm">
                      {getStatusText(
                        oauthStatus.google.clientId !== 'NOT_SET',
                        oauthStatus.google.clientId.includes('.apps.googleusercontent.com')
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(oauthStatus.google.clientSecret === 'SET')}
                      <div>
                        <div className="font-medium">Client Secret</div>
                        <div className="text-sm text-gray-500">
                          {oauthStatus.google.clientSecret === 'SET' ? '설정됨' : '설정되지 않음'}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm">
                      {oauthStatus.google.clientSecret === 'SET' ? '올바르게 설정됨' : '설정되지 않음'}
                    </div>
                  </div>
                </div>

                {oauthStatus.google.clientId === 'NOT_SET' && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-red-800 text-sm">
                      <strong>해결 방법:</strong>
                      <ol className="list-decimal list-inside mt-2 space-y-1">
                        <li>Google Cloud Console에서 OAuth 클라이언트 생성</li>
                        <li>.env.local 파일에 GOOGLE_CLIENT_ID와 GOOGLE_CLIENT_SECRET 추가</li>
                        <li>서버 재시작</li>
                      </ol>
                    </div>
                  </div>
                )}
              </div>

              {/* Facebook OAuth */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <div className="w-6 h-6 mr-2 bg-blue-600 rounded"></div>
                  Facebook OAuth
                </h2>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(oauthStatus.facebook.clientId !== 'NOT_SET')}
                      <div>
                        <div className="font-medium">App ID</div>
                        <div className="text-sm text-gray-500">
                          {oauthStatus.facebook.clientId === 'NOT_SET' ? 
                            '설정되지 않음' : 
                            `${oauthStatus.facebook.clientId} (${oauthStatus.facebook.length}자)`
                          }
                        </div>
                      </div>
                    </div>
                    <div className="text-sm">
                      {getStatusText(oauthStatus.facebook.clientId !== 'NOT_SET')}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(oauthStatus.facebook.clientSecret === 'SET')}
                      <div>
                        <div className="font-medium">App Secret</div>
                        <div className="text-sm text-gray-500">
                          {oauthStatus.facebook.clientSecret === 'SET' ? '설정됨' : '설정되지 않음'}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm">
                      {oauthStatus.facebook.clientSecret === 'SET' ? '올바르게 설정됨' : '설정되지 않음'}
                    </div>
                  </div>
                </div>
              </div>

              {/* NextAuth 설정 */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">NextAuth 설정</h2>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(oauthStatus.nextAuth.url !== 'NOT_SET')}
                      <div>
                        <div className="font-medium">NEXTAUTH_URL</div>
                        <div className="text-sm text-gray-500">{oauthStatus.nextAuth.url}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(oauthStatus.nextAuth.url)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(oauthStatus.nextAuth.secret === 'SET')}
                      <div>
                        <div className="font-medium">NEXTAUTH_SECRET</div>
                        <div className="text-sm text-gray-500">
                          {oauthStatus.nextAuth.secret === 'SET' ? '설정됨' : '설정되지 않음'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 환경 정보 */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">환경 정보</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="font-medium">환경</div>
                    <div className="text-gray-600">{oauthStatus.environment}</div>
                  </div>
                  <div>
                    <div className="font-medium">마지막 확인</div>
                    <div className="text-gray-600">
                      {new Date(oauthStatus.timestamp).toLocaleString('ko-KR')}
                    </div>
                  </div>
                </div>
              </div>

              {/* 유용한 링크 */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">유용한 링크</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a
                    href="https://console.cloud.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-blue-700 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Google Cloud Console</span>
                  </a>
                  <a
                    href="https://developers.facebook.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-blue-700 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Facebook Developers</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </main>
      </FacebookLayout>
    </>
  );
}