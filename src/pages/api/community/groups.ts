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

interface CommunityGroup {
  id: string;
  name: string;
  nameKo: string;
  nameTl: string;
  description: string;
  descriptionKo: string;
  descriptionTl: string;
  category: string;
  coverImage: string;
  memberCount: number;
  postCount: number;
  isPrivate: boolean;
  isJoined: boolean;
  admin: {
    id: string;
    name: string;
    avatar: string;
  };
  moderators: {
    id: string;
    name: string;
    avatar: string;
  }[];
  rules: string[];
  tags: string[];
  location: string;
  createdAt: string;
  lastActivity: string;
  activityLevel: 'low' | 'medium' | 'high';
  joinRequirement: 'open' | 'approval' | 'invite';
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
        return await handleGetGroups(req, res);
      case 'POST':
        return await handleCreateGroup(req, res);
      default:
        return res.status(405).json({
          success: false,
          error: {
            code: 'METHOD_NOT_ALLOWED',
            message: 'Method not allowed'
          },
          timestamp: new Date().toISOString(),
          path: req.url || '/api/community/groups'
        } as ApiErrorResponse);
    }
  } catch (error) {
    console.error('Community groups API error:', error);
    
    return res.status(500).json({
      success: false,
      error: {
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: 'Failed to process request'
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/community/groups'
    } as ApiErrorResponse);
  }
}

async function handleGetGroups(req: NextApiRequest, res: NextApiResponse) {
  const { 
    page = '1', 
    limit = '10', 
    category = 'all',
    location = 'all',
    search = '' 
  } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);

  // 입력 검증
  if (pageNum < 1 || limitNum < 1 || limitNum > 50) {
    return res.status(400).json({
      success: false,
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Invalid pagination parameters',
        details: { page: pageNum, limit: limitNum }
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/community/groups'
    } as ApiErrorResponse);
  }

  const groups = await getCommunityGroups({
    page: pageNum,
    limit: limitNum,
    category: category as string,
    location: location as string,
    search: search as string
  });

  const total = await getTotalGroupsCount(category as string, location as string, search as string);

  res.status(200).json({
    success: true,
    data: groups,
    message: 'Community groups retrieved successfully',
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      hasNext: (pageNum * limitNum) < total,
      hasPrev: pageNum > 1
    }
  } as ApiResponse<CommunityGroup[]>);
}

async function handleCreateGroup(req: NextApiRequest, res: NextApiResponse) {
  const { 
    name, 
    nameKo, 
    nameTl, 
    description, 
    descriptionKo, 
    descriptionTl, 
    category, 
    isPrivate, 
    location,
    rules,
    tags 
  } = req.body;

  // 기본 검증
  if (!name || !description || !category) {
    return res.status(400).json({
      success: false,
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Name, description, and category are required'
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/community/groups'
    } as ApiErrorResponse);
  }

  // 실제 환경에서는 JWT 토큰에서 사용자 정보 추출
  const mockUserId = 'user_' + Date.now();
  
  const newGroup = await createCommunityGroup({
    adminId: mockUserId,
    name,
    nameKo: nameKo || name,
    nameTl: nameTl || name,
    description,
    descriptionKo: descriptionKo || description,
    descriptionTl: descriptionTl || description,
    category,
    isPrivate: isPrivate || false,
    location: location || 'Philippines',
    rules: rules || [],
    tags: tags || []
  });

  res.status(201).json({
    success: true,
    data: newGroup,
    message: 'Group created successfully'
  } as ApiResponse<CommunityGroup>);
}

async function getCommunityGroups(params: {
  page: number;
  limit: number;
  category: string;
  location: string;
  search: string;
}): Promise<CommunityGroup[]> {
  // 실제 환경에서는 데이터베이스 쿼리
  // 현재는 모의 데이터 반환
  
  const allGroups: CommunityGroup[] = [
    {
      id: '1',
      name: 'Korean Community Manila',
      nameKo: '마닐라 한인 커뮤니티',
      nameTl: 'Korean Community Manila',
      description: 'Official community for Koreans living in Manila Metro Area. Share experiences, get help, and connect with fellow Koreans.',
      descriptionKo: '마닐라 수도권에 거주하는 한국인들을 위한 공식 커뮤니티입니다. 경험을 공유하고, 도움을 받고, 동포들과 소통하세요.',
      descriptionTl: 'Official community para sa mga Korean na nakatira sa Manila Metro Area. Magbahagi ng experiences, kumuha ng tulong, at makipag-connect sa mga kapwa Korean.',
      category: 'social',
      coverImage: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=500&h=200&fit=crop',
      memberCount: 1247,
      postCount: 489,
      isPrivate: false,
      isJoined: true,
      admin: {
        id: 'admin_1',
        name: 'Kim Min-jun',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      moderators: [
        {
          id: 'mod_1',
          name: 'Lee Soo-jin',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
        }
      ],
      rules: [
        'Be respectful to all members',
        'No spam or promotional posts',
        'Use appropriate language',
        'Stay on topic',
        'Help maintain a positive community'
      ],
      tags: ['korean', 'manila', 'community', 'social', 'networking'],
      location: 'Manila',
      createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(), // 1년 전
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
      activityLevel: 'high',
      joinRequirement: 'open'
    },
    {
      id: '2',
      name: 'Cebu Expats Housing',
      nameKo: '세부 외국인 주거 그룹',
      nameTl: 'Cebu Expats Housing',
      description: 'Find housing, roommates, and rental advice in Cebu. For expats looking for accommodation in Cebu City and surrounding areas.',
      descriptionKo: '세부에서 주거지, 룸메이트, 임대 조언을 찾으세요. 세부시티와 주변 지역에서 숙소를 찾는 외국인들을 위한 그룹입니다.',
      descriptionTl: 'Maghanap ng housing, roommates, at rental advice sa Cebu. Para sa mga expats na naghahanap ng accommodation sa Cebu City at karatig na lugar.',
      category: 'housing',
      coverImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=200&fit=crop',
      memberCount: 567,
      postCount: 234,
      isPrivate: false,
      isJoined: false,
      admin: {
        id: 'admin_2',
        name: 'Maria Garcia',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      moderators: [
        {
          id: 'mod_2',
          name: 'John Stevens',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        }
      ],
      rules: [
        'Only housing-related posts',
        'Include photos and details',
        'No discriminatory content',
        'Verify information before posting',
        'Report scams or suspicious activity'
      ],
      tags: ['cebu', 'housing', 'expats', 'rental', 'roommates'],
      location: 'Cebu',
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), // 6개월 전
      lastActivity: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5시간 전
      activityLevel: 'medium',
      joinRequirement: 'open'
    },
    {
      id: '3',
      name: 'Philippine Tech Jobs',
      nameKo: '필리핀 IT 구인구직',
      nameTl: 'Philippine Tech Jobs',
      description: 'Job opportunities and career discussions for tech professionals in the Philippines. Share job openings, career advice, and industry insights.',
      descriptionKo: '필리핀의 IT 전문가들을 위한 구직 기회와 경력 논의 그룹입니다. 채용 정보, 경력 조언, 업계 통찰을 공유하세요.',
      descriptionTl: 'Job opportunities at career discussions para sa mga tech professionals sa Pilipinas. Magbahagi ng job openings, career advice, at industry insights.',
      category: 'jobs',
      coverImage: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=500&h=200&fit=crop',
      memberCount: 892,
      postCount: 156,
      isPrivate: false,
      isJoined: true,
      admin: {
        id: 'admin_3',
        name: 'Alex Chen',
        avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face'
      },
      moderators: [
        {
          id: 'mod_3',
          name: 'Sarah Kim',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
        }
      ],
      rules: [
        'Tech-related jobs only',
        'Include salary range if possible',
        'No recruitment agency spam',
        'Be professional in communications',
        'Provide company details'
      ],
      tags: ['jobs', 'tech', 'philippines', 'careers', 'programming'],
      location: 'Philippines',
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 3개월 전
      lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1일 전
      activityLevel: 'medium',
      joinRequirement: 'open'
    },
    {
      id: '4',
      name: 'Manila Foodies United',
      nameKo: '마닐라 맛집 탐방단',
      nameTl: 'Manila Foodies United',
      description: 'Discover the best food spots in Manila! Share restaurant reviews, food photos, and dining experiences. From street food to fine dining.',
      descriptionKo: '마닐라 최고의 맛집을 발견하세요! 레스토랑 리뷰, 음식 사진, 식사 경험을 공유하세요. 길거리 음식부터 파인 다이닝까지.',
      descriptionTl: 'Tuklasin ang pinakamahusay na food spots sa Manila! Magbahagi ng restaurant reviews, food photos, at dining experiences. Mula sa street food hanggang fine dining.',
      category: 'social',
      coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&h=200&fit=crop',
      memberCount: 345,
      postCount: 78,
      isPrivate: false,
      isJoined: false,
      admin: {
        id: 'admin_4',
        name: 'Patricia Santos',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      moderators: [
        {
          id: 'mod_4',
          name: 'Miguel Reyes',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        }
      ],
      rules: [
        'Food-related posts only',
        'Include location and photos',
        'Honest reviews only',
        'Respect different tastes',
        'Support local businesses'
      ],
      tags: ['food', 'manila', 'restaurants', 'reviews', 'dining'],
      location: 'Manila',
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 2개월 전
      lastActivity: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12시간 전
      activityLevel: 'low',
      joinRequirement: 'open'
    },
    {
      id: '5',
      name: 'Davao Korean Community',
      nameKo: '다바오 한인 커뮤니티',
      nameTl: 'Davao Korean Community',
      description: 'Korean community in Davao City. Connect with fellow Koreans, share local information, and build friendships in Mindanao.',
      descriptionKo: '다바오시의 한인 커뮤니티입니다. 동포들과 연결하고, 현지 정보를 공유하고, 민다나오에서 우정을 쌓으세요.',
      descriptionTl: 'Korean community sa Davao City. Makipag-connect sa mga kapwa Korean, magbahagi ng local information, at makabuo ng friendships sa Mindanao.',
      category: 'social',
      coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=200&fit=crop',
      memberCount: 123,
      postCount: 45,
      isPrivate: true,
      isJoined: false,
      admin: {
        id: 'admin_5',
        name: 'Park Ji-hoon',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      moderators: [
        {
          id: 'mod_5',
          name: 'Kim Yu-jin',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
        }
      ],
      rules: [
        'Korean community members only',
        'Respectful communication',
        'No business promotions',
        'Help fellow community members',
        'Maintain privacy of group members'
      ],
      tags: ['korean', 'davao', 'mindanao', 'community', 'private'],
      location: 'Davao',
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), // 4개월 전
      lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3일 전
      activityLevel: 'low',
      joinRequirement: 'approval'
    }
  ];

  let filteredGroups = allGroups;

  // 카테고리 필터링
  if (params.category !== 'all') {
    filteredGroups = filteredGroups.filter(group => group.category === params.category);
  }

  // 지역 필터링
  if (params.location !== 'all') {
    filteredGroups = filteredGroups.filter(group => 
      group.location.toLowerCase().includes(params.location.toLowerCase())
    );
  }

  // 검색 필터링
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredGroups = filteredGroups.filter(group => 
      group.name.toLowerCase().includes(searchLower) ||
      group.description.toLowerCase().includes(searchLower) ||
      group.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  // 인기순으로 정렬 (멤버 수 + 활동성)
  filteredGroups.sort((a, b) => {
    const scoreA = a.memberCount + (a.activityLevel === 'high' ? 1000 : a.activityLevel === 'medium' ? 500 : 0);
    const scoreB = b.memberCount + (b.activityLevel === 'high' ? 1000 : b.activityLevel === 'medium' ? 500 : 0);
    return scoreB - scoreA;
  });

  // 페이징
  const startIndex = (params.page - 1) * params.limit;
  const endIndex = startIndex + params.limit;
  
  return filteredGroups.slice(startIndex, endIndex);
}

async function getTotalGroupsCount(category: string, location: string, search: string): Promise<number> {
  // 실제 환경에서는 데이터베이스 카운트 쿼리
  // 현재는 모의 데이터 기준
  let total = 5; // 전체 그룹 수

  if (category !== 'all') {
    // 카테고리별 개수 (예시)
    const categoryCounts: Record<string, number> = {
      social: 3,
      housing: 1,
      jobs: 1
    };
    total = categoryCounts[category] || 0;
  }

  if (location !== 'all') {
    // 지역별 개수 조정 (실제로는 지역 필터 쿼리 실행)
    total = Math.floor(total * 0.8); // 예시로 80% 정도 반환
  }

  if (search) {
    // 검색 결과에 따른 개수 조정 (실제로는 검색 쿼리 실행)
    total = Math.floor(total * 0.6); // 예시로 60% 정도 반환
  }

  return total;
}

async function createCommunityGroup(data: {
  adminId: string;
  name: string;
  nameKo: string;
  nameTl: string;
  description: string;
  descriptionKo: string;
  descriptionTl: string;
  category: string;
  isPrivate: boolean;
  location: string;
  rules: string[];
  tags: string[];
}): Promise<CommunityGroup> {
  // 실제 환경에서는 데이터베이스에 저장
  // 현재는 모의 데이터 반환
  
  const now = new Date().toISOString();
  
  return {
    id: 'group_' + Date.now(),
    name: data.name,
    nameKo: data.nameKo,
    nameTl: data.nameTl,
    description: data.description,
    descriptionKo: data.descriptionKo,
    descriptionTl: data.descriptionTl,
    category: data.category,
    coverImage: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=500&h=200&fit=crop',
    memberCount: 1, // 생성자만 있음
    postCount: 0,
    isPrivate: data.isPrivate,
    isJoined: true, // 생성자는 자동으로 가입됨
    admin: {
      id: data.adminId,
      name: 'New Admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    moderators: [],
    rules: data.rules,
    tags: data.tags,
    location: data.location,
    createdAt: now,
    lastActivity: now,
    activityLevel: 'low',
    joinRequirement: data.isPrivate ? 'approval' : 'open'
  };
}