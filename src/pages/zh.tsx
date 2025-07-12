import { useEffect } from 'react';
import { useRouter } from 'next/router';

// 중국어 라우트 처리 페이지
export default function ChineseRoute() {
  const router = useRouter();

  useEffect(() => {
    // 중국어 설정을 localStorage에 저장하고 홈페이지로 리다이렉트
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLanguage', 'zh');
      router.replace('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">设置中文...</p>
        <p className="text-gray-500 text-sm">Setting language to Chinese...</p>
      </div>
    </div>
  );
}