import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import FacebookLayout from '@/components/layout/FacebookLayout';
import SEOHead from '@/components/seo/SEOHead';
import { MarketplaceFilters, POPULAR_CATEGORIES, MarketplaceCategory } from '@/types/marketplace';
import { allPhilippinesRegions } from '@/data/philippinesRegions';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  MapPin, 
  Heart, 
  MessageCircle,
  TrendingUp,
  Clock,
  Shield,
  Star,
  Eye,
  Plus,
  LogIn,
  SlidersHorizontal,
  X,
  ChevronDown,
  Package
} from 'lucide-react';

export default function MarketplacePage() {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState('ko');
  const [filters, setFilters] = useState<MarketplaceFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 실제로는 auth context에서 가져올 예정
  const [activeSubSection, setActiveSubSection] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedCondition, setSelectedCondition] = useState<string[]>([]);


  const handleCategorySelect = (categoryId: string) => {
    setFilters({ ...filters, category: categoryId as any });
    setActiveSubSection(categoryId);
  };

  const handleSellClick = () => {
    if (!isLoggedIn) {
      // 로그인 모달 또는 페이지로 이동
      router.push('/auth/login?redirect=/marketplace/sell');
    } else {
      router.push('/marketplace/sell');
    }
  };

  const getLocalizedCategoryName = (category: any) => {
    return category.name;
  };

  const subSections = [
    { id: 'all', name: '전체', nameEn: 'All', icon: '🏪' },
    { id: 'electronics', name: '전자제품', nameEn: 'Electronics', icon: '📱' },
    { id: 'vehicles', name: '차량', nameEn: 'Vehicles', icon: '🚗' },
    { id: 'furniture', name: '가구', nameEn: 'Furniture', icon: '🛋️' },
    { id: 'clothing', name: '의류', nameEn: 'Fashion', icon: '👕' },
    { id: 'home_appliances', name: '가전', nameEn: 'Appliances', icon: '🏠' },
    { id: 'sports', name: '스포츠', nameEn: 'Sports', icon: '⚽' },
    { id: 'books', name: '도서', nameEn: 'Books', icon: '📚' },
    { id: 'beauty', name: '뷰티', nameEn: 'Beauty', icon: '💄' },
    { id: 'others', name: '기타', nameEn: 'Others', icon: '📦' }
  ];

  const conditions = [
    { value: 'new', label: '새상품', labelEn: 'New' },
    { value: 'like_new', label: '거의새것', labelEn: 'Like New' },
    { value: 'good', label: '좋음', labelEn: 'Good' },
    { value: 'fair', label: '보통', labelEn: 'Fair' },
    { value: 'poor', label: '나쁨', labelEn: 'Poor' }
  ];

  // 필터 적용 함수
  const applyFilters = () => {
    const newFilters: MarketplaceFilters = {
      ...filters,
      category: activeSubSection !== 'all' ? activeSubSection as MarketplaceCategory : undefined,
      regionId: selectedRegion || undefined,
      minPrice: priceRange.min ? parseInt(priceRange.min) : undefined,
      maxPrice: priceRange.max ? parseInt(priceRange.max) : undefined,
      condition: selectedCondition.length > 0 ? selectedCondition : undefined,
      searchQuery: searchTerm || undefined
    };
    setFilters(newFilters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({});
    setSelectedRegion('');
    setPriceRange({ min: '', max: '' });
    setSelectedCondition([]);
    setSearchTerm('');
    setActiveSubSection('all');
  };

  const toggleCondition = (condition: string) => {
    setSelectedCondition(prev => 
      prev.includes(condition) 
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  // 상품 데이터는 API에서 가져올 예정
  const sampleItems: any[] = [
    {
      id: '1',
      title: 'iPhone 13 Pro 256GB',
      price: 35000,
      location: 'BGC, Taguig',
      category: 'electronics',
      condition: 'like_new',
      image: 'https://images.unsplash.com/photo-1632633728024-f8b43b1f2b3c?w=300&h=300&fit=crop',
      seller: {
        name: 'John Kim',
        rating: 4.8
      },
      views: 234,
      posted: '2일 전'
    },
    {
      id: '2',
      title: '삼성 55인치 스마트 TV',
      price: 18000,
      location: 'Makati City',
      category: 'electronics',
      condition: 'good',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=300&fit=crop',
      seller: {
        name: 'Sarah Lee',
        rating: 4.5
      },
      views: 156,
      posted: '1주 전'
    }
  ];

  // 필터링된 상품들
  const filteredItems = useMemo(() => {
    return sampleItems.filter(item => {
      if (activeSubSection !== 'all' && item.category !== activeSubSection) return false;
      if (selectedRegion && !item.location.toLowerCase().includes(selectedRegion.toLowerCase())) return false;
      if (selectedCondition.length > 0 && !selectedCondition.includes(item.condition)) return false;
      if (priceRange.min && item.price < parseInt(priceRange.min)) return false;
      if (priceRange.max && item.price > parseInt(priceRange.max)) return false;
      if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [sampleItems, activeSubSection, selectedRegion, selectedCondition, priceRange, searchTerm]);

  return (
    <>
      <SEOHead
        title="Philippines Marketplace - Buy & Sell Everything"
        description="Buy and sell electronics, furniture, vehicles, and more in the Philippines. Safe marketplace for expats and locals."
        keywords="marketplace, buy, sell, philippines, electronics, furniture, vehicles"
        type="website"
        locale={currentLanguage}
      />

      <FacebookLayout section="marketplace">
          <main className="py-8">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                🛒 중고장터
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                필리핀 전역에서 모든 것을 사고팔아보세요. 안전하고 신뢰할 수 있는 거래 플랫폼입니다.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button
                  onClick={handleSellClick}
                  className="flex items-center justify-center space-x-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                >
                  <Plus className="h-5 w-5" />
                  <span>무료로 판매하기</span>
                </button>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>
                      {currentLanguage === 'ko' ? '안전 거래' :
                       currentLanguage === 'zh' ? '安全交易' :
                       currentLanguage === 'ja' ? '安全取引' :
                       'Safe Trading'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-600" />
                    <span>
                      {currentLanguage === 'ko' ? '신뢰 시스템' :
                       currentLanguage === 'zh' ? '信任系统' :
                       currentLanguage === 'ja' ? '信頼システム' :
                       'Trust System'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Login Notice for Non-Users */}
              {!isLoggedIn && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-2xl mx-auto">
                  <div className="flex items-center justify-center space-x-2 text-blue-800">
                    <LogIn className="h-5 w-5" />
                    <span className="font-medium">
                      {currentLanguage === 'ko' ? '로그인하고 더 많은 기능을 이용하세요!' :
                       currentLanguage === 'zh' ? '登录享受更多功能！' :
                       currentLanguage === 'ja' ? 'ログインしてより多くの機能をご利用ください！' :
                       'Login to access more features!'}
                    </span>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    {currentLanguage === 'ko' ? '상품 등록, 메시지 보내기, 찜하기 등' :
                     currentLanguage === 'zh' ? '商品发布、发送消息、收藏等' :
                     currentLanguage === 'ja' ? '商品登録、メッセージ送信、お気に入り等' :
                     'Post items, send messages, save favorites and more'}
                  </p>
                </div>
              )}
            </div>

            {/* Sub-Section Navigation */}
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex flex-wrap gap-2">
                  {subSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSubSection(section.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        activeSubSection === section.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span>{section.icon}</span>
                      <span className="text-sm font-medium">
                        {section.name}
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
                      currentLanguage === 'ko' ? '무엇을 찾고 계신가요? (예: iPhone, 소파, 자동차)' :
                      currentLanguage === 'zh' ? '您在寻找什么？（例如：iPhone、沙发、汽车）' :
                      currentLanguage === 'ja' ? '何をお探しですか？（例：iPhone、ソファ、車）' :
                      'What are you looking for? (e.g. iPhone, sofa, car)'
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
                    {(selectedRegion || selectedCondition.length > 0 || priceRange.min || priceRange.max) && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </button>
                  <button 
                    onClick={applyFilters}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    검색
                  </button>
                </div>
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* 지역 필터 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">지역</label>
                      <select
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
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

                    {/* 가격 범위 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">가격 범위</label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          placeholder="최소"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="number"
                          placeholder="최대"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* 상품 상태 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">상품 상태</label>
                      <div className="space-y-2">
                        {conditions.map(condition => (
                          <label key={condition.value} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedCondition.includes(condition.value)}
                              onChange={() => toggleCondition(condition.value)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                            />
                            <span className="text-sm text-gray-700">
                              {currentLanguage === 'ko' ? condition.label : condition.labelEn}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* 보기 옵션 & 필터 액션 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">보기 옵션</label>
                      <div className="flex space-x-2 mb-4">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-2 border rounded-lg ${viewMode === 'grid' ? 'bg-blue-50 border-blue-300' : 'border-gray-300'}`}
                        >
                          <Grid className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-2 border rounded-lg ${viewMode === 'list' ? 'bg-blue-50 border-blue-300' : 'border-gray-300'}`}
                        >
                          <List className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={clearFilters}
                        className="w-full px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        필터 초기화
                      </button>
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
                    {activeSubSection === 'all' 
                      ? (currentLanguage === 'ko' ? '전체 상품' : 'All Items')
                      : (currentLanguage === 'ko' ? 
                          subSections.find(s => s.id === activeSubSection)?.name : 
                          subSections.find(s => s.id === activeSubSection)?.nameEn)
                    }
                  </h2>
                  <p className="text-gray-600">
                    {filteredItems.length}개의 상품이 있습니다
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="newest">최신순</option>
                    <option value="price_low">낮은 가격순</option>
                    <option value="price_high">높은 가격순</option>
                    <option value="popular">인기순</option>
                  </select>
                </div>
              </div>

              {/* Items Grid/List */}
              {filteredItems.length > 0 ? (
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6" 
                  : "space-y-4"
                }>
                  {filteredItems.map((item) => (
                    <div 
                      key={item.id} 
                      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                      onClick={() => router.push(`/marketplace/item/${item.id}`)}
                    >
                      <div className={`relative ${viewMode === 'list' ? 'w-32 h-32' : 'w-full h-48'}`}>
                        <img 
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <button 
                            className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              // 찜하기 기능
                            }}
                          >
                            <Heart className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium text-white ${
                            item.condition === 'new' ? 'bg-green-600' :
                            item.condition === 'like_new' ? 'bg-blue-600' :
                            item.condition === 'good' ? 'bg-yellow-600' : 'bg-gray-600'
                          }`}>
                            {item.condition === 'new' ? '새상품' :
                             item.condition === 'like_new' ? '거의새것' :
                             item.condition === 'good' ? '좋음' : '보통'}
                          </span>
                        </div>
                      </div>
                      
                      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {item.title}
                        </h3>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-bold text-blue-600">₱{item.price.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                          <MapPin className="h-4 w-4" />
                          <span>{item.location}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                            <div>
                              <div className="text-sm font-medium">{item.seller.name}</div>
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span className="text-xs text-gray-600">{item.seller.rating}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Eye className="h-3 w-3" />
                            <span>{item.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">상품이 없습니다</h3>
                  <p className="text-gray-600 mb-4">
                    선택하신 조건에 맞는 상품이 없습니다. 필터를 조정해보세요.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    필터 초기화
                  </button>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            {activeSubSection === 'all' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-blue-600">{sampleItems.length}</div>
                  <div className="text-sm text-gray-600">
                    {currentLanguage === 'ko' ? '전체 상품' : 'Total Items'}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-green-600">8,901</div>
                  <div className="text-sm text-gray-600">
                    {currentLanguage === 'ko' ? '완료된 거래' : 'Completed Deals'}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-purple-600">2,567</div>
                  <div className="text-sm text-gray-600">
                    {currentLanguage === 'ko' ? '인증 판매자' : 'Verified Sellers'}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-orange-600">4.8/5</div>
                  <div className="text-sm text-gray-600">
                    {currentLanguage === 'ko' ? '평균 평점' : 'Average Rating'}
                  </div>
                </div>
              </div>
            )}

            {/* Trust & Safety */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 mb-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentLanguage === 'ko' ? '🛡️ 안전한 거래를 위한 가이드' :
                   currentLanguage === 'zh' ? '🛡️ 安全交易指南' :
                   currentLanguage === 'ja' ? '🛡️ 安全取引ガイド' :
                   '🛡️ Safe Trading Guidelines'}
                </h2>
                <p className="text-gray-600">
                  {currentLanguage === 'ko' ? '사기를 방지하고 안전한 거래를 위해 다음 가이드라인을 따라주세요' :
                   currentLanguage === 'zh' ? '请遵循以下准则以防止欺诈并确保安全交易' :
                   currentLanguage === 'ja' ? '詐欺を防止し安全な取引のため、以下のガイドラインに従ってください' :
                   'Follow these guidelines to prevent fraud and ensure safe transactions'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {currentLanguage === 'ko' ? '인증된 판매자' : 'Verified Sellers'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {currentLanguage === 'ko' ? '신원이 확인된 판매자와 거래하세요' : 'Trade with identity-verified sellers'}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {currentLanguage === 'ko' ? '공공장소 만남' : 'Public Meetups'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {currentLanguage === 'ko' ? '안전한 공공장소에서 거래하세요' : 'Meet in safe public places'}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {currentLanguage === 'ko' ? '플랫폼 내 채팅' : 'In-App Messaging'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {currentLanguage === 'ko' ? '플랫폼 내에서 안전하게 소통하세요' : 'Communicate safely within the platform'}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {currentLanguage === 'ko' ? '지금 시작해보세요!' :
                 currentLanguage === 'zh' ? '立即开始！' :
                 currentLanguage === 'ja' ? '今すぐ始めましょう！' :
                 'Get Started Today!'}
              </h2>
              <p className="text-gray-600 mb-6">
                {currentLanguage === 'ko' ? '수천 명의 사용자들이 이미 안전하고 편리한 거래를 경험하고 있습니다' :
                 currentLanguage === 'zh' ? '成千上万的用户已经在体验安全便捷的交易' :
                 currentLanguage === 'ja' ? '何千人ものユーザーが既に安全で便利な取引を体験しています' :
                 'Thousands of users are already enjoying safe and convenient trading'}
              </p>
              <button
                onClick={handleSellClick}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                {currentLanguage === 'ko' ? '무료로 판매 시작하기' :
                 currentLanguage === 'zh' ? '免费开始销售' :
                 currentLanguage === 'ja' ? '無料で販売開始' :
                 'Start Selling for Free'}
              </button>
            </div>
          </main>
      </FacebookLayout>
    </>
  );
}