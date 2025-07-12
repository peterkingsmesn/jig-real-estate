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
      totalJobs: number;
      featuredJobs: number;
      urgentJobs: number;
      remoteJobs: number;
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

interface Job {
  id: string;
  title: string;
  titleKo: string;
  titleTl: string;
  company: {
    id: string;
    name: string;
    logo: string;
    verified: boolean;
    size: string;
    industry: string;
    location: string;
  };
  location: string;
  jobType: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'remote' | 'internship';
  salaryRange: {
    min: number;
    max: number;
    currency: string;
    period: 'monthly' | 'yearly' | 'hourly';
  };
  experienceLevel: 'entry' | 'junior' | 'mid' | 'senior' | 'lead';
  description: string;
  descriptionKo: string;
  descriptionTl: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  skills: string[];
  category: string;
  subcategory: string;
  applicationDeadline: string;
  startDate: string;
  postedDate: string;
  updatedDate: string;
  views: number;
  applications: number;
  isUrgent: boolean;
  isFeatured: boolean;
  isRemote: boolean;
  applicationMethod: {
    type: 'email' | 'website' | 'platform';
    value: string;
  };
  contactInfo: {
    email?: string;
    phone?: string;
    website?: string;
  };
  workingHours: {
    schedule: string;
    flexible: boolean;
  };
  status: 'active' | 'paused' | 'closed' | 'draft';
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
        return await handleGetJobs(req, res);
      case 'POST':
        return await handleCreateJob(req, res);
      default:
        return res.status(405).json({
          success: false,
          error: {
            code: 'METHOD_NOT_ALLOWED',
            message: 'Method not allowed'
          },
          timestamp: new Date().toISOString(),
          path: req.url || '/api/jobs'
        } as ApiErrorResponse);
    }
  } catch (error) {
    console.error('Jobs API error:', error);
    
    return res.status(500).json({
      success: false,
      error: {
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: 'Failed to process request'
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/jobs'
    } as ApiErrorResponse);
  }
}

async function handleGetJobs(req: NextApiRequest, res: NextApiResponse) {
  const { 
    page = '1', 
    limit = '20', 
    jobType = 'all',
    location = '',
    experienceLevel = 'all',
    salaryMin = '',
    salaryMax = '',
    category = 'all',
    search = '',
    sort = 'latest',
    featured = 'false',
    remote = 'false'
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
      path: req.url || '/api/jobs'
    } as ApiErrorResponse);
  }

  const jobs = await getJobs({
    page: pageNum,
    limit: limitNum,
    jobType: jobType as string,
    location: location as string,
    experienceLevel: experienceLevel as string,
    salaryMin: salaryMin ? parseInt(salaryMin as string) : undefined,
    salaryMax: salaryMax ? parseInt(salaryMax as string) : undefined,
    category: category as string,
    search: search as string,
    sort: sort as string,
    featured: featured === 'true',
    remote: remote === 'true'
  });

  const { total, stats } = await getJobsStats({
    jobType: jobType as string,
    location: location as string,
    experienceLevel: experienceLevel as string,
    category: category as string,
    search: search as string
  });

  res.status(200).json({
    success: true,
    data: jobs,
    message: 'Jobs retrieved successfully',
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      hasNext: (pageNum * limitNum) < total,
      hasPrev: pageNum > 1,
      filters: stats
    }
  } as ApiResponse<Job[]>);
}

async function handleCreateJob(req: NextApiRequest, res: NextApiResponse) {
  const {
    title,
    titleKo,
    titleTl,
    companyId,
    location,
    jobType,
    salaryRange,
    experienceLevel,
    description,
    descriptionKo,
    descriptionTl,
    requirements,
    responsibilities,
    benefits,
    skills,
    category,
    subcategory,
    applicationDeadline,
    startDate,
    applicationMethod,
    contactInfo,
    workingHours
  } = req.body;

  // 기본 검증
  if (!title || !companyId || !location || !jobType || !description || !requirements) {
    return res.status(400).json({
      success: false,
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Required fields missing: title, companyId, location, jobType, description, requirements'
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/jobs'
    } as ApiErrorResponse);
  }

  // 실제 환경에서는 JWT 토큰에서 사용자 정보 추출하여 권한 확인
  const mockUserId = 'user_' + Date.now();
  
  const newJob = await createJob({
    createdBy: mockUserId,
    title,
    titleKo: titleKo || title,
    titleTl: titleTl || title,
    companyId,
    location,
    jobType,
    salaryRange,
    experienceLevel: experienceLevel || 'mid',
    description,
    descriptionKo: descriptionKo || description,
    descriptionTl: descriptionTl || description,
    requirements,
    responsibilities: responsibilities || [],
    benefits: benefits || [],
    skills: skills || [],
    category: category || 'other',
    subcategory: subcategory || '',
    applicationDeadline,
    startDate,
    applicationMethod,
    contactInfo: contactInfo || {},
    workingHours: workingHours || { schedule: '9AM-6PM', flexible: false }
  });

  res.status(201).json({
    success: true,
    data: newJob,
    message: 'Job created successfully'
  } as ApiResponse<Job>);
}

async function getJobs(params: {
  page: number;
  limit: number;
  jobType: string;
  location: string;
  experienceLevel: string;
  salaryMin?: number;
  salaryMax?: number;
  category: string;
  search: string;
  sort: string;
  featured: boolean;
  remote: boolean;
}): Promise<Job[]> {
  // 실제 환경에서는 데이터베이스 쿼리
  // 현재는 모의 데이터 반환
  
  const allJobs: Job[] = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      titleKo: '시니어 소프트웨어 엔지니어',
      titleTl: 'Senior Software Engineer',
      company: {
        id: 'company_1',
        name: 'Globe Telecom',
        logo: '🌍',
        verified: true,
        size: '10,000+',
        industry: 'Telecommunications',
        location: 'Taguig City'
      },
      location: 'BGC, Taguig',
      jobType: 'full-time',
      salaryRange: {
        min: 60000,
        max: 90000,
        currency: 'PHP',
        period: 'monthly'
      },
      experienceLevel: 'senior',
      description: 'We are looking for an experienced Senior Software Engineer to join our digital transformation team. You will be responsible for designing and developing scalable applications that serve millions of users.',
      descriptionKo: '저희 디지털 혁신 팀에 합류할 경험이 풍부한 시니어 소프트웨어 엔지니어를 찾고 있습니다. 수백만 명의 사용자에게 서비스를 제공하는 확장 가능한 애플리케이션을 설계하고 개발하는 업무를 담당하게 됩니다.',
      descriptionTl: 'Naghahanap kami ng experienced Senior Software Engineer na sasama sa aming digital transformation team. Maging responsible ka sa pag-design at development ng scalable applications na magse-serve sa millions ng users.',
      requirements: [
        '5+ years of software development experience',
        'Proficiency in JavaScript, React, Node.js',
        'Experience with cloud platforms (AWS, Azure)',
        'Strong English communication skills',
        'Bachelor\'s degree in Computer Science or related field'
      ],
      responsibilities: [
        'Design and develop high-quality software solutions',
        'Lead technical discussions and code reviews',
        'Mentor junior developers',
        'Collaborate with cross-functional teams',
        'Ensure application performance and scalability'
      ],
      benefits: [
        'Health and dental insurance',
        '13th month pay',
        'Performance bonuses',
        'Flexible working hours',
        'Professional development budget',
        'Stock options'
      ],
      skills: ['JavaScript', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'TypeScript', 'PostgreSQL'],
      category: 'technology',
      subcategory: 'software-development',
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      views: 1245,
      applications: 23,
      isUrgent: false,
      isFeatured: true,
      isRemote: false,
      applicationMethod: {
        type: 'email',
        value: 'careers@globe.com.ph'
      },
      contactInfo: {
        email: 'careers@globe.com.ph',
        website: 'https://careers.globe.com.ph'
      },
      workingHours: {
        schedule: '9AM-6PM',
        flexible: true
      },
      status: 'active'
    },
    {
      id: '2',
      title: 'Customer Service Representative',
      titleKo: '고객서비스 상담원',
      titleTl: 'Customer Service Representative',
      company: {
        id: 'company_2',
        name: 'Concentrix',
        logo: '🎧',
        verified: true,
        size: '1,000-5,000',
        industry: 'Business Process Outsourcing',
        location: 'Multiple Locations'
      },
      location: 'Alabang, Muntinlupa',
      jobType: 'full-time',
      salaryRange: {
        min: 18000,
        max: 25000,
        currency: 'PHP',
        period: 'monthly'
      },
      experienceLevel: 'entry',
      description: 'Join our international customer service team supporting US and UK clients. We provide comprehensive training and career advancement opportunities in a dynamic BPO environment.',
      descriptionKo: '미국과 영국 고객을 지원하는 국제 고객 서비스 팀에 합류하세요. 역동적인 BPO 환경에서 포괄적인 교육과 경력 발전 기회를 제공합니다.',
      descriptionTl: 'Sumama sa aming international customer service team na sumusuporta sa US at UK clients. Nagbibigay kami ng comprehensive training at career advancement opportunities sa dynamic BPO environment.',
      requirements: [
        'High school diploma or equivalent',
        'Excellent English communication skills',
        'Basic computer skills',
        'Willing to work shifting schedules',
        'Customer service orientation'
      ],
      responsibilities: [
        'Handle customer inquiries via phone, email, and chat',
        'Resolve customer issues efficiently',
        'Maintain accurate customer records',
        'Follow company policies and procedures',
        'Meet performance targets and KPIs'
      ],
      benefits: [
        'Health insurance',
        'Night differential',
        'Transportation allowance',
        'Meal subsidies',
        '13th month pay',
        'Career development programs'
      ],
      skills: ['Customer Service', 'English Communication', 'Problem Solving', 'Computer Literacy', 'Multi-tasking'],
      category: 'customer-service',
      subcategory: 'call-center',
      applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      views: 2341,
      applications: 67,
      isUrgent: true,
      isFeatured: false,
      isRemote: false,
      applicationMethod: {
        type: 'website',
        value: 'https://careers.concentrix.com'
      },
      contactInfo: {
        email: 'recruitment@concentrix.com',
        phone: '(02) 8888-1234',
        website: 'https://careers.concentrix.com'
      },
      workingHours: {
        schedule: 'Shifting (24/7)',
        flexible: false
      },
      status: 'active'
    },
    {
      id: '3',
      title: 'Digital Marketing Specialist',
      titleKo: '디지털 마케팅 전문가',
      titleTl: 'Digital Marketing Specialist',
      company: {
        id: 'company_3',
        name: 'Shopee Philippines',
        logo: '🛒',
        verified: true,
        size: '1,000-5,000',
        industry: 'E-commerce',
        location: 'Pasig City'
      },
      location: 'Pasig City',
      jobType: 'full-time',
      salaryRange: {
        min: 35000,
        max: 50000,
        currency: 'PHP',
        period: 'monthly'
      },
      experienceLevel: 'mid',
      description: 'We are seeking a creative and data-driven Digital Marketing Specialist to develop and execute marketing campaigns that drive user acquisition and engagement on our e-commerce platform.',
      descriptionKo: '저희 전자상거래 플랫폼에서 사용자 확보와 참여를 유도하는 마케팅 캠페인을 개발하고 실행할 창의적이고 데이터 중심적인 디지털 마케팅 전문가를 찾고 있습니다.',
      descriptionTl: 'Naghahanap kami ng creative at data-driven Digital Marketing Specialist na mag-develop at mag-execute ng marketing campaigns na mag-drive ng user acquisition at engagement sa aming e-commerce platform.',
      requirements: [
        '3+ years digital marketing experience',
        'Experience with Google Ads, Facebook Ads',
        'Strong analytical skills',
        'E-commerce experience preferred',
        'Bachelor\'s degree in Marketing or related field'
      ],
      responsibilities: [
        'Develop and execute digital marketing strategies',
        'Manage paid advertising campaigns',
        'Analyze campaign performance and ROI',
        'Create engaging content for social media',
        'Collaborate with creative and product teams'
      ],
      benefits: [
        'Competitive salary',
        'Health insurance',
        'Flexible working arrangements',
        'Professional development opportunities',
        'Employee discounts',
        'Team building events'
      ],
      skills: ['Digital Marketing', 'Google Ads', 'Facebook Ads', 'SEO', 'Analytics', 'Content Creation', 'Social Media'],
      category: 'marketing',
      subcategory: 'digital-marketing',
      applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      views: 987,
      applications: 41,
      isUrgent: false,
      isFeatured: true,
      isRemote: false,
      applicationMethod: {
        type: 'platform',
        value: 'internal-application-system'
      },
      contactInfo: {
        email: 'careers@shopee.ph'
      },
      workingHours: {
        schedule: '9AM-6PM',
        flexible: true
      },
      status: 'active'
    },
    {
      id: '4',
      title: 'Remote Web Developer',
      titleKo: '원격 웹 개발자',
      titleTl: 'Remote Web Developer',
      company: {
        id: 'company_4',
        name: 'Thinking Machines',
        logo: '💻',
        verified: true,
        size: '100-500',
        industry: 'Technology',
        location: 'Remote'
      },
      location: 'Remote (Philippines)',
      jobType: 'remote',
      salaryRange: {
        min: 50000,
        max: 80000,
        currency: 'PHP',
        period: 'monthly'
      },
      experienceLevel: 'senior',
      description: 'Work remotely on cutting-edge web applications for international clients. We are a data science and AI company looking for a skilled web developer to join our remote team.',
      descriptionKo: '국제 고객을 위한 최첨단 웹 애플리케이션을 원격으로 개발하세요. 저희는 데이터 사이언스 및 AI 회사로, 숙련된 웹 개발자가 저희 원격 팀에 합류하기를 원합니다.',
      descriptionTl: 'Mag-work remotely sa cutting-edge web applications para sa international clients. Kami ay data science at AI company na naghahanap ng skilled web developer na sasama sa aming remote team.',
      requirements: [
        '5+ years web development experience',
        'Proficiency in Python, Django, React',
        'Experience with remote work',
        'Strong problem-solving skills',
        'Excellent English communication'
      ],
      responsibilities: [
        'Develop and maintain web applications',
        'Collaborate with data scientists and designers',
        'Implement responsive and accessible interfaces',
        'Optimize application performance',
        'Participate in code reviews and technical discussions'
      ],
      benefits: [
        'Fully remote work',
        'Flexible working hours',
        'Health insurance',
        'Equipment allowance',
        'Professional development budget',
        'Annual team retreats'
      ],
      skills: ['Python', 'Django', 'React', 'JavaScript', 'PostgreSQL', 'AWS', 'Git', 'REST APIs'],
      category: 'technology',
      subcategory: 'web-development',
      applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      startDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
      postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      views: 678,
      applications: 15,
      isUrgent: false,
      isFeatured: false,
      isRemote: true,
      applicationMethod: {
        type: 'email',
        value: 'careers@thinkingmachin.es'
      },
      contactInfo: {
        email: 'careers@thinkingmachin.es',
        website: 'https://thinkingmachin.es/careers'
      },
      workingHours: {
        schedule: 'Flexible',
        flexible: true
      },
      status: 'active'
    },
    {
      id: '5',
      title: 'Marketing Assistant (Part-time)',
      titleKo: '마케팅 어시스턴트 (파트타임)',
      titleTl: 'Marketing Assistant (Part-time)',
      company: {
        id: 'company_5',
        name: 'Jollibee Foods Corporation',
        logo: '🍔',
        verified: false,
        size: '10,000+',
        industry: 'Food & Beverage',
        location: 'Ortigas'
      },
      location: 'Ortigas, Pasig',
      jobType: 'part-time',
      salaryRange: {
        min: 15000,
        max: 20000,
        currency: 'PHP',
        period: 'monthly'
      },
      experienceLevel: 'entry',
      description: 'Support our marketing team with campaign execution, social media management, and brand promotion activities. Perfect for students or career changers looking to gain marketing experience.',
      descriptionKo: '캠페인 실행, 소셜 미디어 관리, 브랜드 프로모션 활동으로 마케팅 팀을 지원하세요. 마케팅 경험을 쌓고자 하는 학생이나 경력 전환자에게 완벽합니다.',
      descriptionTl: 'Suportahan ang aming marketing team sa campaign execution, social media management, at brand promotion activities. Perfect para sa mga students o career changers na gustong makakuha ng marketing experience.',
      requirements: [
        'Fresh graduates welcome',
        'Social media savvy',
        'Creative mindset',
        'Basic graphic design skills preferred',
        'Flexible schedule availability'
      ],
      responsibilities: [
        'Assist in campaign planning and execution',
        'Manage social media accounts',
        'Create content for marketing materials',
        'Support event coordination',
        'Conduct market research'
      ],
      benefits: [
        'Flexible working hours',
        'Employee meal discounts',
        'Learning and development opportunities',
        'Potential for full-time conversion',
        'Transportation allowance'
      ],
      skills: ['Social Media', 'Content Creation', 'Basic Design', 'Communication', 'Research'],
      category: 'marketing',
      subcategory: 'assistant',
      applicationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      views: 1456,
      applications: 89,
      isUrgent: true,
      isFeatured: false,
      isRemote: false,
      applicationMethod: {
        type: 'email',
        value: 'hr@jfc.com.ph'
      },
      contactInfo: {
        email: 'hr@jfc.com.ph',
        phone: '(02) 8634-1111'
      },
      workingHours: {
        schedule: '4 hours/day, flexible',
        flexible: true
      },
      status: 'active'
    }
  ];

  let filteredJobs = allJobs;

  // 필터링 로직
  if (params.jobType !== 'all') {
    filteredJobs = filteredJobs.filter(job => job.jobType === params.jobType);
  }

  if (params.location) {
    filteredJobs = filteredJobs.filter(job => 
      job.location.toLowerCase().includes(params.location.toLowerCase())
    );
  }

  if (params.experienceLevel !== 'all') {
    filteredJobs = filteredJobs.filter(job => job.experienceLevel === params.experienceLevel);
  }

  if (params.category !== 'all') {
    filteredJobs = filteredJobs.filter(job => job.category === params.category);
  }

  if (params.salaryMin || params.salaryMax) {
    filteredJobs = filteredJobs.filter(job => {
      if (params.salaryMin && job.salaryRange.min < params.salaryMin) return false;
      if (params.salaryMax && job.salaryRange.max > params.salaryMax) return false;
      return true;
    });
  }

  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredJobs = filteredJobs.filter(job => 
      job.title.toLowerCase().includes(searchLower) ||
      job.company.name.toLowerCase().includes(searchLower) ||
      job.description.toLowerCase().includes(searchLower) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchLower))
    );
  }

  if (params.featured) {
    filteredJobs = filteredJobs.filter(job => job.isFeatured);
  }

  if (params.remote) {
    filteredJobs = filteredJobs.filter(job => job.isRemote || job.jobType === 'remote');
  }

  // 정렬
  switch (params.sort) {
    case 'salary_high':
      filteredJobs.sort((a, b) => b.salaryRange.max - a.salaryRange.max);
      break;
    case 'salary_low':
      filteredJobs.sort((a, b) => a.salaryRange.min - b.salaryRange.min);
      break;
    case 'company':
      filteredJobs.sort((a, b) => a.company.name.localeCompare(b.company.name));
      break;
    case 'applications':
      filteredJobs.sort((a, b) => b.applications - a.applications);
      break;
    default: // latest
      filteredJobs.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
  }

  // 페이징
  const startIndex = (params.page - 1) * params.limit;
  const endIndex = startIndex + params.limit;
  
  return filteredJobs.slice(startIndex, endIndex);
}

async function getJobsStats(params: {
  jobType: string;
  location: string;
  experienceLevel: string;
  category: string;
  search: string;
}): Promise<{ total: number; stats: { totalJobs: number; featuredJobs: number; urgentJobs: number; remoteJobs: number; } }> {
  // 실제 환경에서는 데이터베이스 통계 쿼리
  // 현재는 모의 데이터 기준
  
  let total = 5; // 전체 채용공고 수
  
  // 필터에 따른 개수 조정 (실제로는 쿼리로 계산)
  if (params.jobType !== 'all') total = Math.floor(total * 0.8);
  if (params.location) total = Math.floor(total * 0.7);
  if (params.experienceLevel !== 'all') total = Math.floor(total * 0.6);
  if (params.category !== 'all') total = Math.floor(total * 0.5);
  if (params.search) total = Math.floor(total * 0.4);

  return {
    total,
    stats: {
      totalJobs: total,
      featuredJobs: Math.floor(total * 0.4), // 40%가 피처드
      urgentJobs: Math.floor(total * 0.3), // 30%가 긴급
      remoteJobs: Math.floor(total * 0.2) // 20%가 원격
    }
  };
}

async function createJob(data: any): Promise<Job> {
  // 실제 환경에서는 데이터베이스에 저장
  // 현재는 모의 데이터 반환
  
  const now = new Date().toISOString();
  
  return {
    id: 'job_' + Date.now(),
    title: data.title,
    titleKo: data.titleKo,
    titleTl: data.titleTl,
    company: {
      id: data.companyId,
      name: 'New Company',
      logo: '🏢',
      verified: false,
      size: '1-10',
      industry: 'Other',
      location: data.location
    },
    location: data.location,
    jobType: data.jobType,
    salaryRange: data.salaryRange || { min: 20000, max: 30000, currency: 'PHP', period: 'monthly' },
    experienceLevel: data.experienceLevel,
    description: data.description,
    descriptionKo: data.descriptionKo,
    descriptionTl: data.descriptionTl,
    requirements: data.requirements,
    responsibilities: data.responsibilities,
    benefits: data.benefits,
    skills: data.skills,
    category: data.category,
    subcategory: data.subcategory,
    applicationDeadline: data.applicationDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    startDate: data.startDate || new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    postedDate: now,
    updatedDate: now,
    views: 0,
    applications: 0,
    isUrgent: false,
    isFeatured: false,
    isRemote: data.jobType === 'remote',
    applicationMethod: data.applicationMethod,
    contactInfo: data.contactInfo,
    workingHours: data.workingHours,
    status: 'active'
  };
}