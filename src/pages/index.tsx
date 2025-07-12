import React from 'react';
import Link from 'next/link';
import FacebookLayout from '@/components/layout/FacebookLayout';

export default function Home() {
  return (
    <FacebookLayout section="home">
      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            필직 (Phil Jig)
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            필리핀에서의 새로운 삶을 시작하세요
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/properties" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              부동산 찾기
            </Link>
            <Link 
              href="/jobs" 
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              구인구직
            </Link>
            <Link 
              href="/community" 
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              커뮤니티
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Sections */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Properties */}
        <Link href="/properties" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="text-blue-600 mb-3">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">부동산</h3>
          <p className="text-gray-600 text-sm">아파트, 콘도, 단독주택 등 다양한 매물을 찾아보세요</p>
        </Link>

        {/* Jobs */}
        <Link href="/jobs" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="text-green-600 mb-3">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">구인구직</h3>
          <p className="text-gray-600 text-sm">필리핀에서의 새로운 기회를 찾아보세요</p>
        </Link>

        {/* Travel */}
        <Link href="/travel" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="text-purple-600 mb-3">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">여행</h3>
          <p className="text-gray-600 text-sm">필리핀 곳곳의 숨겨진 보석을 발견하세요</p>
        </Link>

        {/* Community */}
        <Link href="/community" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="text-orange-600 mb-3">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">커뮤니티</h3>
          <p className="text-gray-600 text-sm">한국인 커뮤니티와 소통하고 정보를 나누세요</p>
        </Link>

        {/* Marketplace */}
        <Link href="/marketplace" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="text-red-600 mb-3">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">장터</h3>
          <p className="text-gray-600 text-sm">중고거래와 필요한 물건을 사고파세요</p>
        </Link>

        {/* Services */}
        <Link href="/services" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="text-indigo-600 mb-3">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">서비스</h3>
          <p className="text-gray-600 text-sm">비자, 은행, 보험 등 필요한 서비스를 찾아보세요</p>
        </Link>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">빠른 링크</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <Link href="/weather" className="text-blue-600 hover:text-blue-800">날씨 정보</Link>
          <Link href="/immigration" className="text-blue-600 hover:text-blue-800">출입국 정보</Link>
          <Link href="/police" className="text-blue-600 hover:text-blue-800">치안 정보</Link>
          <Link href="/grab-drivers" className="text-blue-600 hover:text-blue-800">그랩 기사</Link>
          <Link href="/about" className="text-blue-600 hover:text-blue-800">사이트 정보</Link>
          <Link href="/faq" className="text-blue-600 hover:text-blue-800">자주묻는질문</Link>
          <Link href="/contact" className="text-blue-600 hover:text-blue-800">문의하기</Link>
          <Link href="/load" className="text-blue-600 hover:text-blue-800">로드 서비스</Link>
        </div>
      </div>
    </FacebookLayout>
  );
}