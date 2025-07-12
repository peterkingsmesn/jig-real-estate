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
      totalGuides: number;
      categories: number;
      authors: number;
      totalViews: number;
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

interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  expertise: string[];
  verified: boolean;
}

interface TravelGuide {
  id: string;
  title: string;
  titleKo: string;
  titleTl: string;
  category: string;
  description: string;
  descriptionKo: string;
  descriptionTl: string;
  content: string;
  contentKo: string;
  contentTl: string;
  author: Author | string;
  publishDate: string;
  updatedDate: string;
  readTime: string;
  image: string;
  images: string[];
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  shares: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  destination: string;
  season: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  duration: string;
  isFeatured: boolean;
  isSponsored: boolean;
  relatedGuides: {
    id: string;
    title: string;
    category: string;
    readTime: string;
  }[];
  tableOfContents: {
    section: string;
    subsections: string[];
  }[];
  tips: {
    type: 'pro' | 'warning' | 'info';
    content: string;
  }[];
  resources: {
    type: 'link' | 'document' | 'map';
    title: string;
    url: string;
  }[];
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
        return await handleGetGuides(req, res);
      case 'POST':
        return await handleCreateGuide(req, res);
      default:
        return res.status(405).json({
          success: false,
          error: {
            code: 'METHOD_NOT_ALLOWED',
            message: 'Method not allowed'
          },
          timestamp: new Date().toISOString(),
          path: req.url || '/api/travel/guides'
        } as ApiErrorResponse);
    }
  } catch (error) {
    console.error('Travel guides API error:', error);
    
    return res.status(500).json({
      success: false,
      error: {
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: 'Failed to process request'
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/travel/guides'
    } as ApiErrorResponse);
  }
}

async function handleGetGuides(req: NextApiRequest, res: NextApiResponse) {
  const { 
    page = '1', 
    limit = '20', 
    category = 'all',
    difficulty = '',
    destination = '',
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
      path: req.url || '/api/travel/guides'
    } as ApiErrorResponse);
  }

  const guides = await getTravelGuides({
    page: pageNum,
    limit: limitNum,
    category: category as string,
    difficulty: difficulty as string,
    destination: destination as string,
    search: search as string,
    sort: sort as string,
    featured: featured === 'true'
  });

  const { total, stats } = await getGuidesStats({
    category: category as string,
    destination: destination as string,
    search: search as string
  });

  // author 객체를 문자열로 변환
  const processedGuides = guides.map(guide => ({
    ...guide,
    author: typeof guide.author === 'object' && guide.author !== null 
      ? guide.author.name 
      : guide.author
  }));

  res.status(200).json({
    success: true,
    data: processedGuides,
    message: 'Travel guides retrieved successfully',
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      hasNext: (pageNum * limitNum) < total,
      hasPrev: pageNum > 1,
      filters: stats
    }
  } as ApiResponse<TravelGuide[]>);
}

async function handleCreateGuide(req: NextApiRequest, res: NextApiResponse) {
  const {
    title,
    titleKo,
    titleTl,
    category,
    description,
    content,
    destination,
    difficulty,
    duration,
    budget,
    tags,
    images
  } = req.body;

  // 기본 검증
  if (!title || !category || !description || !content || !destination) {
    return res.status(400).json({
      success: false,
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Required fields missing: title, category, description, content, destination'
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/travel/guides'
    } as ApiErrorResponse);
  }

  // 실제 환경에서는 JWT 토큰에서 작성자 정보 추출
  const mockAuthorId = 'author_' + Date.now();

  const newGuide = await createTravelGuide({
    authorId: mockAuthorId,
    title,
    titleKo: titleKo || title,
    titleTl: titleTl || title,
    category,
    description,
    content,
    destination,
    difficulty: difficulty || 'beginner',
    duration: duration || '1 day',
    budget: budget || { min: 1000, max: 5000, currency: 'PHP' },
    tags: tags || [],
    images: images || []
  });

  res.status(201).json({
    success: true,
    data: newGuide,
    message: 'Travel guide created successfully'
  } as ApiResponse<TravelGuide>);
}

async function getTravelGuides(params: {
  page: number;
  limit: number;
  category: string;
  difficulty: string;
  destination: string;
  search: string;
  sort: string;
  featured: boolean;
}): Promise<TravelGuide[]> {
  // 실제 환경에서는 데이터베이스 쿼리
  // 현재는 모의 데이터 반환
  
  const allGuides: TravelGuide[] = [
    {
      id: '1',
      title: 'Ultimate Philippines Travel Guide for First-Time Visitors',
      titleKo: '첫 방문자를 위한 완벽한 필리핀 여행 가이드',
      titleTl: 'Ultimate Philippines Travel Guide para sa First-Time Visitors',
      category: 'planning',
      description: 'Everything you need to know for your first trip to the Philippines',
      descriptionKo: '필리핀 첫 여행을 위해 알아야 할 모든 것',
      descriptionTl: 'Lahat ng kailangan mong malaman para sa inyong first trip sa Pilipinas',
      content: 'The Philippines is an archipelago of over 7,640 islands, offering diverse experiences from pristine beaches to historic cities. This comprehensive guide covers visa requirements, best destinations, budget planning, cultural tips, and safety guidelines. Whether you\'re planning to explore the white sands of Boracay, the rice terraces of Banaue, or the underground river of Palawan, this guide will help you make the most of your Philippine adventure.',
      contentKo: '필리핀은 7,640개 이상의 섬으로 이루어진 군도로, 깨끗한 해변부터 역사적인 도시까지 다양한 경험을 제공합니다. 이 종합 가이드는 비자 요구사항, 최고의 여행지, 예산 계획, 문화적 팁, 안전 지침을 다룹니다.',
      contentTl: 'Ang Pilipinas ay archipelago na may mahigit 7,640 isla, nag-aalok ng diverse experiences mula sa pristine beaches hanggang sa historic cities. Ang comprehensive guide na ito ay sumasaklaw sa visa requirements, best destinations, budget planning, cultural tips, at safety guidelines.',
      author: {
        id: 'author_1',
        name: 'Maria Santos',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        bio: 'Travel blogger and Philippines tourism expert with 10+ years of experience exploring the archipelago.',
        expertise: ['Philippines Tourism', 'Island Hopping', 'Cultural Tours', 'Budget Travel'],
        verified: true
      },
      publishDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      readTime: '12 min',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=250&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=250&fit=crop',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop'
      ],
      tags: ['planning', 'first-time', 'visa', 'budget', 'philippines', 'beginner'],
      views: 15420,
      likes: 1245,
      comments: 89,
      shares: 234,
      difficulty: 'beginner',
      destination: 'Philippines',
      season: 'year-round',
      budget: {
        min: 2000,
        max: 10000,
        currency: 'PHP'
      },
      duration: '7-14 days',
      isFeatured: true,
      isSponsored: false,
      relatedGuides: [
        {
          id: '2',
          title: 'Best Food to Try in the Philippines',
          category: 'food',
          readTime: '8 min'
        },
        {
          id: '3',
          title: 'Island Hopping Guide: Palawan Edition',
          category: 'destinations',
          readTime: '10 min'
        }
      ],
      tableOfContents: [
        {
          section: 'Before You Go',
          subsections: ['Visa Requirements', 'Best Time to Visit', 'What to Pack']
        },
        {
          section: 'Getting Around',
          subsections: ['Domestic Flights', 'Ferries', 'Local Transport']
        },
        {
          section: 'Top Destinations',
          subsections: ['Luzon', 'Visayas', 'Mindanao']
        },
        {
          section: 'Culture & Etiquette',
          subsections: ['Local Customs', 'Language Tips', 'Tipping']
        }
      ],
      tips: [
        {
          type: 'pro',
          content: 'Book domestic flights early for better prices, especially during peak season (December-May).'
        },
        {
          type: 'warning',
          content: 'Typhoon season is June-November. Check weather forecasts before traveling.'
        },
        {
          type: 'info',
          content: 'Most Filipinos speak English, making communication easy for tourists.'
        }
      ],
      resources: [
        {
          type: 'link',
          title: 'Official Department of Tourism Website',
          url: 'https://www.tourism.gov.ph'
        },
        {
          type: 'document',
          title: 'Philippines Visa Application Form',
          url: 'https://www.dfa.gov.ph/visa-requirements'
        }
      ]
    },
    {
      id: '2',
      title: 'Best Food to Try in the Philippines',
      titleKo: '필리핀에서 꼭 먹어봐야 할 최고의 음식들',
      titleTl: 'Best Food na Dapat Tikman sa Pilipinas',
      category: 'food',
      description: 'A culinary journey through Philippine cuisine',
      descriptionKo: '필리핀 요리를 통한 미식 여행',
      descriptionTl: 'Culinary journey sa pamamagitan ng Philippine cuisine',
      content: 'Philippine cuisine is a melting pot of flavors influenced by Spanish, Chinese, American, and Malay cooking traditions. From the famous adobo to the refreshing halo-halo, this guide explores must-try dishes, street food favorites, regional specialties, and where to find the best local restaurants across the archipelago.',
      contentKo: '필리핀 요리는 스페인, 중국, 미국, 말레이 요리 전통의 영향을 받은 다양한 맛의 용광로입니다. 유명한 아도보부터 상쾌한 할로할로까지, 이 가이드는 꼭 먹어봐야 할 요리들을 탐험합니다.',
      contentTl: 'Ang Philippine cuisine ay melting pot ng mga lasa na naimpluwensyahan ng Spanish, Chinese, American, at Malay cooking traditions. Mula sa sikat na adobo hanggang sa refreshing na halo-halo.',
      author: {
        id: 'author_2',
        name: 'Chef Ricardo Cruz',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        bio: 'Professional chef and food critic specializing in Southeast Asian cuisine.',
        expertise: ['Filipino Cuisine', 'Street Food', 'Regional Cooking', 'Food History'],
        verified: true
      },
      publishDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      readTime: '8 min',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop',
        'https://images.unsplash.com/photo-1563379091339-03246963d4a9?w=400&h=250&fit=crop',
        'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=250&fit=crop'
      ],
      tags: ['food', 'cuisine', 'street-food', 'local', 'adobo', 'halo-halo'],
      views: 9876,
      likes: 892,
      comments: 156,
      shares: 178,
      difficulty: 'beginner',
      destination: 'Philippines',
      season: 'year-round',
      budget: {
        min: 500,
        max: 2000,
        currency: 'PHP'
      },
      duration: '3-7 days',
      isFeatured: true,
      isSponsored: false,
      relatedGuides: [
        {
          id: '1',
          title: 'Ultimate Philippines Travel Guide',
          category: 'planning',
          readTime: '12 min'
        },
        {
          id: '4',
          title: 'Manila Food Tour Guide',
          category: 'food',
          readTime: '6 min'
        }
      ],
      tableOfContents: [
        {
          section: 'Iconic Dishes',
          subsections: ['Adobo', 'Lechon', 'Sinigang', 'Pancit']
        },
        {
          section: 'Street Food',
          subsections: ['Balut', 'Isaw', 'Fish Balls', 'Taho']
        },
        {
          section: 'Desserts',
          subsections: ['Halo-halo', 'Leche Flan', 'Ube Treats', 'Biko']
        },
        {
          section: 'Regional Specialties',
          subsections: ['Luzon', 'Visayas', 'Mindanao']
        }
      ],
      tips: [
        {
          type: 'pro',
          content: 'Try eating with your hands (kamayan style) for an authentic Filipino dining experience.'
        },
        {
          type: 'warning',
          content: 'Be cautious with street food if you have a sensitive stomach. Choose busy stalls with high turnover.'
        },
        {
          type: 'info',
          content: 'Filipino meals are meant to be shared. Order several dishes for the table.'
        }
      ],
      resources: [
        {
          type: 'link',
          title: 'Filipino Food Encyclopedia',
          url: 'https://www.kalaw.com/food'
        },
        {
          type: 'map',
          title: 'Best Food Markets in Manila',
          url: 'https://maps.google.com/manila-food-markets'
        }
      ]
    },
    {
      id: '3',
      title: 'Island Hopping Guide: Palawan Edition',
      titleKo: '아일랜드 호핑 가이드: 팔라완 편',
      titleTl: 'Island Hopping Guide: Palawan Edition',
      category: 'destinations',
      description: 'Complete guide to island hopping in Palawan',
      descriptionKo: '팔라완에서의 아일랜드 호핑 완전 가이드',
      descriptionTl: 'Complete guide sa island hopping sa Palawan',
      content: 'Palawan is the crown jewel of Philippine islands, offering some of the world\'s most spectacular island hopping experiences. This detailed guide covers El Nido and Coron tours, hidden lagoons, snorkeling spots, best tour operators, and insider tips for exploring this tropical paradise.',
      contentKo: '팔라완은 필리핀 섬들의 보석으로, 세계에서 가장 장관인 아일랜드 호핑 경험을 제공합니다. 이 상세한 가이드는 엘니도와 코론 투어를 다룹니다.',
      contentTl: 'Ang Palawan ay crown jewel ng Philippine islands, nag-aalok ng ilan sa world\'s most spectacular island hopping experiences.',
      author: {
        id: 'author_3',
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        bio: 'Marine biologist and adventure travel specialist focusing on Philippine waters.',
        expertise: ['Island Hopping', 'Marine Life', 'Scuba Diving', 'Eco-tourism'],
        verified: true
      },
      publishDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      updatedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      readTime: '10 min',
      image: 'https://images.unsplash.com/photo-1544273813-6e8b31b8e0bb?w=400&h=250&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1544273813-6e8b31b8e0bb?w=400&h=250&fit=crop',
        'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=250&fit=crop',
        'https://images.unsplash.com/photo-1571501679680-de32f1e7aad4?w=400&h=250&fit=crop'
      ],
      tags: ['palawan', 'island-hopping', 'el-nido', 'coron', 'lagoons', 'snorkeling'],
      views: 8234,
      likes: 756,
      comments: 98,
      shares: 145,
      difficulty: 'intermediate',
      destination: 'Palawan',
      season: 'November to May',
      budget: {
        min: 5000,
        max: 15000,
        currency: 'PHP'
      },
      duration: '5-7 days',
      isFeatured: true,
      isSponsored: false,
      relatedGuides: [
        {
          id: '1',
          title: 'Ultimate Philippines Travel Guide',
          category: 'planning',
          readTime: '12 min'
        },
        {
          id: '5',
          title: 'Underwater Photography Tips',
          category: 'photography',
          readTime: '7 min'
        }
      ],
      tableOfContents: [
        {
          section: 'El Nido Tours',
          subsections: ['Tour A: Big Lagoon', 'Tour B: Snake Island', 'Tour C: Hidden Beach', 'Tour D: Cadlao Island']
        },
        {
          section: 'Coron Tours',
          subsections: ['Island Hopping', 'Wreck Diving', 'Hot Springs', 'Twin Lagoon']
        },
        {
          section: 'Planning Your Trip',
          subsections: ['Best Time to Visit', 'Booking Tours', 'What to Bring']
        }
      ],
      tips: [
        {
          type: 'pro',
          content: 'Book tours directly with operators in town for better prices than hotel bookings.'
        },
        {
          type: 'warning',
          content: 'Tours may be cancelled during rough weather. Have flexible itineraries.'
        },
        {
          type: 'info',
          content: 'Bring reef-safe sunscreen to protect marine ecosystems.'
        }
      ],
      resources: [
        {
          type: 'link',
          title: 'El Nido Official Tourism Page',
          url: 'https://www.elnidopalawan.gov.ph'
        },
        {
          type: 'map',
          title: 'Palawan Island Map',
          url: 'https://maps.google.com/palawan-islands'
        }
      ]
    },
    {
      id: '4',
      title: 'Budget Backpacking Philippines: 2-Week Itinerary',
      titleKo: '예산 백패킹 필리핀: 2주 일정',
      titleTl: 'Budget Backpacking Philippines: 2-Week Itinerary',
      category: 'budget',
      description: 'How to explore Philippines on a shoestring budget',
      descriptionKo: '최소한의 예산으로 필리핀을 탐험하는 방법',
      descriptionTl: 'Paano mag-explore ng Philippines sa minimal budget',
      content: 'Traveling the Philippines doesn\'t have to break the bank. This comprehensive budget guide shows you how to experience the best of the archipelago for under ₱30,000 for two weeks. Includes money-saving tips, budget accommodations, cheap eats, and free activities.',
      contentKo: '필리핀 여행이 예산을 초과할 필요는 없습니다. 이 종합 예산 가이드는 2주 동안 30,000페소 이하로 군도 최고의 경험을 하는 방법을 보여줍니다.',
      contentTl: 'Ang paglalakbay sa Philippines ay hindi kailangang masira ang bangko. Ang comprehensive budget guide na ito ay nagpapakita kung paano ma-experience ang best ng archipelago.',
      author: {
        id: 'author_4',
        name: 'Jenny Kim',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        bio: 'Budget travel expert and digital nomad with extensive Southeast Asia experience.',
        expertise: ['Budget Travel', 'Backpacking', 'Solo Travel', 'Money-saving Tips'],
        verified: true
      },
      publishDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      updatedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      readTime: '15 min',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=250&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=250&fit=crop',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=250&fit=crop',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=250&fit=crop'
      ],
      tags: ['budget', 'backpacking', 'cheap', 'hostels', 'money-saving', 'solo-travel'],
      views: 12456,
      likes: 1078,
      comments: 234,
      shares: 312,
      difficulty: 'intermediate',
      destination: 'Philippines',
      season: 'year-round',
      budget: {
        min: 20000,
        max: 30000,
        currency: 'PHP'
      },
      duration: '14 days',
      isFeatured: false,
      isSponsored: false,
      relatedGuides: [
        {
          id: '1',
          title: 'Ultimate Philippines Travel Guide',
          category: 'planning',
          readTime: '12 min'
        },
        {
          id: '6',
          title: 'Solo Female Travel in Philippines',
          category: 'safety',
          readTime: '9 min'
        }
      ],
      tableOfContents: [
        {
          section: 'Planning & Preparation',
          subsections: ['Budget Breakdown', 'Route Planning', 'Essential Apps']
        },
        {
          section: 'Week 1: Luzon',
          subsections: ['Manila (2 days)', 'Baguio (2 days)', 'Vigan (1 day)', 'Manila (2 days)']
        },
        {
          section: 'Week 2: Visayas',
          subsections: ['Cebu (3 days)', 'Bohol (2 days)', 'Boracay (2 days)']
        },
        {
          section: 'Money-Saving Tips',
          subsections: ['Accommodation', 'Food', 'Transportation', 'Activities']
        }
      ],
      tips: [
        {
          type: 'pro',
          content: 'Use local buses instead of tourist shuttles - they\'re 70% cheaper and equally comfortable.'
        },
        {
          type: 'warning',
          content: 'Always have cash on hand as many establishments don\'t accept cards.'
        },
        {
          type: 'info',
          content: 'Eating at local carinderias (eateries) can cost as little as ₱50-100 per meal.'
        }
      ],
      resources: [
        {
          type: 'document',
          title: 'Budget Travel Checklist',
          url: 'https://drive.google.com/budget-checklist'
        },
        {
          type: 'link',
          title: 'Hostel Booking Sites',
          url: 'https://www.hostelbookers.com'
        }
      ]
    }
  ];

  let filteredGuides = allGuides;

  // 필터링 로직
  if (params.category !== 'all') {
    filteredGuides = filteredGuides.filter(guide => guide.category === params.category);
  }

  if (params.difficulty) {
    const difficulties = params.difficulty.split(',');
    filteredGuides = filteredGuides.filter(guide => difficulties.includes(guide.difficulty));
  }

  if (params.destination) {
    filteredGuides = filteredGuides.filter(guide => 
      guide.destination.toLowerCase().includes(params.destination.toLowerCase())
    );
  }

  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredGuides = filteredGuides.filter(guide => 
      guide.title.toLowerCase().includes(searchLower) ||
      guide.titleKo.toLowerCase().includes(searchLower) ||
      guide.description.toLowerCase().includes(searchLower) ||
      guide.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      (typeof guide.author === 'object' && guide.author?.name ? guide.author.name.toLowerCase().includes(searchLower) : false)
    );
  }

  if (params.featured) {
    filteredGuides = filteredGuides.filter(guide => guide.isFeatured);
  }

  // 정렬
  switch (params.sort) {
    case 'views':
      filteredGuides.sort((a, b) => b.views - a.views);
      break;
    case 'likes':
      filteredGuides.sort((a, b) => b.likes - a.likes);
      break;
    case 'newest':
      filteredGuides.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
      break;
    case 'updated':
      filteredGuides.sort((a, b) => new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime());
      break;
    default: // featured
      filteredGuides.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return b.views - a.views;
      });
  }

  // 페이징
  const startIndex = (params.page - 1) * params.limit;
  const endIndex = startIndex + params.limit;
  
  return filteredGuides.slice(startIndex, endIndex);
}

async function getGuidesStats(params: {
  category: string;
  destination: string;
  search: string;
}): Promise<{ total: number; stats: { totalGuides: number; categories: number; authors: number; totalViews: number; } }> {
  // 실제 환경에서는 데이터베이스 통계 쿼리
  // 현재는 모의 데이터 기준
  
  let total = 4; // 전체 가이드 수
  
  // 필터에 따른 개수 조정 (실제로는 쿼리로 계산)
  if (params.category !== 'all') total = Math.floor(total * 0.6);
  if (params.destination) total = Math.floor(total * 0.7);
  if (params.search) total = Math.floor(total * 0.5);

  return {
    total,
    stats: {
      totalGuides: total,
      categories: 5, // planning, food, destinations, budget, photography
      authors: 4,
      totalViews: 45986 // 모든 가이드의 총 조회수
    }
  };
}

async function createTravelGuide(data: any): Promise<TravelGuide> {
  // 실제 환경에서는 데이터베이스에 저장
  // 현재는 모의 데이터 반환
  
  const now = new Date().toISOString();
  
  return {
    id: 'guide_' + Date.now(),
    title: data.title,
    titleKo: data.titleKo,
    titleTl: data.titleTl,
    category: data.category,
    description: data.description,
    descriptionKo: data.description,
    descriptionTl: data.description,
    content: data.content,
    contentKo: data.content,
    contentTl: data.content,
    author: {
      id: data.authorId,
      name: 'New Author',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'Travel writer and content creator',
      expertise: ['Travel Writing', 'Philippines Tourism'],
      verified: false
    },
    publishDate: now,
    updatedDate: now,
    readTime: '5 min',
    image: data.images[0] || 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=250&fit=crop',
    images: data.images,
    tags: data.tags,
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    difficulty: data.difficulty,
    destination: data.destination,
    season: 'year-round',
    budget: data.budget,
    duration: data.duration,
    isFeatured: false,
    isSponsored: false,
    relatedGuides: [],
    tableOfContents: [
      {
        section: 'Introduction',
        subsections: ['Overview', 'What to Expect']
      }
    ],
    tips: [
      {
        type: 'info',
        content: 'This is a new guide. More tips will be added as content develops.'
      }
    ],
    resources: [
      {
        type: 'link',
        title: 'Official Tourism Website',
        url: 'https://www.tourism.gov.ph'
      }
    ]
  };
}