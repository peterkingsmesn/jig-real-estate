import { NextApiRequest, NextApiResponse } from 'next';

// API 계약에 따른 표준 응답 형식
interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    relatedJobs: number;
    viewCount: number;
    applicationCount: number;
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

interface JobDetails {
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
    description: string;
    website: string;
    foundedYear: number;
    employees: string;
  };
  location: string;
  jobType: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'remote' | 'internship';
  salaryRange: {
    min: number;
    max: number;
    currency: string;
    period: 'monthly' | 'yearly' | 'hourly';
    negotiable: boolean;
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
    instructions?: string;
  };
  contactInfo: {
    email?: string;
    phone?: string;
    website?: string;
    contactPerson?: string;
  };
  workingHours: {
    schedule: string;
    flexible: boolean;
    overtime: boolean;
  };
  workEnvironment: {
    teamSize: string;
    culture: string[];
    perks: string[];
  };
  careerGrowth: {
    opportunities: string[];
    trainingProvided: boolean;
    mentorship: boolean;
  };
  status: 'active' | 'paused' | 'closed' | 'draft';
  relatedJobs: {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
  }[];
}

// 에러 코드 정의
const ErrorCodes = {
  VALIDATION_ERROR: 'DATA_001',
  INTERNAL_SERVER_ERROR: 'SERVER_001',
  NOT_FOUND: 'DATA_002',
} as const;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Job ID is required'
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/jobs/[id]'
    } as ApiErrorResponse);
  }

  try {
    switch (req.method) {
      case 'GET':
        return await handleGetJobDetails(req, res, id);
      case 'PUT':
        return await handleUpdateJob(req, res, id);
      case 'DELETE':
        return await handleDeleteJob(req, res, id);
      default:
        return res.status(405).json({
          success: false,
          error: {
            code: 'METHOD_NOT_ALLOWED',
            message: 'Method not allowed'
          },
          timestamp: new Date().toISOString(),
          path: req.url || '/api/jobs/[id]'
        } as ApiErrorResponse);
    }
  } catch (error) {
    console.error('Job details API error:', error);
    
    return res.status(500).json({
      success: false,
      error: {
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: 'Failed to process request'
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/jobs/[id]'
    } as ApiErrorResponse);
  }
}

async function handleGetJobDetails(req: NextApiRequest, res: NextApiResponse, jobId: string) {
  const jobDetails = await getJobDetails(jobId);

  if (!jobDetails) {
    return res.status(404).json({
      success: false,
      error: {
        code: ErrorCodes.NOT_FOUND,
        message: 'Job not found',
        details: { jobId }
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/jobs/[id]'
    } as ApiErrorResponse);
  }

  // 조회수 증가
  await incrementJobViews(jobId);

  res.status(200).json({
    success: true,
    data: jobDetails,
    message: 'Job details retrieved successfully',
    meta: {
      relatedJobs: jobDetails.relatedJobs.length,
      viewCount: jobDetails.views + 1,
      applicationCount: jobDetails.applications
    }
  } as ApiResponse<JobDetails>);
}

async function handleUpdateJob(req: NextApiRequest, res: NextApiResponse, jobId: string) {
  // 실제 환경에서는 JWT 토큰으로 권한 확인
  const updatedJob = await updateJob(jobId, req.body);

  if (!updatedJob) {
    return res.status(404).json({
      success: false,
      error: {
        code: ErrorCodes.NOT_FOUND,
        message: 'Job not found'
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/jobs/[id]'
    } as ApiErrorResponse);
  }

  res.status(200).json({
    success: true,
    data: updatedJob,
    message: 'Job updated successfully'
  } as ApiResponse<JobDetails>);
}

async function handleDeleteJob(req: NextApiRequest, res: NextApiResponse, jobId: string) {
  // 실제 환경에서는 JWT 토큰으로 권한 확인
  const deleted = await deleteJob(jobId);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: {
        code: ErrorCodes.NOT_FOUND,
        message: 'Job not found'
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/jobs/[id]'
    } as ApiErrorResponse);
  }

  res.status(200).json({
    success: true,
    data: { deleted: true },
    message: 'Job deleted successfully'
  } as ApiResponse<{ deleted: boolean }>);
}

async function getJobDetails(jobId: string): Promise<JobDetails | null> {
  // 실제 환경에서는 데이터베이스 쿼리
  // 현재는 모의 데이터 반환
  
  const jobsDatabase: Record<string, JobDetails> = {
    '1': {
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
        location: 'Taguig City',
        description: 'Globe Telecom is the leading telecommunications company in the Philippines, providing innovative digital solutions and connectivity services to millions of Filipinos.',
        website: 'https://www.globe.com.ph',
        foundedYear: 1928,
        employees: '10,000+'
      },
      location: 'BGC, Taguig',
      jobType: 'full-time',
      salaryRange: {
        min: 60000,
        max: 90000,
        currency: 'PHP',
        period: 'monthly',
        negotiable: true
      },
      experienceLevel: 'senior',
      description: 'We are looking for an experienced Senior Software Engineer to join our digital transformation team. You will be responsible for designing and developing scalable applications that serve millions of users across the Philippines. This role offers the opportunity to work with cutting-edge technologies and contribute to the digital future of the country.',
      descriptionKo: '저희 디지털 혁신 팀에 합류할 경험이 풍부한 시니어 소프트웨어 엔지니어를 찾고 있습니다. 필리핀 전역의 수백만 명의 사용자에게 서비스를 제공하는 확장 가능한 애플리케이션을 설계하고 개발하는 업무를 담당하게 됩니다. 이 역할은 최첨단 기술을 사용하고 국가의 디지털 미래에 기여할 기회를 제공합니다.',
      descriptionTl: 'Naghahanap kami ng experienced Senior Software Engineer na sasama sa aming digital transformation team. Maging responsible ka sa pag-design at development ng scalable applications na magse-serve sa millions ng users sa buong Pilipinas. Ang role na ito ay nag-offer ng opportunity na mag-work sa cutting-edge technologies at mag-contribute sa digital future ng bansa.',
      requirements: [
        '5+ years of software development experience',
        'Proficiency in JavaScript, React, Node.js',
        'Experience with cloud platforms (AWS, Azure, GCP)',
        'Strong understanding of microservices architecture',
        'Experience with containerization (Docker, Kubernetes)',
        'Knowledge of database design and optimization',
        'Strong English communication skills',
        'Bachelor\'s degree in Computer Science or related field',
        'Experience with agile development methodologies',
        'Familiarity with CI/CD pipelines'
      ],
      responsibilities: [
        'Design and develop high-quality, scalable software solutions',
        'Lead technical discussions and architectural decisions',
        'Conduct thorough code reviews and provide constructive feedback',
        'Mentor junior developers and promote best practices',
        'Collaborate with cross-functional teams including product managers and designers',
        'Ensure application performance, security, and scalability',
        'Participate in technical planning and estimation sessions',
        'Stay updated with latest technology trends and industry best practices',
        'Troubleshoot and resolve complex technical issues',
        'Contribute to technical documentation and knowledge sharing'
      ],
      benefits: [
        'Comprehensive health and dental insurance',
        '13th month pay and performance bonuses',
        'Life and accident insurance',
        'Flexible working hours and hybrid work arrangement',
        'Professional development budget (₱50,000 annually)',
        'Stock options and equity participation',
        'Paid time off and vacation leaves',
        'Employee discounts on Globe services',
        'Gym membership and wellness programs',
        'Team building activities and company events',
        'Latest equipment and technology allowance',
        'Career advancement opportunities'
      ],
      skills: [
        'JavaScript',
        'React',
        'Node.js',
        'TypeScript',
        'AWS',
        'Docker',
        'Kubernetes',
        'PostgreSQL',
        'MongoDB',
        'Redis',
        'GraphQL',
        'REST APIs',
        'Microservices',
        'CI/CD',
        'Git'
      ],
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
        value: 'careers@globe.com.ph',
        instructions: 'Please include your portfolio and cover letter. Mention "Senior Software Engineer - BGC" in the subject line.'
      },
      contactInfo: {
        email: 'careers@globe.com.ph',
        website: 'https://careers.globe.com.ph',
        contactPerson: 'Maria Santos - Tech Recruiter'
      },
      workingHours: {
        schedule: '9:00 AM - 6:00 PM',
        flexible: true,
        overtime: false
      },
      workEnvironment: {
        teamSize: '8-12 developers',
        culture: ['Collaborative', 'Innovation-driven', 'Diverse', 'Fast-paced'],
        perks: ['Modern office space', 'Free snacks and coffee', 'Game room', 'Rooftop garden', 'Standing desks']
      },
      careerGrowth: {
        opportunities: ['Technical Lead', 'Principal Engineer', 'Engineering Manager', 'Solutions Architect'],
        trainingProvided: true,
        mentorship: true
      },
      status: 'active',
      relatedJobs: [
        {
          id: '3',
          title: 'Digital Marketing Specialist',
          company: 'Shopee Philippines',
          location: 'Pasig City',
          salary: '₱35,000-50,000'
        },
        {
          id: '4',
          title: 'Remote Web Developer',
          company: 'Thinking Machines',
          location: 'Remote',
          salary: '₱50,000-80,000'
        },
        {
          id: '6',
          title: 'Frontend Developer',
          company: 'PayMaya',
          location: 'Makati City',
          salary: '₱45,000-70,000'
        }
      ]
    },
    '2': {
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
        location: 'Multiple Locations',
        description: 'Concentrix is a leading global provider of customer engagement services and solutions, helping brands create better experiences for their customers.',
        website: 'https://www.concentrix.com',
        foundedYear: 2009,
        employees: '5,000+'
      },
      location: 'Alabang, Muntinlupa',
      jobType: 'full-time',
      salaryRange: {
        min: 18000,
        max: 25000,
        currency: 'PHP',
        period: 'monthly',
        negotiable: false
      },
      experienceLevel: 'entry',
      description: 'Join our international customer service team supporting US and UK clients. We provide comprehensive training and career advancement opportunities in a dynamic BPO environment. This is an excellent opportunity for fresh graduates to start their career in customer service.',
      descriptionKo: '미국과 영국 고객을 지원하는 국제 고객 서비스 팀에 합류하세요. 역동적인 BPO 환경에서 포괄적인 교육과 경력 발전 기회를 제공합니다. 신입생들이 고객 서비스 분야에서 경력을 시작할 수 있는 훌륭한 기회입니다.',
      descriptionTl: 'Sumama sa aming international customer service team na sumusuporta sa US at UK clients. Nagbibigay kami ng comprehensive training at career advancement opportunities sa dynamic BPO environment. Ito ay excellent opportunity para sa mga fresh graduates na magsimula ng career sa customer service.',
      requirements: [
        'High school diploma or equivalent required',
        'Excellent English communication skills (written and verbal)',
        'Basic computer skills and familiarity with Windows OS',
        'Willing to work shifting schedules including nights and weekends',
        'Customer service orientation and positive attitude',
        'Ability to multitask and work under pressure',
        'No previous experience required - training provided',
        'Must be willing to work in Alabang, Muntinlupa'
      ],
      responsibilities: [
        'Handle customer inquiries via phone, email, and chat',
        'Resolve customer issues efficiently and effectively',
        'Maintain accurate customer records and documentation',
        'Follow company policies and procedures',
        'Meet performance targets and KPIs',
        'Escalate complex issues to supervisors when needed',
        'Participate in team meetings and training sessions',
        'Provide excellent customer experience consistently'
      ],
      benefits: [
        'Comprehensive health insurance for employee and dependents',
        'Night differential pay (10% additional for night shifts)',
        'Transportation allowance',
        'Meal subsidies and free meals during shifts',
        '13th month pay and holiday bonuses',
        'Career development and training programs',
        'Performance incentives and bonuses',
        'Paid vacation and sick leaves',
        'Employee assistance programs',
        'Team building activities and events'
      ],
      skills: [
        'Customer Service',
        'English Communication',
        'Problem Solving',
        'Computer Literacy',
        'Multi-tasking',
        'Patience',
        'Active Listening',
        'Time Management'
      ],
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
        value: 'https://careers.concentrix.com',
        instructions: 'Apply online through our career portal. Please complete the English assessment test.'
      },
      contactInfo: {
        email: 'recruitment@concentrix.com',
        phone: '(02) 8888-1234',
        website: 'https://careers.concentrix.com'
      },
      workingHours: {
        schedule: 'Shifting (24/7 operations)',
        flexible: false,
        overtime: true
      },
      workEnvironment: {
        teamSize: '20-30 agents per team',
        culture: ['Team-oriented', 'Performance-driven', 'Supportive', 'Multicultural'],
        perks: ['Recreation areas', 'Cafeteria', 'Sleeping quarters', 'Prayer room', 'Parking space']
      },
      careerGrowth: {
        opportunities: ['Senior Representative', 'Team Leader', 'Supervisor', 'Quality Analyst', 'Trainer'],
        trainingProvided: true,
        mentorship: true
      },
      status: 'active',
      relatedJobs: [
        {
          id: '7',
          title: 'Virtual Assistant',
          company: 'TaskUs',
          location: 'Pasig City',
          salary: '₱20,000-28,000'
        },
        {
          id: '8',
          title: 'Content Moderator',
          company: 'Accenture',
          location: 'Taguig City',
          salary: '₱22,000-30,000'
        }
      ]
    }
  };

  return jobsDatabase[jobId] || null;
}

async function incrementJobViews(jobId: string): Promise<void> {
  // 실제 환경에서는 데이터베이스 업데이트
  console.log(`Incrementing views for job ${jobId}`);
}

async function updateJob(jobId: string, updateData: any): Promise<JobDetails | null> {
  // 실제 환경에서는 데이터베이스 업데이트
  // 현재는 기존 데이터에 업데이트 적용하여 반환
  const existingJob = await getJobDetails(jobId);
  if (!existingJob) return null;

  return {
    ...existingJob,
    ...updateData,
    updatedDate: new Date().toISOString()
  };
}

async function deleteJob(jobId: string): Promise<boolean> {
  // 실제 환경에서는 데이터베이스에서 삭제 또는 상태 변경
  const existingJob = await getJobDetails(jobId);
  return !!existingJob;
}