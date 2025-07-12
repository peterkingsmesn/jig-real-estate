import { NextApiRequest, NextApiResponse } from 'next';
import type { ApiResponse, ApiErrorResponse } from '@/types/api';
import { ErrorCodes, createSuccessResponse, createErrorResponse, ApiError } from '@/types/api';
import type { Property } from '@/types/property';

// 매물 쿼리 파라미터 인터페이스
interface PropertyQuery {
  page: number;
  limit: number;
  region?: string;
  type?: 'house' | 'condo' | 'village';
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnished?: boolean;
  sortBy: 'price' | 'date' | 'popularity';
  order: 'asc' | 'desc';
  language: 'ko' | 'zh' | 'ja' | 'en' | 'tl';
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    const error = new ApiError(
      'Method not allowed',
      ErrorCodes.VALIDATION_ERROR,
      405
    );
    return res.status(405).json(
      createErrorResponse(error, req.url || '/api/properties')
    );
  }

  try {
    // 쿼리 파라미터 파싱 및 검증
    const query = parseAndValidateQuery(req.query);
    
    // 데이터 조회 (현재는 모의 데이터, 실제로는 데이터베이스에서 조회)
    const { properties, total } = await getProperties(query);
    
    // 페이지네이션 메타 계산
    const meta = calculatePaginationMeta(total, query.page, query.limit);
    
    // 성공 응답
    const response = createSuccessResponse(
      properties,
      `Found ${properties.length} properties`,
      meta
    );
    res.status(200).json(response);

  } catch (error) {
    console.error('Error fetching properties:', error);
    
    const apiError = error instanceof ValidationError 
      ? new ApiError(error.message, ErrorCodes.VALIDATION_ERROR, 400, error.details)
      : error instanceof ApiError
        ? error
        : new ApiError('Internal server error', ErrorCodes.INTERNAL_SERVER_ERROR, 500);
    
    return res.status(apiError.statusCode).json(
      createErrorResponse(apiError, req.url || '/api/properties')
    );
  }
}

// 쿼리 파라미터 파싱 및 검증
function parseAndValidateQuery(rawQuery: Record<string, string | string[] | undefined>): PropertyQuery {
  const getStringParam = (param: string | string[] | undefined): string | undefined => {
    if (Array.isArray(param)) return param[0];
    return param;
  };

  const query: PropertyQuery = {
    page: parseInt(getStringParam(rawQuery.page) || '1') || 1,
    limit: parseInt(getStringParam(rawQuery.limit) || '20') || 20,
    region: getStringParam(rawQuery.region),
    type: getStringParam(rawQuery.type) as 'house' | 'condo' | 'village' | undefined,
    minPrice: rawQuery.minPrice ? parseInt(getStringParam(rawQuery.minPrice) || '0') : undefined,
    maxPrice: rawQuery.maxPrice ? parseInt(getStringParam(rawQuery.maxPrice) || '0') : undefined,
    bedrooms: rawQuery.bedrooms ? parseInt(getStringParam(rawQuery.bedrooms) || '0') : undefined,
    bathrooms: rawQuery.bathrooms ? parseInt(getStringParam(rawQuery.bathrooms) || '0') : undefined,
    furnished: rawQuery.furnished ? getStringParam(rawQuery.furnished) === 'true' : undefined,
    sortBy: (getStringParam(rawQuery.sortBy) as 'price' | 'date' | 'popularity') || 'date',
    order: (getStringParam(rawQuery.order) as 'asc' | 'desc') || 'desc',
    language: (getStringParam(rawQuery.language) as 'ko' | 'zh' | 'ja' | 'en' | 'tl') || 'ko'
  };

  // 유효성 검증
  if (query.page < 1) {
    throw new ValidationError('Page must be greater than 0', { page: query.page });
  }
  
  if (query.limit < 1 || query.limit > 100) {
    throw new ValidationError('Limit must be between 1 and 100', { limit: query.limit });
  }
  
  if (query.type && !['house', 'condo', 'village'].includes(query.type)) {
    throw new ValidationError('Invalid property type', { type: query.type });
  }
  
  if (query.sortBy && !['price', 'date', 'popularity'].includes(query.sortBy)) {
    throw new ValidationError('Invalid sortBy parameter', { sortBy: query.sortBy });
  }
  
  if (query.order && !['asc', 'desc'].includes(query.order)) {
    throw new ValidationError('Invalid order parameter', { order: query.order });
  }

  return query;
}

// 매물 데이터 조회 (모의 데이터)
async function getProperties(query: PropertyQuery): Promise<{ properties: Property[], total: number }> {
  // 실제 환경에서는 데이터베이스에서 조회
  // const properties = await db.collection('properties').find(filters).toArray();
  
  // 현재는 모의 데이터 사용
  const mockProperties = await getMockProperties();
  
  // 필터링 적용
  let filteredProperties = mockProperties.filter(property => {
    if (query.region && property.region !== query.region) return false;
    if (query.type && property.type !== query.type) return false;
    if (query.minPrice && property.price < query.minPrice) return false;
    if (query.maxPrice && property.price > query.maxPrice) return false;
    if (query.bedrooms && property.bedrooms !== query.bedrooms) return false;
    if (query.bathrooms && property.bathrooms !== query.bathrooms) return false;
    if (query.furnished !== undefined && property.furnished !== query.furnished) return false;
    return true;
  });
  
  // 정렬 적용
  filteredProperties.sort((a, b) => {
    const order = query.order === 'asc' ? 1 : -1;
    
    switch (query.sortBy) {
      case 'price':
        return (a.price - b.price) * order;
      case 'popularity':
        return ((a.viewCount || 0) - (b.viewCount || 0)) * order;
      case 'date':
      default:
        return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * order;
    }
  });
  
  const total = filteredProperties.length;
  const startIndex = (query.page - 1) * query.limit;
  const endIndex = startIndex + query.limit;
  const paginatedProperties = filteredProperties.slice(startIndex, endIndex);
  
  return {
    properties: paginatedProperties,
    total
  };
}

// 페이지네이션 메타 계산
function calculatePaginationMeta(total: number, page: number, limit: number) {
  const totalPages = Math.ceil(total / limit);
  
  return {
    total,
    page,
    limit,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
}

// 모의 매물 데이터 생성
async function getMockProperties(): Promise<Property[]> {
  const today = new Date();
  
  return [
    {
      id: '1',
      title: 'Modern 2BR Condo in BGC',
      description: 'Fully furnished modern condominium in the heart of Bonifacio Global City with city views.',
      type: 'condo',
      region: 'Metro Manila',
      city: 'Taguig',
      district: 'BGC',
      address: '26th Street, BGC, Taguig City',
      price: 45000,
      currency: 'PHP',
      deposit: 90000,
      bedrooms: 2,
      bathrooms: 2,
      area: 65,
      floor: 25,
      furnished: true,
      amenities: ['gym', 'pool', 'parking', 'security', 'wifi'],
      images: [
        {
          id: 'img1',
          url: '/images/property1.jpg',
          thumbnailUrl: '/images/property1_thumb.jpg',
          alt: 'Modern condo living room',
          order: 1,
          isMain: true
        }
      ],
      location: {
        latitude: 14.5547,
        longitude: 121.0244,
        address: '26th Street, BGC, Taguig City',
        landmark: 'Near SM Aura',
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
          description: 'BGC 중심가에 위치한 시티뷰를 갖춘 풀옵션 모던 콘도미니엄'
        },
        zh: {
          title: 'BGC现代2居室公寓',
          description: 'BGC中心地带的全装修现代公寓，享有城市景观'
        },
        en: {
          title: 'Modern 2BR Condo in BGC',
          description: 'Fully furnished modern condominium in the heart of Bonifacio Global City with city views.'
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
      description: 'Large family house with garden, perfect for expat families.',
      type: 'house',
      region: 'Angeles',
      city: 'Angeles City',
      district: 'Balibago',
      address: 'Balibago, Angeles City, Pampanga',
      price: 35000,
      currency: 'PHP',
      deposit: 70000,
      bedrooms: 3,
      bathrooms: 3,
      area: 150,
      furnished: false,
      amenities: ['garden', 'parking', 'security'],
      images: [
        {
          id: 'img2',
          url: '/images/property2.jpg',
          thumbnailUrl: '/images/property2_thumb.jpg',
          alt: 'Spacious house exterior',
          order: 1,
          isMain: true
        }
      ],
      location: {
        latitude: 15.1450,
        longitude: 120.5930,
        address: 'Balibago, Angeles City, Pampanga',
        landmark: 'Near Clark Airport',
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
          description: '정원이 있는 대형 가족용 주택, 외국인 가족에게 완벽'
        },
        zh: {
          title: '安吉利斯市宽敞住宅',
          description: '带花园的大型家庭住宅，适合外籍家庭'
        },
        en: {
          title: 'Spacious House in Angeles City',
          description: 'Large family house with garden, perfect for expat families.'
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

// 커스텀 에러 클래스
class ValidationError extends Error {
  constructor(message: string, public details?: Record<string, unknown>) {
    super(message);
    this.name = 'ValidationError';
  }
}