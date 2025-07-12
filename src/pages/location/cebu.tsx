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
import { Waves, Plane, Building, MapPin, Users, Calendar, Wifi, Shield, Car } from 'lucide-react';

export default function CebuPage() {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [filters, setFilters] = useState<PropertyFilters>({ region: 'cebu' });

  // SEO 설정
  const seoConfig = useMemo(() => {
    const baseSEO = locationSEO.cebu;
    return getLocalizedSEO(baseSEO, currentLanguage);
  }, [currentLanguage]);

  // 빵 부스러기 생성
  const breadcrumbs = generateBreadcrumbs(router);

  // Cebu 지역 매물 필터링
  const cebuProperties = useMemo(() => {
    const allProperties = [...mockProperties, ...mockMonthlyStayProperties];
    return allProperties.filter(property => property.region === 'cebu');
  }, []);

  // 필터링된 매물
  const filteredProperties = useMemo(() => {
    let filtered = cebuProperties;
    
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
  }, [cebuProperties, filters]);

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
  };

  const handleFiltersChange = (newFilters: PropertyFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, region: 'cebu' }));
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
  const cebuFeatures = [
    {
      icon: <Waves className="h-8 w-8 text-blue-600" />,
      title: 'Island Paradise',
      description: 'Beautiful beaches, diving spots, and tropical lifestyle',
      details: ['Beach Access', 'Water Sports', 'Island Hopping', 'Diving Sites']
    },
    {
      icon: <Plane className="h-8 w-8 text-green-600" />,
      title: 'International Hub',
      description: 'Major airport, direct flights to Asia and worldwide',
      details: ['International Airport', 'Asian Hub', 'Direct Flights', 'Tourism Center']
    },
    {
      icon: <Building className="h-8 w-8 text-purple-600" />,
      title: 'IT Capital',
      description: 'Major BPO and IT hub with modern infrastructure',
      details: ['IT Parks', 'BPO Centers', 'Tech Companies', 'Modern Offices']
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: 'Safe & Friendly',
      description: 'Known for friendly locals and safe environment',
      details: ['Friendly Locals', 'Safe Areas', 'Expat Friendly', 'English Speaking']
    }
  ];

  const cebuDistricts = [
    {
      name: 'IT Park',
      description: 'Modern business district with high-rise condos and tech companies',
      properties: cebuProperties.filter(p => p.address.includes('IT Park')).length,
      averagePrice: 25000,
      highlights: ['Tech Hub', 'Modern Condos', 'Restaurants', 'Nightlife']
    },
    {
      name: 'Lahug',
      description: 'Upscale area with restaurants, schools, and shopping centers',
      properties: cebuProperties.filter(p => p.address.includes('Lahug')).length,
      averagePrice: 22000,
      highlights: ['Upscale Area', 'International Schools', 'Shopping', 'Restaurants']
    },
    {
      name: 'Ayala Center',
      description: 'Prime central location with shopping, dining, and entertainment',
      properties: cebuProperties.filter(p => p.address.includes('Ayala')).length,
      averagePrice: 28000,
      highlights: ['Central Location', 'Shopping Mall', 'Business District', 'Entertainment']
    },
    {
      name: 'Mactan Island',
      description: 'Beachfront living with resorts, beaches, and airport access',
      properties: cebuProperties.filter(p => p.address.includes('Mactan')).length,
      averagePrice: 20000,
      highlights: ['Beach Access', 'Resorts', 'Airport Nearby', 'Water Activities']
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
            addressLocality: "Cebu City",
            addressRegion: "Cebu",
            postalCode: "6000",
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
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl p-8 mb-8">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  🏝️ Cebu Apartments for Rent
                </h1>
                <p className="text-xl mb-6 opacity-90">
                  {(currentLanguage as string) === 'ko' && '세부 최고의 아파트를 찾아보세요. 아일랜드 파라다이스에서의 생활.'}
                  {(currentLanguage as string) === 'zh' && '找到宿务最好的公寓。在岛屿天堂中生活。'}
                  {(currentLanguage as string) === 'ja' && 'セブ最高のアパートを見つけてください。アイランドパラダイスでの生活。'}
                  {(currentLanguage as string) === 'en' && 'Find the best apartments in Cebu. Island paradise living at its finest.'}
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <div className="bg-white/20 px-4 py-2 rounded-full">
                    📍 {cebuProperties.length} Properties Available
                  </div>
                  <div className="bg-white/20 px-4 py-2 rounded-full">
                    🏖️ Beach Access
                  </div>
                  <div className="bg-white/20 px-4 py-2 rounded-full">
                    💼 IT Hub Location
                  </div>
                </div>
              </div>
            </div>

            {/* Cebu Features */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-center mb-8">Why Choose Cebu?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cebuFeatures.map((feature, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      {feature.icon}
                      <h3 className="text-lg font-semibold ml-3">{feature.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <ul className="space-y-1">
                      {feature.details.map((detail, i) => (
                        <li key={i} className="text-sm text-gray-500 flex items-center">
                          <span className="w-1 h-1 bg-cyan-500 rounded-full mr-2"></span>
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
              <h2 className="text-3xl font-bold text-center mb-8">Popular Areas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cebuDistricts.map((district, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">{district.name}</h3>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">{district.properties} properties</div>
                        <div className="text-lg font-bold text-cyan-600">₱{district.averagePrice.toLocaleString()}</div>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{district.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {district.highlights.map((highlight, i) => (
                        <span key={i} className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-sm">
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
              <h2 className="text-2xl font-bold mb-6">Find Your Perfect Cebu Apartment</h2>
              <PropertySearch 
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onSearch={() => {}}
                language={currentLanguage}
              />
            </div>

            {/* Results */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-gray-600">
                <span className="font-medium">{filteredProperties.length}</span> apartments found in Cebu
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
                  onClick={() => handleFiltersChange({ region: 'cebu' })}
                  className="text-primary hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* CTA Section */}
            <div className="bg-cyan-50 rounded-2xl p-8 mt-12 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Experience Cebu Island Life?</h3>
              <p className="text-gray-600 mb-6">
                Connect with our local Cebu experts for the best island living experience
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-cyan-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-cyan-700 transition-colors">
                  Contact Cebu Expert
                </button>
                <button className="border border-cyan-600 text-cyan-600 px-8 py-3 rounded-lg font-medium hover:bg-cyan-50 transition-colors">
                  Virtual Tour
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