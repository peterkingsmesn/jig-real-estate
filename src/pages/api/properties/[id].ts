import { NextApiRequest, NextApiResponse } from 'next';

// API 계약에 따른 표준 응답 형식
interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  path: string;
}

// 매물 상세 응답 인터페이스
interface PropertyDetailResponse {
  property: PropertyDetail;
  relatedProperties: Property[];
  viewCount: number;
}

interface PropertyDetail {
  id: string;
  title: string;
  description: string;
  type: 'house' | 'condo' | 'village';
  region: string;
  address: string;
  price: number;
  currency: 'PHP';
  deposit: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  floor?: number;
  furnished: boolean;
  amenities: string[];
  images: PropertyImage[];
  location: Location;
  contact: ContactInfo;
  translations: PropertyTranslations;
  status: 'active' | 'inactive' | 'rented';
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
}

interface Property {
  id: string;
  title: string;
  description: string;
  type: 'house' | 'condo' | 'village';
  region: string;
  price: number;
  currency: 'PHP';
  bedrooms: number;
  bathrooms: number;
  area: number;
  furnished: boolean;
  images: PropertyImage[];
  viewCount: number;
  featured: boolean;
}

interface PropertyImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  alt: string;
  order: number;
  isMain: boolean;
}

interface Location {
  latitude: number;
  longitude: number;
  address: string;
  landmark?: string;
  district?: string;
  city: string;
  province: string;
}

interface ContactInfo {
  whatsapp?: string;
  telegram?: string;
  email?: string;
  phone?: string;
  contactName?: string;
}

interface PropertyTranslations {
  ko?: { title: string; description: string; };
  zh?: { title: string; description: string; };
  ja?: { title: string; description: string; };
  en?: { title: string; description: string; };
}

// 에러 코드 정의
const ErrorCodes = {
  VALIDATION_ERROR: 'DATA_001',
  RESOURCE_NOT_FOUND: 'DATA_002',
  INTERNAL_SERVER_ERROR: 'SERVER_001',
} as const;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Method not allowed'
      },
      timestamp: new Date().toISOString(),
      path: req.url || `/api/properties/${req.query.id}`
    } as ApiErrorResponse);
  }

  try {
    const { id } = req.query;
    
    // ID 유효성 검증
    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          code: ErrorCodes.VALIDATION_ERROR,
          message: 'Property ID is required and must be a string',
          details: { id }
        },
        timestamp: new Date().toISOString(),
        path: req.url || `/api/properties/${id}`
      } as ApiErrorResponse);
    }

    // 매물 상세 정보 조회
    const propertyDetail = await getPropertyDetail(id);
    
    if (!propertyDetail) {
      return res.status(404).json({
        success: false,
        error: {
          code: ErrorCodes.RESOURCE_NOT_FOUND,
          message: 'Property not found',
          details: { id }
        },
        timestamp: new Date().toISOString(),
        path: req.url || `/api/properties/${id}`
      } as ApiErrorResponse);
    }

    // 조회수 증가
    await incrementViewCount(id);
    
    // 관련 매물 조회 (같은 지역, 비슷한 가격대)
    const relatedProperties = await getRelatedProperties(id, propertyDetail.region, propertyDetail.type);
    
    // 성공 응답
    const response: PropertyDetailResponse = {
      property: propertyDetail,
      relatedProperties,
      viewCount: propertyDetail.viewCount + 1
    };

    res.status(200).json({
      success: true,
      data: response,
      message: 'Property details retrieved successfully'
    } as ApiResponse<PropertyDetailResponse>);

  } catch (error) {
    console.error('Error fetching property detail:', error);
    
    return res.status(500).json({
      success: false,
      error: {
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: 'Internal server error'
      },
      timestamp: new Date().toISOString(),
      path: req.url || `/api/properties/${req.query.id}`
    } as ApiErrorResponse);
  }
}

// 매물 상세 정보 조회 (모의 데이터)
async function getPropertyDetail(id: string): Promise<PropertyDetail | null> {
  // 실제 환경에서는 데이터베이스에서 조회
  // const property = await db.collection('properties').findOne({ id });
  
  // 현재는 모의 데이터 사용
  const mockProperties = await getMockPropertyDetails();
  return mockProperties.find(p => p.id === id) || null;
}

// 조회수 증가
async function incrementViewCount(id: string): Promise<void> {
  // 실제 환경에서는 데이터베이스 업데이트
  // await db.collection('properties').updateOne({ id }, { $inc: { viewCount: 1 } });
  console.log(`View count incremented for property ${id}`);
}

// 관련 매물 조회
async function getRelatedProperties(currentId: string, region: string, type: string): Promise<Property[]> {
  // 실제 환경에서는 데이터베이스에서 조회
  // const related = await db.collection('properties')
  //   .find({ 
  //     id: { $ne: currentId },
  //     $or: [{ region }, { type }],
  //     status: 'active'
  //   })
  //   .limit(4)
  //   .toArray();
  
  // 현재는 모의 데이터 사용
  const mockProperties = await getMockRelatedProperties();
  return mockProperties
    .filter(p => p.id !== currentId && (p.region === region || p.type === type))
    .slice(0, 4);
}

// 모의 매물 상세 데이터
async function getMockPropertyDetails(): Promise<PropertyDetail[]> {
  const today = new Date();
  
  return [
    {
      id: '1',
      title: 'Modern 2BR Condo in BGC',
      description: 'Fully furnished modern condominium in the heart of Bonifacio Global City with stunning city views. This premium unit features high-end appliances, modern fixtures, and access to world-class amenities including a swimming pool, fitness center, and 24/7 security.',
      type: 'condo',
      region: 'Metro Manila',
      address: '26th Street, BGC, Taguig City',
      price: 45000,
      currency: 'PHP',
      deposit: 90000,
      bedrooms: 2,
      bathrooms: 2,
      area: 65,
      floor: 25,
      furnished: true,
      amenities: ['gym', 'pool', 'parking', 'security', 'wifi', 'aircon', 'elevator', 'laundry'],
      images: [
        {
          id: 'img1_1',
          url: '/images/property1_living.jpg',
          thumbnailUrl: '/images/property1_living_thumb.jpg',
          alt: 'Modern living room with city view',
          order: 1,
          isMain: true
        },
        {
          id: 'img1_2',
          url: '/images/property1_bedroom.jpg',
          thumbnailUrl: '/images/property1_bedroom_thumb.jpg',
          alt: 'Master bedroom',
          order: 2,
          isMain: false
        },
        {
          id: 'img1_3',
          url: '/images/property1_kitchen.jpg',
          thumbnailUrl: '/images/property1_kitchen_thumb.jpg',
          alt: 'Modern kitchen',
          order: 3,
          isMain: false
        }
      ],
      location: {
        latitude: 14.5547,
        longitude: 121.0244,
        address: '26th Street, BGC, Taguig City',
        landmark: 'Near SM Aura Premier',
        district: 'BGC',
        city: 'Taguig',
        province: 'Metro Manila'
      },
      contact: {
        whatsapp: '+639171234567',
        telegram: '@bgcowner',
        email: 'owner@bgccondo.com',
        phone: '+639171234567',
        contactName: 'Maria Santos'
      },
      translations: {
        ko: {
          title: 'BGC 모던 2베드룸 콘도',
          description: 'BGC 중심가에 위치한 멋진 시티뷰를 갖춘 풀옵션 모던 콘도미니엄. 고급 가전제품, 모던한 인테리어, 수영장, 피트니스센터, 24시간 보안 등 최고급 편의시설 이용 가능.'
        },
        zh: {
          title: 'BGC现代2居室公寓',
          description: 'BGC中心地带的全装修现代公寓，享有壮丽的城市景观。配备高端电器、现代装修，可使用游泳池、健身中心和24小时安保等世界级设施。'
        },
        en: {
          title: 'Modern 2BR Condo in BGC',
          description: 'Fully furnished modern condominium in the heart of Bonifacio Global City with stunning city views. This premium unit features high-end appliances, modern fixtures, and access to world-class amenities.'
        }
      },
      status: 'active',
      viewCount: 150,
      createdAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      featured: true
    },
    {
      id: '2',
      title: 'Spacious House in Angeles City',
      description: 'Large family house with beautiful garden, perfect for expat families looking for a comfortable home in Angeles City. The property features a spacious living area, modern kitchen, and private parking.',
      type: 'house',
      region: 'Angeles',
      address: 'Balibago, Angeles City, Pampanga',
      price: 35000,
      currency: 'PHP',
      deposit: 70000,
      bedrooms: 3,
      bathrooms: 3,
      area: 150,
      furnished: false,
      amenities: ['garden', 'parking', 'security', 'wifi', 'aircon'],
      images: [
        {
          id: 'img2_1',
          url: '/images/property2_exterior.jpg',
          thumbnailUrl: '/images/property2_exterior_thumb.jpg',
          alt: 'House exterior with garden',
          order: 1,
          isMain: true
        },
        {
          id: 'img2_2',
          url: '/images/property2_living.jpg',
          thumbnailUrl: '/images/property2_living_thumb.jpg',
          alt: 'Spacious living room',
          order: 2,
          isMain: false
        }
      ],
      location: {
        latitude: 15.1450,
        longitude: 120.5930,
        address: 'Balibago, Angeles City, Pampanga',
        landmark: 'Near Clark International Airport',
        district: 'Balibago',
        city: 'Angeles',
        province: 'Pampanga'
      },
      contact: {
        whatsapp: '+639189876543',
        email: 'owner@angeleshouse.com',
        contactName: 'John Reyes'
      },
      translations: {
        ko: {
          title: '앙헬레스 넓은 단독주택',
          description: '아름다운 정원이 있는 대형 가족용 주택으로 앙헬레스에서 편안한 집을 찾는 외국인 가족에게 완벽합니다. 넓은 거실, 모던한 주방, 전용 주차장을 갖추고 있습니다.'
        },
        zh: {
          title: '安吉利斯市宽敞住宅',
          description: '带美丽花园的大型家庭住宅，适合在安吉利斯市寻找舒适家园的外籍家庭。房产配有宽敞客厅、现代厨房和私人停车场。'
        },
        en: {
          title: 'Spacious House in Angeles City',
          description: 'Large family house with beautiful garden, perfect for expat families looking for a comfortable home in Angeles City. The property features a spacious living area, modern kitchen, and private parking.'
        }
      },
      status: 'active',
      viewCount: 89,
      createdAt: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      featured: false
    }
  ];
}

// 모의 관련 매물 데이터
async function getMockRelatedProperties(): Promise<Property[]> {
  return [
    {
      id: '3',
      title: 'Luxury Condo in Makati',
      description: 'Premium condo in Makati CBD',
      type: 'condo',
      region: 'Metro Manila',
      price: 55000,
      currency: 'PHP',
      bedrooms: 2,
      bathrooms: 2,
      area: 70,
      furnished: true,
      images: [
        {
          id: 'img3',
          url: '/images/property3.jpg',
          thumbnailUrl: '/images/property3_thumb.jpg',
          alt: 'Luxury condo',
          order: 1,
          isMain: true
        }
      ],
      viewCount: 95,
      featured: true
    },
    {
      id: '4',
      title: 'Cozy House in Clark',
      description: 'Comfortable house near Clark',
      type: 'house',
      region: 'Angeles',
      price: 28000,
      currency: 'PHP',
      bedrooms: 2,
      bathrooms: 2,
      area: 120,
      furnished: false,
      images: [
        {
          id: 'img4',
          url: '/images/property4.jpg',
          thumbnailUrl: '/images/property4_thumb.jpg',
          alt: 'Cozy house',
          order: 1,
          isMain: true
        }
      ],
      viewCount: 67,
      featured: false
    }
  ];
}