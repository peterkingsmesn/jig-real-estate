import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import DynamicHeader from '@/components/common/DynamicHeader';
import FloatingContactButton from '@/components/common/FloatingContactButton';
import PortalLayout from '@/components/layout/PortalLayout';
import SEOHead from '@/components/seo/SEOHead';
import { OrganizationSchema, WebsiteSchema } from '@/components/seo/JsonLd';
import { Property, PropertyFilters } from '@/types/property';
import { defaultSEO, getLocalizedSEO } from '@/utils/seo';
import { resetMenuCache } from '@/utils/resetMenu';
import { ThumbsUp, MessageCircle, Share2, Camera, Video, Smile, MapPin, Home as HomeIcon, Heart, Bookmark, MoreHorizontal, Globe } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [filters, setFilters] = useState<PropertyFilters>({ category: 'all' });

  // SEO 설정 - 단순화
  const seoConfig = useMemo(() => {
    return defaultSEO.home;
  }, []);

  // 메뉴 캐시 강제 초기화는 일시적으로 비활성화
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const hasResetForAngeles = localStorage.getItem('hasResetMenuForAngeles');
  //     if (!hasResetForAngeles) {
  //       resetMenuCache();
  //       localStorage.setItem('hasResetMenuForAngeles', 'true');
  //       console.log('Menu cache has been reset for Angeles region support');
  //     }
  //   }
  // }, []);

  // Properties will be fetched from API
  const allProperties: Property[] = [];

  // Calculate filtered properties directly
  const filteredProperties = useMemo(() => {
    // Get base properties based on category
    const baseProperties = allProperties;
    
    // Filter properties based on filters
    let filtered = baseProperties;
    
    if (filters.region) {
      filtered = filtered.filter(property => property.region === filters.region);
    }
    
    if (filters.type) {
      filtered = filtered.filter(property => property.type === filters.type);
    }
    
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(property => property.price >= filters.minPrice!);
    }
    
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(property => property.price <= filters.maxPrice!);
    }
    
    if (filters.bedrooms !== undefined) {
      filtered = filtered.filter(property => property.bedrooms >= filters.bedrooms!);
    }
    
    if (filters.bathrooms !== undefined) {
      filtered = filtered.filter(property => property.bathrooms >= filters.bathrooms!);
    }
    
    if (filters.furnished !== undefined) {
      filtered = filtered.filter(property => property.furnished === filters.furnished);
    }

    // Monthly stay specific filters
    if (filters.travelerFriendly) {
      filtered = filtered.filter(property => property.monthlyStay?.available === true);
    }

    if (filters.nearTouristSpots) {
      filtered = filtered.filter(property => 
        property.monthlyStay?.touristAttractions?.some(attraction => 
          attraction.type === 'beach' || attraction.type === 'temple'
        )
      );
    }

    if (filters.wifiSpeed) {
      filtered = filtered.filter(property => {
        const wifiSpeed = property.monthlyStay?.livingConvenience?.wifi_speed;
        if (!wifiSpeed) return false;
        
        switch (filters.wifiSpeed) {
          case 'basic': return true;
          case 'fast': return wifiSpeed === 'fast' || wifiSpeed === 'ultra';
          case 'ultra': return wifiSpeed === 'ultra';
          default: return true;
        }
      });
    }

    if (filters.duration) {
      filtered = filtered.filter(property => {
        const monthlyStay = property.monthlyStay;
        if (!monthlyStay) return false;
        
        switch (filters.duration) {
          case 'short': return monthlyStay.minStayDays <= 14;
          case 'medium': return monthlyStay.minStayDays <= 30 && monthlyStay.maxStayDays >= 30;
          case 'long': return monthlyStay.maxStayDays >= 60;
          case 'extended': return monthlyStay.maxStayDays >= 90;
          default: return true;
        }
      });
    }
    
    // Sort properties
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'price':
            return a.price - b.price;
          case 'date':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'popularity':
            return (b.viewCount || 0) - (a.viewCount || 0);
          default:
            return 0;
        }
      });
    }
    
    return filtered;
  }, [filters]);

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
  };

  const handleFiltersChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
  };

  const handlePropertyContact = (property: Property) => {
    if (property.contact.whatsapp) {
      window.open(`https://wa.me/${property.contact.whatsapp}`, '_blank');
    }
  };

  const handlePropertyLike = (property: Property) => {
    // TODO: Implement like functionality
  };

  const handlePropertyShare = (property: Property) => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: `/property/${property.id}`,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`${window.location.origin}/property/${property.id}`);
    }
  };

  // Remove this as we're now grouping by region/type

  // 스토리 데이터 (주요 부동산 하이라이트)
  const stories = [
    { id: 1, title: '마닐라 럭셔리', image: '/images/properties/manila-luxury.jpg', type: 'luxury' },
    { id: 2, title: '세부 비치뷰', image: '/images/properties/cebu-beach.jpg', type: 'beach' },
    { id: 3, title: '다바오 신축', image: '/images/properties/davao-new.jpg', type: 'new' },
    { id: 4, title: '앙헬레스 풀빌라', image: '/images/properties/angeles-villa.jpg', type: 'villa' },
    { id: 5, title: '보라카이 리조트', image: '/images/properties/boracay-resort.jpg', type: 'resort' },
  ];

  // 더미 부동산 데이터 (실제로는 API에서 가져와야 함)
  const dummyProperties: Property[] = [
    // 더 많은 더미 데이터 추가 가능
  ];

  return (
    <>
      <SEOHead
        title="Philippines Rental - Premium Apartments for Foreigners"
        description="Find premium rental apartments in Philippines perfect for foreigners. Monthly stays, furnished apartments in Manila, Cebu, Davao. Professional service, multilingual support."
        keywords="Philippines rental, apartments for foreigners, monthly stay Philippines, furnished rental Manila, Cebu apartment, Davao rental, long term rental Philippines"
        image="/images/og-home.jpg"
        type="website"
        locale={currentLanguage}
        alternateLocales={['en', 'ko', 'zh', 'ja']}
      />
      
      <OrganizationSchema
        name="Philippines Rental"
        url={process.env.NEXT_PUBLIC_SITE_URL || 'https://philippines-rental.com'}
        logo={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://philippines-rental.com'}/images/logo.png`}
        description="Premium rental apartments in Philippines for foreigners. Professional service, multilingual support."
        contactPoint={{
          telephone: "",
          contactType: "customer service",
          areaServed: "Philippines",
          availableLanguage: ["English", "Korean", "Chinese", "Japanese"]
        }}
        address={{
          streetAddress: "",
          addressLocality: "Manila",
          addressRegion: "NCR",
          postalCode: "",
          addressCountry: "Philippines"
        }}
        sameAs={[
          "https://www.facebook.com/philippinesrental",
          "https://www.instagram.com/philippinesrental",
          "https://twitter.com/philippinesrental"
        ]}
      />
      
      <WebsiteSchema />

      {/* 페이스북 스타일 배경 */}
      <div className="min-h-screen" style={{ backgroundColor: '#f0f2f5' }}>
        <DynamicHeader 
          currentLanguage={currentLanguage} 
          onLanguageChange={handleLanguageChange} 
        />
        
        <PortalLayout>
          <main className="py-4">
            <div className="max-w-screen-lg mx-auto">
              {/* 포스트 작성 박스 */}
              <div className="bg-white rounded-lg shadow mb-4">
                <div className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <HomeIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <button 
                      onClick={() => router.push('/owner/submit')}
                      className="flex-1 text-left bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 text-gray-500 transition-colors"
                    >
                      어떤 부동산을 등록하시겠어요?
                    </button>
                  </div>
                  <div className="border-t mt-3 pt-3 flex justify-around">
                    <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors">
                      <Camera className="text-green-600" />
                      <span className="text-sm font-medium">사진</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors">
                      <Video className="text-red-600" />
                      <span className="text-sm font-medium">동영상</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors">
                      <MapPin className="text-blue-600" />
                      <span className="text-sm font-medium">위치</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 스토리 섹션 */}
              <div className="bg-white rounded-lg shadow mb-4 p-4">
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {/* 스토리 추가 버튼 */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-28 h-48 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                        <div className="h-36 bg-gray-200 flex items-center justify-center">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-2xl">+</span>
                          </div>
                        </div>
                        <div className="h-12 flex items-center justify-center">
                          <span className="text-xs font-medium">스토리 만들기</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 스토리 아이템들 */}
                  {stories.map(story => (
                    <div key={story.id} className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-28 h-48 bg-gradient-to-b from-transparent to-black/60 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                          <img 
                            src={story.image} 
                            alt={story.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2">
                            <div className="w-10 h-10 bg-blue-500 rounded-full border-4 border-white" />
                          </div>
                          <div className="absolute bottom-2 left-2 right-2">
                            <p className="text-white text-xs font-medium">{story.title}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 필터 섹션 (페이스북 스타일) */}
              <div className="bg-white rounded-lg shadow mb-4 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">부동산 필터</h3>
                  <button 
                    onClick={() => handleFiltersChange({})}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    필터 초기화
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <select 
                    className="px-3 py-1.5 bg-gray-100 rounded-full text-sm"
                    value={filters.region || ''}
                    onChange={(e) => handleFiltersChange({...filters, region: e.target.value || undefined})}
                  >
                    <option value="">모든 지역</option>
                    <option value="Manila">마닐라</option>
                    <option value="Cebu">세부</option>
                    <option value="Davao">다바오</option>
                    <option value="Angeles">앙헬레스</option>
                  </select>
                  <select 
                    className="px-3 py-1.5 bg-gray-100 rounded-full text-sm"
                    value={filters.type || ''}
                    onChange={(e) => handleFiltersChange({...filters, type: e.target.value as 'house' | 'condo' | 'apartment' | 'studio' | 'villa' | 'townhouse' | 'village' || undefined})}
                  >
                    <option value="">모든 유형</option>
                    <option value="condo">콘도</option>
                    <option value="house">하우스</option>
                    <option value="apartment">아파트</option>
                    <option value="villa">빌라</option>
                  </select>
                  <select 
                    className="px-3 py-1.5 bg-gray-100 rounded-full text-sm"
                    value={filters.sortBy || ''}
                    onChange={(e) => handleFiltersChange({...filters, sortBy: e.target.value as any || undefined})}
                  >
                    <option value="">정렬</option>
                    <option value="date">최신순</option>
                    <option value="price">가격순</option>
                    <option value="popularity">인기순</option>
                  </select>
                </div>
              </div>

              {/* 부동산 피드 (페이스북 포스트 스타일) */}
              <div className="space-y-4">
                {(dummyProperties.length > 0 ? dummyProperties : filteredProperties).map((property: any) => (
                  <div key={property.id} className="bg-white rounded-lg shadow">
                    {/* 포스트 헤더 */}
                    <div className="p-4">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                          {property.owner?.avatar ? (
                            <img src={property.owner.avatar} alt={property.owner.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <HomeIcon className="h-5 w-5 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center">
                            <h3 className="font-semibold text-sm">
                              {property.owner?.name || property.contact.name}
                            </h3>
                            {property.owner?.verified && (
                              <span className="ml-1 text-blue-500 text-xs">✓</span>
                            )}
                          </div>
                          <div className="flex items-center text-gray-500 text-xs">
                            <span>{new Date(property.createdAt).toLocaleDateString()}</span>
                            <span className="mx-1">·</span>
                            <MapPin className="mr-1" size={10} />
                            <span>{property.region}</span>
                          </div>
                        </div>
                        <button className="text-gray-600 hover:bg-gray-100 rounded-full p-2">
                          <span className="text-xl">···</span>
                        </button>
                      </div>
                      
                      {/* 포스트 내용 */}
                      <div className="mt-3">
                        <h2 className="font-semibold text-lg mb-1">{property.title}</h2>
                        <p className="text-gray-700 text-sm mb-2">{property.description}</p>
                        <div className="text-blue-600 font-semibold text-lg">
                          ₱{property.price.toLocaleString()}/월
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                            {property.bedrooms}BR {property.bathrooms}BA
                          </span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                            {property.area}㎡
                          </span>
                          {property.furnished && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                              가구완비
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* 이미지 */}
                    {property.images && property.images[0] && (
                      <div className="relative h-96 bg-gray-200">
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {/* 좋아요/댓글 수 */}
                    <div className="px-4 py-2 border-b">
                      <div className="flex items-center justify-between text-gray-500 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="flex items-center">
                            <ThumbsUp className="text-blue-500 mr-1" size={14} />
                            {property.likeCount || 0}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span>{property.commentCount || 0} 댓글</span>
                          <span>{property.viewCount || 0} 조회</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* 액션 버튼 */}
                    <div className="px-4 py-1">
                      <div className="flex items-center justify-around">
                        <button 
                          onClick={() => handlePropertyLike(property)}
                          className="flex items-center justify-center space-x-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors flex-1"
                        >
                          <ThumbsUp size={18} />
                          <span className="text-sm font-medium">좋아요</span>
                        </button>
                        <button 
                          onClick={() => router.push(`/property/${property.id}`)}
                          className="flex items-center justify-center space-x-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors flex-1"
                        >
                          <MessageCircle size={18} />
                          <span className="text-sm font-medium">댓글</span>
                        </button>
                        <button 
                          onClick={() => handlePropertyShare(property)}
                          className="flex items-center justify-center space-x-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors flex-1"
                        >
                          <Share2 size={18} />
                          <span className="text-sm font-medium">공유</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* 문의하기 버튼 */}
                    <div className="px-4 pb-3">
                      <button 
                        onClick={() => handlePropertyContact(property)}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-colors"
                      >
                        메시지 보내기
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 더 보기 버튼 */}
              <div className="mt-6 text-center">
                <button className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-lg font-medium text-gray-700 transition-colors">
                  더 보기
                </button>
              </div>

              {/* No Results */}
              {filteredProperties.length === 0 && dummyProperties.length === 0 && (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <div className="text-gray-500 text-lg mb-4">
                    등록된 부동산이 없습니다
                  </div>
                  <button 
                    onClick={() => handleFiltersChange({})}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    필터 초기화
                  </button>
                </div>
              )}
            </div>
          </main>
        </PortalLayout>

        {/* Floating Contact Button */}
        <FloatingContactButton />
      </div>
    </>
  );
}