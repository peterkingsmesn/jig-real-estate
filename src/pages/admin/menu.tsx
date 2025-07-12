import { useState } from 'react';
import { useMenuManager } from '@/hooks/useMenuManager';
import MenuManager from '@/components/admin/MenuManager';
import AdminLayout from '@/components/admin/AdminLayout';
import { Eye, Code } from 'lucide-react';

export default function AdminMenuPage() {
  const [currentLanguage, setCurrentLanguage] = useState('ko');
  const [previewMode, setPreviewMode] = useState(false);
  const { getVisibleMenuItems, refreshMenuItems } = useMenuManager();

  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang);
  };

  const visibleMenuItems = getVisibleMenuItems();

  return (
    <AdminLayout
      title="메뉴 관리"
      description="웹사이트 메뉴를 관리하고 구성할 수 있습니다"
    >
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">메뉴 관리</h1>
          <p className="text-gray-600 mt-2">웹사이트의 네비게이션 메뉴를 관리하세요</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              previewMode 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-gray-100 text-gray-700 border border-gray-200'
            }`}
          >
            {previewMode ? (
              <>
                <Code className="h-4 w-4" />
                <span>편집 모드</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span>미리보기</span>
              </>
            )}
          </button>
          
          <select
            value={currentLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="ko">한국어</option>
            <option value="zh">中文</option>
            <option value="ja">日本語</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      {previewMode ? (
        <div className="space-y-6">
          {/* 미리보기 모드 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">메뉴 미리보기</h2>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                현재 {visibleMenuItems.length}개의 메뉴가 활성화되어 있습니다.
              </div>
              
              {/* 데스크톱 미리보기 */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium text-gray-900 mb-3">데스크톱 메뉴</h3>
                <div className="flex items-center space-x-6 p-4 bg-white rounded border">
                  <div className="font-bold text-primary">🏠 Philippines Rental</div>
                  <div className="flex items-center space-x-4">
                    {visibleMenuItems.map((item) => {
                      const translation = item.translations[currentLanguage as keyof typeof item.translations];
                      const title = translation?.title || item.title;
                      return (
                        <div key={item.id} className="flex items-center space-x-1 text-gray-600">
                          {item.icon && <span className="text-sm">{item.icon}</span>}
                          <span className="text-sm">{title}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* 모바일 미리보기 */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium text-gray-900 mb-3">모바일 메뉴</h3>
                <div className="max-w-xs mx-auto">
                  <div className="bg-white rounded border p-4 space-y-2">
                    {visibleMenuItems.map((item) => {
                      const translation = item.translations[currentLanguage as keyof typeof item.translations];
                      const title = translation?.title || item.title;
                      return (
                        <div key={item.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                          {item.icon && <span>{item.icon}</span>}
                          <span className="text-sm">{title}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <MenuManager language={currentLanguage} />
      )}
    </AdminLayout>
  );
}