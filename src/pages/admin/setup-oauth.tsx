import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import FacebookLayout from '@/components/layout/FacebookLayout';
import SEOHead from '@/components/seo/SEOHead';
import { 
  ExternalLink, 
  Copy, 
  CheckCircle, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export default function SetupOAuthPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const redirectUri = 'http://localhost:3005/api/auth/callback/google';
  const baseUrl = 'http://localhost:3005';

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <>
      <SEOHead
        title="OAuth 설정 가이드 - 필직 Admin"
        description="Google OAuth 설정 단계별 가이드"
        keywords="admin, oauth, google, setup"
        type="website"
        locale="ko"
      />

      <FacebookLayout section="admin">
        <main className="py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Google OAuth 설정 가이드
            </h1>
            <p className="text-gray-600">
              단계별로 따라하면 5분 안에 Google 로그인을 설정할 수 있습니다.
            </p>
          </div>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  1
                </div>
                <h2 className="text-xl font-semibold">Google Cloud Console 접속</h2>
              </div>
              
              <div className="ml-11">
                <p className="text-gray-600 mb-4">
                  Google Cloud Console에 접속해서 새 프로젝트를 만듭니다.
                </p>
                <a
                  href="https://console.cloud.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Google Cloud Console 열기
                </a>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  2
                </div>
                <h2 className="text-xl font-semibold">OAuth 동의 화면 설정</h2>
              </div>
              
              <div className="ml-11">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                    <span className="text-yellow-800 font-medium">
                      이 단계를 건너뛰면 "401 invalid_client" 오류가 발생합니다!
                    </span>
                  </div>
                </div>
                
                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                  <li><strong>APIs & Services</strong> → <strong>OAuth consent screen</strong> 클릭</li>
                  <li><strong>User Type:</strong> External 선택 → <strong>Create</strong></li>
                  <li><strong>App name:</strong> 필직 (Phil Jig)</li>
                  <li><strong>User support email:</strong> 본인 이메일 입력</li>
                  <li><strong>Developer contact information:</strong> 본인 이메일 입력</li>
                  <li>나머지는 기본값으로 두고 <strong>Save and Continue</strong></li>
                </ol>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  3
                </div>
                <h2 className="text-xl font-semibold">OAuth 클라이언트 생성</h2>
              </div>
              
              <div className="ml-11">
                <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-4">
                  <li><strong>APIs & Services</strong> → <strong>Credentials</strong> 클릭</li>
                  <li><strong>+ CREATE CREDENTIALS</strong> → <strong>OAuth client ID</strong> 선택</li>
                  <li><strong>Application type:</strong> Web application</li>
                  <li><strong>Name:</strong> 필직 Web Client</li>
                </ol>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium mb-2">Authorized JavaScript origins:</h4>
                  <div className="flex items-center space-x-2">
                    <code className="bg-white px-3 py-2 rounded border flex-1 text-sm">
                      {baseUrl}
                    </code>
                    <button
                      onClick={() => copyToClipboard(baseUrl, 'origin')}
                      className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      {copied === 'origin' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Authorized redirect URIs:</h4>
                  <div className="flex items-center space-x-2">
                    <code className="bg-white px-3 py-2 rounded border flex-1 text-sm">
                      {redirectUri}
                    </code>
                    <button
                      onClick={() => copyToClipboard(redirectUri, 'redirect')}
                      className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      {copied === 'redirect' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  4
                </div>
                <h2 className="text-xl font-semibold">클라이언트 ID와 Secret 복사</h2>
              </div>
              
              <div className="ml-11">
                <p className="text-gray-600 mb-4">
                  OAuth 클라이언트가 생성되면 Client ID와 Client Secret을 복사해서 
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">.env.local</code> 파일에 붙여넣으세요.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">형식 예시:</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Client ID:</strong> 
                      <code className="text-blue-600 ml-2">1234567890-abcdefg.apps.googleusercontent.com</code>
                    </div>
                    <div>
                      <strong>Client Secret:</strong> 
                      <code className="text-blue-600 ml-2">GOCSPX-abcdefghijklmnop</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  5
                </div>
                <h2 className="text-xl font-semibold">환경변수 업데이트</h2>
              </div>
              
              <div className="ml-11">
                <p className="text-gray-600 mb-4">
                  복사한 값들을 <code className="bg-gray-100 px-2 py-1 rounded text-sm">.env.local</code> 파일에 붙여넣으세요:
                </p>
                
                <div className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm font-mono">
                  <div>GOOGLE_CLIENT_ID=여기에_클라이언트_ID_붙여넣기</div>
                  <div>GOOGLE_CLIENT_SECRET=여기에_클라이언트_시크릿_붙여넣기</div>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  파일 경로: <code>/mnt/c/Users/peter/Documents/jig/.env.local</code>
                </div>
              </div>
            </div>

            {/* Step 6 */}
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  6
                </div>
                <h2 className="text-xl font-semibold text-green-900">서버 재시작 및 테스트</h2>
              </div>
              
              <div className="ml-11">
                <ol className="list-decimal list-inside space-y-2 text-green-800 mb-4">
                  <li>터미널에서 <code className="bg-white px-2 py-1 rounded">Ctrl+C</code>로 서버 중지</li>
                  <li><code className="bg-white px-2 py-1 rounded">npm run dev</code>로 서버 재시작</li>
                  <li>로그인 페이지에서 Google 로그인 테스트</li>
                </ol>

                <div className="flex space-x-3">
                  <a
                    href="/auth/login"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    로그인 페이지로 이동
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                  <a
                    href="/admin/oauth-status"
                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    OAuth 상태 확인
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </FacebookLayout>
    </>
  );
}