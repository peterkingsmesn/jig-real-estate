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

interface CommunityPost {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    location: string;
  };
  category: string;
  title: string;
  titleKo: string;
  titleTl: string;
  content: string;
  contentKo: string;
  contentTl: string;
  images: string[];
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
  isBookmarked: boolean;
  isPinned: boolean;
  status: 'active' | 'hidden' | 'reported';
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
        return await handleGetPosts(req, res);
      case 'POST':
        return await handleCreatePost(req, res);
      default:
        return res.status(405).json({
          success: false,
          error: {
            code: 'METHOD_NOT_ALLOWED',
            message: 'Method not allowed'
          },
          timestamp: new Date().toISOString(),
          path: req.url || '/api/community/posts'
        } as ApiErrorResponse);
    }
  } catch (error) {
    console.error('Community posts API error:', error);
    
    return res.status(500).json({
      success: false,
      error: {
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: 'Failed to process request'
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/community/posts'
    } as ApiErrorResponse);
  }
}

async function handleGetPosts(req: NextApiRequest, res: NextApiResponse) {
  const { 
    page = '1', 
    limit = '10', 
    category = 'all',
    sort = 'latest',
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
      path: req.url || '/api/community/posts'
    } as ApiErrorResponse);
  }

  const posts = await getCommunityPosts({
    page: pageNum,
    limit: limitNum,
    category: category as string,
    sort: sort as string,
    search: search as string
  });

  const total = await getTotalPostsCount(category as string, search as string);

  res.status(200).json({
    success: true,
    data: posts,
    message: 'Community posts retrieved successfully',
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      hasNext: (pageNum * limitNum) < total,
      hasPrev: pageNum > 1
    }
  } as ApiResponse<CommunityPost[]>);
}

async function handleCreatePost(req: NextApiRequest, res: NextApiResponse) {
  const { title, titleKo, titleTl, content, contentKo, contentTl, category, tags, images } = req.body;

  // 기본 검증
  if (!title || !content || !category) {
    return res.status(400).json({
      success: false,
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Title, content, and category are required'
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/community/posts'
    } as ApiErrorResponse);
  }

  // 실제 환경에서는 JWT 토큰에서 사용자 정보 추출
  const mockUserId = 'user_' + Date.now();
  
  const newPost = await createCommunityPost({
    authorId: mockUserId,
    title,
    titleKo: titleKo || title,
    titleTl: titleTl || title,
    content,
    contentKo: contentKo || content,
    contentTl: contentTl || content,
    category,
    tags: tags || [],
    images: images || []
  });

  res.status(201).json({
    success: true,
    data: newPost,
    message: 'Post created successfully'
  } as ApiResponse<CommunityPost>);
}

async function getCommunityPosts(params: {
  page: number;
  limit: number;
  category: string;
  sort: string;
  search: string;
}): Promise<CommunityPost[]> {
  // 실제 환경에서는 데이터베이스 쿼리
  // 현재는 모의 데이터 반환
  
  const allPosts: CommunityPost[] = [
    // 최신 게시글들
    {
      id: '1',
      author: {
        id: 'user_1',
        name: 'Maria Santos',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        verified: true,
        location: 'BGC, Taguig'
      },
      category: 'housing',
      title: 'Looking for a roommate in BGC',
      titleKo: 'BGC에서 룸메이트 구해요',
      titleTl: 'Naghahanap ng roommate sa BGC',
      content: 'Hi everyone! I\'m looking for a female roommate to share a 2BR condo in BGC. Rent is ₱15,000/month per person. The place is fully furnished and very close to office buildings. Please message me if interested!',
      contentKo: '안녕하세요! BGC에서 2베드룸 콘도를 함께 쓸 여성 룸메이트를 찾고 있어요. 월세는 인당 15,000페소이고, 풀옵션이며 오피스 빌딩들과 매우 가까워요. 관심있으시면 메시지 주세요!',
      contentTl: 'Hi everyone! Naghahanap ako ng female roommate para sa 2BR condo sa BGC. Rent ay ₱15,000/month per person. Fully furnished at malapit sa mga office buildings. Message ninyo ko kung interested!',
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=300&fit=crop'],
      tags: ['roommate', 'bgc', 'condo', 'female'],
      likes: 23,
      comments: 8,
      shares: 2,
      views: 156,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isLiked: false,
      isBookmarked: true,
      isPinned: false,
      status: 'active'
    },
    {
      id: '2',
      author: {
        id: 'user_2',
        name: 'John Kim',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        verified: true,
        location: 'Makati City'
      },
      category: 'jobs',
      title: 'Software Developer Job Opening',
      titleKo: '소프트웨어 개발자 채용공고',
      titleTl: 'Software Developer Job Opening',
      content: 'Our startup is looking for a passionate software developer. Must have experience with React and Node.js. Competitive salary and flexible working hours. Remote work available. We offer health insurance, 13th month pay, and performance bonuses.',
      contentKo: '저희 스타트업에서 열정적인 소프트웨어 개발자를 찾고 있습니다. React와 Node.js 경험 필수. 경쟁력 있는 급여와 유연한 근무시간. 재택근무 가능. 건강보험, 13개월 급여, 성과 보너스 제공.',
      contentTl: 'Ang aming startup ay naghahanap ng passionate software developer. Dapat may experience sa React at Node.js. Competitive salary at flexible working hours. May remote work. May health insurance, 13th month pay, at performance bonuses.',
      images: [],
      tags: ['jobs', 'developer', 'react', 'nodejs', 'startup'],
      likes: 45,
      comments: 12,
      shares: 15,
      views: 289,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4시간 전
      updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      isLiked: true,
      isBookmarked: false,
      isPinned: true,
      status: 'active'
    },
    {
      id: '3',
      author: {
        id: 'user_3',
        name: 'Lisa Chen',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        verified: false,
        location: 'Cebu City'
      },
      category: 'events',
      title: 'Korean Community BBQ Night',
      titleKo: '한인 커뮤니티 바베큐 나이트',
      titleTl: 'Korean Community BBQ Night',
      content: 'Join us for a fun BBQ night this Saturday! Meet fellow Koreans and Filipino friends. Bring your own drinks. Food will be provided. Location: Lahug, Cebu City. Event starts at 6 PM. Please RSVP in the comments!',
      contentKo: '이번 토요일 재미있는 바베큐 나이트에 참가하세요! 동포들과 필리핀 친구들을 만나보세요. 음료는 개별 준비, 음식은 제공됩니다. 장소: 라훅, 세부시티. 오후 6시 시작. 댓글로 참석 여부 알려주세요!',
      contentTl: 'Samahan ninyo kami sa masayang BBQ night ngayong Saturday! Makakameet ninyo ang mga Korean at Filipino friends. Dalhin ang sariling drinks. May provided na food. Location: Lahug, Cebu City. Start ng 6 PM. RSVP sa comments!',
      images: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&h=300&fit=crop'],
      tags: ['event', 'bbq', 'community', 'cebu', 'social'],
      likes: 67,
      comments: 23,
      shares: 8,
      views: 445,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1일 전
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      isLiked: false,
      isBookmarked: true,
      isPinned: false,
      status: 'active'
    },
    {
      id: '4',
      author: {
        id: 'user_4',
        name: 'Pedro Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        verified: false,
        location: 'Angeles, Pampanga'
      },
      category: 'help',
      title: 'Need help with visa renewal',
      titleKo: '비자 갱신 도움 필요해요',
      titleTl: 'Kailangan ng tulong sa visa renewal',
      content: 'Hello! I need help with visa renewal process. Has anyone recently renewed their tourist visa? What documents are needed and how long does it take? Any recommended agencies? I\'m in Angeles, Pampanga area.',
      contentKo: '안녕하세요! 비자 갱신 과정에서 도움이 필요합니다. 최근에 관광비자 갱신하신 분 계신가요? 어떤 서류가 필요하고 얼마나 걸리나요? 추천 업체 있나요? 앙헬레스, 팜팡가 지역에 있어요.',
      contentTl: 'Hello! Kailangan ko ng tulong sa visa renewal process. May nakarenew ba recently ng tourist visa? Anong documents ang kailangan at gaano katagal? May recommended agencies ba kayo? Nasa Angeles, Pampanga area ako.',
      images: [],
      tags: ['visa', 'renewal', 'help', 'angeles', 'documents'],
      likes: 12,
      comments: 34,
      shares: 3,
      views: 198,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 전
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: false,
      isBookmarked: false,
      isPinned: false,
      status: 'active'
    },
    {
      id: '5',
      author: {
        id: 'user_5',
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        verified: true,
        location: 'Bonifacio Global City'
      },
      category: 'marketplace',
      title: 'iPhone 14 for sale - Almost new',
      titleKo: '아이폰 14 판매 - 거의 새것',
      titleTl: 'iPhone 14 for sale - Almost new',
      content: 'Selling my iPhone 14 128GB in excellent condition. Used for only 3 months. Still has warranty. Complete package with original box, charger, and case. No scratches or dents. Serious buyers only. Price: ₱45,000 (negotiable)',
      contentKo: '상태 좋은 아이폰 14 128GB 판매합니다. 3개월만 사용했고 아직 보증기간 내입니다. 정품 박스, 충전기, 케이스 포함. 스크래치나 찌그러짐 없어요. 진지한 구매자만 연락주세요. 가격: 45,000페소 (흥정 가능)',
      contentTl: 'Binebenta ko ang iPhone 14 128GB ko na excellent condition. 3 months lang ginamit. May warranty pa. Complete package with original box, charger, at case. Walang scratches o dents. Serious buyers lang. Price: ₱45,000 (negotiable)',
      images: ['https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&h=300&fit=crop'],
      tags: ['iphone', 'sale', 'smartphone', 'apple', 'bgc'],
      likes: 34,
      comments: 19,
      shares: 6,
      views: 267,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5시간 전
      updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      isLiked: false,
      isBookmarked: false,
      isPinned: false,
      status: 'active'
    },
    
    // 지난 주 게시글들
    {
      id: '6',
      author: {
        id: 'user_6',
        name: '김민수',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        verified: true,
        location: 'Makati City'
      },
      category: 'life',
      title: '필리핀 운전면허 취득 후기',
      titleKo: '필리핀 운전면허 취득 후기',
      titleTl: 'Philippine driver\'s license experience',
      content: '드디어 필리핀 운전면허를 취득했습니다! 한국 면허증 전환이 아니라 처음부터 시작했는데, 생각보다 복잡했어요. 전체 과정, 필요서류, 비용 등을 공유합니다.\n\n1. 이론 시험 - 온라인으로 가능하고 60문제 중 48개 이상 맞으면 합격\n2. 실기 시험 - 코스가 간단해서 한국보다 쉬워요\n3. 총 비용: 약 5,000페소 정도 들었습니다.',
      contentKo: '드디어 필리핀 운전면허를 취득했습니다! 한국 면허증 전환이 아니라 처음부터 시작했는데, 생각보다 복잡했어요. 전체 과정, 필요서류, 비용 등을 공유합니다.\n\n1. 이론 시험 - 온라인으로 가능하고 60문제 중 48개 이상 맞으면 합격\n2. 실기 시험 - 코스가 간단해서 한국보다 쉬워요\n3. 총 비용: 약 5,000페소 정도 들었습니다.',
      contentTl: 'Finally got my Philippine driver\'s license! Hindi conversion from Korean license, nagsimula ako from scratch. Mas complicated than expected. Sharing the whole process, requirements, and costs.',
      images: ['https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&h=300&fit=crop'],
      tags: ['운전면허', '라이센스', '팁', '정보'],
      likes: 156,
      comments: 67,
      shares: 23,
      views: 892,
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: false,
      isBookmarked: true,
      isPinned: false,
      status: 'active'
    },
    {
      id: '7',
      author: {
        id: 'user_7',
        name: '박지영',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
        verified: false,
        location: 'Quezon City'
      },
      category: 'questions',
      title: '아이들 국제학교 추천 부탁드려요',
      titleKo: '아이들 국제학교 추천 부탁드려요',
      titleTl: 'International school recommendations for kids',
      content: '내년에 필리핀으로 이주 예정인데 초등학생 아이들 국제학교를 알아보고 있습니다. QC 지역 근처로 추천 부탁드려요. 예산은 연간 학비 100-150만페소 정도 생각하고 있어요.',
      contentKo: '내년에 필리핀으로 이주 예정인데 초등학생 아이들 국제학교를 알아보고 있습니다. QC 지역 근처로 추천 부탁드려요. 예산은 연간 학비 100-150만페소 정도 생각하고 있어요.',
      contentTl: 'Moving to Philippines next year and looking for international schools for elementary kids. Near QC area please. Budget around 100-150K pesos per year.',
      images: [],
      tags: ['국제학교', '교육', '아이들', 'QC'],
      likes: 89,
      comments: 123,
      shares: 12,
      views: 567,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: false,
      isBookmarked: false,
      isPinned: false,
      status: 'active'
    },
    
    // 지난 달 인기 게시글들
    {
      id: '8',
      author: {
        id: 'user_8',
        name: '이현우',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        verified: true,
        location: 'Alabang'
      },
      category: 'life',
      title: '필리핀 5년차의 솔직한 생활 팁 모음',
      titleKo: '필리핀 5년차의 솔직한 생활 팁 모음',
      titleTl: '5 years in the Philippines - honest tips',
      content: '필리핀 거주 5년차 한국인으로서 신규 이주민들에게 도움될 만한 팁들을 정리해봤습니다.\n\n1. 에어컨 전기료 절약법\n2. 좋은 헬퍼 구하는 방법\n3. 한국 음식 재료 구하기\n4. 병원 추천 (건강보험 가입 필수)\n5. 사기 피하는 법\n\n자세한 내용은 댓글로 질문 주세요!',
      contentKo: '필리핀 거주 5년차 한국인으로서 신규 이주민들에게 도움될 만한 팁들을 정리해봤습니다.\n\n1. 에어컨 전기료 절약법\n2. 좋은 헬퍼 구하는 방법\n3. 한국 음식 재료 구하기\n4. 병원 추천 (건강보험 가입 필수)\n5. 사기 피하는 법\n\n자세한 내용은 댓글로 질문 주세요!',
      contentTl: 'As a Korean living in the Philippines for 5 years, compiled helpful tips for newcomers. Ask details in comments!',
      images: ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&h=300&fit=crop'],
      tags: ['생활팁', '정보', '5년차', '꿀팁'],
      likes: 342,
      comments: 198,
      shares: 87,
      views: 2341,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: true,
      isBookmarked: true,
      isPinned: true,
      status: 'active'
    },
    {
      id: '9',
      author: {
        id: 'user_9',
        name: 'Jenny Kim',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
        verified: false,
        location: 'Clark, Pampanga'
      },
      category: 'business',
      title: '한국 음식점 오픈 경험 공유',
      titleKo: '한국 음식점 오픈 경험 공유',
      titleTl: 'Korean restaurant opening experience',
      content: '클락에 한국 음식점을 오픈한지 6개월이 되었네요. 처음 사업하시는 분들에게 도움이 될까 해서 경험을 공유합니다. 허가 과정, 초기 투자비용, 현지 직원 관리 등 궁금하신 점 물어보세요.',
      contentKo: '클락에 한국 음식점을 오픈한지 6개월이 되었네요. 처음 사업하시는 분들에게 도움이 될까 해서 경험을 공유합니다. 허가 과정, 초기 투자비용, 현지 직원 관리 등 궁금하신 점 물어보세요.',
      contentTl: 'It\'s been 6 months since I opened a Korean restaurant in Clark. Sharing experience for those planning to start a business.',
      images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=300&fit=crop'],
      tags: ['사업', '음식점', '클락', '창업'],
      likes: 234,
      comments: 156,
      shares: 45,
      views: 1892,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: false,
      isBookmarked: false,
      isPinned: false,
      status: 'active'
    },
    
    // 3개월 전 게시글들
    {
      id: '10',
      author: {
        id: 'user_10',
        name: '최준호',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face',
        verified: true,
        location: 'Davao City'
      },
      category: 'travel',
      title: '다바오 숨은 명소 Best 10',
      titleKo: '다바오 숨은 명소 Best 10',
      titleTl: 'Davao hidden gems Best 10',
      content: '다바오에 살면서 발견한 관광객들이 잘 모르는 명소들을 소개합니다. 사말 섬, 에덴 네이처파크 말고도 정말 좋은 곳들이 많아요!',
      contentKo: '다바오에 살면서 발견한 관광객들이 잘 모르는 명소들을 소개합니다. 사말 섬, 에덴 네이처파크 말고도 정말 좋은 곳들이 많아요!',
      contentTl: 'Living in Davao, discovered many hidden gems tourists don\'t know about. Beyond Samal Island and Eden Nature Park!',
      images: ['https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=500&h=300&fit=crop'],
      tags: ['다바오', '여행', '명소', '추천'],
      likes: 456,
      comments: 234,
      shares: 123,
      views: 3456,
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: true,
      isBookmarked: true,
      isPinned: false,
      status: 'active'
    },
    {
      id: '11',
      author: {
        id: 'user_11',
        name: '강미나',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        verified: false,
        location: 'Pasig City'
      },
      category: 'help',
      title: '긴급! 병원 추천해주세요',
      titleKo: '긴급! 병원 추천해주세요',
      titleTl: 'Urgent! Hospital recommendations',
      content: '아이가 갑자기 고열이 나서 병원을 가야하는데 Pasig 근처 좋은 소아과 있는 병원 추천 부탁드려요. 보험 처리 가능한 곳이면 더 좋겠습니다.',
      contentKo: '아이가 갑자기 고열이 나서 병원을 가야하는데 Pasig 근처 좋은 소아과 있는 병원 추천 부탁드려요. 보험 처리 가능한 곳이면 더 좋겠습니다.',
      contentTl: 'Child has high fever suddenly, need hospital near Pasig with good pediatrics. Insurance coverage preferred.',
      images: [],
      tags: ['긴급', '병원', '소아과', 'Pasig'],
      likes: 67,
      comments: 89,
      shares: 23,
      views: 567,
      createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: false,
      isBookmarked: false,
      isPinned: false,
      status: 'active'
    },
    
    // 6개월 전 인기글
    {
      id: '12',
      author: {
        id: 'user_12',
        name: '정수진',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        verified: true,
        location: 'Mandaluyong'
      },
      category: 'life',
      title: '필리핀에서 한국 음식 만들기 - 재료 구입처 총정리',
      titleKo: '필리핀에서 한국 음식 만들기 - 재료 구입처 총정리',
      titleTl: 'Making Korean food in PH - where to buy ingredients',
      content: '필리핀에서 한국 음식 해먹기 힘드시죠? 제가 3년간 모은 한국 식재료 구입처를 총정리했습니다. 지역별로 정리했으니 참고하세요!',
      contentKo: '필리핀에서 한국 음식 해먹기 힘드시죠? 제가 3년간 모은 한국 식재료 구입처를 총정리했습니다. 지역별로 정리했으니 참고하세요!',
      contentTl: 'Hard to make Korean food in the Philippines? Compiled all Korean ingredient stores I found over 3 years!',
      images: ['https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&h=300&fit=crop'],
      tags: ['한국음식', '재료', '마트', '정보'],
      likes: 789,
      comments: 456,
      shares: 234,
      views: 5678,
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 170 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: true,
      isBookmarked: true,
      isPinned: true,
      status: 'active'
    },
    {
      id: '13',
      author: {
        id: 'user_13',
        name: '김태형',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        verified: false,
        location: 'Subic Bay'
      },
      category: 'business',
      title: '수빅 자유무역지대 사업 기회',
      titleKo: '수빅 자유무역지대 사업 기회',
      titleTl: 'Subic Freeport business opportunities',
      content: '수빅에서 무역업을 시작한지 2년됐습니다. 세금 혜택도 좋고 인프라도 잘 되어있어요. 관심있으신 분들 정보 공유해드립니다.',
      contentKo: '수빅에서 무역업을 시작한지 2년됐습니다. 세금 혜택도 좋고 인프라도 잘 되어있어요. 관심있으신 분들 정보 공유해드립니다.',
      contentTl: 'Started trading business in Subic 2 years ago. Good tax benefits and infrastructure. Sharing info for interested people.',
      images: [],
      tags: ['수빅', '사업', '무역', '투자'],
      likes: 234,
      comments: 123,
      shares: 56,
      views: 2345,
      createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 195 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: false,
      isBookmarked: false,
      isPinned: false,
      status: 'active'
    },
    
    // 1년 전 레전드 게시글
    {
      id: '14',
      author: {
        id: 'user_14',
        name: '박성민',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        verified: true,
        location: 'Eastwood City'
      },
      category: 'life',
      title: '[레전드] 필리핀 이주 전 꼭 알아야 할 100가지',
      titleKo: '[레전드] 필리핀 이주 전 꼭 알아야 할 100가지',
      titleTl: '[Legend] 100 things to know before moving to PH',
      content: '필리핀 10년차가 정리한 이주 전 꼭 알아야 할 것들. 이 글 하나면 충분합니다. 북마크 필수!',
      contentKo: '필리핀 10년차가 정리한 이주 전 꼭 알아야 할 것들. 이 글 하나면 충분합니다. 북마크 필수!',
      contentTl: '10-year resident compiled must-know things before moving. This post is all you need. Must bookmark!',
      images: ['https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=500&h=300&fit=crop'],
      tags: ['레전드', '필독', '이주', '정보', '10년차'],
      likes: 2345,
      comments: 1234,
      shares: 789,
      views: 23456,
      createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: true,
      isBookmarked: true,
      isPinned: true,
      status: 'active'
    },
    {
      id: '15',
      author: {
        id: 'user_15',
        name: '이소연',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
        verified: true,
        location: 'Ortigas'
      },
      category: 'life',
      title: '필리핀 결혼식 다녀온 후기',
      titleKo: '필리핀 결혼식 다녀온 후기',
      titleTl: 'Philippine wedding experience',
      content: '필리핀 친구 결혼식에 초대받아서 다녀왔는데 한국이랑 정말 다르더라구요! 문화 차이 때문에 당황했던 점들과 재미있었던 경험 공유해요.',
      contentKo: '필리핀 친구 결혼식에 초대받아서 다녀왔는데 한국이랑 정말 다르더라구요! 문화 차이 때문에 당황했던 점들과 재미있었던 경험 공유해요.',
      contentTl: 'Attended Filipino friend\'s wedding and it was so different from Korea! Sharing culture shock moments and fun experiences.',
      images: ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&h=300&fit=crop'],
      tags: ['결혼식', '문화', '경험', '필리핀문화'],
      likes: 567,
      comments: 234,
      shares: 123,
      views: 4567,
      createdAt: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 395 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: false,
      isBookmarked: false,
      isPinned: false,
      status: 'active'
    },
    
    // 추가 게시글들 - 다양한 시기와 카테고리
    {
      id: '16',
      author: {
        id: 'user_16',
        name: '홍길동',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        verified: false,
        location: 'Las Piñas'
      },
      category: 'marketplace',
      title: '삼성 에어컨 팝니다 (이사)',
      titleKo: '삼성 에어컨 팝니다 (이사)',
      titleTl: 'Samsung aircon for sale (moving out)',
      content: '한국으로 귀국하게 되어 삼성 인버터 에어컨 팝니다. 2HP, 작년에 구입했고 상태 매우 좋습니다. 가격: 25,000페소',
      contentKo: '한국으로 귀국하게 되어 삼성 인버터 에어컨 팝니다. 2HP, 작년에 구입했고 상태 매우 좋습니다. 가격: 25,000페소',
      contentTl: 'Moving back to Korea, selling Samsung inverter aircon. 2HP, bought last year, very good condition. Price: ₱25,000',
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop'],
      tags: ['에어컨', '삼성', '판매', '이사'],
      likes: 34,
      comments: 12,
      shares: 5,
      views: 234,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: false,
      isBookmarked: false,
      isPinned: false,
      status: 'active'
    },
    {
      id: '17',
      author: {
        id: 'user_17',
        name: '김철수',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face',
        verified: true,
        location: 'Fort Bonifacio'
      },
      category: 'social',
      title: '테니스 동호회 회원 모집',
      titleKo: '테니스 동호회 회원 모집',
      titleTl: 'Tennis club member recruitment',
      content: 'BGC 테니스 동호회에서 새 회원을 모집합니다. 매주 토요일 오전 7시 McKinley Hill 코트에서 모입니다. 초보자도 환영!',
      contentKo: 'BGC 테니스 동호회에서 새 회원을 모집합니다. 매주 토요일 오전 7시 McKinley Hill 코트에서 모입니다. 초보자도 환영!',
      contentTl: 'BGC tennis club recruiting new members. Every Saturday 7AM at McKinley Hill courts. Beginners welcome!',
      images: ['https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=500&h=300&fit=crop'],
      tags: ['테니스', '동호회', 'BGC', '운동'],
      likes: 78,
      comments: 34,
      shares: 12,
      views: 456,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: true,
      isBookmarked: false,
      isPinned: false,
      status: 'active'
    },
    {
      id: '18',
      author: {
        id: 'user_18',
        name: '최영희',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
        verified: false,
        location: 'Parañaque'
      },
      category: 'questions',
      title: '공항 근처 장기 주차 추천',
      titleKo: '공항 근처 장기 주차 추천',
      titleTl: 'Long-term parking near airport recommendation',
      content: '다음주에 한국 다녀오는데 2주 정도 차를 맡길 곳을 찾고 있어요. NAIA 근처 안전하고 저렴한 장기 주차장 아시는 분?',
      contentKo: '다음주에 한국 다녀오는데 2주 정도 차를 맡길 곳을 찾고 있어요. NAIA 근처 안전하고 저렴한 장기 주차장 아시는 분?',
      contentTl: 'Going to Korea next week, need parking for 2 weeks. Anyone know safe and affordable long-term parking near NAIA?',
      images: [],
      tags: ['주차', '공항', 'NAIA', '장기주차'],
      likes: 23,
      comments: 45,
      shares: 8,
      views: 234,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: false,
      isBookmarked: true,
      isPinned: false,
      status: 'active'
    },
    {
      id: '19',
      author: {
        id: 'user_19',
        name: '정민재',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        verified: true,
        location: 'Tagaytay'
      },
      category: 'business',
      title: '타가이타이 펜션 사업 후기',
      titleKo: '타가이타이 펜션 사업 후기',
      titleTl: 'Tagaytay pension business review',
      content: '타가이타이에서 펜션 운영한지 3년째입니다. 초기 투자비용, 수익성, 운영 노하우 등 궁금하신 분들께 경험 공유합니다.',
      contentKo: '타가이타이에서 펜션 운영한지 3년째입니다. 초기 투자비용, 수익성, 운영 노하우 등 궁금하신 분들께 경험 공유합니다.',
      contentTl: 'Running pension in Tagaytay for 3 years. Sharing experience on initial investment, profitability, operation know-how.',
      images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=500&h=300&fit=crop'],
      tags: ['타가이타이', '펜션', '사업', '부동산'],
      likes: 345,
      comments: 167,
      shares: 89,
      views: 2345,
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: false,
      isBookmarked: true,
      isPinned: false,
      status: 'active'
    },
    {
      id: '20',
      author: {
        id: 'user_20',
        name: '이정훈',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        verified: false,
        location: 'Laguna'
      },
      category: 'help',
      title: '차량 사고 처리 도움 요청',
      titleKo: '차량 사고 처리 도움 요청',
      titleTl: 'Car accident help needed',
      content: '어제 SLEX에서 접촉사고가 났는데 처음이라 어떻게 해야할지 모르겠어요. 보험처리나 경찰서 신고 절차 아시는 분 도와주세요.',
      contentKo: '어제 SLEX에서 접촉사고가 났는데 처음이라 어떻게 해야할지 모르겠어요. 보험처리나 경찰서 신고 절차 아시는 분 도와주세요.',
      contentTl: 'Had minor accident on SLEX yesterday, first time so don\'t know what to do. Need help with insurance and police report process.',
      images: [],
      tags: ['사고', '보험', '도움', 'SLEX'],
      likes: 45,
      comments: 78,
      shares: 23,
      views: 567,
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: false,
      isBookmarked: false,
      isPinned: false,
      status: 'active'
    },
    {
      id: '21',
      author: {
        id: 'user_21',
        name: '송미경',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        verified: true,
        location: 'Alabang'
      },
      category: 'life',
      title: '아얄라 알라방 생활 3년 후기',
      titleKo: '아얄라 알라방 생활 3년 후기',
      titleTl: 'Ayala Alabang 3 years living review',
      content: '알라방에 살면서 느낀 장단점을 솔직하게 적어봅니다. 교통, 쇼핑, 학교, 치안 등 전반적인 생활 환경에 대해 공유해요.',
      contentKo: '알라방에 살면서 느낀 장단점을 솔직하게 적어봅니다. 교통, 쇼핑, 학교, 치안 등 전반적인 생활 환경에 대해 공유해요.',
      contentTl: 'Honest pros and cons of living in Alabang. Sharing about traffic, shopping, schools, security, overall living environment.',
      images: ['https://images.unsplash.com/photo-1560184897-ae75f418493e?w=500&h=300&fit=crop'],
      tags: ['알라방', '생활', '거주', '후기'],
      likes: 234,
      comments: 89,
      shares: 45,
      views: 1234,
      createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: true,
      isBookmarked: false,
      isPinned: false,
      status: 'active'
    },
    {
      id: '22',
      author: {
        id: 'user_22',
        name: '김동현',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        verified: false,
        location: 'Baguio'
      },
      category: 'travel',
      title: '바기오 딸기 농장 투어 추천',
      titleKo: '바기오 딸기 농장 투어 추천',
      titleTl: 'Baguio strawberry farm tour recommendation',
      content: '지난 주말 바기오 딸기 농장 다녀왔는데 너무 좋았어요! La Trinidad 지역 농장들 비교와 가는 방법, 비용 정리했습니다.',
      contentKo: '지난 주말 바기오 딸기 농장 다녀왔는데 너무 좋았어요! La Trinidad 지역 농장들 비교와 가는 방법, 비용 정리했습니다.',
      contentTl: 'Went to Baguio strawberry farms last weekend, it was great! Compared La Trinidad area farms, directions, and costs.',
      images: ['https://images.unsplash.com/photo-1543528176-61b239494933?w=500&h=300&fit=crop'],
      tags: ['바기오', '딸기농장', '여행', '주말여행'],
      likes: 156,
      comments: 67,
      shares: 34,
      views: 890,
      createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: false,
      isBookmarked: true,
      isPinned: false,
      status: 'active'
    },
    {
      id: '23',
      author: {
        id: 'user_23',
        name: '박서준',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face',
        verified: true,
        location: 'Antipolo'
      },
      category: 'events',
      title: '[공지] 한인회 연말 파티',
      titleKo: '[공지] 한인회 연말 파티',
      titleTl: '[Notice] Korean Association Year-end Party',
      content: '2023년 한인회 연말 파티를 12월 15일 토요일에 개최합니다. 장소: Antipolo Beehive Events Place. 회비: 1,000페소 (어린이 무료)',
      contentKo: '2023년 한인회 연말 파티를 12월 15일 토요일에 개최합니다. 장소: Antipolo Beehive Events Place. 회비: 1,000페소 (어린이 무료)',
      contentTl: '2023 Korean Association year-end party on December 15, Saturday. Venue: Antipolo Beehive Events Place. Fee: ₱1,000 (kids free)',
      images: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&h=300&fit=crop'],
      tags: ['한인회', '연말파티', '공지', '이벤트'],
      likes: 234,
      comments: 123,
      shares: 56,
      views: 1567,
      createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: true,
      isBookmarked: true,
      isPinned: true,
      status: 'active'
    },
    {
      id: '24',
      author: {
        id: 'user_24',
        name: '한지민',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
        verified: false,
        location: 'Marikina'
      },
      category: 'marketplace',
      title: '한국 책 무료 나눔',
      titleKo: '한국 책 무료 나눔',
      titleTl: 'Korean books free giveaway',
      content: '이사 정리하면서 한국 책들 무료로 나눔합니다. 소설, 자기계발서, 아동도서 등 약 50권 있어요. 마리키나 픽업만 가능!',
      contentKo: '이사 정리하면서 한국 책들 무료로 나눔합니다. 소설, 자기계발서, 아동도서 등 약 50권 있어요. 마리키나 픽업만 가능!',
      contentTl: 'Giving away Korean books while moving. Novels, self-help, children\'s books about 50 books. Marikina pickup only!',
      images: [],
      tags: ['무료나눔', '한국책', '이사', '마리키나'],
      likes: 89,
      comments: 45,
      shares: 23,
      views: 456,
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: false,
      isBookmarked: false,
      isPinned: false,
      status: 'active'
    },
    {
      id: '25',
      author: {
        id: 'user_25',
        name: '이동욱',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        verified: true,
        location: 'Greenhills'
      },
      category: 'jobs',
      title: '한국어 과외 선생님 구합니다',
      titleKo: '한국어 과외 선생님 구합니다',
      titleTl: 'Looking for Korean language tutor',
      content: '필리핀 아내가 한국어를 배우고 싶어해서 과외 선생님을 찾습니다. 주 2회, 회당 2시간, 시급 800페소. Greenhills 지역입니다.',
      contentKo: '필리핀 아내가 한국어를 배우고 싶어해서 과외 선생님을 찾습니다. 주 2회, 회당 2시간, 시급 800페소. Greenhills 지역입니다.',
      contentTl: 'Filipino wife wants to learn Korean, looking for tutor. 2x/week, 2hrs/session, ₱800/hour. Greenhills area.',
      images: [],
      tags: ['한국어', '과외', '선생님', 'Greenhills'],
      likes: 56,
      comments: 34,
      shares: 12,
      views: 345,
      createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: false,
      isBookmarked: false,
      isPinned: false,
      status: 'active'
    },
    {
      id: '26',
      author: {
        id: 'user_26',
        name: '김하늘',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
        verified: false,
        location: 'Pasay'
      },
      category: 'questions',
      title: 'SSS 가입 방법 문의',
      titleKo: 'SSS 가입 방법 문의',
      titleTl: 'SSS registration inquiry',
      content: '프리랜서로 일하고 있는데 SSS 가입을 하려고 합니다. 외국인도 가입 가능한가요? 필요 서류와 절차를 알려주세요.',
      contentKo: '프리랜서로 일하고 있는데 SSS 가입을 하려고 합니다. 외국인도 가입 가능한가요? 필요 서류와 절차를 알려주세요.',
      contentTl: 'Working as freelancer and want to register for SSS. Can foreigners join? Please share required documents and process.',
      images: [],
      tags: ['SSS', '프리랜서', '가입', '외국인'],
      likes: 34,
      comments: 56,
      shares: 8,
      views: 234,
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: false,
      isBookmarked: true,
      isPinned: false,
      status: 'active'
    },
    {
      id: '27',
      author: {
        id: 'user_27',
        name: '정우성',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        verified: true,
        location: 'Nuvali'
      },
      category: 'life',
      title: '누발리 국제학교 비교 분석',
      titleKo: '누발리 국제학교 비교 분석',
      titleTl: 'Nuvali international schools comparison',
      content: '누발리 지역 국제학교 3곳을 직접 방문하고 비교 분석했습니다. Brent, Beacon, Xavier 학교의 커리큘럼, 학비, 시설 등을 정리했어요.',
      contentKo: '누발리 지역 국제학교 3곳을 직접 방문하고 비교 분석했습니다. Brent, Beacon, Xavier 학교의 커리큘럼, 학비, 시설 등을 정리했어요.',
      contentTl: 'Visited and compared 3 international schools in Nuvali area. Summarized curriculum, tuition, facilities of Brent, Beacon, Xavier.',
      images: ['https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&h=300&fit=crop'],
      tags: ['누발리', '국제학교', '교육', '비교'],
      likes: 456,
      comments: 234,
      shares: 123,
      views: 3456,
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 115 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: true,
      isBookmarked: true,
      isPinned: false,
      status: 'active'
    },
    {
      id: '28',
      author: {
        id: 'user_28',
        name: '이나영',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        verified: false,
        location: 'El Nido'
      },
      category: 'travel',
      title: '엘니도 4박5일 여행 코스',
      titleKo: '엘니도 4박5일 여행 코스',
      titleTl: 'El Nido 5 days 4 nights itinerary',
      content: '엘니도 다녀온 후기입니다. 투어 A,B,C,D 전부 다녀봤고, 숨은 맛집과 저렴한 숙소 정보까지 모두 공유해드려요!',
      contentKo: '엘니도 다녀온 후기입니다. 투어 A,B,C,D 전부 다녀봤고, 숨은 맛집과 저렴한 숙소 정보까지 모두 공유해드려요!',
      contentTl: 'El Nido trip review. Did all tours A,B,C,D, sharing hidden restaurants and budget accommodation info!',
      images: ['https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=500&h=300&fit=crop'],
      tags: ['엘니도', '여행', '팔라완', '여행코스'],
      likes: 678,
      comments: 345,
      shares: 234,
      views: 4567,
      createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 145 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: false,
      isBookmarked: true,
      isPinned: false,
      status: 'active'
    },
    {
      id: '29',
      author: {
        id: 'user_29',
        name: '조인성',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        verified: true,
        location: 'Cavite'
      },
      category: 'business',
      title: '카비테 공장 운영 5년 경험담',
      titleKo: '카비테 공장 운영 5년 경험담',
      titleTl: 'Cavite factory operation 5 years experience',
      content: '카비테에서 소규모 제조업체를 운영한 경험을 공유합니다. PEZA 등록, 인력 관리, 세무 처리 등 실무적인 내용 위주로 정리했습니다.',
      contentKo: '카비테에서 소규모 제조업체를 운영한 경험을 공유합니다. PEZA 등록, 인력 관리, 세무 처리 등 실무적인 내용 위주로 정리했습니다.',
      contentTl: 'Sharing experience running small manufacturing in Cavite. Focused on practical matters like PEZA registration, HR, tax processing.',
      images: ['https://images.unsplash.com/photo-1565982238447-5dac87ca9a59?w=500&h=300&fit=crop'],
      tags: ['카비테', '공장', '제조업', 'PEZA'],
      likes: 345,
      comments: 178,
      shares: 89,
      views: 2345,
      createdAt: new Date(Date.now() - 250 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: false,
      isBookmarked: false,
      isPinned: false,
      status: 'active'
    },
    {
      id: '30',
      author: {
        id: 'user_30',
        name: '김지은',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
        verified: false,
        location: 'Iloilo'
      },
      category: 'life',
      title: '일로일로 이주 1년차 솔직 후기',
      titleKo: '일로일로 이주 1년차 솔직 후기',
      titleTl: 'Iloilo 1 year living honest review',
      content: '마닐라에서 일로일로로 이주한지 1년이 되었네요. 생활비, 교통, 교육, 의료 등 전반적인 생활을 마닐라와 비교해봤습니다.',
      contentKo: '마닐라에서 일로일로로 이주한지 1년이 되었네요. 생활비, 교통, 교육, 의료 등 전반적인 생활을 마닐라와 비교해봤습니다.',
      contentTl: 'It\'s been 1 year since moving from Manila to Iloilo. Compared overall life including cost, transport, education, healthcare.',
      images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=500&h=300&fit=crop'],
      tags: ['일로일로', '이주', '생활', '비교'],
      likes: 234,
      comments: 123,
      shares: 56,
      views: 1890,
      createdAt: new Date(Date.now() - 280 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 275 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: true,
      isBookmarked: false,
      isPinned: false,
      status: 'active'
    },
    
    // 1년 이상 오래된 게시글들
    {
      id: '31',
      author: {
        id: 'user_31',
        name: '박준혁',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face',
        verified: true,
        location: 'General Santos'
      },
      category: 'business',
      title: '제너럴 산토스 참치 사업 진출기',
      titleKo: '제너럴 산토스 참치 사업 진출기',
      titleTl: 'General Santos tuna business entry',
      content: '참치의 도시 제너럴 산토스에서 수산물 무역을 시작한 경험담입니다. 현지 파트너 찾기부터 수출 절차까지 상세히 공유합니다.',
      contentKo: '참치의 도시 제너럴 산토스에서 수산물 무역을 시작한 경험담입니다. 현지 파트너 찾기부터 수출 절차까지 상세히 공유합니다.',
      contentTl: 'Experience starting seafood trade in tuna capital General Santos. Sharing details from finding local partners to export procedures.',
      images: ['https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&h=300&fit=crop'],
      tags: ['제너럴산토스', '참치', '수산업', '무역'],
      likes: 567,
      comments: 289,
      shares: 145,
      views: 4567,
      createdAt: new Date(Date.now() - 450 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 440 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: false,
      isBookmarked: true,
      isPinned: false,
      status: 'active'
    },
    {
      id: '32',
      author: {
        id: 'user_32',
        name: '최수정',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
        verified: false,
        location: 'Zamboanga'
      },
      category: 'life',
      title: '잠보앙가 생활의 현실',
      titleKo: '잠보앙가 생활의 현실',
      titleTl: 'Reality of living in Zamboanga',
      content: '민다나오 잠보앙가에서 2년간 살면서 느낀 점들입니다. 치안, 할랄 문화, 현지인들과의 관계 등 솔직한 경험담을 나눕니다.',
      contentKo: '민다나오 잠보앙가에서 2년간 살면서 느낀 점들입니다. 치안, 할랄 문화, 현지인들과의 관계 등 솔직한 경험담을 나눕니다.',
      contentTl: 'Thoughts from living 2 years in Zamboanga, Mindanao. Sharing honest experiences about security, halal culture, local relationships.',
      images: [],
      tags: ['잠보앙가', '민다나오', '생활', '문화'],
      likes: 345,
      comments: 234,
      shares: 78,
      views: 3456,
      createdAt: new Date(Date.now() - 500 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 495 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: false,
      isBookmarked: false,
      isPinned: false,
      status: 'active'
    },
    {
      id: '33',
      author: {
        id: 'user_33',
        name: '강동원',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        verified: true,
        location: 'Puerto Princesa'
      },
      category: 'travel',
      title: '팔라완 지하강 투어 완벽 가이드',
      titleKo: '팔라완 지하강 투어 완벽 가이드',
      titleTl: 'Palawan Underground River tour complete guide',
      content: '유네스코 세계자연유산 팔라완 지하강 투어를 다녀왔습니다. 예약 방법, 최적 시기, 준비물, 주의사항 등을 상세히 정리했어요.',
      contentKo: '유네스코 세계자연유산 팔라완 지하강 투어를 다녀왔습니다. 예약 방법, 최적 시기, 준비물, 주의사항 등을 상세히 정리했어요.',
      contentTl: 'Visited UNESCO World Heritage Palawan Underground River. Detailed booking method, best time, what to bring, precautions.',
      images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop'],
      tags: ['팔라완', '지하강', '유네스코', '투어'],
      likes: 890,
      comments: 456,
      shares: 345,
      views: 6789,
      createdAt: new Date(Date.now() - 520 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 515 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: true,
      isBookmarked: true,
      isPinned: false,
      status: 'active'
    },
    {
      id: '34',
      author: {
        id: 'user_34',
        name: '김수현',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        verified: false,
        location: 'Boracay'
      },
      category: 'business',
      title: '보라카이 레스토랑 창업 실패담',
      titleKo: '보라카이 레스토랑 창업 실패담',
      titleTl: 'Boracay restaurant business failure story',
      content: '보라카이에서 한식당을 운영하다 실패한 경험을 공유합니다. 같은 실수를 반복하지 않도록 실패 원인을 분석했습니다.',
      contentKo: '보라카이에서 한식당을 운영하다 실패한 경험을 공유합니다. 같은 실수를 반복하지 않도록 실패 원인을 분석했습니다.',
      contentTl: 'Sharing experience of failed Korean restaurant in Boracay. Analyzed failure reasons to help others avoid same mistakes.',
      images: [],
      tags: ['보라카이', '창업', '실패', '레스토랑'],
      likes: 456,
      comments: 267,
      shares: 123,
      views: 3456,
      createdAt: new Date(Date.now() - 600 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 595 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: false,
      isBookmarked: false,
      isPinned: false,
      status: 'active'
    },
    {
      id: '35',
      author: {
        id: 'user_35',
        name: '이민호',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        verified: true,
        location: 'Cagayan de Oro'
      },
      category: 'life',
      title: '카가얀데오로 한인 정착기',
      titleKo: '카가얀데오로 한인 정착기',
      titleTl: 'Korean settlement in Cagayan de Oro',
      content: '북부 민다나오의 관문 도시 CDO에 정착한지 3년. 이곳의 장단점과 한인 커뮤니티 현황을 소개합니다.',
      contentKo: '북부 민다나오의 관문 도시 CDO에 정착한지 3년. 이곳의 장단점과 한인 커뮤니티 현황을 소개합니다.',
      contentTl: 'Settled in CDO, gateway to Northern Mindanao for 3 years. Introducing pros/cons and Korean community status.',
      images: ['https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=500&h=300&fit=crop'],
      tags: ['카가얀데오로', 'CDO', '정착', '민다나오'],
      likes: 234,
      comments: 145,
      shares: 67,
      views: 2345,
      createdAt: new Date(Date.now() - 650 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 640 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: true,
      isBookmarked: false,
      isPinned: false,
      status: 'active'
    },
    
    // 2년 전 역사적 게시글
    {
      id: '36',
      author: {
        id: 'user_36',
        name: '정해인',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face',
        verified: true,
        location: 'Manila'
      },
      category: 'life',
      title: '[필독] 코로나 시대 필리핀 생활 가이드',
      titleKo: '[필독] 코로나 시대 필리핀 생활 가이드',
      titleTl: '[Must Read] Philippines life guide during COVID',
      content: '팬데믹 기간 동안 필리핀에서 살아남기. 격리 규정, 백신 접종, 여행 제한 등 꼭 알아야 할 정보들을 총정리했습니다.',
      contentKo: '팬데믹 기간 동안 필리핀에서 살아남기. 격리 규정, 백신 접종, 여행 제한 등 꼭 알아야 할 정보들을 총정리했습니다.',
      contentTl: 'Surviving in the Philippines during pandemic. Compiled must-know info on quarantine rules, vaccination, travel restrictions.',
      images: [],
      tags: ['코로나', '팬데믹', '생활가이드', '필독'],
      likes: 3456,
      comments: 1890,
      shares: 1234,
      views: 34567,
      createdAt: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 700 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: true,
      isBookmarked: true,
      isPinned: false,
      status: 'active'
    }
  ];

  let filteredPosts = allPosts;

  // 카테고리 필터링
  if (params.category !== 'all') {
    filteredPosts = filteredPosts.filter(post => post.category === params.category);
  }

  // 검색 필터링
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  // 정렬
  switch (params.sort) {
    case 'popular':
      filteredPosts.sort((a, b) => (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares));
      break;
    case 'oldest':
      filteredPosts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case 'most_commented':
      filteredPosts.sort((a, b) => b.comments - a.comments);
      break;
    default: // latest
      filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // 페이징
  const startIndex = (params.page - 1) * params.limit;
  const endIndex = startIndex + params.limit;
  
  return filteredPosts.slice(startIndex, endIndex);
}

async function getTotalPostsCount(category: string, search: string): Promise<number> {
  // 실제 환경에서는 데이터베이스 카운트 쿼리
  // 현재는 모의 데이터 기준
  let total = 36; // 전체 게시글 수

  if (category !== 'all') {
    // 카테고리별 개수 (실제 카운트)
    const categoryCounts: Record<string, number> = {
      housing: 2,
      jobs: 3,
      events: 2,
      help: 3,
      marketplace: 3,
      life: 9,
      questions: 3,
      business: 5,
      travel: 3,
      social: 1
    };
    total = categoryCounts[category] || 0;
  }

  if (search) {
    // 검색 결과에 따른 개수 조정 (실제로는 검색 쿼리 실행)
    total = Math.floor(total * 0.7); // 예시로 70% 정도 반환
  }

  return total;
}

async function createCommunityPost(data: {
  authorId: string;
  title: string;
  titleKo: string;
  titleTl: string;
  content: string;
  contentKo: string;
  contentTl: string;
  category: string;
  tags: string[];
  images: string[];
}): Promise<CommunityPost> {
  // 실제 환경에서는 데이터베이스에 저장
  // 현재는 모의 데이터 반환
  
  const now = new Date().toISOString();
  
  return {
    id: 'post_' + Date.now(),
    author: {
      id: data.authorId,
      name: 'New User',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      verified: false,
      location: 'Philippines'
    },
    category: data.category,
    title: data.title,
    titleKo: data.titleKo,
    titleTl: data.titleTl,
    content: data.content,
    contentKo: data.contentKo,
    contentTl: data.contentTl,
    images: data.images,
    tags: data.tags,
    likes: 0,
    comments: 0,
    shares: 0,
    views: 0,
    createdAt: now,
    updatedAt: now,
    isLiked: false,
    isBookmarked: false,
    isPinned: false,
    status: 'active'
  };
}