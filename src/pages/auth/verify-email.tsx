import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  Mail, 
  CheckCircle, 
  RefreshCcw, 
  AlertCircle, 
  Clock,
  Shield,
  ArrowLeft
} from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { email, token } = router.query;
  
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'expired' | 'invalid' | 'pending'>('pending');
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (token) {
      verifyEmailToken(token as string);
    }
  }, [token]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const verifyEmailToken = async (verificationToken: string) => {
    setVerificationStatus('verifying');
    
    try {
      // 실제로는 API 호출
      console.log('Verifying token:', verificationToken);
      
      // 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 토큰 검증 시뮬레이션
      if (verificationToken === 'valid-token') {
        setVerificationStatus('success');
        setSuccess('이메일 인증이 완료되었습니다!');
        
        // 3초 후 로그인 페이지로 리다이렉트
        setTimeout(() => {
          router.push('/auth/login?message=email_verified');
        }, 3000);
      } else if (verificationToken === 'expired-token') {
        setVerificationStatus('expired');
      } else {
        setVerificationStatus('invalid');
      }
      
    } catch (err) {
      setVerificationStatus('invalid');
      setError('인증 처리 중 오류가 발생했습니다.');
    }
  };

  const resendVerificationEmail = async () => {
    if (resendCooldown > 0) return;
    
    setIsResending(true);
    setError('');
    
    try {
      // 실제로는 API 호출
      console.log('Resending verification email to:', email);
      
      // 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess('인증 이메일이 다시 발송되었습니다. 받은 편지함을 확인해주세요.');
      setResendCooldown(60); // 60초 쿨다운
      
    } catch (err) {
      setError('이메일 재발송 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsResending(false);
    }
  };

  const renderVerificationStatus = () => {
    switch (verificationStatus) {
      case 'verifying':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <RefreshCcw className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              이메일 인증 중...
            </h2>
            <p className="text-gray-600">
              잠시만 기다려주세요. 이메일 인증을 처리하고 있습니다.
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              인증 완료!
            </h2>
            <p className="text-gray-600 mb-6">
              이메일 인증이 성공적으로 완료되었습니다. 이제 모든 서비스를 이용하실 수 있습니다.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                잠시 후 로그인 페이지로 자동 이동됩니다...
              </p>
            </div>
          </div>
        );

      case 'expired':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              인증 링크 만료
            </h2>
            <p className="text-gray-600 mb-6">
              인증 링크가 만료되었습니다. 보안을 위해 인증 링크는 24시간 후 자동으로 만료됩니다.
            </p>
            <button
              onClick={resendVerificationEmail}
              disabled={isResending || resendCooldown > 0}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {isResending ? (
                <>
                  <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                  이메일 발송 중...
                </>
              ) : resendCooldown > 0 ? (
                `${resendCooldown}초 후 재발송 가능`
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  새 인증 이메일 발송
                </>
              )}
            </button>
          </div>
        );

      case 'invalid':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              유효하지 않은 링크
            </h2>
            <p className="text-gray-600 mb-6">
              인증 링크가 유효하지 않습니다. 링크가 손상되었거나 이미 사용된 것 같습니다.
            </p>
            <button
              onClick={resendVerificationEmail}
              disabled={isResending || resendCooldown > 0}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {isResending ? (
                <>
                  <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                  이메일 발송 중...
                </>
              ) : resendCooldown > 0 ? (
                `${resendCooldown}초 후 재발송 가능`
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  새 인증 이메일 발송
                </>
              )}
            </button>
          </div>
        );

      default: // pending
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              이메일을 확인해주세요
            </h2>
            <p className="text-gray-600 mb-6">
              {email ? (
                <>
                  <strong>{email}</strong> 주소로 인증 이메일을 보내드렸습니다.<br />
                  받은 편지함에서 인증 링크를 클릭해주세요.
                </>
              ) : (
                '회원가입 시 입력하신 이메일 주소로 인증 이메일을 보내드렸습니다.'
              )}
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-medium text-blue-900 mb-2">📬 이메일이 오지 않았나요?</h4>
              <ul className="text-xs text-blue-800 space-y-1 text-left">
                <li>• 스팸 메일함을 확인해보세요</li>
                <li>• 이메일 주소를 정확히 입력했는지 확인해보세요</li>
                <li>• 최대 5분까지 소요될 수 있습니다</li>
              </ul>
            </div>

            <button
              onClick={resendVerificationEmail}
              disabled={isResending || resendCooldown > 0}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {isResending ? (
                <>
                  <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                  이메일 발송 중...
                </>
              ) : resendCooldown > 0 ? (
                `${resendCooldown}초 후 재발송 가능`
              ) : (
                <>
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  인증 이메일 다시 보내기
                </>
              )}
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* 헤더 */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            이메일 인증
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            계정 보안을 위해 이메일 인증이 필요합니다
          </p>
        </div>

        {/* 인증 상태 표시 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {renderVerificationStatus()}
        </div>

        {/* 에러/성공 메시지 */}
        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-sm text-red-800">{error}</span>
          </div>
        )}

        {success && verificationStatus !== 'success' && (
          <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm text-green-800">{success}</span>
          </div>
        )}

        {/* 뒤로 가기 */}
        <div className="text-center">
          <Link href="/auth/login" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4 mr-1" />
            로그인 페이지로 돌아가기
          </Link>
        </div>

        {/* 보안 안내 */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Shield className="h-5 w-5 text-gray-600 mt-0.5" />
            <div className="text-sm text-gray-700">
              <p className="font-medium mb-1">🔒 보안 인증</p>
              <ul className="text-xs space-y-1">
                <li>• 이메일 인증은 계정 보안을 위해 필수입니다</li>
                <li>• 인증 링크는 24시간 후 자동으로 만료됩니다</li>
                <li>• 문제가 지속되면 고객센터로 문의해주세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}