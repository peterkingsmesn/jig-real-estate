import { useState } from 'react';
import { useRouter } from 'next/router';
import FacebookLayout from '@/components/layout/FacebookLayout';
import SEOHead from '@/components/seo/SEOHead';

export default function LoadPrepaidPage() {
  const router = useRouter();
  const currentLanguage = 'ko';


  const networks = [
    { id: 'globe', name: 'Globe', icon: '🌍', color: 'blue' },
    { id: 'smart', name: 'Smart/TNT', icon: '📱', color: 'green' },
    { id: 'dito', name: 'DITO', icon: '📶', color: 'red' },
    { id: 'sun', name: 'Sun Cellular', icon: '☀️', color: 'yellow' }
  ];

  const loadAmounts = [
    { amount: 15, bonus: '1 day' },
    { amount: 30, bonus: '3 days' },
    { amount: 50, bonus: '5 days' },
    { amount: 100, bonus: '1 week' },
    { amount: 200, bonus: '2 weeks' },
    { amount: 500, bonus: '1 month' }
  ];

  return (
    <>
      <SEOHead
        title="Load/Prepaid - 필직"
        description="Buy mobile load and prepaid credits for Globe, Smart, DITO and more"
        keywords="load, prepaid, mobile, globe, smart, dito, philippines"
        type="website"
        locale={currentLanguage}
      />

      <FacebookLayout section="load">
          <main className="py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                📱 {(currentLanguage as string) === 'ko' ? '선불 충전' :
                     (currentLanguage as string) === 'tl' ? 'Load' :
                     'Load/Prepaid'}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {(currentLanguage as string) === 'ko' ? '모든 통신사 선불 충전을 빠르고 편리하게' :
                 (currentLanguage as string) === 'tl' ? 'Mabilis at convenient na load para sa lahat ng network' :
                 'Quick and convenient load for all networks'}
              </p>
            </div>

            {/* Network Selection */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {(currentLanguage as string) === 'ko' ? '통신사 선택' :
                 (currentLanguage as string) === 'tl' ? 'Piliin ang Network' :
                 'Select Network'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {networks.map((network) => (
                  <div key={network.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="text-center">
                      <div className="text-4xl mb-3">{network.icon}</div>
                      <h3 className="text-lg font-semibold text-gray-900">{network.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Load Amounts */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {(currentLanguage as string) === 'ko' ? '충전 금액' :
                 (currentLanguage as string) === 'tl' ? 'Halaga ng Load' :
                 'Load Amount'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {loadAmounts.map((load) => (
                  <div key={load.amount} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">₱{load.amount}</div>
                      <div className="text-sm text-gray-600">+ {load.bonus} validity</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Load Form */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {(currentLanguage as string) === 'ko' ? '충전 정보 입력' :
                 (currentLanguage as string) === 'tl' ? 'I-enter ang Details' :
                 'Enter Load Details'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {(currentLanguage as string) === 'ko' ? '휴대폰 번호' :
                     (currentLanguage as string) === 'tl' ? 'Mobile Number' :
                     'Mobile Number'}
                  </label>
                  <input
                    type="tel"
                    placeholder="09XX XXX XXXX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  {(currentLanguage as string) === 'ko' ? '충전하기' :
                   (currentLanguage as string) === 'tl' ? 'Mag-load' :
                   'Load Now'}
                </button>
              </div>
            </div>

            <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                ⚡ {(currentLanguage as string) === 'ko' ? '빠른 충전 혜택' :
                    (currentLanguage as string) === 'tl' ? 'Instant Load Benefits' :
                    'Instant Load Benefits'}
              </h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• {(currentLanguage as string) === 'ko' ? '즉시 충전 완료 (평균 30초)' :
                        (currentLanguage as string) === 'tl' ? 'Instant load (average 30 seconds)' :
                        'Instant load completion (average 30 seconds)'}</li>
                <li>• {(currentLanguage as string) === 'ko' ? '24시간 연중무휴 서비스' :
                        (currentLanguage as string) === 'tl' ? '24/7 na serbisyo' :
                        '24/7 service availability'}</li>
                <li>• {(currentLanguage as string) === 'ko' ? '모든 프로모와 데이터 플랜 지원' :
                        (currentLanguage as string) === 'tl' ? 'Suportado ang lahat ng promo at data plans' :
                        'Supports all promos and data plans'}</li>
              </ul>
            </div>
          </main>
      </FacebookLayout>
    </>
  );
}