import React from 'react';

interface AdBanner {
  id: string;
  title: string;
  description: string;
  image?: string;
  link: string;
  type: 'banner' | 'square' | 'vertical';
}

interface FacebookRightSidebarProps {
  section?: string;
}

const FacebookRightSidebar: React.FC<FacebookRightSidebarProps> = ({ section = 'default' }) => {
  const getBannersBySection = (section: string): AdBanner[] => {
    switch (section) {
      case 'properties':
        return [
          {
            id: '1',
            title: '프리미엄 콘도 분양',
            description: 'BGC 신축 콘도, 외국인 투자 환영',
            link: '/properties',
            type: 'banner',
          },
          {
            id: '2',
            title: '부동산 투자 가이드',
            description: '필리핀 부동산 투자 완벽 가이드북',
            link: '#',
            type: 'banner',
          },
          {
            id: '3',
            title: '임대 관리 서비스',
            description: '전문 임대 관리 및 유지보수 서비스',
            link: '#',
            type: 'banner',
          },
          {
            id: '4',
            title: '법무 상담',
            description: '부동산 계약 및 법적 검토 서비스',
            link: '#',
            type: 'square',
          },
          {
            id: '5',
            title: '인테리어 서비스',
            description: '맞춤형 인테리어 및 가구 렌탈',
            link: '#',
            type: 'square',
          },
        ];
      case 'community':
        return [
          {
            id: '1',
            title: '한인 모임',
            description: '마닐라 한인 정기 모임 및 행사',
            link: '/community',
            type: 'banner',
          },
          {
            id: '2',
            title: '생활 정보',
            description: '필리핀 생활 필수 정보 및 팁',
            link: '#',
            type: 'banner',
          },
          {
            id: '3',
            title: '한국 음식점',
            description: '맛있는 한국 음식점 추천',
            link: '#',
            type: 'banner',
          },
          {
            id: '4',
            title: '언어 교환',
            description: '한국어-영어 언어 교환 모임',
            link: '#',
            type: 'square',
          },
          {
            id: '5',
            title: '의료 서비스',
            description: '한국인 전용 의료 서비스',
            link: '#',
            type: 'square',
          },
        ];
      case 'jobs':
        return [
          {
            id: '1',
            title: '한국 기업 채용',
            description: '필리핀 진출 한국 기업 채용 정보',
            link: '/jobs',
            type: 'banner',
          },
          {
            id: '2',
            title: '영어 강사',
            description: '한국인 영어 강사 채용',
            link: '#',
            type: 'banner',
          },
          {
            id: '3',
            title: '번역 서비스',
            description: '한국어-영어 번역 및 통역 서비스',
            link: '#',
            type: 'banner',
          },
          {
            id: '4',
            title: '이력서 작성',
            description: '전문 이력서 작성 및 컨설팅',
            link: '#',
            type: 'square',
          },
          {
            id: '5',
            title: '면접 코칭',
            description: '영어 면접 및 취업 컨설팅',
            link: '#',
            type: 'square',
          },
        ];
      case 'travel':
        return [
          {
            id: '1',
            title: '세부 다이빙 투어',
            description: '한국인 가이드와 함께하는 안전한 다이빙',
            link: '/travel',
            type: 'banner',
          },
          {
            id: '2',
            title: '보라카이 패키지',
            description: '보라카이 3박 4일 완벽 패키지',
            link: '#',
            type: 'banner',
          },
          {
            id: '3',
            title: '팔라완 투어',
            description: '팔라완 엘니도 자연 투어',
            link: '#',
            type: 'banner',
          },
          {
            id: '4',
            title: '항공 예약',
            description: '한국-필리핀 항공 예약 서비스',
            link: '#',
            type: 'square',
          },
          {
            id: '5',
            title: '여행 보험',
            description: '여행자 보험 및 안전 서비스',
            link: '#',
            type: 'square',
          },
        ];
      case 'marketplace':
        return [
          {
            id: '1',
            title: '중고 가전제품',
            description: '검증된 중고 가전제품 거래',
            link: '/marketplace',
            type: 'banner',
          },
          {
            id: '2',
            title: '자동차 거래',
            description: '중고차 매매 및 렌탈 서비스',
            link: '#',
            type: 'banner',
          },
          {
            id: '3',
            title: '가구 임대',
            description: '단기/장기 가구 임대 서비스',
            link: '#',
            type: 'banner',
          },
          {
            id: '4',
            title: '안전 거래',
            description: '안전한 거래를 위한 에스크로 서비스',
            link: '#',
            type: 'square',
          },
          {
            id: '5',
            title: '배송 서비스',
            description: '마닐라 전 지역 배송 서비스',
            link: '#',
            type: 'square',
          },
        ];
      case 'about':
        return [
          {
            id: '1',
            title: '전문가 상담',
            description: '무료 부동산 컨설팅',
            link: '/contact',
            type: 'banner',
          },
          {
            id: '2',
            title: '다국어 지원',
            description: '4개 언어 지원',
            link: '#',
            type: 'banner',
          },
          {
            id: '3',
            title: '파트너십 문의',
            description: '사업 제휴 환영',
            link: '#',
            type: 'banner',
          },
          {
            id: '4',
            title: '고객 성공 사례',
            description: '2000+ 만족 고객',
            link: '#',
            type: 'square',
          },
          {
            id: '5',
            title: '프리미엄 서비스',
            description: 'VIP 고객 전용 서비스',
            link: '#',
            type: 'square',
          },
        ];
      case 'faq':
        return [
          {
            id: '1',
            title: '24/7 고객지원',
            description: '한국어 상담 가능',
            link: '/contact',
            type: 'banner',
          },
          {
            id: '2',
            title: '비디오 가이드',
            description: '필리핀 생활 팁',
            link: '#',
            type: 'banner',
          },
          {
            id: '3',
            title: '안전 거래 가이드',
            description: '사기 예방 매뉴얼',
            link: '#',
            type: 'banner',
          },
          {
            id: '4',
            title: '법률 상담',
            description: '계약서 검토 서비스',
            link: '#',
            type: 'square',
          },
          {
            id: '5',
            title: '커뮤니티 Q&A',
            description: '실시간 질문 답변',
            link: '/community',
            type: 'square',
          },
        ];
      case 'contact':
        return [
          {
            id: '1',
            title: '긴급 상담',
            description: '24시간 핫라인',
            link: '#',
            type: 'banner',
          },
          {
            id: '2',
            title: '방문 상담',
            description: '사무실 예약',
            link: '#',
            type: 'banner',
          },
          {
            id: '3',
            title: '화상 상담',
            description: 'Zoom 미팅 예약',
            link: '#',
            type: 'banner',
          },
          {
            id: '4',
            title: '파트너 문의',
            description: '제휴 및 협력',
            link: '#',
            type: 'square',
          },
          {
            id: '5',
            title: '채용 정보',
            description: '함께 일해요',
            link: '/jobs',
            type: 'square',
          },
        ];
      case 'weather':
        return [
          {
            id: '1',
            title: '재해 보험',
            description: '태풍/홍수 보상',
            link: '#',
            type: 'banner',
          },
          {
            id: '2',
            title: '긴급 대피소',
            description: '안전한 피난처 정보',
            link: '#',
            type: 'banner',
          },
          {
            id: '3',
            title: '날씨 알림',
            description: '실시간 태풍 경보',
            link: '#',
            type: 'banner',
          },
        ];
      case 'load':
        return [
          {
            id: '1',
            title: '무제한 데이터',
            description: '월 999페소',
            link: '#',
            type: 'banner',
          },
          {
            id: '2',
            title: 'WiFi 렌탈',
            description: '포켓 WiFi 대여',
            link: '#',
            type: 'banner',
          },
          {
            id: '3',
            title: '국제전화 요금',
            description: '한국 통화 할인',
            link: '#',
            type: 'banner',
          },
        ];
      case 'immigration':
        return [
          {
            id: '1',
            title: '비자 연장 서비스',
            description: '전문 비자 대행 서비스',
            link: '/contact',
            type: 'banner',
          },
          {
            id: '2',
            title: 'ACR 카드 대행',
            description: '빠르고 편리한 ACR 발급',
            link: '#',
            type: 'banner',
          },
          {
            id: '3',
            title: '법무법인 상담',
            description: '이민 전문 변호사 연결',
            link: '#',
            type: 'banner',
          },
          {
            id: '4',
            title: '관광비자 연장',
            description: '6개월 연장 가능',
            link: '#',
            type: 'square',
          },
          {
            id: '5',
            title: '워킹비자 전환',
            description: '9G 비자 컨설팅',
            link: '#',
            type: 'square',
          },
        ];
      case 'police':
        return [
          {
            id: '1',
            title: '경찰 신고증명',
            description: 'NBI 클리어런스 대행',
            link: '#',
            type: 'banner',
          },
          {
            id: '2',
            title: '보안 서비스',
            description: '24시간 경호 서비스',
            link: '#',
            type: 'banner',
          },
          {
            id: '3',
            title: '범죄 예방 가이드',
            description: '안전한 필리핀 생활',
            link: '#',
            type: 'banner',
          },
          {
            id: '4',
            title: '긴급 연락처',
            description: '한국 영사관 핫라인',
            link: '#',
            type: 'square',
          },
          {
            id: '5',
            title: 'CCTV 설치',
            description: '주거 보안 강화',
            link: '#',
            type: 'square',
          },
        ];
      case 'grab-drivers':
        return [
          {
            id: '1',
            title: '그랩 드라이버 모집',
            description: '월 50,000페소 이상',
            link: '#',
            type: 'banner',
          },
          {
            id: '2',
            title: '차량 렌탈',
            description: '그랩용 차량 대여',
            link: '#',
            type: 'banner',
          },
          {
            id: '3',
            title: '운전자 교육',
            description: '안전운전 교육 프로그램',
            link: '#',
            type: 'banner',
          },
          {
            id: '4',
            title: '그랩 할인코드',
            description: '첫 탑승 50% 할인',
            link: '#',
            type: 'square',
          },
          {
            id: '5',
            title: '음식 배달',
            description: '그랩푸드 파트너',
            link: '#',
            type: 'square',
          },
        ];
      default:
        return [
          {
            id: '1',
            title: '필리핀 콘도 분양',
            description: '마닐라 BGC 신축 콘도, 특별 할인 중!',
            link: '/properties',
            type: 'banner',
          },
          {
            id: '2',
            title: '세부 다이빙 투어',
            description: '한국인 가이드와 함께하는 안전한 다이빙',
            link: '/travel',
            type: 'banner',
          },
          {
            id: '3',
            title: '필리핀 구인구직',
            description: '한국인 대상 다양한 일자리 정보',
            link: '/jobs',
            type: 'banner',
          },
          {
            id: '4',
            title: '한국 음식점',
            description: '마닐라 최고의 한국 음식점 추천',
            link: '#',
            type: 'square',
          },
          {
            id: '5',
            title: '필리핀 법무법인',
            description: '비자, 사업 등록 등 모든 법적 문제 해결',
            link: '#',
            type: 'square',
          },
        ];
    }
  };

  const adBanners = getBannersBySection(section);

  return (
    <div className="p-4 space-y-4">
      {/* 광고 배너 섹션 */}
      <div>
        <h3 className="text-gray-600 font-semibold mb-3">Sponsored</h3>
        <div className="space-y-4">
          {adBanners.map((ad) => (
            <a
              key={ad.id}
              href={ad.link}
              className="block hover:bg-gray-100 rounded-lg p-3 -mx-2 border border-gray-200"
            >
              <div className="flex space-x-3">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <span className="text-white text-xs font-bold text-center">광고</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-gray-900">{ad.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{ad.description}</p>
                  <span className="text-xs text-blue-600 mt-1 block">자세히 보기</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <hr className="border-gray-300" />

      {/* 큰 배너 광고 */}
      <div>
        <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-4 text-white">
          <h4 className="font-bold text-sm mb-2">필리핀 생활 완벽 가이드</h4>
          <p className="text-xs opacity-90 mb-3">비자, 부동산, 일자리까지 모든 정보</p>
          <button className="bg-white text-gray-800 px-3 py-1 rounded text-xs font-semibold hover:bg-gray-100">
            무료 다운로드
          </button>
        </div>
      </div>

      <hr className="border-gray-300" />

      {/* 세로 배너 광고들 */}
      <div className="space-y-3">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <h4 className="font-semibold text-sm text-yellow-800">한국 음식 배달</h4>
          <p className="text-xs text-yellow-600 mt-1">마닐라 전 지역 한식 배달 서비스</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <h4 className="font-semibold text-sm text-red-800">필리핀 법무 상담</h4>
          <p className="text-xs text-red-600 mt-1">비자, 사업자 등록 전문 상담</p>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <h4 className="font-semibold text-sm text-purple-800">한국인 병원</h4>
          <p className="text-xs text-purple-600 mt-1">마닐라 한국인 전용 의료 서비스</p>
        </div>
      </div>
    </div>
  );
};

export default FacebookRightSidebar;