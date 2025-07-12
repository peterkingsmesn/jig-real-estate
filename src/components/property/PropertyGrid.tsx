import { Property } from '@/types/property';
import PropertyCard from './PropertyCard';

interface PropertyGridProps {
  properties: Property[];
  language?: string;
  onContact?: (property: Property) => void;
  onLike?: (property: Property) => void;
  onShare?: (property: Property) => void;
}

export default function PropertyGrid({ 
  properties, 
  language = 'en', 
  onContact, 
  onLike, 
  onShare 
}: PropertyGridProps) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          language={language}
          onContact={onContact}
          onLike={onLike}
          onShare={onShare}
        />
      ))}
    </div>
  );
}