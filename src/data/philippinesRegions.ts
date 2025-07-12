// 필리핀 지역 데이터 구조
export interface Region {
  id: string;
  name: string;
  nameKo: string;
  nameZh: string;
  nameJa: string;
  province: string;
  island: 'luzon' | 'visayas' | 'mindanao';
  majorCity: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  districts?: District[];
  neighborhoods?: Neighborhood[];
  description: string;
  descriptionKo: string;
  population?: number;
  averageRent?: number;
  safetyRating: 1 | 2 | 3 | 4 | 5; // 1=매우위험, 5=매우안전
  foreignerFriendly: boolean;
  hasInternationalSchools: boolean;
  businessDistrict: boolean;
  touristArea: boolean;
}

export interface District {
  id: string;
  name: string;
  nameKo: string;
  parentRegionId: string;
  type: 'cbd' | 'residential' | 'mixed' | 'industrial' | 'tourist';
  averageRent?: number;
  safetyRating: 1 | 2 | 3 | 4 | 5;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
}

export interface Neighborhood {
  id: string;
  name: string;
  nameKo: string;
  parentDistrictId: string;
  parentRegionId: string;
  averageRent?: number;
  safetyRating: 1 | 2 | 3 | 4 | 5;
  coordinates: {
    lat: number;
    lng: number;
  };
  landmarks: string[];
}

// 메트로 마닐라 세부 지역
export const metroManilaRegions: Region[] = [
  {
    id: 'makati',
    name: 'Makati City',
    nameKo: '마카티',
    nameZh: '马卡蒂',
    nameJa: 'マカティ',
    province: 'Metro Manila',
    island: 'luzon',
    majorCity: true,
    coordinates: { lat: 14.5547, lng: 121.0244 },
    description: 'Premier business district with high-end condos and expat community',
    descriptionKo: '고급 비즈니스 지구로 외국인 커뮤니티가 잘 형성됨',
    population: 629000,
    averageRent: 45000,
    safetyRating: 5,
    foreignerFriendly: true,
    hasInternationalSchools: true,
    businessDistrict: true,
    touristArea: false,
    districts: [
      {
        id: 'makati-cbd',
        name: 'Makati CBD',
        nameKo: '마카티 비즈니스 지구',
        parentRegionId: 'makati',
        type: 'cbd',
        averageRent: 55000,
        safetyRating: 5,
        coordinates: { lat: 14.5555, lng: 121.0244 },
        description: 'Central business district with premium offices and condos'
      },
      {
        id: 'salcedo-village',
        name: 'Salcedo Village',
        nameKo: '살세도 빌리지',
        parentRegionId: 'makati',
        type: 'residential',
        averageRent: 50000,
        safetyRating: 5,
        coordinates: { lat: 14.5547, lng: 121.0200 },
        description: 'Upscale residential area popular with expats'
      },
      {
        id: 'legazpi-village',
        name: 'Legazpi Village',
        nameKo: '레가스피 빌리지',
        parentRegionId: 'makati',
        type: 'residential',
        averageRent: 48000,
        safetyRating: 5,
        coordinates: { lat: 14.5530, lng: 121.0180 },
        description: 'Premium residential area with restaurants and nightlife'
      },
      {
        id: 'greenbelt',
        name: 'Greenbelt Area',
        nameKo: '그린벨트 지역',
        parentRegionId: 'makati',
        type: 'mixed',
        averageRent: 52000,
        safetyRating: 5,
        coordinates: { lat: 14.5520, lng: 121.0210 },
        description: 'Shopping and dining district'
      }
    ]
  },
  {
    id: 'bgc',
    name: 'Bonifacio Global City (BGC)',
    nameKo: 'BGC (보니파시오 글로벌 시티)',
    nameZh: 'BGC全球城',
    nameJa: 'BGC（ボニファシオ・グローバル・シティ）',
    province: 'Metro Manila',
    island: 'luzon',
    majorCity: true,
    coordinates: { lat: 14.5507, lng: 121.0494 },
    description: 'Modern business district with international atmosphere',
    descriptionKo: '국제적 분위기의 현대적 비즈니스 지구',
    population: 250000,
    averageRent: 50000,
    safetyRating: 5,
    foreignerFriendly: true,
    hasInternationalSchools: true,
    businessDistrict: true,
    touristArea: true,
    districts: [
      {
        id: 'bgc-central',
        name: 'BGC Central',
        nameKo: 'BGC 중심가',
        parentRegionId: 'bgc',
        type: 'cbd',
        averageRent: 55000,
        safetyRating: 5,
        coordinates: { lat: 14.5507, lng: 121.0494 },
        description: 'Main business and shopping area'
      },
      {
        id: 'high-street',
        name: 'High Street',
        nameKo: '하이 스트리트',
        parentRegionId: 'bgc',
        type: 'mixed',
        averageRent: 52000,
        safetyRating: 5,
        coordinates: { lat: 14.5490, lng: 121.0500 },
        description: 'Shopping and dining strip'
      },
      {
        id: 'serendra',
        name: 'Serendra',
        nameKo: '세렌드라',
        parentRegionId: 'bgc',
        type: 'residential',
        averageRent: 48000,
        safetyRating: 5,
        coordinates: { lat: 14.5520, lng: 121.0510 },
        description: 'Upscale residential complex'
      }
    ]
  },
  {
    id: 'ortigas',
    name: 'Ortigas Center',
    nameKo: '오르티가스 센터',
    nameZh: '奥迪加斯中心',
    nameJa: 'オルティガス・センター',
    province: 'Metro Manila',
    island: 'luzon',
    majorCity: true,
    coordinates: { lat: 14.5866, lng: 121.0567 },
    description: 'Major business district with affordable housing options',
    descriptionKo: '저렴한 주거 옵션이 있는 주요 비즈니스 지구',
    population: 450000,
    averageRent: 35000,
    safetyRating: 4,
    foreignerFriendly: true,
    hasInternationalSchools: true,
    businessDistrict: true,
    touristArea: false,
    districts: [
      {
        id: 'ortigas-cbd',
        name: 'Ortigas CBD',
        nameKo: '오르티가스 비즈니스 지구',
        parentRegionId: 'ortigas',
        type: 'cbd',
        averageRent: 40000,
        safetyRating: 4,
        coordinates: { lat: 14.5866, lng: 121.0567 },
        description: 'Central business district'
      },
      {
        id: 'capitol-commons',
        name: 'Capitol Commons',
        nameKo: '캐피톨 커먼스',
        parentRegionId: 'ortigas',
        type: 'mixed',
        averageRent: 38000,
        safetyRating: 4,
        coordinates: { lat: 14.5840, lng: 121.0590 },
        description: 'Mixed-use development'
      }
    ]
  },
  {
    id: 'quezon-city',
    name: 'Quezon City',
    nameKo: '퀘존 시티',
    nameZh: '奎松市',
    nameJa: 'ケソン市',
    province: 'Metro Manila',
    island: 'luzon',
    majorCity: true,
    coordinates: { lat: 14.6760, lng: 121.0437 },
    description: 'Largest city in Metro Manila with diverse neighborhoods',
    descriptionKo: '메트로 마닐라에서 가장 큰 도시로 다양한 지역',
    population: 2900000,
    averageRent: 25000,
    safetyRating: 3,
    foreignerFriendly: true,
    hasInternationalSchools: true,
    businessDistrict: false,
    touristArea: false,
    districts: [
      {
        id: 'diliman',
        name: 'Diliman',
        nameKo: '딜리만',
        parentRegionId: 'quezon-city',
        type: 'residential',
        averageRent: 30000,
        safetyRating: 4,
        coordinates: { lat: 14.6537, lng: 121.0685 },
        description: 'University area with UP Diliman'
      },
      {
        id: 'eastwood',
        name: 'Eastwood City',
        nameKo: '이스트우드 시티',
        parentRegionId: 'quezon-city',
        type: 'mixed',
        averageRent: 35000,
        safetyRating: 4,
        coordinates: { lat: 14.6091, lng: 121.0773 },
        description: 'Business and entertainment district'
      }
    ]
  }
];

// 세부 지역
export const cebuRegions: Region[] = [
  {
    id: 'cebu-city',
    name: 'Cebu City',
    nameKo: '세부 시티',
    nameZh: '宿务市',
    nameJa: 'セブ市',
    province: 'Cebu',
    island: 'visayas',
    majorCity: true,
    coordinates: { lat: 10.3157, lng: 123.8854 },
    description: 'Major city in Visayas with growing expat community',
    descriptionKo: '비사야스의 주요 도시로 외국인 커뮤니티 증가',
    population: 950000,
    averageRent: 20000,
    safetyRating: 4,
    foreignerFriendly: true,
    hasInternationalSchools: true,
    businessDistrict: true,
    touristArea: true,
    districts: [
      {
        id: 'cebu-it-park',
        name: 'Cebu IT Park',
        nameKo: '세부 IT 파크',
        parentRegionId: 'cebu-city',
        type: 'cbd',
        averageRent: 25000,
        safetyRating: 5,
        coordinates: { lat: 10.3272, lng: 123.9065 },
        description: 'Tech hub with international companies'
      },
      {
        id: 'lahug',
        name: 'Lahug',
        nameKo: '라후그',
        parentRegionId: 'cebu-city',
        type: 'residential',
        averageRent: 18000,
        safetyRating: 4,
        coordinates: { lat: 10.3380, lng: 123.9050 },
        description: 'Upscale residential area'
      },
      {
        id: 'banilad',
        name: 'Banilad',
        nameKo: '바닐라드',
        parentRegionId: 'cebu-city',
        type: 'mixed',
        averageRent: 22000,
        safetyRating: 4,
        coordinates: { lat: 10.3410, lng: 123.9180 },
        description: 'Commercial and residential area'
      }
    ]
  },
  {
    id: 'mactan',
    name: 'Mactan Island',
    nameKo: '막탄 섬',
    nameZh: '马克坦岛',
    nameJa: 'マクタン島',
    province: 'Cebu',
    island: 'visayas',
    majorCity: false,
    coordinates: { lat: 10.3088, lng: 123.9616 },
    description: 'Resort island with beaches and airport',
    descriptionKo: '해변과 공항이 있는 리조트 섬',
    population: 470000,
    averageRent: 25000,
    safetyRating: 4,
    foreignerFriendly: true,
    hasInternationalSchools: false,
    businessDistrict: false,
    touristArea: true
  }
];

// 다바오 지역
export const davaoRegions: Region[] = [
  {
    id: 'davao-city',
    name: 'Davao City',
    nameKo: '다바오 시티',
    nameZh: '达沃市',
    nameJa: 'ダバオ市',
    province: 'Davao del Sur',
    island: 'mindanao',
    majorCity: true,
    coordinates: { lat: 7.1907, lng: 125.4553 },
    description: 'Largest city in Mindanao, known for safety and durian',
    descriptionKo: '민다나오에서 가장 큰 도시, 안전함과 두리안으로 유명',
    population: 1800000,
    averageRent: 18000,
    safetyRating: 4,
    foreignerFriendly: true,
    hasInternationalSchools: true,
    businessDistrict: true,
    touristArea: false,
    districts: [
      {
        id: 'poblacion',
        name: 'Poblacion District',
        nameKo: '포블라시온 지구',
        parentRegionId: 'davao-city',
        type: 'cbd',
        averageRent: 22000,
        safetyRating: 4,
        coordinates: { lat: 7.0731, lng: 125.6128 },
        description: 'Downtown business district'
      },
      {
        id: 'lanang',
        name: 'Lanang',
        nameKo: '라낭',
        parentRegionId: 'davao-city',
        type: 'mixed',
        averageRent: 20000,
        safetyRating: 4,
        coordinates: { lat: 7.0892, lng: 125.6275 },
        description: 'Commercial and residential area'
      }
    ]
  }
];

// 관광지역
export const touristRegions: Region[] = [
  {
    id: 'boracay',
    name: 'Boracay Island',
    nameKo: '보라카이 섬',
    nameZh: '长滩岛',
    nameJa: 'ボラカイ島',
    province: 'Aklan',
    island: 'visayas',
    majorCity: false,
    coordinates: { lat: 11.9674, lng: 121.9248 },
    description: 'Famous beach destination with white sand beaches',
    descriptionKo: '하얀 모래 해변으로 유명한 관광지',
    population: 37000,
    averageRent: 30000,
    safetyRating: 4,
    foreignerFriendly: true,
    hasInternationalSchools: false,
    businessDistrict: false,
    touristArea: true
  },
  {
    id: 'baguio',
    name: 'Baguio City',
    nameKo: '바기오 시티',
    nameZh: '碧瑶市',
    nameJa: 'バギオ市',
    province: 'Benguet',
    island: 'luzon',
    majorCity: true,
    coordinates: { lat: 16.4023, lng: 120.5960 },
    description: 'Mountain city with cool climate, summer capital',
    descriptionKo: '시원한 기후의 산악 도시, 여름 수도',
    population: 365000,
    averageRent: 15000,
    safetyRating: 5,
    foreignerFriendly: true,
    hasInternationalSchools: true,
    businessDistrict: false,
    touristArea: true
  }
];

// 전체 지역 목록
export const allPhilippinesRegions: Region[] = [
  ...metroManilaRegions,
  ...cebuRegions,
  ...davaoRegions,
  ...touristRegions
];

// 지역 검색 및 필터링 함수들
export const getRegionById = (id: string): Region | undefined => {
  return allPhilippinesRegions.find(region => region.id === id);
};

export const getRegionsByIsland = (island: 'luzon' | 'visayas' | 'mindanao'): Region[] => {
  return allPhilippinesRegions.filter(region => region.island === island);
};

export const getBusinessDistricts = (): Region[] => {
  return allPhilippinesRegions.filter(region => region.businessDistrict);
};

export const getForeignerFriendlyRegions = (): Region[] => {
  return allPhilippinesRegions.filter(region => region.foreignerFriendly);
};

export const getSafeRegions = (minRating: number = 4): Region[] => {
  return allPhilippinesRegions.filter(region => region.safetyRating >= minRating);
};

export const getRegionsByPriceRange = (minPrice: number, maxPrice: number): Region[] => {
  return allPhilippinesRegions.filter(region => 
    region.averageRent && region.averageRent >= minPrice && region.averageRent <= maxPrice
  );
};

export const searchRegions = (query: string): Region[] => {
  const searchTerm = query.toLowerCase();
  return allPhilippinesRegions.filter(region =>
    region.name.toLowerCase().includes(searchTerm) ||
    region.nameKo.includes(searchTerm) ||
    region.description.toLowerCase().includes(searchTerm) ||
    region.descriptionKo.includes(searchTerm)
  );
};