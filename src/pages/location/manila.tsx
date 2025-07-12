import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import DynamicHeader from '@/components/common/DynamicHeader';
import PropertyGridByRegion from '@/components/property/PropertyGridByRegion';
import PropertySearch from '@/components/property/PropertySearch';
import FloatingContactButton from '@/components/common/FloatingContactButton';
import PortalLayout from '@/components/layout/PortalLayout';
import SEOHead from '@/components/seo/SEOHead';
import { BreadcrumbSchema, RealEstateSchema } from '@/components/seo/JsonLd';
import { Property, PropertyFilters } from '@/types/property';
import { mockProperties } from '@/data/mockProperties';
import { mockMonthlyStayProperties } from '@/data/mockMonthlyStayProperties';
import { locationSEO, getLocalizedSEO, generateBreadcrumbs } from '@/utils/seo';
import { Building, MapPin, Users, Calendar, Wifi, Shield, Car } from 'lucide-react';

export default function ManilaPage() {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [filters, setFilters] = useState<PropertyFilters>({ region: 'manila' });

  // SEO 설정
  const seoConfig = useMemo(() => {
    const baseSEO = locationSEO.manila;
    return getLocalizedSEO(baseSEO, currentLanguage);
  }, [currentLanguage]);

  // 빵 부스러기 생성
  const breadcrumbs = generateBreadcrumbs(router);

  // Manila 지역 매물 필터링
  const manilaProperties = useMemo(() => {
    const allProperties = [...mockProperties, ...mockMonthlyStayProperties];
    return allProperties.filter(property => property.region === 'manila');
  }, []);

  // 필터링된 매물
  const filteredProperties = useMemo(() => {
    let filtered = manilaProperties;
    
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
    
    return filtered;
  }, [manilaProperties, filters]);

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
  };

  const handleFiltersChange = (newFilters: PropertyFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, region: 'manila' }));
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
    }
  };

  // 지역 특징 데이터
  const manilaFeatures = [
    {
      icon: <Building className="h-8 w-8 text-blue-600" />,
      title: 'Business Districts',
      description: 'Makati, BGC, Ortigas - Prime business locations',
      details: ['Makati CBD', 'Bonifacio Global City', 'Ortigas Center', 'Manila Bay Area']
    },
    {
      icon: <MapPin className="h-8 w-8 text-green-600" />,
      title: 'Transportation',
      description: 'MRT, LRT, buses, and jeepneys connectivity',
      details: ['MRT/LRT Access', 'Airport Proximity', 'Grab/Taxi Available', 'Bus Terminals']
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: 'Expat Community',
      description: 'Large foreign community with international amenities',
      details: ['International Schools', 'Expat Communities', 'Foreign Restaurants', 'English Friendly']
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: 'Safety & Security',
      description: '24/7 security, gated communities, safe neighborhoods',
      details: ['24/7 Security', 'Gated Communities', 'CCTV Surveillance', 'Safe Areas']
    }
  ];

  const manilaDistricts = [
    {
      name: 'Makati',
      description: 'Premier business district with luxury condos and amenities',
      properties: manilaProperties.filter(p => p.address.includes('Makati')).length,
      averagePrice: 35000,
      highlights: ['CBD Location', 'Luxury Condos', 'Shopping Malls', 'Restaurants']
    },
    {
      name: 'BGC (Bonifacio Global City)',
      description: 'Modern planned city with high-rise living and green spaces',
      properties: manilaProperties.filter(p => p.address.includes('BGC') || p.address.includes('Bonifacio')).length,
      averagePrice: 45000,
      highlights: ['Modern City', 'Green Spaces', 'International Brands', 'Nightlife']
    },
    {
      name: 'Ortigas',
      description: 'Established business district with diverse housing options',
      properties: manilaProperties.filter(p => p.address.includes('Ortigas')).length,
      averagePrice: 28000,
      highlights: ['Business Hub', 'Shopping Centers', 'Hospitals', 'Universities']
    },
    {
      name: 'Manila Bay',
      description: 'Waterfront living with stunning bay views and entertainment',
      properties: manilaProperties.filter(p => p.address.includes('Manila Bay') || p.address.includes('Malate')).length,
      averagePrice: 32000,
      highlights: ['Bay Views', 'Entertainment', 'Restaurants', 'Sunset Views']
    }
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
      
      {/* 대표 매물에 대한 구조화된 데이터 */}
      {filteredProperties.length > 0 && (
        <RealEstateSchema
          name={filteredProperties[0].title}
          description={filteredProperties[0].description}
          url={`${process.env.NEXT_PUBLIC_SITE_URL}/property/${filteredProperties[0].id}`}
          image={[typeof filteredProperties[0].images[0] === 'string' ? filteredProperties[0].images[0] : (filteredProperties[0].images[0]?.url || '/images/default-property.jpg')]}
          address={{
            streetAddress: filteredProperties[0].address,
            addressLocality: "Manila",
            addressRegion: "NCR",
            postalCode: "1000",
            addressCountry: "Philippines"
          }}
          floorSize={{
            value: filteredProperties[0].area,
            unitCode: "SQM"
          }}
          numberOfRooms={filteredProperties[0].bedrooms}
          numberOfBathroomsTotal={filteredProperties[0].bathrooms}
          amenityFeature={filteredProperties[0].amenities}
          offers={{
            price: filteredProperties[0].price.toString(),
            priceCurrency: "PHP",
            availability: "InStock",
            validFrom: new Date().toISOString(),
            priceSpecification: {
              price: filteredProperties[0].price.toString(),
              priceCurrency: "PHP",
              unitCode: "MON"
            }
          }}
        />
      )}

      <div className="min-h-screen bg-gray-50">
        <DynamicHeader 
          currentLanguage={currentLanguage} 
          onLanguageChange={handleLanguageChange} 
        />
        
        <PortalLayout>
          <main className="py-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 mb-8">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  🏙️ Manila Apartments for Rent
                </h1>
                <p className="text-xl mb-6 opacity-90">
                  {currentLanguage === 'ko' && '마닐라 최고의 아파트를 찾아보세요. 외국인 전용 프리미엄 서비스.'}
                  {currentLanguage === 'zh' && '找到马尼拉最好的公寓。外国人专用优质服务。'}
                  {currentLanguage === 'ja' && 'マニラ最高のアパートを見つけてください。外国人専用プレミアムサービス。'}
                  {currentLanguage === 'en' && 'Find the best apartments in Manila. Premium service for foreigners.'}
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <div className="bg-white/20 px-4 py-2 rounded-full">
                    📍 {manilaProperties.length} Properties Available
                  </div>
                  <div className="bg-white/20 px-4 py-2 rounded-full">
                    💰 From ₱15,000/month
                  </div>
                  <div className="bg-white/20 px-4 py-2 rounded-full">
                    🌐 Multilingual Support
                  </div>
                </div>
              </div>
            </div>

            {/* Manila Features */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-center mb-8">Why Choose Manila?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {manilaFeatures.map((feature, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      {feature.icon}
                      <h3 className="text-lg font-semibold ml-3">{feature.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <ul className="space-y-1">
                      {feature.details.map((detail, i) => (
                        <li key={i} className="text-sm text-gray-500 flex items-center">
                          <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Districts */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-center mb-8">Popular Districts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {manilaDistricts.map((district, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">{district.name}</h3>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">{district.properties} properties</div>
                        <div className="text-lg font-bold text-blue-600">₱{district.averagePrice.toLocaleString()}</div>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{district.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {district.highlights.map((highlight, i) => (
                        <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Search Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Find Your Perfect Manila Apartment</h2>
              <PropertySearch 
                filters={filters}
                onFiltersChange={handleFiltersChange}
                language={currentLanguage}
              />
            </div>

            {/* Results */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-gray-600">
                <span className="font-medium">{filteredProperties.length}</span> apartments found in Manila
              </div>
            </div>

            {/* Properties Grid */}
            <PropertyGridByRegion 
              properties={filteredProperties}
              language={currentLanguage}
              onContact={handlePropertyContact}
              onLike={handlePropertyLike}
              onShare={handlePropertyShare}
            />

            {/* No Results */}
            {filteredProperties.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">
                  No properties found matching your criteria
                </div>
                <button 
                  onClick={() => handleFiltersChange({ region: 'manila' })}
                  className="text-primary hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* CTA Section */}
            <div className="bg-blue-50 rounded-2xl p-8 mt-12 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Find Your Manila Home?</h3>
              <p className="text-gray-600 mb-6">
                Get personalized recommendations from our Manila rental experts
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Contact Manila Expert
                </button>
                <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  Schedule Viewing
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