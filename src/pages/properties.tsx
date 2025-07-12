import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import FacebookLayout from '@/components/layout/FacebookLayout';
import PropertyGridByRegion from '@/components/property/PropertyGridByRegion';
import PropertySearch from '@/components/property/PropertySearch';
import CategorySelector from '@/components/property/CategorySelector';
import FloatingContactButton from '@/components/common/FloatingContactButton';
import SEOHead from '@/components/seo/SEOHead';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';
import { Property, PropertyFilters } from '@/types/property';
import { mockProperties } from '@/data/mockProperties';
import { mockMonthlyStayProperties } from '@/data/mockMonthlyStayProperties';
import { defaultSEO, getLocalizedSEO } from '@/utils/seo';
import { Filter, Grid, List, SlidersHorizontal, MapPin, Building, Users, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function PropertiesPage() {
  const router = useRouter();
  const currentLanguage = 'ko';
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  // SEO 설정
  const seoConfig = useMemo(() => {
    const baseSEO = defaultSEO.properties;
    return getLocalizedSEO(baseSEO, currentLanguage);
  }, [currentLanguage]);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Properties', url: '/properties' }
  ];

  // 모든 매물 결합
  const allProperties = useMemo(() => {
    return [...mockProperties, ...mockMonthlyStayProperties];
  }, []);

  // 필터링된 매물
  const filteredProperties = useMemo(() => {
    let filtered = allProperties;
    
    if (filters.region) {
      filtered = filtered.filter(property => property.region === filters.region);
    }
    
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

  // 지역별 통계
  const regionStats = useMemo(() => {
    const stats = allProperties.reduce((acc, property) => {
      const region = property.region;
      if (!acc[region]) {
        acc[region] = { count: 0, avgPrice: 0, totalPrice: 0 };
      }
      acc[region].count++;
      acc[region].totalPrice += property.price;
      acc[region].avgPrice = Math.round(acc[region].totalPrice / acc[region].count);
      return acc;
    }, {} as Record<string, { count: number; avgPrice: number; totalPrice: number }>);
    
    return Object.entries(stats).map(([region, data]) => ({
      region,
      ...data
    }));
  }, [allProperties]);


  // 검색 기능
  const searchProperties = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.region) queryParams.append('region', filters.region);
      if (filters.type) queryParams.append('propertyType', filters.type);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
      if (filters.bedrooms) queryParams.append('bedrooms', filters.bedrooms.toString());
      if (filters.bathrooms) queryParams.append('bathrooms', filters.bathrooms.toString());
      if (filters.search) queryParams.append('search', filters.search);

      const response = await fetch(`/api/properties/search?${queryParams}`);
      const data = await response.json();

      if (response.ok) {
        setProperties(data.properties);
      } else {
        throw new Error('Failed to fetch properties');
      }
    } catch (error) {
      toast.error('매물 검색 중 오류가 발생했습니다.');
      console.error('Search error:', error);
      // 오류 시 목 데이터 사용
      setProperties([...mockProperties, ...mockMonthlyStayProperties]);
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드 및 필터 변경 시 검색
  useEffect(() => {
    // 초기에는 목 데이터 사용
    setProperties([...mockProperties, ...mockMonthlyStayProperties]);
  }, []);

  const handleFiltersChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
  };

  const handlePropertyContact = (property: Property) => {
    if (property.contact.whatsapp) {
      window.open(`https://wa.me/${property.contact.whatsapp}`, '_blank');
    }
  };

  const handlePropertyLike = async (property: Property) => {
    try {
      const response = await fetch(`/api/properties/${property.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        toast.success('좋아요를 눌렀습니다!');
        // 좋아요 수 업데이트
        searchProperties();
      }
    } catch (error) {
      toast.error('좋아요 처리 중 오류가 발생했습니다.');
      console.error('Like error:', error);
    }
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
    setFilters({});
  };

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

      <FacebookLayout section="properties">
          <main className="py-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                🏢 All Properties
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                필리핀 전역의 프리미엄 렌탈 매물을 찾아보세요. 외국인을 위한 검증된 매물들입니다.
              </p>

              {/* 매물 등록 버튼 */}
              <div className="mb-6">
                <button
                  onClick={() => router.push('/properties/add')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>매물 등록하기</span>
                </button>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                  📍 {allProperties.length} Properties Available
                </div>
                <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                  🏙️ {regionStats.length} Cities
                </div>
                <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                  💰 From ₱{Math.min(...allProperties.map(p => p.price)).toLocaleString()}/month
                </div>
                <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                  🌐 Multilingual Support
                </div>
              </div>
            </div>

            {/* Region Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {regionStats.map((stat) => (
                <div key={stat.region} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
                  <div className="text-lg font-bold text-gray-900 capitalize">{stat.region}</div>
                  <div className="text-sm text-gray-600 mb-1">{stat.count} properties</div>
                  <div className="text-sm font-medium text-blue-600">
                    Avg: ₱{stat.avgPrice.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Search Section */}
            <div className="mb-8">
              <PropertySearch 
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onSearch={searchProperties}
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

            {/* Controls */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              {/* Results Info */}
              <div className="text-gray-600">
                <span className="font-medium">{filteredProperties.length}</span> of {allProperties.length} properties found
                {Object.keys(filters).length > 0 && (
                  <button 
                    onClick={clearFilters}
                    className="ml-4 text-blue-600 hover:text-blue-700 text-sm underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              {/* View Controls */}
              <div className="flex items-center gap-4">
                {/* Sort */}
                <select
                  value={filters.sortBy || ''}
                  onChange={(e) => handleFiltersChange({ ...filters, sortBy: e.target.value as any })}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sort by</option>
                  <option value="price">Price: Low to High</option>
                  <option value="date">Newest First</option>
                  <option value="popularity">Most Popular</option>
                </select>

                {/* View Mode */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </button>
              </div>
            </div>

            {/* Active Filters */}
            {Object.keys(filters).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.region && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {filters.region}
                  </span>
                )}
                {filters.type && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    {filters.type}
                  </span>
                )}
                {filters.category && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {filters.category === 'monthly_stay' ? 'Monthly Stay' : 'Long Term'}
                  </span>
                )}
                {filters.bedrooms && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    {filters.bedrooms}+ bedrooms
                  </span>
                )}
                {filters.furnished !== undefined && (
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                    {filters.furnished ? 'Furnished' : 'Unfurnished'}
                  </span>
                )}
              </div>
            )}

            {/* Properties Display */}
            {filteredProperties.length > 0 ? (
              <PropertyGridByRegion 
                properties={filteredProperties}
                language={currentLanguage}
                onContact={handlePropertyContact}
                onLike={handlePropertyLike}
                onShare={handlePropertyShare}
                viewMode={viewMode}
              />
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Found</h3>
                <p className="text-gray-600 mb-6">
                  No properties match your current search criteria. Try adjusting your filters.
                </p>
                <button 
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Call to Action */}
            <div className="bg-blue-50 rounded-2xl p-8 mt-12 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Can't Find What You're Looking For?
              </h3>
              <p className="text-gray-600 mb-6">
                Our expert team can help you find properties that match your specific requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/contact')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Contact Property Expert
                </button>
                <button
                  onClick={() => router.push('/owner/submit')}
                  className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  List Your Property
                </button>
              </div>
            </div>
          </main>
        <FloatingContactButton />
      </FacebookLayout>
    </>
  );
}