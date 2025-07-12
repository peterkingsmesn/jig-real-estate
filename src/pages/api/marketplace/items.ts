import { NextApiRequest, NextApiResponse } from 'next';

// API 계약에 따른 표준 응답 형식
interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
    filters: {
      totalItems: number;
      featuredItems: number;
      newItems: number;
      activeUsers: number;
    };
  };
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

interface MarketplaceItem {
  id: string;
  title: string;
  titleKo: string;
  titleTl: string;
  description: string;
  descriptionKo: string;
  descriptionTl: string;
  price: number;
  currency: string;
  negotiable: boolean;
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  category: string;
  subcategory: string;
  images: string[];
  thumbnail: string;
  seller: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    verified: boolean;
    memberSince: string;
  };
  location: {
    region: string;
    city: string;
    area: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  specifications?: Record<string, string>;
  tags: string[];
  views: number;
  favorites: number;
  inquiries: number;
  postedDate: string;
  updatedDate: string;
  expiryDate: string;
  status: 'active' | 'sold' | 'reserved' | 'expired' | 'removed';
  isFeatured: boolean;
  isUrgent: boolean;
  deliveryOptions: {
    pickup: boolean;
    delivery: boolean;
    shipping: boolean;
    meetup: boolean;
  };
  paymentMethods: string[];
  warranty?: {
    hasWarranty: boolean;
    duration: string;
    description: string;
  };
}

// 에러 코드 정의
const ErrorCodes = {
  VALIDATION_ERROR: 'DATA_001',
  INTERNAL_SERVER_ERROR: 'SERVER_001',
  UNAUTHORIZED: 'AUTH_001',
  NOT_FOUND: 'DATA_002',
} as const;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return await handleGetItems(req, res);
      case 'POST':
        return await handleCreateItem(req, res);
      default:
        return res.status(405).json({
          success: false,
          error: {
            code: 'METHOD_NOT_ALLOWED',
            message: 'Method not allowed'
          },
          timestamp: new Date().toISOString(),
          path: req.url || '/api/marketplace/items'
        } as ApiErrorResponse);
    }
  } catch (error) {
    console.error('Marketplace items API error:', error);
    
    return res.status(500).json({
      success: false,
      error: {
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: 'Failed to process request'
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/marketplace/items'
    } as ApiErrorResponse);
  }
}

async function handleGetItems(req: NextApiRequest, res: NextApiResponse) {
  const { 
    page = '1', 
    limit = '20', 
    category = 'all',
    location = '',
    condition = '',
    minPrice = '',
    maxPrice = '',
    search = '',
    sort = 'latest',
    featured = 'false',
    sellerId = ''
  } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);

  // 입력 검증
  if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
    return res.status(400).json({
      success: false,
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Invalid pagination parameters',
        details: { page: pageNum, limit: limitNum }
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/marketplace/items'
    } as ApiErrorResponse);
  }

  const items = await getMarketplaceItems({
    page: pageNum,
    limit: limitNum,
    category: category as string,
    location: location as string,
    condition: condition as string,
    minPrice: minPrice ? parseInt(minPrice as string) : undefined,
    maxPrice: maxPrice ? parseInt(maxPrice as string) : undefined,
    search: search as string,
    sort: sort as string,
    featured: featured === 'true',
    sellerId: sellerId as string
  });

  const { total, stats } = await getItemsStats({
    category: category as string,
    location: location as string,
    search: search as string
  });

  res.status(200).json({
    success: true,
    data: items,
    message: 'Marketplace items retrieved successfully',
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      hasNext: (pageNum * limitNum) < total,
      hasPrev: pageNum > 1,
      filters: stats
    }
  } as ApiResponse<MarketplaceItem[]>);
}

async function handleCreateItem(req: NextApiRequest, res: NextApiResponse) {
  const {
    title,
    titleKo,
    titleTl,
    description,
    descriptionKo,
    descriptionTl,
    price,
    negotiable,
    condition,
    category,
    subcategory,
    images,
    location,
    specifications,
    tags,
    deliveryOptions,
    paymentMethods,
    warranty
  } = req.body;

  // 기본 검증
  if (!title || !description || !price || !condition || !category || !location) {
    return res.status(400).json({
      success: false,
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Required fields missing: title, description, price, condition, category, location'
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/marketplace/items'
    } as ApiErrorResponse);
  }

  // 실제 환경에서는 JWT 토큰에서 사용자 정보 추출
  const mockUserId = 'user_' + Date.now();
  
  const newItem = await createMarketplaceItem({
    sellerId: mockUserId,
    title,
    titleKo: titleKo || title,
    titleTl: titleTl || title,
    description,
    descriptionKo: descriptionKo || description,
    descriptionTl: descriptionTl || description,
    price,
    negotiable: negotiable || false,
    condition,
    category,
    subcategory: subcategory || '',
    images: images || [],
    location,
    specifications: specifications || {},
    tags: tags || [],
    deliveryOptions: deliveryOptions || { pickup: true, delivery: false, shipping: false, meetup: true },
    paymentMethods: paymentMethods || ['cash'],
    warranty: warranty || null
  });

  res.status(201).json({
    success: true,
    data: newItem,
    message: 'Item created successfully'
  } as ApiResponse<MarketplaceItem>);
}

async function getMarketplaceItems(params: {
  page: number;
  limit: number;
  category: string;
  location: string;
  condition: string;
  minPrice?: number;
  maxPrice?: number;
  search: string;
  sort: string;
  featured: boolean;
  sellerId: string;
}): Promise<MarketplaceItem[]> {
  // 실제 환경에서는 데이터베이스 쿼리
  // 현재는 모의 데이터 반환
  
  const allItems: MarketplaceItem[] = [
    {
      id: '1',
      title: 'iPhone 14 Pro Max 256GB - Space Black',
      titleKo: '아이폰 14 프로 맥스 256GB - 스페이스 블랙',
      titleTl: 'iPhone 14 Pro Max 256GB - Space Black',
      description: 'iPhone 14 Pro Max in excellent condition. Used for only 3 months. Still has warranty until next year. Complete package with original box, charger, and case. No scratches or dents. Serious buyers only.',
      descriptionKo: '상태 좋은 아이폰 14 프로 맥스입니다. 3개월만 사용했고 내년까지 보증기간이 남아있습니다. 정품 박스, 충전기, 케이스 포함. 스크래치나 찌그러짐 없습니다. 진지한 구매자만 연락주세요.',
      descriptionTl: 'iPhone 14 Pro Max na excellent condition. 3 months lang ginamit. May warranty pa hanggang next year. Complete package with original box, charger, at case. Walang scratches o dents. Serious buyers lang.',
      price: 45000,
      currency: 'PHP',
      negotiable: true,
      condition: 'like_new',
      category: 'electronics',
      subcategory: 'smartphones',
      images: [
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=300&h=300&fit=crop',
      seller: {
        id: 'seller_1',
        name: 'Sarah Kim',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        rating: 4.8,
        reviewCount: 156,
        verified: true,
        memberSince: '2022-01-15'
      },
      location: {
        region: 'NCR',
        city: 'Makati',
        area: 'BGC',
        coordinates: { lat: 14.5547, lng: 121.0244 }
      },
      specifications: {
        'Storage': '256GB',
        'Color': 'Space Black',
        'Condition': 'Like New',
        'Battery Health': '98%',
        'Network': 'Unlocked'
      },
      tags: ['iphone', 'apple', 'smartphone', 'unlocked', 'warranty'],
      views: 1245,
      favorites: 89,
      inquiries: 23,
      postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      expiryDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      isFeatured: true,
      isUrgent: false,
      deliveryOptions: {
        pickup: true,
        delivery: true,
        shipping: true,
        meetup: true
      },
      paymentMethods: ['cash', 'bank_transfer', 'gcash', 'paymaya'],
      warranty: {
        hasWarranty: true,
        duration: '8 months remaining',
        description: 'Apple warranty until December 2024'
      }
    },
    {
      id: '2',
      title: 'Toyota Vios 2020 - Manual Transmission',
      titleKo: '토요타 비오스 2020 - 수동변속기',
      titleTl: 'Toyota Vios 2020 - Manual Transmission',
      description: 'Well-maintained Toyota Vios 2020 with manual transmission. Single owner, regularly serviced at Casa. Clean papers, no accidents. Complete OR/CR. Fresh registration. Perfect for first-time car owners.',
      descriptionKo: '수동변속기 토요타 비오스 2020년형입니다. 단일 오너, 정기적으로 카사에서 정비받았습니다. 깨끗한 서류, 사고 없음. 완전한 OR/CR. 신규 등록. 첫 차 구매자에게 완벽합니다.',
      descriptionTl: 'Well-maintained Toyota Vios 2020 na may manual transmission. Single owner, regular service sa Casa. Clean papers, walang accident. Complete OR/CR. Fresh registration. Perfect para sa first-time car owners.',
      price: 650000,
      currency: 'PHP',
      negotiable: true,
      condition: 'good',
      category: 'vehicles',
      subcategory: 'cars',
      images: [
        'https://images.unsplash.com/photo-1549399276-3ba6c7e9eaa6?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=500&fit=crop'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1549399276-3ba6c7e9eaa6?w=300&h=300&fit=crop',
      seller: {
        id: 'seller_2',
        name: 'Miguel Santos',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        rating: 4.6,
        reviewCount: 89,
        verified: true,
        memberSince: '2021-06-20'
      },
      location: {
        region: 'NCR',
        city: 'Quezon City',
        area: 'Diliman',
        coordinates: { lat: 14.6349, lng: 121.0438 }
      },
      specifications: {
        'Year': '2020',
        'Transmission': 'Manual',
        'Mileage': '45,000 km',
        'Engine': '1.3L',
        'Fuel Type': 'Gasoline'
      },
      tags: ['toyota', 'vios', 'manual', 'sedan', 'clean-papers'],
      views: 2341,
      favorites: 156,
      inquiries: 45,
      postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      isFeatured: true,
      isUrgent: false,
      deliveryOptions: {
        pickup: true,
        delivery: false,
        shipping: false,
        meetup: true
      },
      paymentMethods: ['cash', 'bank_transfer', 'financing'],
      warranty: {
        hasWarranty: false,
        duration: '',
        description: ''
      }
    },
    {
      id: '3',
      title: '3-Seater Sofa Set - Like New Condition',
      titleKo: '3인용 소파 세트 - 거의 새것 상태',
      titleTl: '3-Seater Sofa Set - Like New Condition',
      description: 'Beautiful 3-seater sofa set in like-new condition. Made of premium fabric and solid wood frame. Very comfortable and perfect for living room. Reason for selling: moving to smaller place. Must go this week.',
      descriptionKo: '거의 새것 상태의 아름다운 3인용 소파 세트입니다. 프리미엄 패브릭과 견고한 원목 프레임으로 제작되었습니다. 매우 편안하고 거실에 완벽합니다. 판매 이유: 더 작은 곳으로 이사. 이번 주 안에 가져가셔야 합니다.',
      descriptionTl: 'Magandang 3-seater sofa set na like-new condition. Gawa sa premium fabric at solid wood frame. Very comfortable at perfect para sa living room. Reason for selling: moving to smaller place. Must go this week.',
      price: 12000,
      currency: 'PHP',
      negotiable: true,
      condition: 'like_new',
      category: 'furniture',
      subcategory: 'living-room',
      images: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop',
      seller: {
        id: 'seller_3',
        name: 'Lisa Chen',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        rating: 4.3,
        reviewCount: 67,
        verified: false,
        memberSince: '2023-03-10'
      },
      location: {
        region: 'Central Visayas',
        city: 'Cebu',
        area: 'Lahug',
        coordinates: { lat: 10.3310, lng: 123.9036 }
      },
      specifications: {
        'Material': 'Premium Fabric',
        'Frame': 'Solid Wood',
        'Dimensions': '200cm x 90cm x 85cm',
        'Seating': '3 persons',
        'Color': 'Beige'
      },
      tags: ['sofa', 'furniture', 'living-room', 'beige', 'comfortable'],
      views: 567,
      favorites: 34,
      inquiries: 12,
      postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      expiryDate: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      isFeatured: false,
      isUrgent: true,
      deliveryOptions: {
        pickup: true,
        delivery: true,
        shipping: false,
        meetup: false
      },
      paymentMethods: ['cash', 'gcash'],
      warranty: {
        hasWarranty: false,
        duration: '',
        description: ''
      }
    },
    {
      id: '4',
      title: 'Nike Air Max 270 - Size 9 US',
      titleKo: '나이키 에어맥스 270 - 사이즈 9 US',
      titleTl: 'Nike Air Max 270 - Size 9 US',
      description: 'Authentic Nike Air Max 270 in excellent condition. Worn only a few times. Very comfortable for running and casual wear. Original box included. Perfect for sneaker enthusiasts.',
      descriptionKo: '정품 나이키 에어맥스 270 운동화입니다. 몇 번만 신었고 상태가 아주 좋습니다. 러닝과 캐주얼 착용에 매우 편안합니다. 정품 박스 포함. 스니커 애호가에게 완벽합니다.',
      descriptionTl: 'Authentic Nike Air Max 270 na excellent condition. Ilang beses lang nasuot. Very comfortable para sa running at casual wear. May kasamang original box. Perfect para sa sneaker enthusiasts.',
      price: 3500,
      currency: 'PHP',
      negotiable: false,
      condition: 'good',
      category: 'clothing',
      subcategory: 'shoes',
      images: [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop',
      seller: {
        id: 'seller_4',
        name: 'Alex Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        rating: 4.7,
        reviewCount: 234,
        verified: true,
        memberSince: '2020-11-08'
      },
      location: {
        region: 'Davao',
        city: 'Davao',
        area: 'Poblacion',
        coordinates: { lat: 7.0731, lng: 125.6123 }
      },
      specifications: {
        'Brand': 'Nike',
        'Model': 'Air Max 270',
        'Size': '9 US / 42.5 EU',
        'Color': 'Black/White',
        'Condition': 'Good'
      },
      tags: ['nike', 'airmax', 'sneakers', 'running', 'authentic'],
      views: 234,
      favorites: 18,
      inquiries: 7,
      postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updatedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      expiryDate: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      isFeatured: false,
      isUrgent: false,
      deliveryOptions: {
        pickup: true,
        delivery: false,
        shipping: true,
        meetup: true
      },
      paymentMethods: ['cash', 'gcash', 'paymaya'],
      warranty: {
        hasWarranty: false,
        duration: '',
        description: ''
      }
    },
    {
      id: '5',
      title: 'Samsung 15kg Washing Machine - Front Load',
      titleKo: '삼성 15kg 세탁기 - 프론트 로드',
      titleTl: 'Samsung 15kg Washing Machine - Front Load',
      description: 'Samsung front-loading washing machine with 15kg capacity. Perfect for large families. Energy efficient and has multiple wash programs. Only 1 year old, still under warranty. Moving sale.',
      descriptionKo: '15kg 용량의 삼성 프론트 로딩 세탁기입니다. 대가족에게 완벽합니다. 에너지 효율적이고 다양한 세탁 프로그램이 있습니다. 1년밖에 안 됐고 아직 보증기간 내입니다. 이사로 인한 판매.',
      descriptionTl: 'Samsung front-loading washing machine na may 15kg capacity. Perfect para sa large families. Energy efficient at may multiple wash programs. 1 year old lang, may warranty pa. Moving sale.',
      price: 25000,
      currency: 'PHP',
      negotiable: true,
      condition: 'good',
      category: 'home_appliances',
      subcategory: 'laundry',
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1610557892732-f9e2b67a4eba?w=500&h=500&fit=crop'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
      seller: {
        id: 'seller_5',
        name: 'Maria Gonzales',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        rating: 4.9,
        reviewCount: 45,
        verified: true,
        memberSince: '2022-08-15'
      },
      location: {
        region: 'NCR',
        city: 'Manila',
        area: 'Ermita',
        coordinates: { lat: 14.5832, lng: 120.9817 }
      },
      specifications: {
        'Brand': 'Samsung',
        'Capacity': '15kg',
        'Type': 'Front Load',
        'Energy Rating': '5 Star',
        'Age': '1 year'
      },
      tags: ['samsung', 'washing-machine', 'front-load', 'energy-efficient', 'warranty'],
      views: 456,
      favorites: 67,
      inquiries: 19,
      postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      expiryDate: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      isFeatured: false,
      isUrgent: false,
      deliveryOptions: {
        pickup: true,
        delivery: true,
        shipping: false,
        meetup: false
      },
      paymentMethods: ['cash', 'bank_transfer', 'installment'],
      warranty: {
        hasWarranty: true,
        duration: '1 year remaining',
        description: 'Samsung manufacturer warranty until 2025'
      }
    }
  ];

  let filteredItems = allItems;

  // 필터링 로직
  if (params.category !== 'all') {
    filteredItems = filteredItems.filter(item => item.category === params.category);
  }

  if (params.location) {
    filteredItems = filteredItems.filter(item => 
      item.location.city.toLowerCase().includes(params.location.toLowerCase()) ||
      item.location.region.toLowerCase().includes(params.location.toLowerCase())
    );
  }

  if (params.condition) {
    const conditions = params.condition.split(',');
    filteredItems = filteredItems.filter(item => conditions.includes(item.condition));
  }

  if (params.minPrice || params.maxPrice) {
    filteredItems = filteredItems.filter(item => {
      if (params.minPrice && item.price < params.minPrice) return false;
      if (params.maxPrice && item.price > params.maxPrice) return false;
      return true;
    });
  }

  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredItems = filteredItems.filter(item => 
      item.title.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      item.seller.name.toLowerCase().includes(searchLower)
    );
  }

  if (params.featured) {
    filteredItems = filteredItems.filter(item => item.isFeatured);
  }

  if (params.sellerId) {
    filteredItems = filteredItems.filter(item => item.seller.id === params.sellerId);
  }

  // 정렬
  switch (params.sort) {
    case 'price_low':
      filteredItems.sort((a, b) => a.price - b.price);
      break;
    case 'price_high':
      filteredItems.sort((a, b) => b.price - a.price);
      break;
    case 'popular':
      filteredItems.sort((a, b) => (b.views + b.favorites) - (a.views + a.favorites));
      break;
    case 'newest':
      filteredItems.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
      break;
    default: // latest
      filteredItems.sort((a, b) => new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime());
  }

  // 페이징
  const startIndex = (params.page - 1) * params.limit;
  const endIndex = startIndex + params.limit;
  
  return filteredItems.slice(startIndex, endIndex);
}

async function getItemsStats(params: {
  category: string;
  location: string;
  search: string;
}): Promise<{ total: number; stats: { totalItems: number; featuredItems: number; newItems: number; activeUsers: number; } }> {
  // 실제 환경에서는 데이터베이스 통계 쿼리
  // 현재는 모의 데이터 기준
  
  let total = 5; // 전체 아이템 수
  
  // 필터에 따른 개수 조정 (실제로는 쿼리로 계산)
  if (params.category !== 'all') total = Math.floor(total * 0.8);
  if (params.location) total = Math.floor(total * 0.7);
  if (params.search) total = Math.floor(total * 0.6);

  return {
    total,
    stats: {
      totalItems: total,
      featuredItems: Math.floor(total * 0.4), // 40%가 피처드
      newItems: Math.floor(total * 0.3), // 30%가 신규
      activeUsers: Math.floor(total * 0.8) // 80%가 활성 사용자
    }
  };
}

async function createMarketplaceItem(data: any): Promise<MarketplaceItem> {
  // 실제 환경에서는 데이터베이스에 저장
  // 현재는 모의 데이터 반환
  
  const now = new Date().toISOString();
  
  return {
    id: 'item_' + Date.now(),
    title: data.title,
    titleKo: data.titleKo,
    titleTl: data.titleTl,
    description: data.description,
    descriptionKo: data.descriptionKo,
    descriptionTl: data.descriptionTl,
    price: data.price,
    currency: 'PHP',
    negotiable: data.negotiable,
    condition: data.condition,
    category: data.category,
    subcategory: data.subcategory,
    images: data.images,
    thumbnail: data.images[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop',
    seller: {
      id: data.sellerId,
      name: 'New Seller',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 0,
      reviewCount: 0,
      verified: false,
      memberSince: now
    },
    location: data.location,
    specifications: data.specifications,
    tags: data.tags,
    views: 0,
    favorites: 0,
    inquiries: 0,
    postedDate: now,
    updatedDate: now,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    isFeatured: false,
    isUrgent: false,
    deliveryOptions: data.deliveryOptions,
    paymentMethods: data.paymentMethods,
    warranty: data.warranty
  };
}