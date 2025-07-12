// 마켓플레이스 (중고거래) 관련 타입 정의

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  category: MarketplaceCategory;
  subcategory: string;
  
  // 가격 정보
  price: number;
  currency: 'PHP' | 'USD';
  priceType: 'fixed' | 'negotiable' | 'auction' | 'free';
  originalPrice?: number; // 정가 (할인률 계산용)
  
  // 상품 상태
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  conditionDescription?: string;
  
  // 상품 정보
  brand?: string;
  model?: string;
  year?: number;
  size?: string;
  color?: string;
  specifications?: { [key: string]: string };
  
  // 이미지
  images: MarketplaceImage[];
  
  // 위치
  location: {
    regionId: string;
    districtId?: string;
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    meetupLocations?: string[]; // 거래 선호 장소
  };
  
  // 판매자 정보
  seller: {
    userId: string;
    username: string;
    avatar?: string;
    rating: number;
    responseRate: number; // 응답률 %
    responseTime: string; // "within 1 hour"
    verificationLevel: 'basic' | 'verified' | 'trusted';
    sellerType: 'individual' | 'business' | 'shop';
  };
  
  // 거래 옵션
  tradingOptions: {
    delivery: boolean;
    pickup: boolean;
    meetup: boolean;
    shipping: boolean;
    cod: boolean; // 착불
    bankTransfer: boolean;
    cash: boolean;
    installment: boolean; // 할부
  };
  
  // 상태 관리
  status: 'active' | 'sold' | 'reserved' | 'expired' | 'removed';
  featured: boolean;
  urgent: boolean;
  boosted: boolean; // 광고
  
  // 통계
  viewCount: number;
  favoriteCount: number;
  inquiryCount: number;
  
  // 시간 정보
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  soldAt?: string;
  
  // 태그
  tags: string[];
  
  // 번역
  translations: {
    ko?: { title: string; description: string };
    zh?: { title: string; description: string };
    ja?: { title: string; description: string };
    en?: { title: string; description: string };
  };
}

export interface MarketplaceImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  alt: string;
  order: number;
  isMain: boolean;
}

// 마켓플레이스 카테고리
export type MarketplaceCategory = 
  | 'electronics'      // 전자제품
  | 'furniture'        // 가구
  | 'vehicles'         // 차량
  | 'clothing'         // 의류
  | 'books'           // 도서
  | 'sports'          // 스포츠/레저
  | 'beauty'          // 뷰티/화장품
  | 'home_appliances' // 가전제품
  | 'baby_kids'       // 유아용품
  | 'pets'            // 반려동물용품
  | 'music'           // 악기/음향
  | 'games'           // 게임/완구
  | 'art_collectibles' // 예술품/수집품
  | 'business'        // 사업용품
  | 'services'        // 서비스
  | 'others';         // 기타

// 카테고리별 세부 분류
export const MARKETPLACE_SUBCATEGORIES = {
  electronics: [
    'smartphones', 'laptops', 'tablets', 'cameras', 'headphones', 
    'speakers', 'gaming_consoles', 'smart_watches', 'televisions', 'others'
  ],
  furniture: [
    'sofas', 'beds', 'dining_tables', 'chairs', 'wardrobes', 
    'desks', 'shelves', 'decorations', 'lighting', 'others'
  ],
  vehicles: [
    'cars', 'motorcycles', 'bicycles', 'trucks', 'vans', 
    'parts_accessories', 'boats', 'others'
  ],
  clothing: [
    'mens', 'womens', 'kids', 'shoes', 'bags', 'accessories', 
    'formal_wear', 'sportswear', 'others'
  ],
  books: [
    'textbooks', 'novels', 'comics', 'magazines', 'children_books',
    'reference', 'academic', 'others'
  ],
  sports: [
    'fitness_equipment', 'outdoor_gear', 'team_sports', 'water_sports',
    'martial_arts', 'cycling', 'running', 'others'
  ],
  beauty: [
    'skincare', 'makeup', 'hair_care', 'perfume', 'nail_care',
    'men_grooming', 'beauty_tools', 'others'
  ],
  home_appliances: [
    'refrigerators', 'washing_machines', 'air_conditioners', 'microwaves',
    'rice_cookers', 'electric_fans', 'water_heaters', 'others'
  ],
  baby_kids: [
    'strollers', 'car_seats', 'toys', 'clothing', 'feeding',
    'furniture', 'safety', 'others'
  ],
  pets: [
    'dog_supplies', 'cat_supplies', 'food', 'toys', 'accessories',
    'health_care', 'cages', 'others'
  ],
  music: [
    'guitars', 'keyboards', 'drums', 'audio_equipment', 'accessories',
    'recording', 'dj_equipment', 'others'
  ],
  games: [
    'video_games', 'board_games', 'toys', 'collectibles', 'puzzles',
    'outdoor_games', 'party_games', 'others'
  ],
  art_collectibles: [
    'paintings', 'sculptures', 'antiques', 'coins', 'stamps',
    'memorabilia', 'crafts', 'others'
  ],
  business: [
    'office_furniture', 'equipment', 'supplies', 'electronics',
    'machinery', 'tools', 'inventory', 'others'
  ],
  services: [
    'cleaning', 'tutoring', 'delivery', 'repair', 'photography',
    'translation', 'consulting', 'others'
  ],
  others: [
    'miscellaneous', 'uncategorized'
  ]
};

// 필터 옵션
export interface MarketplaceFilters {
  category?: MarketplaceCategory;
  subcategory?: string;
  regionId?: string;
  districtId?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string[];
  priceType?: string[];
  tradingOptions?: string[];
  sellerType?: string[];
  postedWithin?: 'today' | 'week' | 'month' | 'all';
  sortBy?: 'newest' | 'oldest' | 'price_low' | 'price_high' | 'popular' | 'nearby';
  searchQuery?: string;
}

// 검색 제안
export interface SearchSuggestion {
  id: string;
  text: string;
  category?: MarketplaceCategory;
  type: 'category' | 'brand' | 'popular' | 'recent';
  count?: number;
}

// 카테고리 메타데이터
export interface CategoryInfo {
  id: MarketplaceCategory;
  name: string;
  nameKo: string;
  nameZh: string;
  nameJa: string;
  icon: string;
  color: string;
  description: string;
  descriptionKo: string;
  popularSubcategories: string[];
  avgPriceRange: {
    min: number;
    max: number;
  };
  totalItems: number;
  trendingItems: string[];
}

// 인기 카테고리 정보
export const POPULAR_CATEGORIES: CategoryInfo[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    nameKo: '전자제품',
    nameZh: '电子产品',
    nameJa: '電子製品',
    icon: '📱',
    color: 'blue',
    description: 'Smartphones, laptops, gadgets and more',
    descriptionKo: '스마트폰, 노트북, 각종 전자기기',
    popularSubcategories: ['smartphones', 'laptops', 'headphones'],
    avgPriceRange: { min: 1000, max: 50000 },
    totalItems: 1250,
    trendingItems: ['iPhone 14', 'MacBook Pro', 'AirPods']
  },
  {
    id: 'vehicles',
    name: 'Vehicles',
    nameKo: '차량',
    nameZh: '车辆',
    nameJa: '車両',
    icon: '🚗',
    color: 'red',
    description: 'Cars, motorcycles, bicycles and vehicle parts',
    descriptionKo: '자동차, 오토바이, 자전거 및 부품',
    popularSubcategories: ['cars', 'motorcycles', 'bicycles'],
    avgPriceRange: { min: 50000, max: 2000000 },
    totalItems: 890,
    trendingItems: ['Toyota Vios', 'Honda Click', 'Mountain Bike']
  },
  {
    id: 'furniture',
    name: 'Furniture',
    nameKo: '가구',
    nameZh: '家具',
    nameJa: '家具',
    icon: '🛋️',
    color: 'brown',
    description: 'Sofas, beds, tables and home furniture',
    descriptionKo: '소파, 침대, 테이블 등 가정용 가구',
    popularSubcategories: ['sofas', 'beds', 'dining_tables'],
    avgPriceRange: { min: 2000, max: 30000 },
    totalItems: 670,
    trendingItems: ['Queen Bed', 'Dining Set', 'Office Chair']
  },
  {
    id: 'home_appliances',
    name: 'Home Appliances',
    nameKo: '가전제품',
    nameZh: '家用电器',
    nameJa: '家電製品',
    icon: '🏠',
    color: 'green',
    description: 'Refrigerators, washing machines, air conditioners',
    descriptionKo: '냉장고, 세탁기, 에어컨 등 가전제품',
    popularSubcategories: ['refrigerators', 'washing_machines', 'air_conditioners'],
    avgPriceRange: { min: 5000, max: 80000 },
    totalItems: 540,
    trendingItems: ['Split AC', 'Front Load Washer', 'Double Door Fridge']
  },
  {
    id: 'clothing',
    name: 'Clothing & Fashion',
    nameKo: '의류 & 패션',
    nameZh: '服装时尚',
    nameJa: '衣類・ファッション',
    icon: '👕',
    color: 'purple',
    description: 'Clothes, shoes, bags and fashion accessories',
    descriptionKo: '의류, 신발, 가방 및 패션 액세서리',
    popularSubcategories: ['mens', 'womens', 'shoes'],
    avgPriceRange: { min: 200, max: 5000 },
    totalItems: 980,
    trendingItems: ['Nike Shoes', 'Designer Bag', 'Formal Dress']
  },
  {
    id: 'services',
    name: 'Services',
    nameKo: '서비스',
    nameZh: '服务',
    nameJa: 'サービス',
    icon: '🔧',
    color: 'orange',
    description: 'Cleaning, tutoring, repair and other services',
    descriptionKo: '청소, 과외, 수리 등 각종 서비스',
    popularSubcategories: ['cleaning', 'tutoring', 'repair'],
    avgPriceRange: { min: 500, max: 10000 },
    totalItems: 320,
    trendingItems: ['House Cleaning', 'English Tutoring', 'AC Repair']
  }
];

// 거래 상태 추적
export interface Transaction {
  id: string;
  itemId: string;
  buyerId: string;
  sellerId: string;
  status: 'inquiry' | 'negotiating' | 'agreed' | 'meeting_arranged' | 'completed' | 'cancelled';
  agreedPrice?: number;
  meetupLocation?: string;
  meetupTime?: string;
  paymentMethod?: string;
  messages: TransactionMessage[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface TransactionMessage {
  id: string;
  senderId: string;
  message: string;
  timestamp: string;
  type: 'text' | 'location' | 'price_offer' | 'system';
  offer?: {
    price: number;
    currency: string;
    validUntil: string;
  };
}

// 안전 가이드라인
export const SAFETY_GUIDELINES = {
  meetup: [
    '공공장소에서 만나세요 (쇼핑몰, 카페 등)',
    '낮 시간대에 거래하세요',
    '가능하면 친구와 함께 가세요',
    '현금 거래 시 큰 돈은 미리 준비하세요',
    '상품을 꼼꼼히 확인한 후 거래하세요'
  ],
  online: [
    '선입금 요구는 사기일 가능성이 높습니다',
    '검증된 판매자와 거래하세요',
    '거래 내역을 저장해두세요',
    '의심스러운 요구는 거절하세요',
    '개인정보를 과도하게 요구하면 주의하세요'
  ],
  general: [
    '너무 싼 가격은 의심해보세요',
    '판매자의 평점과 리뷰를 확인하세요',
    '상품 사진이 도용된 것은 아닌지 확인하세요',
    '급하게 거래를 재촉하면 의심하세요',
    '문제 발생 시 즉시 신고하세요'
  ]
};