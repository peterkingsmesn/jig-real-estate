import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AuthErrorPage() {
  const router = useRouter();
  const { error } = router.query;

  const getErrorMessage = () => {
    switch (error) {
      case 'Configuration':
        return '서버 설정에 문제가 있습니다. 잠시 후 다시 시도해주세요.';
      case 'AccessDenied':
        return '접근이 거부되었습니다.';
      case 'Verification':
        return '인증 토큰이 만료되었거나 이미 사용되었습니다.';
      case 'OAuthSignin':
        return 'OAuth 로그인 중 오류가 발생했습니다.';
      case 'OAuthCallback':
        return 'OAuth 콜백 처리 중 오류가 발생했습니다.';
      case 'OAuthCreateAccount':
        return 'OAuth 계정 생성 중 오류가 발생했습니다.';
      case 'EmailCreateAccount':
        return '이메일 계정 생성 중 오류가 발생했습니다.';
      case 'Callback':
        return '콜백 처리 중 오류가 발생했습니다.';
      case 'OAuthAccountNotLinked':
        return '이 이메일은 이미 다른 로그인 방법으로 등록되어 있습니다.';
      case 'EmailSignin':
        return '이메일 로그인 중 오류가 발생했습니다.';
      case 'CredentialsSignin':
        return '이메일 또는 비밀번호가 올바르지 않습니다.';
      case 'SessionRequired':
        return '이 페이지에 접근하려면 로그인이 필요합니다.';
      default:
        return '로그인 중 오류가 발생했습니다. 다시 시도해주세요.';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          로그인 오류
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  오류 발생
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{getErrorMessage()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/auth/login"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              로그인 페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}