import { NextPageContext } from 'next';
import Link from 'next/link';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

interface ErrorProps {
  statusCode?: number;
  hasGetInitialPropsRun?: boolean;
  err?: Error;
}

function Error({ statusCode }: ErrorProps) {
  const getErrorMessage = () => {
    if (statusCode === 404) {
      return {
        title: '페이지를 찾을 수 없습니다',
        message: '요청하신 페이지가 존재하지 않거나 이동되었습니다.',
        suggestion: '홈페이지로 돌아가거나 다른 페이지를 이용해보세요.'
      };
    }
    
    if (statusCode === 500) {
      return {
        title: '서버 오류가 발생했습니다',
        message: '일시적인 서버 문제가 발생했습니다.',
        suggestion: '잠시 후 다시 시도해주세요.'
      };
    }
    
    return {
      title: '오류가 발생했습니다',
      message: `${statusCode ? `오류 코드: ${statusCode}` : '알 수 없는 오류가 발생했습니다.'}`,
      suggestion: '홈페이지로 돌아가거나 새로고침을 시도해보세요.'
    };
  };

  const errorInfo = getErrorMessage();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-2">
            {statusCode || 'ERROR'}
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {errorInfo.title}
          </h2>
          <p className="text-gray-600 mb-4">
            {errorInfo.message}
          </p>
          <p className="text-sm text-gray-500">
            {errorInfo.suggestion}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>뒤로 가기</span>
          </button>
          
          <Link
            href="/"
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>홈으로</span>
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            문제가 지속적으로 발생한다면{' '}
            <Link href="/contact" className="font-medium hover:underline">
              고객 지원팀에 문의
            </Link>
            해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;