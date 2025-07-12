import { ReactNode } from 'react';

interface PortalLayoutProps {
  children: ReactNode;
  leftBanners?: ReactNode;
  rightBanners?: ReactNode;
}

export default function PortalLayout({ children, leftBanners, rightBanners }: PortalLayoutProps) {
  return (
    <div className="flex max-w-[1400px] mx-auto px-4 gap-4">
      {/* Left Sidebar - Ad Banners */}
      <div className="hidden xl:block w-[200px] flex-shrink-0">
        <div className="sticky top-20 space-y-4">
          {leftBanners || <DefaultLeftBanners />}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {children}
      </div>

      {/* Right Sidebar - Ad Banners */}
      <div className="hidden xl:block w-[200px] flex-shrink-0">
        <div className="sticky top-20 space-y-4">
          {rightBanners || <DefaultRightBanners />}
        </div>
      </div>
    </div>
  );
}

function DefaultLeftBanners() {
  return (
    <>
      {/* Moving Company Ad */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <div className="text-blue-600 text-sm font-semibold mb-2">🚚 이사업체</div>
        <div className="text-xs text-blue-800 mb-3">안전하고 빠른 이사 서비스</div>
        <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">
          견적 문의
        </button>
      </div>

      {/* Furniture Store Ad */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <div className="text-green-600 text-sm font-semibold mb-2">🛏️ 가구점</div>
        <div className="text-xs text-green-800 mb-3">신규 고객 20% 할인</div>
        <button className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">
          할인받기
        </button>
      </div>

      {/* Bank Ad */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
        <div className="text-purple-600 text-sm font-semibold mb-2">🏦 BPI Bank</div>
        <div className="text-xs text-purple-800 mb-3">외국인 계좌개설</div>
        <button className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700">
          상담예약
        </button>
      </div>

      {/* Korean Mart Ad */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <div className="text-red-600 text-sm font-semibold mb-2">🇰🇷 한국마트</div>
        <div className="text-xs text-red-800 mb-3">김치, 라면, 한국식품</div>
        <button className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700">
          주문하기
        </button>
      </div>
    </>
  );
}

function DefaultRightBanners() {
  return (
    <>
      {/* Telecom Ad */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
        <div className="text-orange-600 text-sm font-semibold mb-2">📱 Globe</div>
        <div className="text-xs text-orange-800 mb-3">외국인 전용 요금제</div>
        <button className="bg-orange-600 text-white px-3 py-1 rounded text-xs hover:bg-orange-700">
          가입하기
        </button>
      </div>

      {/* Delivery App Ad */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <div className="text-yellow-600 text-sm font-semibold mb-2">🍕 Grab Food</div>
        <div className="text-xs text-yellow-800 mb-3">첫 주문 50% 할인</div>
        <button className="bg-yellow-600 text-white px-3 py-1 rounded text-xs hover:bg-yellow-700">
          주문하기
        </button>
      </div>

      {/* Insurance Ad */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
        <div className="text-indigo-600 text-sm font-semibold mb-2">🛡️ 보험</div>
        <div className="text-xs text-indigo-800 mb-3">외국인 건강보험</div>
        <button className="bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700">
          견적받기
        </button>
      </div>

      {/* English School Ad */}
      <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 text-center">
        <div className="text-pink-600 text-sm font-semibold mb-2">📚 영어학원</div>
        <div className="text-xs text-pink-800 mb-3">원어민 1:1 수업</div>
        <button className="bg-pink-600 text-white px-3 py-1 rounded text-xs hover:bg-pink-700">
          체험수업
        </button>
      </div>

      {/* Advertise Here */}
      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
        <div className="text-gray-500 text-sm font-medium mb-2">광고 문의</div>
        <div className="text-xs text-gray-400 mb-3">이 자리에 광고하세요</div>
        <button className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600">
          문의하기
        </button>
      </div>
    </>
  );
}