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
      totalDestinations: number;
      featuredDestinations: number;
      popularDestinations: number;
      categoriesCount: number;
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

interface TravelDestination {
  id: string;
  name: string;
  nameKo: string;
  nameTl: string;
  region: string;
  description: string;
  descriptionKo: string;
  descriptionTl: string;
  highlights: string[];
  image: string;
  images: string[];
  category: string;
  rating: number;
  reviewCount: number;
  bestTimeToVisit: string;
  estimatedCost: {
    budget: number;
    midrange: number;
    luxury: number;
  };
  duration: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  activities: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  isFeatured: boolean;
  isPopular: boolean;
  weather: {
    averageTemp: string;
    season: string;
    rainfall: string;
  };
  transportation: {
    fromManila: string;
    localTransport: string[];
  };
  accommodation: {
    types: string[];
    priceRange: string;
  };
  cuisine: {
    specialties: string[];
    recommendedRestaurants: string[];
  };
  safety: {
    level: 'low' | 'moderate' | 'high';
    tips: string[];
  };
  createdDate: string;
  updatedDate: string;
}

// 에러 코드 정의
const ErrorCodes = {
  VALIDATION_ERROR: 'DATA_001',
  INTERNAL_SERVER_ERROR: 'SERVER_001',
  NOT_FOUND: 'DATA_002',
} as const;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return await handleGetDestinations(req, res);
      case 'POST':
        return await handleCreateDestination(req, res);
      default:
        return res.status(405).json({
          success: false,
          error: {
            code: 'METHOD_NOT_ALLOWED',
            message: 'Method not allowed'
          },
          timestamp: new Date().toISOString(),
          path: req.url || '/api/travel/destinations'
        } as ApiErrorResponse);
    }
  } catch (error) {
    console.error('Travel destinations API error:', error);
    
    return res.status(500).json({
      success: false,
      error: {
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: 'Failed to process request'
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/travel/destinations'
    } as ApiErrorResponse);
  }
}

async function handleGetDestinations(req: NextApiRequest, res: NextApiResponse) {
  const { 
    page = '1', 
    limit = '20', 
    category = 'all',
    region = '',
    difficulty = '',
    minBudget = '',
    maxBudget = '',
    search = '',
    sort = 'featured',
    featured = 'false'
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
      path: req.url || '/api/travel/destinations'
    } as ApiErrorResponse);
  }

  const destinations = await getTravelDestinations({
    page: pageNum,
    limit: limitNum,
    category: category as string,
    region: region as string,
    difficulty: difficulty as string,
    minBudget: minBudget ? parseInt(minBudget as string) : undefined,
    maxBudget: maxBudget ? parseInt(maxBudget as string) : undefined,
    search: search as string,
    sort: sort as string,
    featured: featured === 'true'
  });

  const { total, stats } = await getDestinationsStats({
    category: category as string,
    region: region as string,
    search: search as string
  });

  res.status(200).json({
    success: true,
    data: destinations,
    message: 'Travel destinations retrieved successfully',
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      hasNext: (pageNum * limitNum) < total,
      hasPrev: pageNum > 1,
      filters: stats
    }
  } as ApiResponse<TravelDestination[]>);
}

async function handleCreateDestination(req: NextApiRequest, res: NextApiResponse) {
  const {
    name,
    nameKo,
    nameTl,
    region,
    description,
    descriptionKo,
    descriptionTl,
    category,
    highlights,
    images,
    coordinates,
    estimatedCost,
    activities,
    difficulty,
    bestTimeToVisit,
    duration
  } = req.body;

  // 기본 검증
  if (!name || !region || !description || !category || !coordinates) {
    return res.status(400).json({
      success: false,
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Required fields missing: name, region, description, category, coordinates'
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/travel/destinations'
    } as ApiErrorResponse);
  }

  const newDestination = await createTravelDestination({
    name,
    nameKo: nameKo || name,
    nameTl: nameTl || name,
    region,
    description,
    descriptionKo: descriptionKo || description,
    descriptionTl: descriptionTl || description,
    category,
    highlights: highlights || [],
    images: images || [],
    coordinates,
    estimatedCost: estimatedCost || { budget: 1000, midrange: 3000, luxury: 8000 },
    activities: activities || [],
    difficulty: difficulty || 'easy',
    bestTimeToVisit: bestTimeToVisit || 'Year-round',
    duration: duration || '1-2 days'
  });

  res.status(201).json({
    success: true,
    data: newDestination,
    message: 'Travel destination created successfully'
  } as ApiResponse<TravelDestination>);
}

async function getTravelDestinations(params: {
  page: number;
  limit: number;
  category: string;
  region: string;
  difficulty: string;
  minBudget?: number;
  maxBudget?: number;
  search: string;
  sort: string;
  featured: boolean;
}): Promise<TravelDestination[]> {
  // 실제 환경에서는 데이터베이스 쿼리
  // 현재는 모의 데이터 반환
  
  const allDestinations: TravelDestination[] = [
    {
      id: '1',
      name: 'Boracay Island',
      nameKo: '보라카이 섬',
      nameTl: 'Boracay Island',
      region: 'Visayas',
      description: 'World-famous white sand beach paradise with crystal clear waters and vibrant nightlife.',
      descriptionKo: '수정처럼 맑은 바다와 활기찬 밤문화를 자랑하는 세계적으로 유명한 화이트 샌드 비치 천국입니다.',
      descriptionTl: 'World-famous white sand beach paradise na may crystal clear waters at vibrant nightlife.',
      highlights: ['White Beach', 'Water Sports', 'Sunset Sailing', 'D\'Mall Shopping', 'Island Hopping'],
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1571501679680-de32f1e7aad4?w=500&h=300&fit=crop'
      ],
      category: 'beaches',
      rating: 4.8,
      reviewCount: 1245,
      bestTimeToVisit: 'November to April',
      estimatedCost: {
        budget: 2500,
        midrange: 5000,
        luxury: 12000
      },
      duration: '3-5 days',
      difficulty: 'easy',
      activities: ['Swimming', 'Diving', 'Parasailing', 'Island Hopping', 'Nightlife', 'Sunset Sailing'],
      coordinates: { lat: 11.9674, lng: 121.9248 },
      isFeatured: true,
      isPopular: true,
      weather: {
        averageTemp: '26-32°C',
        season: 'Tropical',
        rainfall: 'Low (Nov-Apr), High (May-Oct)'
      },
      transportation: {
        fromManila: 'Fly to Caticlan (1.5 hours) + Boat transfer (20 mins)',
        localTransport: ['Tricycle', 'E-trike', 'Motorbike', 'Walking']
      },
      accommodation: {
        types: ['Luxury resorts', 'Beach hotels', 'Hostels', 'Vacation rentals'],
        priceRange: '₱800-15,000 per night'
      },
      cuisine: {
        specialties: ['Fresh seafood', 'Chori burger', 'Halo-halo', 'Tropical fruits'],
        recommendedRestaurants: ['D\'Talipapa Seafood Market', 'Sunny Side Cafe', 'Real Coffee']
      },
      safety: {
        level: 'low',
        tips: ['Watch your belongings on the beach', 'Be careful with water activities', 'Stay hydrated']
      },
      createdDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      name: 'Baguio City',
      nameKo: '바기오 시티',
      nameTl: 'Baguio City',
      region: 'Luzon',
      description: 'Summer capital of the Philippines known for its cool climate, pine trees, and beautiful parks.',
      descriptionKo: '시원한 기후, 소나무, 아름다운 공원으로 유명한 필리핀의 여름 수도입니다.',
      descriptionTl: 'Summer capital ng Pilipinas na kilala sa cool climate, pine trees, at magagandang parks.',
      highlights: ['Burnham Park', 'Session Road', 'Mines View Park', 'Camp John Hay', 'Strawberry Farm'],
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=500&h=300&fit=crop'
      ],
      category: 'cities',
      rating: 4.5,
      reviewCount: 892,
      bestTimeToVisit: 'December to February',
      estimatedCost: {
        budget: 1500,
        midrange: 3000,
        luxury: 7000
      },
      duration: '2-3 days',
      difficulty: 'easy',
      activities: ['Sightseeing', 'Shopping', 'Photography', 'Hiking', 'Food Tours', 'Strawberry Picking'],
      coordinates: { lat: 16.4023, lng: 120.5960 },
      isFeatured: false,
      isPopular: true,
      weather: {
        averageTemp: '15-23°C',
        season: 'Cool climate year-round',
        rainfall: 'High (Jun-Sep), Low (Oct-May)'
      },
      transportation: {
        fromManila: 'Bus (6-8 hours) or Private car via NLEX-SCTEX',
        localTransport: ['Jeepney', 'Taxi', 'Tricycle', 'Walking']
      },
      accommodation: {
        types: ['Mountain resorts', 'Boutique hotels', 'Budget inns', 'Vacation homes'],
        priceRange: '₱1,000-8,000 per night'
      },
      cuisine: {
        specialties: ['Strawberries', 'Ube products', 'Cordillera cuisine', 'Coffee'],
        recommendedRestaurants: ['Hill Station', 'Café by the Ruins', 'Good Taste']
      },
      safety: {
        level: 'low',
        tips: ['Bring warm clothing', 'Be careful on mountain roads', 'Watch for slippery surfaces when wet']
      },
      createdDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      updatedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      name: 'Palawan',
      nameKo: '팔라완',
      nameTl: 'Palawan',
      region: 'Luzon',
      description: 'Last frontier of the Philippines with pristine beaches, underground rivers, and diverse wildlife.',
      descriptionKo: '깨끗한 해변, 지하강, 다양한 야생동물을 보유한 필리핀의 마지막 개척지입니다.',
      descriptionTl: 'Last frontier ng Pilipinas na may pristine beaches, underground rivers, at diverse wildlife.',
      highlights: ['El Nido', 'Coron', 'Puerto Princesa Underground River', 'Big Lagoon', 'Small Lagoon'],
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=500&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1544273813-6e8b31b8e0bb?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop'
      ],
      category: 'islands',
      rating: 4.9,
      reviewCount: 2156,
      bestTimeToVisit: 'November to May',
      estimatedCost: {
        budget: 4000,
        midrange: 8000,
        luxury: 18000
      },
      duration: '5-7 days',
      difficulty: 'moderate',
      activities: ['Island Hopping', 'Diving', 'Snorkeling', 'Cave Exploration', 'Wildlife Watching', 'Kayaking'],
      coordinates: { lat: 9.8349, lng: 118.7384 },
      isFeatured: true,
      isPopular: true,
      weather: {
        averageTemp: '25-31°C',
        season: 'Tropical',
        rainfall: 'Low (Nov-May), High (Jun-Oct)'
      },
      transportation: {
        fromManila: 'Fly to Puerto Princesa (1.5 hours) or El Nido (1.5 hours)',
        localTransport: ['Van transfers', 'Boat transfers', 'Tricycle', 'Motorbike']
      },
      accommodation: {
        types: ['Eco-resorts', 'Beach hotels', 'Hostels', 'Glamping'],
        priceRange: '₱1,500-25,000 per night'
      },
      cuisine: {
        specialties: ['Fresh seafood', 'Lato seaweed', 'Tamilok', 'Tropical fruits'],
        recommendedRestaurants: ['Artcafe', 'El Nido Corner', 'La Plage']
      },
      safety: {
        level: 'moderate',
        tips: ['Book tours with reputable operators', 'Bring sunscreen and water', 'Respect marine life']
      },
      createdDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updatedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '4',
      name: 'Siargao Island',
      nameKo: '시아르가오 섬',
      nameTl: 'Siargao Island',
      region: 'Mindanao',
      description: 'Surfing capital of the Philippines with world-class waves, coconut trees, and laid-back island vibes.',
      descriptionKo: '세계적 수준의 파도, 코코넛 나무, 여유로운 섬 분위기를 자랑하는 필리핀의 서핑 수도입니다.',
      descriptionTl: 'Surfing capital ng Pilipinas na may world-class waves, coconut trees, at laid-back island vibes.',
      highlights: ['Cloud 9 Surf Break', 'Magpupungko Rock Pools', 'Naked Island', 'Sugba Lagoon', 'Coconut Tree Forest'],
      image: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=500&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1571501679680-de32f1e7aad4?w=500&h=300&fit=crop'
      ],
      category: 'beaches',
      rating: 4.7,
      reviewCount: 1567,
      bestTimeToVisit: 'March to October',
      estimatedCost: {
        budget: 3000,
        midrange: 6000,
        luxury: 15000
      },
      duration: '4-6 days',
      difficulty: 'moderate',
      activities: ['Surfing', 'Island Hopping', 'Swimming', 'Rock Pool Exploration', 'Motorbike Tours', 'Fishing'],
      coordinates: { lat: 9.8601, lng: 126.0581 },
      isFeatured: true,
      isPopular: true,
      weather: {
        averageTemp: '25-30°C',
        season: 'Tropical',
        rainfall: 'Moderate year-round'
      },
      transportation: {
        fromManila: 'Fly to Butuan or Cebu, then boat to Siargao',
        localTransport: ['Motorbike', 'Tricycle', 'Habal-habal', 'Boat']
      },
      accommodation: {
        types: ['Surf resorts', 'Beach hotels', 'Hostels', 'Homestays'],
        priceRange: '₱800-12,000 per night'
      },
      cuisine: {
        specialties: ['Fresh seafood', 'Coconut dishes', 'Kinilaw', 'Local fruits'],
        recommendedRestaurants: ['Shaka Cafe', 'Mama\'s Grill', 'Kawayan Restaurant']
      },
      safety: {
        level: 'moderate',
        tips: ['Wear helmets when riding motorbikes', 'Be careful with strong currents', 'Respect local customs']
      },
      createdDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '5',
      name: 'Banaue Rice Terraces',
      nameKo: '바나우에 계단식 논',
      nameTl: 'Banaue Rice Terraces',
      region: 'Luzon',
      description: '2,000-year-old rice terraces carved into the mountains, known as the 8th Wonder of the World.',
      descriptionKo: '세계 8대 불가사의로 알려진 2,000년 된 산악 지대의 계단식 논입니다.',
      descriptionTl: '2,000-year-old rice terraces na nakaukit sa bundok, kilala bilang 8th Wonder of the World.',
      highlights: ['Banaue Rice Terraces', 'Batad Rice Terraces', 'Hapao Rice Terraces', 'Ifugao Culture', 'Trekking'],
      image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=500&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop'
      ],
      category: 'heritage',
      rating: 4.6,
      reviewCount: 743,
      bestTimeToVisit: 'March to May, October to November',
      estimatedCost: {
        budget: 2000,
        midrange: 4000,
        luxury: 9000
      },
      duration: '3-4 days',
      difficulty: 'challenging',
      activities: ['Trekking', 'Cultural Tours', 'Photography', 'Village Visits', 'Rice Farming Experience'],
      coordinates: { lat: 16.9270, lng: 121.0583 },
      isFeatured: false,
      isPopular: true,
      weather: {
        averageTemp: '15-25°C',
        season: 'Cool mountain climate',
        rainfall: 'High (Jun-Sep), Moderate (Oct-May)'
      },
      transportation: {
        fromManila: 'Bus to Banaue (8-10 hours) via Baguio',
        localTransport: ['Jeepney', 'Tricycle', 'Trekking', 'Habal-habal']
      },
      accommodation: {
        types: ['Mountain lodges', 'Guesthouses', 'Homestays', 'Traditional huts'],
        priceRange: '₱500-5,000 per night'
      },
      cuisine: {
        specialties: ['Ifugao red rice', 'Native chicken', 'Wild vegetables', 'Rice wine'],
        recommendedRestaurants: ['People\'s Lodge Restaurant', 'Sanafe Lodge', 'Local homestays']
      },
      safety: {
        level: 'moderate',
        tips: ['Hire local guides for trekking', 'Bring warm clothes', 'Respect cultural sites']
      },
      createdDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      updatedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '6',
      name: 'Chocolate Hills',
      nameKo: '초콜릿 힐스',
      nameTl: 'Chocolate Hills',
      region: 'Visayas',
      description: 'Over 1,200 cone-shaped hills that turn chocolate brown during dry season, unique geological formation.',
      descriptionKo: '건기에 초콜릿 갈색으로 변하는 1,200개 이상의 원뿔 모양 언덕들로 이루어진 독특한 지질 구조입니다.',
      descriptionTl: 'Mahigit 1,200 cone-shaped hills na nagiging chocolate brown sa dry season, unique geological formation.',
      highlights: ['Chocolate Hills Complex', 'Sagbayan Peak', 'Tarsier Sanctuary', 'Loboc River', 'Carmen Viewpoint'],
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop'
      ],
      category: 'mountains',
      rating: 4.4,
      reviewCount: 968,
      bestTimeToVisit: 'February to May',
      estimatedCost: {
        budget: 2200,
        midrange: 4500,
        luxury: 10000
      },
      duration: '2-3 days',
      difficulty: 'easy',
      activities: ['Sightseeing', 'Photography', 'ATV Tours', 'Zip-lining', 'Tarsier Watching', 'River Cruise'],
      coordinates: { lat: 9.8236, lng: 124.1634 },
      isFeatured: false,
      isPopular: true,
      weather: {
        averageTemp: '23-30°C',
        season: 'Tropical',
        rainfall: 'Low (Dec-May), High (Jun-Nov)'
      },
      transportation: {
        fromManila: 'Fly to Tagbilaran (1.5 hours), then 1-hour drive',
        localTransport: ['Van', 'Tricycle', 'Motorbike', 'ATV']
      },
      accommodation: {
        types: ['Resorts', 'Hotels', 'Guesthouses', 'Eco-lodges'],
        priceRange: '₱1,200-8,000 per night'
      },
      cuisine: {
        specialties: ['Bohol bee farm dishes', 'Fresh seafood', 'Kalamay', 'Peanut kisses'],
        recommendedRestaurants: ['Bee Farm Restaurant', 'Float Restaurant Loboc', 'Giuseppe Restaurant']
      },
      safety: {
        level: 'low',
        tips: ['Stay on designated paths', 'Bring sun protection', 'Respect wildlife areas']
      },
      createdDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      updatedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  let filteredDestinations = allDestinations;

  // 필터링 로직
  if (params.category !== 'all') {
    filteredDestinations = filteredDestinations.filter(dest => dest.category === params.category);
  }

  if (params.region) {
    filteredDestinations = filteredDestinations.filter(dest => 
      dest.region.toLowerCase().includes(params.region.toLowerCase())
    );
  }

  if (params.difficulty) {
    const difficulties = params.difficulty.split(',');
    filteredDestinations = filteredDestinations.filter(dest => difficulties.includes(dest.difficulty));
  }

  if (params.minBudget || params.maxBudget) {
    filteredDestinations = filteredDestinations.filter(dest => {
      if (params.minBudget && dest.estimatedCost.budget < params.minBudget) return false;
      if (params.maxBudget && dest.estimatedCost.budget > params.maxBudget) return false;
      return true;
    });
  }

  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredDestinations = filteredDestinations.filter(dest => 
      dest.name.toLowerCase().includes(searchLower) ||
      dest.nameKo.toLowerCase().includes(searchLower) ||
      dest.description.toLowerCase().includes(searchLower) ||
      dest.highlights.some(highlight => highlight.toLowerCase().includes(searchLower)) ||
      dest.activities.some(activity => activity.toLowerCase().includes(searchLower))
    );
  }

  if (params.featured) {
    filteredDestinations = filteredDestinations.filter(dest => dest.isFeatured);
  }

  // 정렬
  switch (params.sort) {
    case 'rating':
      filteredDestinations.sort((a, b) => b.rating - a.rating);
      break;
    case 'budget_low':
      filteredDestinations.sort((a, b) => a.estimatedCost.budget - b.estimatedCost.budget);
      break;
    case 'budget_high':
      filteredDestinations.sort((a, b) => b.estimatedCost.budget - a.estimatedCost.budget);
      break;
    case 'popular':
      filteredDestinations.sort((a, b) => (b.reviewCount + (b.isPopular ? 1000 : 0)) - (a.reviewCount + (a.isPopular ? 1000 : 0)));
      break;
    case 'newest':
      filteredDestinations.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
      break;
    default: // featured
      filteredDestinations.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return b.rating - a.rating;
      });
  }

  // 페이징
  const startIndex = (params.page - 1) * params.limit;
  const endIndex = startIndex + params.limit;
  
  return filteredDestinations.slice(startIndex, endIndex);
}

async function getDestinationsStats(params: {
  category: string;
  region: string;
  search: string;
}): Promise<{ total: number; stats: { totalDestinations: number; featuredDestinations: number; popularDestinations: number; categoriesCount: number; } }> {
  // 실제 환경에서는 데이터베이스 통계 쿼리
  // 현재는 모의 데이터 기준
  
  let total = 6; // 전체 여행지 수
  
  // 필터에 따른 개수 조정 (실제로는 쿼리로 계산)
  if (params.category !== 'all') total = Math.floor(total * 0.7);
  if (params.region) total = Math.floor(total * 0.8);
  if (params.search) total = Math.floor(total * 0.6);

  return {
    total,
    stats: {
      totalDestinations: total,
      featuredDestinations: Math.floor(total * 0.5), // 50%가 피처드
      popularDestinations: Math.floor(total * 0.8), // 80%가 인기
      categoriesCount: 6 // beaches, cities, islands, heritage, mountains, adventure
    }
  };
}

async function createTravelDestination(data: any): Promise<TravelDestination> {
  // 실제 환경에서는 데이터베이스에 저장
  // 현재는 모의 데이터 반환
  
  const now = new Date().toISOString();
  
  return {
    id: 'dest_' + Date.now(),
    name: data.name,
    nameKo: data.nameKo,
    nameTl: data.nameTl,
    region: data.region,
    description: data.description,
    descriptionKo: data.descriptionKo,
    descriptionTl: data.descriptionTl,
    highlights: data.highlights,
    image: data.images[0] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
    images: data.images,
    category: data.category,
    rating: 0,
    reviewCount: 0,
    bestTimeToVisit: data.bestTimeToVisit,
    estimatedCost: data.estimatedCost,
    duration: data.duration,
    difficulty: data.difficulty,
    activities: data.activities,
    coordinates: data.coordinates,
    isFeatured: false,
    isPopular: false,
    weather: {
      averageTemp: '25-30°C',
      season: 'Tropical',
      rainfall: 'Variable'
    },
    transportation: {
      fromManila: 'Contact for details',
      localTransport: ['Local transport available']
    },
    accommodation: {
      types: ['Various accommodations available'],
      priceRange: '₱1,000-10,000 per night'
    },
    cuisine: {
      specialties: ['Local specialties'],
      recommendedRestaurants: ['Local restaurants']
    },
    safety: {
      level: 'low',
      tips: ['Follow standard travel safety guidelines']
    },
    createdDate: now,
    updatedDate: now
  };
}