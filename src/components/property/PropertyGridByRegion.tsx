import { Property } from '@/types/property';
import PropertyCard from './PropertyCard';
import { ChevronRight, MapPin } from 'lucide-react';

interface PropertyGridByRegionProps {
  properties: Property[];
  language?: string;
  onContact?: (property: Property) => void;
  onLike?: (property: Property) => void;
  onShare?: (property: Property) => void;
  viewMode?: 'grid' | 'list';
}

const regionNames = {
  manila: 'Manila',
  cebu: 'Cebu',
  angeles: 'Angeles',
  davao: 'Davao',
  boracay: 'Boracay',
  baguio: 'Baguio',
  'Metro Manila': 'Manila',
  'NCR': 'Manila',
};

const typeNames = {
  house: 'Houses',
  condo: 'Condos', 
  village: 'Villages',
  apartment: 'Apartments',
};

// 지역 우선순위 정렬
const regionOrder = ['manila', 'cebu', 'angeles', 'davao', 'baguio', 'boracay'];

// 타입 우선순위 정렬  
const typeOrder = ['house', 'condo', 'village', 'apartment'];

export default function PropertyGridByRegion({ 
  properties, 
  language = 'en', 
  onContact, 
  onLike, 
  onShare,
  viewMode = 'grid'
}: PropertyGridByRegionProps) {
  
  // 지역명 정규화 함수
  const normalizeRegion = (region: string): string => {
    const normalized = region.toLowerCase();
    if (normalized === 'metro manila' || normalized === 'ncr') return 'manila';
    return normalized;
  };

  // Group properties by region (정규화된 지역명 사용)
  const propertiesByRegion = properties.reduce((acc, property) => {
    const normalizedRegion = normalizeRegion(property.region);
    if (!acc[normalizedRegion]) {
      acc[normalizedRegion] = [];
    }
    acc[normalizedRegion].push(property);
    return acc;
  }, {} as Record<string, Property[]>);

  // 지역별로 정렬된 엔트리
  const sortedRegionEntries = Object.entries(propertiesByRegion).sort(([a], [b]) => {
    const aIndex = regionOrder.indexOf(a);
    const bIndex = regionOrder.indexOf(b);
    
    // 정의된 순서에 있는 지역들은 해당 순서대로
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    // 정의되지 않은 지역은 마지막에 알파벳 순으로
    if (aIndex === -1 && bIndex === -1) {
      return a.localeCompare(b);
    }
    // 정의된 지역이 정의되지 않은 지역보다 먼저
    return aIndex !== -1 ? -1 : 1;
  });

  // Group properties by type within each region (타입별 정렬)
  const getPropertiesByType = (regionProperties: Property[]) => {
    const grouped = regionProperties.reduce((acc, property) => {
      if (!acc[property.type]) {
        acc[property.type] = [];
      }
      acc[property.type].push(property);
      return acc;
    }, {} as Record<string, Property[]>);

    // 타입별로 정렬된 엔트리 반환
    return Object.entries(grouped).sort(([a], [b]) => {
      const aIndex = typeOrder.indexOf(a);
      const bIndex = typeOrder.indexOf(b);
      
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      if (aIndex === -1 && bIndex === -1) {
        return a.localeCompare(b);
      }
      return aIndex !== -1 ? -1 : 1;
    });
  };

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No properties found</div>
        <div className="text-gray-400 text-sm">
          Try adjusting your search criteria or browse all properties
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sortedRegionEntries.map(([region, regionProperties]) => (
        <div key={region} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Region Header */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-gray-900">
                  {regionNames[region as keyof typeof regionNames] || region.charAt(0).toUpperCase() + region.slice(1)}
                </h2>
                <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {regionProperties.length} properties
                </span>
              </div>
              <button className="flex items-center text-primary hover:text-blue-700 text-sm font-medium">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Properties by Type */}
          <div className="p-4">
            {getPropertiesByType(regionProperties).map(([type, typeProperties]) => (
              <div key={type} className="mb-6 last:mb-0">
                {/* Type Header */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-md font-medium text-gray-800 flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    {typeNames[type as keyof typeof typeNames] || type.charAt(0).toUpperCase() + type.slice(1)}
                    <span className="ml-2 text-sm text-gray-500">({typeProperties.length})</span>
                  </h3>
                  {typeProperties.length > 5 && (
                    <button className="text-primary hover:text-blue-700 text-sm font-medium">
                      View More
                    </button>
                  )}
                </div>

                {/* Properties Grid */}
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3" 
                  : "space-y-4"}>
                  {typeProperties
                    .sort((a, b) => {
                      // Featured properties first
                      if (a.featured && !b.featured) return -1;
                      if (!a.featured && b.featured) return 1;
                      // Then by price (ascending)
                      return a.price - b.price;
                    })
                    .slice(0, 5)
                    .map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        language={language}
                        onContact={onContact}
                        onLike={onLike}
                        onShare={onShare}
                        viewMode={viewMode}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}