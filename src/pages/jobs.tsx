import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import FacebookLayout from '@/components/layout/FacebookLayout';
import SEOHead from '@/components/seo/SEOHead';
import { allPhilippinesRegions } from '@/data/philippinesRegions';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  DollarSign,
  Briefcase,
  Clock,
  Building,
  Users,
  Star,
  Plus,
  SlidersHorizontal,
  ChevronDown,
  Eye,
  Heart,
  Share2,
  TrendingUp
} from 'lucide-react';

interface JobFilters {
  jobType?: string;
  location?: string;
  salary?: { min: number; max: number };
  experience?: string;
  company?: string;
}

export default function JobsPage() {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState('ko');
  const [filters, setFilters] = useState<JobFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeJobType, setActiveJobType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedSalaryRange, setSelectedSalaryRange] = useState('');


  const jobTypes = [
    { id: 'all', name: '전체', nameEn: 'All Jobs', nameTl: 'Lahat ng Trabaho', icon: '💼' },
    { id: 'full-time', name: '정규직', nameEn: 'Full-time', nameTl: 'Full-time', icon: '🏢' },
    { id: 'part-time', name: '파트타임', nameEn: 'Part-time', nameTl: 'Part-time', icon: '⏰' },
    { id: 'freelance', name: '프리랜서', nameEn: 'Freelance', nameTl: 'Freelance', icon: '💻' },
    { id: 'contract', name: '계약직', nameEn: 'Contract', nameTl: 'Kontrata', icon: '📋' },
    { id: 'remote', name: '재택근무', nameEn: 'Remote', nameTl: 'Work from Home', icon: '🏠' },
    { id: 'internship', name: '인턴십', nameEn: 'Internship', nameTl: 'Internship', icon: '🎓' }
  ];

  const experienceLevels = [
    { value: 'all', label: '전체', labelEn: 'All', labelTl: 'Lahat' },
    { value: 'entry', label: '신입', labelEn: 'Entry Level', labelTl: 'Entry Level' },
    { value: 'junior', label: '주니어', labelEn: 'Junior (1-3 years)', labelTl: 'Junior (1-3 taon)' },
    { value: 'mid', label: '중급', labelEn: 'Mid Level (3-5 years)', labelTl: 'Mid Level (3-5 taon)' },
    { value: 'senior', label: '시니어', labelEn: 'Senior (5+ years)', labelTl: 'Senior (5+ taon)' },
    { value: 'lead', label: '리드/매니저', labelEn: 'Lead/Manager', labelTl: 'Lead/Manager' }
  ];

  const salaryRanges = [
    { value: 'all', label: '전체', labelEn: 'All', labelTl: 'Lahat' },
    { value: '15000-25000', label: '₱15,000-25,000', labelEn: '₱15,000-25,000', labelTl: '₱15,000-25,000' },
    { value: '25000-40000', label: '₱25,000-40,000', labelEn: '₱25,000-40,000', labelTl: '₱25,000-40,000' },
    { value: '40000-60000', label: '₱40,000-60,000', labelEn: '₱40,000-60,000', labelTl: '₱40,000-60,000' },
    { value: '60000-100000', label: '₱60,000-100,000', labelEn: '₱60,000-100,000', labelTl: '₱60,000-100,000' },
    { value: '100000+', label: '₱100,000+', labelEn: '₱100,000+', labelTl: '₱100,000+' }
  ];

  // 채용공고 데이터는 API에서 가져올 예정
  const sampleJobs: any[] = [
    {
      id: '1',
      title: '한국어 번역 전문가',
      titleKo: '한국어 번역 전문가',
      company: 'Korea Philippines Corp',
      companyLogo: '🏢',
      location: 'BGC, Taguig',
      salary: '₱40,000-60,000',
      posted: '2일 전',
      description: '한국어-영어 번역 및 통역 업무를 담당할 전문가를 모집합니다.',
      requirements: ['한국어 원어민', '영어 유창', '번역 경험 3년+'],
      jobType: 'full-time',
      experience: 'mid',
      urgent: true,
      verified: true,
      saved: false,
      applications: 12
    },
    {
      id: '2',
      title: '웹 개발자',
      titleKo: '웹 개발자',
      company: 'Tech Solutions PH',
      companyLogo: '💻',
      location: 'Makati City',
      salary: '₱35,000-50,000',
      posted: '1주 전',
      description: 'React/Next.js를 활용한 웹 애플리케이션 개발자를 모집합니다.',
      requirements: ['React', 'Next.js', 'TypeScript'],
      jobType: 'full-time',
      experience: 'junior',
      urgent: false,
      verified: true,
      saved: true,
      applications: 25
    }
  ];

  // 필터링된 채용공고들
  const filteredJobs = useMemo(() => {
    return sampleJobs.filter(job => {
      if (activeJobType !== 'all' && job.jobType !== activeJobType) return false;
      if (selectedLocation && !job.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
      if (selectedExperience !== 'all' && job.experience !== selectedExperience) return false;
      if (searchTerm && !job.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !job.company.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [sampleJobs, activeJobType, selectedLocation, selectedExperience, searchTerm]);

  const getJobTypeName = (jobType: any) => {
    return jobType.name;
  };

  const getExperienceLabel = (option: any) => {
    return option.label;
  };

  const getJobTitle = (job: any) => {
    return job.title;
  };

  return (
    <>
      <SEOHead
        title="Jobs - Philippines Employment Portal"
        description="Find the best job opportunities in the Philippines. Full-time, part-time, remote, and freelance positions available."
        keywords="jobs, employment, philippines, career, hiring, work, manila, cebu"
        type="website"
        locale={currentLanguage}
      />

      <FacebookLayout section="jobs">
          <main className="py-8">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                💼 구인구직
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                필리핀 전역의 최고의 취업 기회를 찾아보세요
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button
                  onClick={() => router.push('/jobs/post')}
                  className="flex items-center justify-center space-x-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                >
                  <Plus className="h-5 w-5" />
                  <span>채용공고 올리기</span>
                </button>
                
                <button
                  onClick={() => router.push('/jobs/resume')}
                  className="flex items-center justify-center space-x-2 px-8 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg"
                >
                  <Briefcase className="h-5 w-5" />
                  <span>이력서 업로드</span>
                </button>
              </div>
            </div>

            {/* Job Type Navigation */}
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex flex-wrap gap-2">
                  {jobTypes.map((jobType) => (
                    <button
                      key={jobType.id}
                      onClick={() => setActiveJobType(jobType.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        activeJobType === jobType.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span>{jobType.icon}</span>
                      <span className="text-sm font-medium">
                        {getJobTypeName(jobType)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={
                      (currentLanguage as string) === 'ko' ? '직무나 회사명을 검색하세요' :
                      (currentLanguage as string) === 'tl' ? 'Maghanap ng trabaho o kumpanya' :
                      'Search job title or company'
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <SlidersHorizontal className="h-5 w-5" />
                    <span>필터</span>
                    {(selectedLocation || selectedExperience !== 'all') && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </button>
                </div>
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 지역 필터 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">지역</label>
                      <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">전체 지역</option>
                        {allPhilippinesRegions.map(region => (
                          <option key={region.id} value={region.name}>
                            {region.nameKo} ({region.name})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 경력 필터 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">경력</label>
                      <select
                        value={selectedExperience}
                        onChange={(e) => setSelectedExperience(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {experienceLevels.map(option => (
                          <option key={option.value} value={option.value}>
                            {getExperienceLabel(option)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 급여 필터 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">급여</label>
                      <select
                        value={selectedSalaryRange}
                        onChange={(e) => setSelectedSalaryRange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {salaryRanges.map(option => (
                          <option key={option.value} value={option.value}>
                            {getExperienceLabel(option)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {activeJobType === 'all' 
                      ? ((currentLanguage as string) === 'ko' ? '전체 채용공고' : 
                         (currentLanguage as string) === 'tl' ? 'Lahat ng Trabaho' : 'All Jobs')
                      : getJobTypeName(jobTypes.find(t => t.id === activeJobType))
                    }
                  </h2>
                  <p className="text-gray-600">
                    {filteredJobs.length}개의 채용공고가 있습니다
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="latest">최신순</option>
                    <option value="salary_high">높은 급여순</option>
                    <option value="salary_low">낮은 급여순</option>
                    <option value="company">회사명순</option>
                  </select>
                </div>
              </div>

              {/* Jobs List */}
              {filteredJobs.length > 0 ? (
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <div 
                      key={job.id} 
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => router.push(`/jobs/${job.id}`)}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="text-2xl">{job.companyLogo}</div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {getJobTitle(job)}
                                </h3>
                                <p className="text-sm text-gray-600">{job.company}</p>
                              </div>
                              {job.urgent && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                                  긴급
                                </span>
                              )}
                              {job.verified && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                  인증
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{job.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <DollarSign className="h-4 w-4" />
                                <span>{job.salary}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{job.posted}</span>
                              </div>
                            </div>
                            
                            <p className="text-gray-700 mb-3 line-clamp-2">
                              {job.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              {job.requirements?.slice(0, 3).map((req: string, index: number) => (
                                <span 
                                  key={index}
                                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                                >
                                  {req}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-2 ml-4">
                            <div className="flex space-x-2">
                              <button 
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Heart className={`h-4 w-4 ${job.saved ? 'fill-current text-red-500' : ''}`} />
                              </button>
                              <button 
                                className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Share2 className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="text-right text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Eye className="h-3 w-3" />
                                <span>{job.applications} applications</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">채용공고가 없습니다</h3>
                  <p className="text-gray-600 mb-4">
                    선택하신 조건에 맞는 채용공고가 없습니다. 필터를 조정해보세요.
                  </p>
                </div>
              )}
            </div>

            {/* Job Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-blue-600">{filteredJobs.length}</div>
                <div className="text-sm text-gray-600">활성 채용공고</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-green-600">245+</div>
                <div className="text-sm text-gray-600">등록 기업</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-purple-600">1.2K+</div>
                <div className="text-sm text-gray-600">지원자</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-orange-600">89%</div>
                <div className="text-sm text-gray-600">매칭율</div>
              </div>
            </div>
          </main>
      </FacebookLayout>
    </>
  );
}