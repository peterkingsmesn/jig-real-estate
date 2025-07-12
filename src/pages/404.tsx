import Link from 'next/link';
import { Search, Home, ArrowLeft } from 'lucide-react';

export default function Custom404() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="text-8xl mb-4">🏠</div>
          <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 mb-4">
            요청하신 페이지가 존재하지 않거나 이동되었습니다.
          </p>
          <p className="text-sm text-gray-500">
            URL을 확인하시거나 다른 페이지를 이용해보세요.
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

        {/* Search Suggestion */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-center space-x-2 text-blue-800 mb-2">
            <Search className="h-4 w-4" />
            <span className="font-medium">찾고 계신 정보가 있나요?</span>
          </div>
          <p className="text-sm text-blue-700">
            <Link href="/properties" className="hover:underline">매물 검색</Link>
            {' · '}
            <Link href="/blog" className="hover:underline">블로그</Link>
            {' · '}
            <Link href="/contact" className="hover:underline">문의하기</Link>
          </p>
        </div>
      </div>
    </div>
  );
}