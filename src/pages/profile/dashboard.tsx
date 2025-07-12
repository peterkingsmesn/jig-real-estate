import { useState } from 'react';
import { useRouter } from 'next/router';
import DynamicHeader from '@/components/common/DynamicHeader';
import PortalLayout from '@/components/layout/PortalLayout';
import SEOHead from '@/components/seo/SEOHead';
import { 
  User, 
  Settings, 
  Package, 
  MessageCircle, 
  Heart, 
  Star, 
  Eye, 
  Plus,
  Edit3,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Shield,
  TrendingUp,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function UserDashboard() {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('overview');

  // 사용자 데이터 (실제로는 API에서 가져올 예정)
  const userData = {
    id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+63 912 345 6789',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    location: '마카티, 마닐라',
    joinedAt: '2024-01-15',
    rating: 4.5,
    totalReviews: 23,
    verified: false
  };

  const dashboardStats = {
    activeListings: 5,
    totalViews: 1247,
    messages: 12,
    favorites: 8,
    completedDeals: 15,
    totalEarnings: 125000
  };

  const recentListings = [
    {
      id: '1',
      title: 'iPhone 14 Pro Max 256GB',
      price: 45000,
      views: 234,
      messages: 8,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=150&h=150&fit=crop'
    },
    {
      id: '2', 
      title: '소파 3인용 (거의 새것)',
      price: 12000,
      views: 89,
      messages: 3,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=150&h=150&fit=crop'
    },
    {
      id: '3',
      title: '삼성 세탁기 15kg',
      price: 25000,
      views: 156,
      messages: 5,
      status: 'sold',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=150&fit=crop'
    }
  ];

  const recentMessages = [
    {
      id: '1',
      item: 'iPhone 14 Pro Max',
      buyer: 'Maria Santos',
      message: '혹시 네고 가능한가요?',
      timestamp: '2시간 전',
      unread: true
    },
    {
      id: '2',
      item: '소파 3인용',
      buyer: 'Kim Lee',
      message: '언제 볼 수 있나요?',
      timestamp: '5시간 전',
      unread: true
    },
    {
      id: '3',
      item: '삼성 세탁기',
      buyer: 'Chen Wu',
      message: '감사합니다!',
      timestamp: '1일 전',
      unread: false
    }
  ];

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'sold': return 'text-gray-600 bg-gray-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '판매중';
      case 'sold': return '판매완료';
      case 'pending': return '대기중';
      default: return status;
    }
  };

  return (
    <>
      <SEOHead
        title="Dashboard - My Profile"
        description="Manage your listings, messages, and account settings"
        type="website"
        locale={currentLanguage}
      />

      <div className="min-h-screen bg-gray-50">
        <DynamicHeader 
          currentLanguage={currentLanguage} 
          onLanguageChange={handleLanguageChange} 
        />
        
        <PortalLayout>
          <div className="py-8">
            {/* 프로필 헤더 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative">
                  <img
                    src={userData.avatar}
                    alt={userData.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <button className="absolute -bottom-1 -right-1 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                    <Edit3 className="h-3 w-3" />
                  </button>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
                    {userData.verified ? (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">인증됨</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-yellow-600">
                        <AlertCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">미인증</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span>{userData.rating} ({userData.totalReviews} 리뷰)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{userData.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>가입일: {userData.joinedAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">연락처:</span>
                    <span className="text-sm text-gray-900">{userData.email}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-900">{userData.phone}</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button 
                    onClick={() => router.push('/profile/edit')}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Settings className="h-4 w-4" />
                    <span>설정</span>
                  </button>
                  <button 
                    onClick={() => router.push('/marketplace/sell')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    <span>상품 등록</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-200">
                <Package className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{dashboardStats.activeListings}</div>
                <div className="text-sm text-gray-600">판매중</div>
              </div>
              
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-200">
                <Eye className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{dashboardStats.totalViews.toLocaleString()}</div>
                <div className="text-sm text-gray-600">조회수</div>
              </div>

              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-200">
                <MessageCircle className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{dashboardStats.messages}</div>
                <div className="text-sm text-gray-600">메시지</div>
              </div>

              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-200">
                <Heart className="h-6 w-6 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{dashboardStats.favorites}</div>
                <div className="text-sm text-gray-600">찜한 상품</div>
              </div>

              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-200">
                <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{dashboardStats.completedDeals}</div>
                <div className="text-sm text-gray-600">완료된 거래</div>
              </div>

              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-200">
                <DollarSign className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">₱{dashboardStats.totalEarnings.toLocaleString()}</div>
                <div className="text-sm text-gray-600">총 수익</div>
              </div>
            </div>

            {/* 탭 네비게이션 */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: 'overview', label: '개요', icon: TrendingUp },
                    { id: 'listings', label: '내 상품', icon: Package },
                    { id: 'messages', label: '메시지', icon: MessageCircle },
                    { id: 'favorites', label: '찜한 상품', icon: Heart }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* 탭 컨텐츠 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 메인 컨텐츠 */}
              <div className="lg:col-span-2">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* 최근 등록한 상품 */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">최근 등록한 상품</h3>
                        <button 
                          onClick={() => setActiveTab('listings')}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          모두 보기 →
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {recentListings.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{item.title}</h4>
                              <p className="text-lg font-bold text-blue-600">₱{item.price.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                                <Eye className="h-4 w-4" />
                                <span>{item.views}</span>
                                <MessageCircle className="h-4 w-4" />
                                <span>{item.messages}</span>
                              </div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                {getStatusText(item.status)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'listings' && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">내 상품 목록</h3>
                    <div className="space-y-4">
                      {recentListings.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                            <p className="text-lg font-bold text-blue-600 mb-2">₱{item.price.toLocaleString()}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Eye className="h-4 w-4" />
                                <span>{item.views} 조회</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MessageCircle className="h-4 w-4" />
                                <span>{item.messages} 메시지</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {getStatusText(item.status)}
                            </span>
                            <button className="text-sm text-blue-600 hover:text-blue-700">
                              편집
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'messages' && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 메시지</h3>
                    <div className="space-y-4">
                      {recentMessages.map((msg) => (
                        <div key={msg.id} className={`p-4 border rounded-lg ${msg.unread ? 'bg-blue-50 border-blue-200' : 'border-gray-200'}`}>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">{msg.item}</h4>
                              <p className="text-sm text-gray-600">{msg.buyer}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">{msg.timestamp}</span>
                              {msg.unread && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-700">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 사이드바 */}
              <div className="space-y-6">
                {/* 빠른 액션 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 액션</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => router.push('/marketplace/sell')}
                      className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <Plus className="h-5 w-5 text-blue-600" />
                      <span>새 상품 등록</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                      <span>메시지 확인</span>
                    </button>
                    <button 
                      onClick={() => router.push('/profile/edit')}
                      className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <Settings className="h-5 w-5 text-purple-600" />
                      <span>계정 설정</span>
                    </button>
                  </div>
                </div>

                {/* 월간 통계 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">이번 달 활동</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">새 조회수</span>
                      <span className="font-medium">+234</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">새 메시지</span>
                      <span className="font-medium">+12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">완료된 거래</span>
                      <span className="font-medium">3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">수익</span>
                      <span className="font-medium text-green-600">₱15,000</span>
                    </div>
                  </div>
                </div>

                {/* 계정 상태 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">계정 상태</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">이메일 인증</span>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">핸드폰 인증</span>
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">신분증 인증</span>
                      <AlertCircle className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <button className="w-full mt-4 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    인증 완료하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </PortalLayout>
      </div>
    </>
  );
}