import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import DynamicHeader from '@/components/common/DynamicHeader';
import PropertyGridByRegion from '@/components/property/PropertyGridByRegion';
import PropertySearch from '@/components/property/PropertySearch';
import CategorySelector from '@/components/property/CategorySelector';
import FloatingContactButton from '@/components/common/FloatingContactButton';
import PortalLayout from '@/components/layout/PortalLayout';
import SEOHead from '@/components/seo/SEOHead';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';
import { Property, PropertyFilters } from '@/types/property';
import { mockProperties } from '@/data/mockProperties';
import { mockMonthlyStayProperties } from '@/data/mockMonthlyStayProperties';
import { defaultSEO, getLocalizedSEO } from '@/utils/seo';
import { 
  MapPin, Building, Users, Star, Phone, Mail, MessageCircle, 
  Plane, Car, Utensils, ShoppingBag, Gamepad2, Coffee, Wifi, 
  Shield, Camera, Heart, Share2, Clock, Calendar, Target
} from 'lucide-react';

export default function AngelesPage() {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [filters, setFilters] = useState<PropertyFilters>({ region: 'angeles' });

  // SEO 설정
  const seoConfig = useMemo(() => {
    const baseSEO = {
      title: (currentLanguage as string) === 'ko' ? '앙헬레스 렌탈 - 외국인을 위한 프리미엄 매물 | 필리핀 렌탈' :
             (currentLanguage as string) === 'zh' ? '安吉利斯市租房 - 外国人专属优质房源 | 菲律宾租房' :
             (currentLanguage as string) === 'ja' ? 'アンヘレス市賃貸 - 外国人向けプレミアム物件 | フィリピン賃貸' :
             'Angeles City Rentals - Premium Properties for Foreigners | Philippines Rental',
      description: (currentLanguage as string) === 'ko' ? '필리핀 앙헬레스 시의 프리미엄 렌탈 매물을 찾아보세요. 클라크, 엔터테인먼트 지구, 공항 근처의 검증된 아파트와 콘도. 외국인과 디지털 노마드에게 완벽.' :
                   (currentLanguage as string) === 'zh' ? '在菲律宾安吉利斯市寻找优质租赁房源。靠近克拉克、娱乐区和机场的经过验证的公寓和共管公寓。最适合外籍人士和数字游民。' :
                   (currentLanguage as string) === 'ja' ? 'フィリピン、アンヘレス市のプレミアム賃貸物件を見つけます。クラーク、エンターテインメント地区、空港近くの検証済みアパートメントとコンドミニアム。外国人とデジタルノマドに最適。' :
                   'Find premium rental properties in Angeles City, Philippines. Verified apartments and condos near Clark, entertainment districts, and airports. Perfect for expats and digital nomads.',
      keywords: (currentLanguage as string) === 'ko' ? '앙헬레스 렌탈, 클라크 렌탈, 필리핀 아파트, 앙헬레스 콘도, 클라크 공군기지, 엔터테인먼트 지구, 외국인 주거, 디지털 노마드, 가구 완비 아파트, 단기 렌탈' :
                (currentLanguage as string) === 'zh' ? '安吉利斯市租房, 克拉克租房, 菲律宾公寓, 安吉利斯共管公寓, 克拉克空军基地, 娱乐区, 外籍人士住房, 数字游民, 带家具公寓, 短期租赁' :
                (currentLanguage as string) === 'ja' ? 'アンヘレス市賃貸, クラーク賃貸, フィリピンアパート, アンヘレスコンドミニアム, クラーク空軍基地, エンターテインメント地区, 外国人住宅, デジタルノマド, 家具付きアパート, 短期賃貸' :
                'Angeles City rental, Clark rental, Philippines apartments, Angeles condos, Clark Airbase, entertainment district, expat housing, digital nomad, furnished apartments, short term rental',
      image: '/images/locations/angeles-hero.jpg'
    };
    
    return baseSEO;
  }, [currentLanguage]);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Locations', url: '/locations' },
    { name: 'Angeles', url: '/location/angeles' }
  ];

  // 모든 매물 결합
  const allProperties = useMemo(() => {
    return [...mockProperties, ...mockMonthlyStayProperties];
  }, []);

  // 필터링된 매물 (Angeles 지역)
  const filteredProperties = useMemo(() => {
    let filtered = allProperties.filter(property => property.region === 'angeles');
    
    if (filters.type) {
      filtered = filtered.filter(property => property.type === filters.type);
    }
    
    if (filters.category) {
      if (filters.category === 'monthly_stay') {
        filtered = filtered.filter(property => property.monthlyStay?.available);
      } else if (filters.category === 'long_term') {
        filtered = filtered.filter(property => !property.monthlyStay?.available);
      }
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
  }, [allProperties, filters]);

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
  };

  const handleFiltersChange = (newFilters: PropertyFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, region: 'angeles' }));
  };

  const handlePropertyContact = (property: Property) => {
    if (property.contact.whatsapp) {
      window.open(`https://wa.me/${property.contact.whatsapp}`, '_blank');
    }
  };

  const handlePropertyLike = (property: Property) => {
    console.log('Liked property:', property.id);
  };

  const handlePropertyShare = (property: Property) => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: `/property/${property.id}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/property/${property.id}`);
    }
  };

  const clearFilters = () => {
    setFilters({ region: 'angeles' });
  };

  const cityHighlights = [
    {
      icon: <Plane className="h-6 w-6" />,
      title: 'Clark International Airport',
      description: 'Major international gateway with direct flights to Asia and beyond',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: <Gamepad2 className="h-6 w-6" />,
      title: 'Entertainment District',
      description: 'Famous nightlife and entertainment venues for international visitors',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: <ShoppingBag className="h-6 w-6" />,
      title: 'SM City Clark',
      description: 'Modern shopping mall with international brands and dining options',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: <Car className="h-6 w-6" />,
      title: 'Clark Freeport Zone',
      description: 'Business district with modern infrastructure and facilities',
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const neighborhoods = [
    {
      name: 'Balibago',
      description: 'Famous entertainment district with bars, restaurants, and nightlife',
      properties: 45,
      avgPrice: 35000,
      highlights: ['Entertainment venues', 'International restaurants', 'Hotel strip']
    },
    {
      name: 'Clark Freeport',
      description: 'Modern business district with upscale residences and offices',
      properties: 28,
      avgPrice: 55000,
      highlights: ['Business district', 'Modern infrastructure', 'Golf courses']
    },
    {
      name: 'Malabanias',
      description: 'Central area with local markets and authentic Filipino culture',
      properties: 32,
      avgPrice: 28000,
      highlights: ['Local markets', 'Traditional Filipino food', 'Central location']
    },
    {
      name: 'Hensonville',
      description: 'Residential area popular with expats and long-term residents',
      properties: 38,
      avgPrice: 42000,
      highlights: ['Expat community', 'Quiet residential', 'Family-friendly']
    }
  ];

  const amenities = [
    {
      icon: <Wifi className="h-5 w-5" />,
      title: 'High-Speed Internet',
      description: 'Fiber optic connections up to 100 Mbps'
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: '24/7 Security',
      description: 'Professional security services and CCTV monitoring'
    },
    {
      icon: <Car className="h-5 w-5" />,
      title: 'Airport Proximity',
      description: 'Just 10-15 minutes from Clark International Airport'
    },
    {
      icon: <Coffee className="h-5 w-5" />,
      title: 'Dining & Entertainment',
      description: 'International restaurants and vibrant nightlife scene'
    }
  ];

  const stats = [
    { number: filteredProperties.length.toString(), label: 'Properties Available', icon: <Building className="h-5 w-5" /> },
    { number: '4', label: 'Neighborhoods', icon: <MapPin className="h-5 w-5" /> },
    { number: '₱35K', label: 'Average Rent', icon: <Target className="h-5 w-5" /> },
    { number: '98%', label: 'Occupancy Rate', icon: <Star className="h-5 w-5" /> }
  ];

  return (
    <>
      <SEOHead
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        image={seoConfig.image}
        type="website"
        locale={currentLanguage}
        alternateLocales={['en', 'ko', 'zh', 'ja']}
      />
      
      <BreadcrumbSchema items={breadcrumbs} />

      <div className="min-h-screen bg-gray-50">
        <DynamicHeader 
          currentLanguage={currentLanguage} 
          onLanguageChange={handleLanguageChange} 
        />
        
        <PortalLayout>
          <main className="py-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                🏢 Angeles City Rentals
              </h1>
              <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
                {(currentLanguage as string) === 'ko' && '클라크 국제공항 근처의 앙헬레스 시티에서 프리미엄 렌탈 매물을 찾아보세요. 외국인과 디지털 노마드를 위한 완벽한 위치입니다.'}
                {(currentLanguage as string) === 'zh' && '在靠近克拉克国际机场的安吉利斯市寻找优质租赁房源。外籍人士和数字游民的理想地点。'}
                {(currentLanguage as string) === 'ja' && 'クラーク国際空港近くのアンヘレス市でプレミアム賃貸物件を見つけます。外国人とデジタルノマドに最適な場所です。'}
                {(currentLanguage as string) === 'en' && 'Find premium rental properties in Angeles City near Clark International Airport. Perfect location for expats and digital nomads.'}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      {stat.icon}
                    </div>
                    <div className="text-lg font-bold text-gray-900">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* City Highlights */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-center mb-8">Why Choose Angeles City</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cityHighlights.map((highlight, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                    <div className={`w-12 h-12 ${highlight.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      {highlight.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{highlight.title}</h3>
                    <p className="text-gray-600 text-sm">{highlight.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Neighborhoods */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-center mb-8">Popular Neighborhoods</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {neighborhoods.map((neighborhood, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{neighborhood.name}</h3>
                      <span className="text-sm text-blue-600 font-medium">{neighborhood.properties} properties</span>
                    </div>
                    <p className="text-gray-600 mb-4">{neighborhood.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500">Average rent:</span>
                      <span className="text-lg font-bold text-gray-900">₱{neighborhood.avgPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {neighborhood.highlights.map((highlight, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-center mb-8">Key Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {amenities.map((amenity, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
                        {amenity.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900">{amenity.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{amenity.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Search Section */}
            <div className="mb-8">
              <PropertySearch 
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onSearch={() => {}}
                language={currentLanguage}
              />
            </div>

            {/* Category Selector */}
            <div className="mb-8">
              <CategorySelector 
                filters={filters}
                onFiltersChange={handleFiltersChange}
                language={currentLanguage}
              />
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-gray-600">
                <span className="font-medium">{filteredProperties.length}</span> properties found in Angeles City
                {Object.keys(filters).length > 1 && (
                  <button 
                    onClick={clearFilters}
                    className="ml-4 text-blue-600 hover:text-blue-700 text-sm underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>

            {/* Properties Display */}
            {filteredProperties.length > 0 ? (
              <PropertyGridByRegion 
                properties={filteredProperties}
                language={currentLanguage}
                onContact={handlePropertyContact}
                onLike={handlePropertyLike}
                onShare={handlePropertyShare}
              />
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Found</h3>
                <p className="text-gray-600 mb-6">
                  No properties match your current search criteria in Angeles City. Try adjusting your filters.
                </p>
                <button 
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Contact CTA */}
            <div className="bg-blue-50 rounded-2xl p-8 mt-12 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Need Help Finding Properties in Angeles?
              </h3>
              <p className="text-gray-600 mb-6">
                Our local Angeles City experts can help you find the perfect rental property.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/contact')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Contact Local Expert
                </button>
                <button
                  onClick={() => window.open('https://wa.me/639123456789', '_blank')}
                  className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  WhatsApp Us
                </button>
              </div>
            </div>
          </main>
        </PortalLayout>

        <FloatingContactButton />
      </div>
    </>
  );
}