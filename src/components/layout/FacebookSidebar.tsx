import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: number;
}

const FacebookSidebar: React.FC = () => {
  const router = useRouter();
  const [showMore, setShowMore] = useState(false);

  const mainMenuItems: MenuItem[] = [
    {
      icon: <div className="w-8 h-8 bg-gray-300 rounded-full" />,
      label: '내 프로필',
      href: '/profile',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
        </svg>
      ),
      label: '커뮤니티',
      href: '/community',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      label: '부동산',
      href: '/properties',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
        </svg>
      ),
      label: '마켓플레이스',
      href: '/marketplace',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zm4-3a1 1 0 00-1 1v1h2V4a1 1 0 00-1-1zM4 9v7h12V9H4z" clipRule="evenodd" />
        </svg>
      ),
      label: '구인구직',
      href: '/jobs',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
      label: '여행 정보',
      href: '/travel',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
      label: '사이트 정보',
      href: '/about',
    },
  ];

  const moreMenuItems: MenuItem[] = [
    {
      icon: (
        <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      ),
      label: '쪽지함',
      href: '/messages',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
      label: '날씨 정보',
      href: '/weather',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      label: '출입국 정보',
      href: '/immigration',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      label: '치안 정보',
      href: '/police',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
        </svg>
      ),
      label: '그랩 기사',
      href: '/grab-drivers',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
        </svg>
      ),
      label: '룸메이트 구하기',
      href: '/roommates',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
        </svg>
      ),
      label: '외국인 친구 사귀기',
      href: '/friends',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C17.759 8.071 18 9.007 18 10zm-9.466 3.075c-.194.852-.685 1.454-1.188 1.454-.65 0-1.3-.718-1.3-2.03 0-.851.327-1.651.901-2.289l1.06 1.06-.277.277a1 1 0 101.414 1.414l.277-.277 1.06 1.06a4.5 4.5 0 01-1.947.331zm1.884-6.449L9 5.207A6.002 6.002 0 004.52 9H3a1 1 0 100 2h1.476A6.002 6.002 0 009 15.793l1.418-1.419A6.002 6.002 0 0016 10.5V9a1 1 0 10-2 0v1.5a4.002 4.002 0 01-3.582 3.975z" clipRule="evenodd" />
        </svg>
      ),
      label: '문의하기',
      href: '/contact',
    },
  ];

  const shortcuts = [
    { name: 'BGC Premium Properties', href: '/properties?region=Metro Manila&district=BGC' },
    { name: 'Manila Rental Hub', href: '/properties?region=Metro Manila' },
    { name: 'Cebu Properties', href: '/properties?region=Cebu' },
    { name: 'Expat Job Board', href: '/jobs' },
    { name: 'International Community', href: '/community?category=social' },
    { name: 'Roommate Matching', href: '/roommates' },
    { name: 'Expat Life Tips', href: '/community?category=life' },
  ];

  return (
    <div className="p-4 space-y-1">
      {/* User Profile Quick Access */}
      {mainMenuItems.map((item, index) => (
        <Link 
          key={index} 
          href={item.href}
          className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-200 transition-colors ${
            router.pathname === item.href ? 'bg-gray-200' : ''
          }`}
        >
          {item.icon}
          <span className="flex-1 font-medium">{item.label}</span>
          {item.badge && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {item.badge}
            </span>
          )}
        </Link>
      ))}

      {/* Show More / Less */}
      {!showMore && (
        <button
          onClick={() => setShowMore(true)}
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-200 w-full text-left"
        >
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-medium">더보기</span>
        </button>
      )}

      {/* More Menu Items */}
      {showMore && (
        <>
          {moreMenuItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.href}
              className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-200 transition-colors ${
                router.pathname === item.href ? 'bg-gray-200' : ''
              }`}
            >
              {item.icon}
              <span className="flex-1 font-medium">{item.label}</span>
            </Link>
          ))}
          
          <button
            onClick={() => setShowMore(false)}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-200 w-full text-left"
          >
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="font-medium">간략히 보기</span>
          </button>
        </>
      )}

      {/* Shortcuts */}
      <div className="pt-4 border-t border-gray-300">
        <h3 className="text-gray-600 font-semibold mb-2 px-2">Popular Shortcuts</h3>
        {shortcuts.map((shortcut, index) => (
          <Link
            key={index}
            href={shortcut.href}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-200"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm font-medium">{shortcut.name}</span>
          </Link>
        ))}
      </div>

      {/* Footer Links */}
      <div className="pt-4 px-2">
        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
          <Link href="/about" className="hover:underline">사이트 소개</Link>
          <span>·</span>
          <Link href="/contact" className="hover:underline">문의하기</Link>
          <span>·</span>
          <Link href="/banking" className="hover:underline">은행정보</Link>
          <span>·</span>
          <a href="#" className="hover:underline">개인정보처리방침</a>
          <span>·</span>
          <a href="#" className="hover:underline">이용약관</a>
        </div>
        <p className="text-xs text-gray-500 mt-2">필직 (Phil Jig) © 2024</p>
        <p className="text-xs text-gray-400 mt-1">필리핀 생활 포털</p>
      </div>
    </div>
  );
};

export default FacebookSidebar;