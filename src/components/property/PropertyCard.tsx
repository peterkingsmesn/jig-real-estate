import { useState } from 'react';
import { Property, PropertyImage } from '@/types/property';
import { Heart, MessageCircle, Share2, MapPin, Bed, Bath, Square } from 'lucide-react';
import Image from 'next/image';

interface PropertyCardProps {
  property: Property;
  onContact?: (property: Property) => void;
  onLike?: (property: Property) => void;
  onShare?: (property: Property) => void;
  language?: string;
  viewMode?: 'grid' | 'list';
}

export default function PropertyCard({ 
  property, 
  onContact, 
  onLike, 
  onShare, 
  language = 'en',
  viewMode = 'grid'
}: PropertyCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(property);
  };

  const handleContact = () => {
    onContact?.(property);
  };

  const handleShare = () => {
    onShare?.(property);
  };

  const getTranslatedTitle = () => {
    if (language === 'ko' && property.titleKo) return property.titleKo;
    if (language === 'zh' && property.titleZh) return property.titleZh;
    if (language === 'ja' && property.titleJa) return property.titleJa;
    return property.title;
  };

  const getTranslatedDescription = () => {
    if (language === 'ko' && property.descriptionKo) return property.descriptionKo;
    if (language === 'zh' && property.descriptionZh) return property.descriptionZh;
    if (language === 'ja' && property.descriptionJa) return property.descriptionJa;
    return property.description;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getTypeLabel = (type: string) => {
    const typeLabels = {
      house: { ko: '단독주택', zh: '独栋房', ja: '一戸建て', en: 'House' },
      condo: { ko: '콘도', zh: '公寓', ja: 'コンド', en: 'Condo' },
      village: { ko: '빌리지', zh: '别墅区', ja: 'ビレッジ', en: 'Village' },
    };
    return typeLabels[type as keyof typeof typeLabels]?.[language as keyof typeof typeLabels.house] || type;
  };

  const mainImage = property.images && property.images.length > 0
    ? (typeof property.images[0] === 'string' 
        ? property.images[0] 
        : (property.images as PropertyImage[]).find(img => img.isMain) || property.images[0])
    : null;

  return (
    <div 
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group border border-gray-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative h-32 overflow-hidden">
        <Image
          src={mainImage 
            ? (typeof mainImage === 'string' ? mainImage : mainImage.url)
            : '/placeholder-property.jpg'}
          alt={mainImage 
            ? (typeof mainImage === 'string' ? getTranslatedTitle() : mainImage.alt)
            : getTranslatedTitle()}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {property.featured && (
            <span className="bg-accent text-white px-2 py-1 rounded-full text-xs font-medium">
              Featured
            </span>
          )}
          <span className="bg-primary text-white px-2 py-1 rounded-full text-xs font-medium">
            {getTypeLabel(property.type)}
          </span>
        </div>

        {/* Heart button */}
        <button
          onClick={handleLike}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <Heart 
            className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        </button>

        {/* Price badge */}
        <div className="absolute bottom-3 left-3 bg-secondary text-white px-3 py-1 rounded-full">
          <span className="text-sm font-semibold">{formatPrice(property.price)}/month</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-2">
        {/* Title */}
        <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
          {getTranslatedTitle()}
        </h3>

        {/* Location */}
        <div className="flex items-center text-primary text-xs mb-2">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{property.address}</span>
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Bed className="h-3 w-3 mr-1" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-3 w-3 mr-1" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center">
              <Square className="h-3 w-3 mr-1" />
              <span>{property.area}m²</span>
            </div>
          </div>
          {property.furnished && (
            <span className="text-secondary text-xs">Furnished</span>
          )}
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1 mb-3">
          {property.amenities.slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
            >
              {amenity}
            </span>
          ))}
          {property.amenities.length > 3 && (
            <span className="text-gray-500 text-xs">
              +{property.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <button
            onClick={handleContact}
            className="flex items-center space-x-1 bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            <MessageCircle className="h-3 w-3" />
            <span>Contact</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Share2 className="h-3 w-3 text-gray-600" />
            </button>
            
            {property.contact.whatsapp && (
              <button
                onClick={() => window.open(`https://wa.me/${property.contact.whatsapp}`, '_blank')}
                className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs hover:bg-green-600 transition-colors"
              >
                WhatsApp
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}