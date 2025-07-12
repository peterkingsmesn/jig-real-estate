import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import FacebookLayout from '@/components/layout/FacebookLayout';
import SEOHead from '@/components/seo/SEOHead';
import { useAutoUpdates, useUpdateStatus } from '@/hooks/useAutoUpdates';
import { 
  FileText, 
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
  RefreshCw,
  Wifi,
  WifiOff,
  Building,
  DollarSign
} from 'lucide-react';

export default function ImmigrationPage() {
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
    service: 'immigration', 
    autoRefresh: true,
    refreshInterval: 5 * 60 * 1000 // 5분마다 체크
  });

  const { isOnline, lastSync, updateLastSync } = useUpdateStatus();


  // 페이지 로드 시 알림 권한 요청
  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  const categories = [
    { id: 'all', name: '전체', nameEn: 'All', nameTl: 'Lahat', icon: '📋' },
    { id: 'visa', name: '비자 관련', nameEn: 'Visa Updates', nameTl: 'Mga Update sa Visa', icon: '📄' },
    { id: 'policy', name: '정책 변경', nameEn: 'Policy Changes', nameTl: 'Mga Pagbabago sa Patakaran', icon: '📜' },
    { id: 'procedures', name: '절차 안내', nameEn: 'Procedures', nameTl: 'Mga Pamamaraan', icon: '📝' },
    { id: 'fees', name: '수수료', nameEn: 'Fees', nameTl: 'Mga Bayad', icon: '💰' },
    { id: 'requirements', name: '요구사항', nameEn: 'Requirements', nameTl: 'Mga Kinakailangan', icon: '📋' },
    { id: 'emergency', name: '긴급공지', nameEn: 'Emergency Notice', nameTl: 'Emergency Notice', icon: '🚨' }
  ];

  // 실시간 업데이트와 정적 데이터 병합
  const immigrationNews = liveUpdates.length > 0 ? liveUpdates : [];

  const filteredNews = immigrationNews.filter((news: any) => {
    if (activeCategory !== 'all' && news.category !== activeCategory) return false;
    if (searchTerm && !news.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !news.titleKo.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getCategoryName = (category: any) => {
    switch (currentLanguage as string) {
      case 'ko': return category.name;
      case 'tl': return category.nameTl;
      default: return category.nameEn;
    }
  };

  const getNewsTitle = (news: any) => {
    switch (currentLanguage as string) {
      case 'ko': return news.titleKo;
      case 'tl': return news.titleTl;
      default: return news.title;
    }
  };

  const getNewsContent = (news: any) => {
    switch (currentLanguage as string) {
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
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLanguage === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <SEOHead
        title="Immigration Updates - Bureau of Immigration Philippines"
        description="Latest announcements and updates from the Bureau of Immigration Philippines. Visa updates, policy changes, and important notices for foreigners."
        keywords="philippines immigration, bureau of immigration, visa updates, immigration news, visa extension, acr card"
        type="website"
        locale={currentLanguage}
      />

      <FacebookLayout section="immigration">
          <main className="py-8">
            {/* Live Update Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center space-x-2 ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                    {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                    <span className="text-sm font-medium">
                      {isOnline ? 
                        (currentLanguage === 'ko' ? '실시간 업데이트 활성' : 
                         currentLanguage === 'tl' ? 'Live Updates Active' : 
                         'Live Updates Active') :
                        (currentLanguage === 'ko' ? '오프라인' : 
                         currentLanguage === 'tl' ? 'Offline' : 
                         'Offline')
                      }
                    </span>
                  </div>
                  {lastUpdated && (
                    <div className="text-sm text-gray-500">
                      {currentLanguage === 'ko' ? '마지막 업데이트: ' : 
                       currentLanguage === 'tl' ? 'Huling update: ' : 
                       'Last updated: '}
                      {new Date(lastUpdated).toLocaleString()}
                    </div>
                  )}
                </div>
                <button
                  onClick={refreshUpdates}
                  disabled={isRefreshing}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isRefreshing 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>
                    {isRefreshing ? 
                      (currentLanguage === 'ko' ? '업데이트 중...' : 
                       currentLanguage === 'tl' ? 'Nag-u-update...' : 
                       'Updating...') :
                      (currentLanguage === 'ko' ? '새로고침' : 
                       currentLanguage === 'tl' ? 'Refresh' : 
                       'Refresh')
                    }
                  </span>
                </button>
              </div>
              {error && (
                <div className="mt-2 text-sm text-red-600">
                  {currentLanguage === 'ko' ? '업데이트 오류: ' : 
                   currentLanguage === 'tl' ? 'Update error: ' : 
                   'Update error: '}{error}
                </div>
              )}
            </div>

            {/* Hero Section */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                🏛️ {currentLanguage === 'ko' ? '이민국 발표내용' :
                     currentLanguage === 'tl' ? 'Mga Anunsyo ng Bureau of Immigration' :
                     'Immigration Announcements'}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {currentLanguage === 'ko' ? '필리핀 이민국의 최신 발표 및 업데이트 사항을 확인하세요' :
                 currentLanguage === 'tl' ? 'Tingnan ang mga pinakabagong anunsyo at updates ng Bureau of Immigration ng Pilipinas' :
                 'Stay updated with the latest announcements from the Bureau of Immigration Philippines'}
              </p>
            </div>

            {/* Emergency Alerts */}
            {immigrationNews.filter((news: any) => news.category === 'emergency').length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-r-lg">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-800">
                      {currentLanguage === 'ko' ? '긴급 공지사항' :
                       currentLanguage === 'tl' ? 'Mga Emergency Notice' :
                       'Emergency Notices'}
                    </h3>
                    <div className="mt-2 space-y-2">
                      {immigrationNews.filter((news: any) => news.category === 'emergency').map((news: any) => (
                        <div key={news.id} className="text-red-700">
                          <strong>{getNewsTitle(news)}</strong>
                          <div className="text-sm mt-1">{formatDate(news.date)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Contact */}
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                📞 {currentLanguage === 'ko' ? '이민국 연락처' :
                    currentLanguage === 'tl' ? 'Contact Information ng BI' :
                    'Bureau of Immigration Contact'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Hotline:</span>
                  <span>(02) 8465-2400</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Email:</span>
                  <span>info@immigration.gov.ph</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Website:</span>
                  <a href="https://immigration.gov.ph" target="_blank" className="text-blue-600 hover:underline">
                    immigration.gov.ph
                  </a>
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
                      currentLanguage === 'ko' ? '공지사항 검색...' :
                      currentLanguage === 'tl' ? 'Maghanap ng announcement...' :
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
                          {currentLanguage === 'ko' ? '첨부파일' :
                           currentLanguage === 'tl' ? 'Mga Attachment' :
                           'Attachments'}
                        </h4>
                        <div className="space-y-2">
                          {news.attachments.map((attachment, index) => (
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
                          {currentLanguage === 'ko' ? '관련 링크' :
                           currentLanguage === 'tl' ? 'Mga Related Link' :
                           'Related Links'}
                        </h4>
                        <div className="space-y-2">
                          {news.relatedLinks.map((link, index) => (
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
                  <FileText className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {currentLanguage === 'ko' ? '검색 결과가 없습니다' :
                   currentLanguage === 'tl' ? 'Walang nahanap na resulta' :
                   'No announcements found'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {currentLanguage === 'ko' ? '검색 조건을 조정해보세요' :
                   currentLanguage === 'tl' ? 'Subukan na baguhin ang search criteria' :
                   'Try adjusting your search criteria'}
                </p>
              </div>
            )}

            {/* Useful Links */}
            <div className="bg-white rounded-xl p-6 mt-12 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🔗 {currentLanguage === 'ko' ? '유용한 링크' :
                    currentLanguage === 'tl' ? 'Mga Useful Links' :
                    'Useful Links'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <a href="https://appointment.immigration.gov.ph" target="_blank" className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-700 font-medium">Online Appointment</span>
                </a>
                <a href="https://immigration.gov.ph/visa-requirements" target="_blank" className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span className="text-green-700 font-medium">Visa Requirements</span>
                </a>
                <a href="https://immigration.gov.ph/fees" target="_blank" className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                  <span className="text-yellow-700 font-medium">Fee Schedule</span>
                </a>
              </div>
            </div>
          </main>
      </FacebookLayout>
    </>
  );
}