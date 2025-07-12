import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import FacebookLayout from '@/components/layout/FacebookLayout';
import SEOHead from '@/components/seo/SEOHead';
import { useAutoUpdates, useUpdateStatus } from '@/hooks/useAutoUpdates';
import { 
  Shield, 
  Calendar, 
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Download,
  ExternalLink,
  Filter,
  Search,
  Bookmark,
  Bell,
  User,
  Globe,
  MapPin,
  Phone,
  Mail,
  FileText,
  Camera,
  Car,
  Users,
  Building,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react';

export default function PolicePage() {
  const router = useRouter();
  const currentLanguage = 'ko';
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 자동 업데이트 훅
  const { 
    updates: liveUpdates, 
    loading, 
    error, 
    lastUpdated, 
    isRefreshing, 
    refreshUpdates,
    requestNotificationPermission 
  } = useAutoUpdates({ 
    service: 'police', 
    autoRefresh: true,
    refreshInterval: 5 * 60 * 1000 // 5분마다 체크
  });

  const { isOnline } = useUpdateStatus();


  // 페이지 로드 시 알림 권한 요청
  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  const categories = [
    { id: 'all', name: '전체', nameEn: 'All', nameTl: 'Lahat', icon: '📋' },
    { id: 'safety', name: '안전 공지', nameEn: 'Safety Alerts', nameTl: 'Mga Safety Alert', icon: '🚨' },
    { id: 'procedures', name: '절차 안내', nameEn: 'Procedures', nameTl: 'Mga Pamamaraan', icon: '📝' },
    { id: 'clearance', name: '신원조회', nameEn: 'Police Clearance', nameTl: 'Police Clearance', icon: '📄' },
    { id: 'traffic', name: '교통 정보', nameEn: 'Traffic Updates', nameTl: 'Traffic Updates', icon: '🚦' },
    { id: 'crime', name: '범죄 예방', nameEn: 'Crime Prevention', nameTl: 'Pagpigil sa Krimen', icon: '🛡️' },
    { id: 'emergency', name: '긴급사태', nameEn: 'Emergency', nameTl: 'Emergency', icon: '🚨' },
    { id: 'community', name: '지역사회', nameEn: 'Community', nameTl: 'Komunidad', icon: '👥' }
  ];

  // 실시간 업데이트와 정적 데이터 병합
  const policeNews = liveUpdates.length > 0 ? liveUpdates : [];

  const filteredNews = policeNews.filter((news: any) => {
    if (activeCategory !== 'all' && news.category !== activeCategory) return false;
    if (searchTerm && !news.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !news.titleKo.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getCategoryName = (category: any) => {
    switch ((currentLanguage as string) as string) {
      case 'ko': return category.name;
      case 'tl': return category.nameTl;
      default: return category.nameEn;
    }
  };

  const getNewsTitle = (news: any) => {
    switch ((currentLanguage as string) as string) {
      case 'ko': return news.titleKo;
      case 'tl': return news.titleTl;
      default: return news.title;
    }
  };

  const getNewsContent = (news: any) => {
    switch ((currentLanguage as string) as string) {
      case 'ko': return news.contentKo;
      case 'tl': return news.contentTl;
      default: return news.content;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Info className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString((currentLanguage as string) === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <SEOHead
        title="Police Updates - Philippine National Police"
        description="Latest announcements and updates from the Philippine National Police. Safety alerts, procedures, and important notices for residents and visitors."
        keywords="philippines police, pnp, police clearance, safety alerts, crime prevention, traffic updates"
        type="website"
        locale={currentLanguage}
      />

      <FacebookLayout section="police">
          <main className="py-8">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                🚔 {(currentLanguage as string) === 'ko' ? '경찰국 발표내용' :
                     (currentLanguage as string) === 'tl' ? 'Mga Anunsyo ng Philippine National Police' :
                     'Police Announcements'}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {(currentLanguage as string) === 'ko' ? '필리핀 국가경찰의 최신 발표 및 안전 정보를 확인하세요' :
                 (currentLanguage as string) === 'tl' ? 'Tingnan ang mga pinakabagong anunsyo at safety information ng Philippine National Police' :
                 'Stay informed with the latest announcements and safety information from the Philippine National Police'}
              </p>
            </div>

            {/* Emergency Alerts */}
            {policeNews.filter((news: any) => news.category === 'emergency' || news.priority === 'high').length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-r-lg">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-red-400 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-800">
                      {(currentLanguage as string) === 'ko' ? '긴급 안전 공지' :
                       (currentLanguage as string) === 'tl' ? 'Mga Urgent Safety Notice' :
                       'Urgent Safety Notices'}
                    </h3>
                    <div className="mt-2 space-y-2">
                      {policeNews.filter((news: any) => news.category === 'emergency' || news.priority === 'high').slice(0, 2).map((news: any) => (
                        <div key={news.id} className="text-red-700">
                          <strong>{getNewsTitle(news)}</strong>
                          <div className="text-sm mt-1">{formatDate(news.date)} • {news.region}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Emergency Hotlines */}
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                🚨 {(currentLanguage as string) === 'ko' ? '긴급 신고 전화' :
                    (currentLanguage as string) === 'tl' ? 'Emergency Hotlines' :
                    'Emergency Hotlines'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Emergency:</span>
                  <span className="text-lg font-bold">911</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">PNP Hotline:</span>
                  <span>117</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Text Hotline:</span>
                  <span>2920</span>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={
                      (currentLanguage as string) === 'ko' ? '공지사항 검색...' :
                      (currentLanguage as string) === 'tl' ? 'Maghanap ng announcement...' :
                      'Search announcements...'
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-all ${
                      activeCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-xs">{category.icon}</span>
                    <span>{getCategoryName(category)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* News List */}
            <div className="space-y-6">
              {filteredNews.map((news: any) => (
                <div key={news.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  {/* News Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {news.isNew && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                              NEW
                            </span>
                          )}
                          <span className={`flex items-center space-x-1 px-2 py-1 border rounded text-xs font-medium ${getPriorityColor(news.priority)}`}>
                            {getPriorityIcon(news.priority)}
                            <span className="capitalize">{news.priority}</span>
                          </span>
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                            {categories.find(c => c.id === news.category)?.icon} {getCategoryName(categories.find(c => c.id === news.category)!)}
                          </span>
                          <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded">
                            📍 {news.region}
                          </span>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                          {getNewsTitle(news)}
                        </h2>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(news.date)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Building className="h-4 w-4" />
                            <span>{news.source}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                          <Bookmark className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-500 transition-colors">
                          <Bell className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* News Content */}
                  <div className="p-6">
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {getNewsContent(news)}
                    </p>

                    {/* Attachments */}
                    {news.attachments.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          {(currentLanguage as string) === 'ko' ? '첨부파일' :
                           (currentLanguage as string) === 'tl' ? 'Mga Attachment' :
                           'Attachments'}
                        </h4>
                        <div className="space-y-2">
                          {news.attachments.map((attachment: string, index: number) => (
                            <div key={index} className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700">
                              <Download className="h-4 w-4" />
                              <span className="cursor-pointer hover:underline">{attachment}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Related Links */}
                    {news.relatedLinks.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          {(currentLanguage as string) === 'ko' ? '관련 링크' :
                           (currentLanguage as string) === 'tl' ? 'Mga Related Link' :
                           'Related Links'}
                        </h4>
                        <div className="space-y-2">
                          {news.relatedLinks.map((link: string, index: number) => (
                            <div key={index} className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700">
                              <ExternalLink className="h-4 w-4" />
                              <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                {link}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredNews.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {(currentLanguage as string) === 'ko' ? '검색 결과가 없습니다' :
                   (currentLanguage as string) === 'tl' ? 'Walang nahanap na resulta' :
                   'No announcements found'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {(currentLanguage as string) === 'ko' ? '검색 조건을 조정해보세요' :
                   (currentLanguage as string) === 'tl' ? 'Subukan na baguhin ang search criteria' :
                   'Try adjusting your search criteria'}
                </p>
              </div>
            )}

            {/* Quick Services */}
            <div className="bg-white rounded-xl p-6 mt-12 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🔧 {(currentLanguage as string) === 'ko' ? '주요 서비스' :
                    (currentLanguage as string) === 'tl' ? 'Mga Pangunahing Serbisyo' :
                    'Key Services'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <a href="https://pnpclearance.ph" target="_blank" className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-700 font-medium">Police Clearance</span>
                </a>
                <a href="https://pnp.gov.ph/firearms" target="_blank" className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-green-700 font-medium">Firearms License</span>
                </a>
                <a href="https://pnp.gov.ph/complaint" target="_blank" className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                  <User className="h-5 w-5 text-yellow-600" />
                  <span className="text-yellow-700 font-medium">File Complaint</span>
                </a>
                <a href="https://pnp.gov.ph/crime-report" target="_blank" className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="text-red-700 font-medium">Report Crime</span>
                </a>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                💡 {(currentLanguage as string) === 'ko' ? '안전 수칙' :
                    (currentLanguage as string) === 'tl' ? 'Mga Safety Tips' :
                    'Safety Tips'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <span>{(currentLanguage as string) === 'ko' ? '밤늦은 시간 혼자 다니지 마세요' : (currentLanguage as string) === 'tl' ? 'Huwag mag-isa sa gabi' : 'Avoid walking alone at night'}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <span>{(currentLanguage as string) === 'ko' ? '귀중품을 보이는 곳에 두지 마세요' : (currentLanguage as string) === 'tl' ? 'Huwag ipakita ang mga valuables' : 'Keep valuables out of sight'}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <span>{(currentLanguage as string) === 'ko' ? '긴급시 911에 즉시 신고하세요' : (currentLanguage as string) === 'tl' ? 'Tumawag sa 911 sa emergency' : 'Call 911 in emergencies'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span>{(currentLanguage as string) === 'ko' ? '항상 신분증을 소지하세요' : (currentLanguage as string) === 'tl' ? 'Magdala lagi ng ID' : 'Always carry identification'}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span>{(currentLanguage as string) === 'ko' ? '의심스러운 활동을 신고하세요' : (currentLanguage as string) === 'tl' ? 'I-report ang suspicious activities' : 'Report suspicious activities'}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span>{(currentLanguage as string) === 'ko' ? '가족에게 행선지를 알려주세요' : (currentLanguage as string) === 'tl' ? 'Sabihin sa pamilya ang pupuntahan' : 'Inform family of your whereabouts'}</span>
                  </div>
                </div>
              </div>
            </div>
          </main>
      </FacebookLayout>
    </>
  );
}