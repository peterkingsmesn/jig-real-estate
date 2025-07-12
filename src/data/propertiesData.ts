import { Property } from '@/types/property';

// 매물 데이터 (실제로는 데이터베이스에서 가져올 데이터)
export const propertiesData: Property[] = [
  {
    id: '1',
    title: 'Modern 2BR Condo in BGC Taguig',
    description: 'Beautiful modern condominium unit located in the heart of Bonifacio Global City. Features stunning city views, premium amenities, and excellent location near shopping centers and business districts.',
    type: 'condo',
    region: 'manila',
    city: 'Taguig',
    district: 'BGC',
    address: '5th Avenue, BGC, Taguig City, Metro Manila',
    price: 45000,
    currency: 'PHP',
    deposit: 90000,
    bedrooms: 2,
    bathrooms: 2,
    area: 65,
    floor: 25,
    furnished: true,
    amenities: ['elevator', 'security', 'gym', 'swimming_pool', 'parking', 'balcony', 'aircon'],
    images: [
      {
        id: 'img1',
        url: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=300&h=200&fit=crop',
        alt: 'Modern living room with city view',
        order: 1,
        isMain: true
      },
      {
        id: 'img2',
        url: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=300&h=200&fit=crop',
        alt: 'Modern kitchen',
        order: 2,
        isMain: false
      },
      {
        id: 'img3',
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
        alt: 'Bedroom',
        order: 3,
        isMain: false
      }
    ],
    location: {
      latitude: 14.5547,
      longitude: 121.0491,
      address: '5th Avenue, BGC, Taguig City, Metro Manila',
      landmark: 'Near SM Aura',
      district: 'BGC',
      city: 'Taguig',
      province: 'Metro Manila'
    },
    contact: {
      whatsapp: '+63 912 345 6789',
      telegram: '@property_owner1',
      email: 'owner1@example.com',
      phone: '+63 912 345 6789',
      contactName: 'Maria Santos'
    },
    translations: {
      ko: {
        title: 'BGC 타기그의 모던 2베드룸 콘도',
        description: '보니파시오 글로벌 시티 중심부에 위치한 아름다운 모던 콘도미니엄 유닛입니다.'
      },
      zh: {
        title: 'BGC塔吉格现代2卧室公寓',
        description: '位于博尼法西奥全球城市中心的美丽现代公寓单位。'
      },
      ja: {
        title: 'BGCタギッグのモダン2ベッドルームコンド',
        description: 'ボニファシオ・グローバル・シティの中心部に位置する美しいモダンコンドミニアム。'
      },
      en: {
        title: 'Modern 2BR Condo in BGC Taguig',
        description: 'Beautiful modern condominium unit located in the heart of Bonifacio Global City.'
      }
    },
    status: 'active',
    viewCount: 245,
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    featured: true
  },
  {
    id: '2',
    title: 'Cozy 1BR House in Cebu City',
    description: 'Charming single-bedroom house perfect for couples or solo travelers. Located in a quiet residential area with easy access to IT Park and shopping centers.',
    type: 'house',
    region: 'cebu',
    city: 'Cebu City',
    district: 'Lahug',
    address: 'Lahug, Cebu City, Cebu',
    price: 18000,
    currency: 'PHP',
    deposit: 36000,
    bedrooms: 1,
    bathrooms: 1,
    area: 40,
    furnished: false,
    amenities: ['parking', 'security', 'water_supply', 'electricity', 'internet', 'garden'],
    images: [
      {
        id: 'img4',
        url: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=300&h=200&fit=crop',
        alt: 'Cozy house exterior',
        order: 1,
        isMain: true
      },
      {
        id: 'img5',
        url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=300&h=200&fit=crop',
        alt: 'Living area',
        order: 2,
        isMain: false
      }
    ],
    location: {
      latitude: 10.3157,
      longitude: 123.8854,
      address: 'Lahug, Cebu City, Cebu',
      landmark: 'Near IT Park',
      district: 'Lahug',
      city: 'Cebu City',
      province: 'Cebu'
    },
    contact: {
      whatsapp: '+63 922 123 4567',
      telegram: '@cebu_rentals',
      email: 'cebuhouse@example.com',
      phone: '+63 922 123 4567',
      contactName: 'Juan Dela Cruz'
    },
    translations: {
      ko: {
        title: '세부시의 아늑한 1베드룸 하우스',
        description: '커플이나 혼자 여행하는 분들에게 완벽한 매력적인 1베드룸 하우스입니다.'
      },
      zh: {
        title: '宿务市舒适的1卧室房屋',
        description: '完美适合情侣或独自旅行者的迷人单卧室房屋。'
      },
      ja: {
        title: 'セブ市の居心地の良い1ベッドルームハウス',
        description: 'カップルや一人旅の方に最適な魅力的な1ベッドルームハウス。'
      },
      en: {
        title: 'Cozy 1BR House in Cebu City',
        description: 'Charming single-bedroom house perfect for couples or solo travelers.'
      }
    },
    status: 'active',
    viewCount: 123,
    createdAt: '2024-01-10T10:15:00Z',
    updatedAt: '2024-01-18T09:45:00Z',
    featured: false
  },
  {
    id: '3',
    title: 'Luxury 3BR Village House in Alabang',
    description: 'Spacious three-bedroom house in a secure gated village community. Features include swimming pool, basketball court, and 24/7 security. Perfect for families.',
    type: 'village',
    region: 'manila',
    city: 'Muntinlupa',
    district: 'Alabang',
    address: 'Ayala Alabang Village, Muntinlupa City',
    price: 85000,
    currency: 'PHP',
    deposit: 170000,
    bedrooms: 3,
    bathrooms: 3,
    area: 180,
    furnished: true,
    amenities: ['security', 'swimming_pool', 'basketball_court', 'playground', 'clubhouse', 'parking', 'garden'],
    images: [
      {
        id: 'img6',
        url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop',
        alt: 'Luxury house exterior',
        order: 1,
        isMain: true
      },
      {
        id: 'img7',
        url: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=300&h=200&fit=crop',
        alt: 'Spacious living room',
        order: 2,
        isMain: false
      },
      {
        id: 'img8',
        url: 'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1560448075-bb485b067938?w=300&h=200&fit=crop',
        alt: 'Master bedroom',
        order: 3,
        isMain: false
      }
    ],
    location: {
      latitude: 14.4297,
      longitude: 121.0394,
      address: 'Ayala Alabang Village, Muntinlupa City',
      landmark: 'Ayala Alabang Country Club',
      district: 'Alabang',
      city: 'Muntinlupa',
      province: 'Metro Manila'
    },
    contact: {
      whatsapp: '+63 917 888 9999',
      telegram: '@alabang_luxury',
      email: 'luxury@example.com',
      phone: '+63 917 888 9999',
      contactName: 'Robert Chen'
    },
    translations: {
      ko: {
        title: '알라방의 럭셔리 3베드룸 빌리지 하우스',
        description: '보안이 철저한 게이트 빌리지 커뮤니티의 넓은 3베드룸 하우스입니다.'
      },
      zh: {
        title: '阿拉邦豪华3卧室村屋',
        description: '位于安全封闭式村庄社区的宽敞三卧室房屋。'
      },
      ja: {
        title: 'アラバンの高級3ベッドルームビレッジハウス',
        description: 'セキュリティの整ったゲート付きビレッジコミュニティの広々とした3ベッドルームハウス。'
      },
      en: {
        title: 'Luxury 3BR Village House in Alabang',
        description: 'Spacious three-bedroom house in a secure gated village community.'
      }
    },
    status: 'active',
    viewCount: 189,
    createdAt: '2024-01-12T16:20:00Z',
    updatedAt: '2024-01-22T11:15:00Z',
    featured: true
  },
  {
    id: '4',
    title: 'Beach Front Studio in Boracay',
    description: 'Wake up to stunning ocean views in this beachfront studio apartment. Perfect for vacation rentals or those seeking island living. Includes beach access and sunset views.',
    type: 'condo',
    region: 'boracay',
    city: 'Boracay',
    district: 'Station 2',
    address: 'Station 2, White Beach, Boracay Island',
    price: 35000,
    currency: 'PHP',
    deposit: 70000,
    bedrooms: 1,
    bathrooms: 1,
    area: 35,
    floor: 3,
    furnished: true,
    amenities: ['beach_access', 'balcony', 'aircon', 'wifi', 'restaurant'],
    images: [
      {
        id: 'img9',
        url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=300&h=200&fit=crop',
        alt: 'Beach front view',
        order: 1,
        isMain: true
      },
      {
        id: 'img10',
        url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=300&h=200&fit=crop',
        alt: 'Studio interior',
        order: 2,
        isMain: false
      }
    ],
    location: {
      latitude: 11.9674,
      longitude: 121.9248,
      address: 'Station 2, White Beach, Boracay Island',
      landmark: 'White Beach Station 2',
      district: 'Station 2',
      city: 'Boracay',
      province: 'Aklan'
    },
    contact: {
      whatsapp: '+63 906 777 8888',
      telegram: '@boracay_beach',
      email: 'beachstudio@example.com',
      phone: '+63 906 777 8888',
      contactName: 'Anna Reyes'
    },
    translations: {
      ko: {
        title: '보라카이 해변가 스튜디오',
        description: '멋진 바다 전망으로 깨어나는 해변가 스튜디오 아파트입니다.'
      },
      zh: {
        title: '长滩岛海滨工作室',
        description: '在这个海滨工作室公寓中醒来就能看到令人惊叹的海景。'
      },
      ja: {
        title: 'ボラカイビーチフロントスタジオ',
        description: 'このビーチフロントスタジオアパートで素晴らしい海の景色で目覚めましょう。'
      },
      en: {
        title: 'Beach Front Studio in Boracay',
        description: 'Wake up to stunning ocean views in this beachfront studio apartment.'
      }
    },
    status: 'inactive',
    viewCount: 87,
    createdAt: '2024-01-08T12:30:00Z',
    updatedAt: '2024-01-19T15:45:00Z',
    featured: false
  },
  {
    id: '5',
    title: 'Mountain View 2BR in Baguio',
    description: 'Escape to the cool mountain air in this charming 2-bedroom house with panoramic mountain views. Perfect for those seeking a peaceful retreat from city life.',
    type: 'house',
    region: 'baguio',
    city: 'Baguio',
    district: 'Upper Session',
    address: 'Upper Session Road, Baguio City',
    price: 25000,
    currency: 'PHP',
    deposit: 50000,
    bedrooms: 2,
    bathrooms: 1,
    area: 75,
    furnished: true,
    amenities: ['mountain_view', 'garden', 'parking', 'fireplace', 'wifi'],
    images: [
      {
        id: 'img11',
        url: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=300&h=200&fit=crop',
        alt: 'Mountain house exterior',
        order: 1,
        isMain: true
      },
      {
        id: 'img12',
        url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=300&h=200&fit=crop',
        alt: 'Cozy interior with fireplace',
        order: 2,
        isMain: false
      }
    ],
    location: {
      latitude: 16.4023,
      longitude: 120.5960,
      address: 'Upper Session Road, Baguio City',
      landmark: 'Session Road',
      district: 'Upper Session',
      city: 'Baguio',
      province: 'Benguet'
    },
    contact: {
      whatsapp: '+63 918 555 6666',
      telegram: '@baguio_mountain',
      email: 'mountain@example.com',
      phone: '+63 918 555 6666',
      contactName: 'Michael Torres'
    },
    translations: {
      ko: {
        title: '바기오 산전망 2베드룸',
        description: '파노라마 산 전망을 가진 이 매력적인 2베드룸 하우스에서 시원한 산 공기로 피하세요.'
      },
      zh: {
        title: '碧瑶山景2卧室',
        description: '在这座拥有全景山景的迷人2卧室房屋中逃到凉爽的山间空气。'
      },
      ja: {
        title: 'バギオマウンテンビュー2ベッドルーム',
        description: 'パノラマの山の景色を持つこの魅力的な2ベッドルームハウスで涼しい山の空気に逃れましょう。'
      },
      en: {
        title: 'Mountain View 2BR in Baguio',
        description: 'Escape to the cool mountain air in this charming 2-bedroom house with panoramic mountain views.'
      }
    },
    status: 'active',
    viewCount: 156,
    createdAt: '2024-01-05T09:00:00Z',
    updatedAt: '2024-01-21T13:20:00Z',
    featured: false
  }
];

// 매물 상태별 필터링 함수들
export const getPropertiesByStatus = (status: 'active' | 'inactive') => {
  return propertiesData.filter(property => property.status === status);
};

export const getFeaturedProperties = () => {
  return propertiesData.filter(property => property.featured && property.status === 'active');
};

export const getPropertiesByRegion = (region: string) => {
  return propertiesData.filter(property => property.region === region && property.status === 'active');
};

export const getPropertiesByType = (type: 'house' | 'condo' | 'village') => {
  return propertiesData.filter(property => property.type === type && property.status === 'active');
};

// 관리자용 통계 함수들
export const getPropertyStats = () => {
  const total = propertiesData.length;
  const active = propertiesData.filter(p => p.status === 'active').length;
  const inactive = propertiesData.filter(p => p.status === 'inactive').length;
  const featured = propertiesData.filter(p => p.featured).length;
  
  return { total, active, inactive, featured };
};