import { useState } from 'react';
import { Property, PropertyImage } from '@/types/property';
import { 
  Calendar, 
  MapPin, 
  Wifi, 
  Star, 
  Clock, 
  Users,
  Plane,
  Coffee,
  Shield,
  Briefcase,
  Heart,
  Share2,
  MessageCircle
} from 'lucide-react';
import Image from 'next/image';

interface MonthlyStayCardProps {
  property: Property;
  onContact?: (property: Property) => void;
  onLike?: (property: Property) => void;
  onShare?: (property: Property) => void;
  language?: string;
}

export default function MonthlyStayCard({ 
  property, 
  onContact, 
  onLike, 
  onShare, 
  language = 'en' 
}: MonthlyStayCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showPackages, setShowPackages] = useState(false);

  const monthlyStay = property.monthlyStay;
  if (!monthlyStay) return null;

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
    const translation = property.translations?.[language as keyof typeof property.translations];
    return translation?.title || property.title;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getDiscountedPrice = (originalPrice: number, discount: number) => {
    return originalPrice - (originalPrice * discount / 100);
  };

  const mainImage = typeof property.images[0] === 'string' 
    ? property.images[0] 
    : (property.images as PropertyImage[]).find(img => img.isMain) || property.images[0];
  const popularPackage = monthlyStay.packages.find(pkg => pkg.popular);

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 4.0) return 'text-blue-600';
    if (score >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDurationBadge = () => {
    const min = monthlyStay.minStayDays;
    if (min <= 7) return { text: 'Short Stay', color: 'bg-blue-100 text-blue-700' };
    if (min <= 30) return { text: 'Monthly Stay', color: 'bg-green-100 text-green-700' };
    return { text: 'Long Stay', color: 'bg-purple-100 text-purple-700' };
  };

  const durationBadge = getDurationBadge();

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {mainImage ? (
          <Image
            src={typeof mainImage === 'string' ? mainImage : mainImage.url}
            alt={typeof mainImage === 'string' ? getTranslatedTitle() : (mainImage.alt || getTranslatedTitle())}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-4xl mb-2">🏖️</div>
              <div className="text-sm font-medium">Monthly Stay</div>
            </div>
          </div>
        )}
        
        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${durationBadge.color}`}>
            {durationBadge.text}
          </span>
          {monthlyStay.monthlyDiscount > 0 && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              -{monthlyStay.monthlyDiscount}% Monthly
            </span>
          )}
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

        {/* Overall Score */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
            <span className={`text-sm font-semibold ${getScoreColor(monthlyStay.scores.overall)}`}>
              {monthlyStay.scores.overall.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title and Location */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">
            {getTranslatedTitle()}
          </h3>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{property.address}</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
          <div className="text-center p-2 bg-blue-50 rounded">
            <Wifi className="h-3 w-3 mx-auto mb-1 text-blue-600" />
            <span className="text-blue-700 font-medium">
              {monthlyStay.scores.wifi_quality.toFixed(1)}
            </span>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <Shield className="h-3 w-3 mx-auto mb-1 text-green-600" />
            <span className="text-green-700 font-medium">
              {monthlyStay.scores.safety.toFixed(1)}
            </span>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded">
            <Coffee className="h-3 w-3 mx-auto mb-1 text-purple-600" />
            <span className="text-purple-700 font-medium">
              {monthlyStay.scores.living_convenience.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Key Amenities */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {monthlyStay.travelerAmenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
              >
                {amenity.name}
              </span>
            ))}
            {monthlyStay.travelerAmenities.length > 3 && (
              <span className="text-gray-500 text-xs py-1">
                +{monthlyStay.travelerAmenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Duration and Check-in */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{monthlyStay.minStayDays}-{monthlyStay.maxStayDays} days</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>Check-in {monthlyStay.checkInTime}</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-4">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-bold text-secondary">
                {formatPrice(property.price)}
              </span>
              <span className="text-gray-600 text-sm">/month</span>
            </div>
            {monthlyStay.monthlyDiscount > 0 && (
              <div className="text-right">
                <div className="text-xs text-gray-500 line-through">
                  {formatPrice(property.price / (1 - monthlyStay.monthlyDiscount / 100))}
                </div>
                <div className="text-xs text-green-600 font-medium">
                  Save {monthlyStay.monthlyDiscount}%
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Popular Package */}
        {popularPackage && (
          <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-blue-900">
                🎁 {popularPackage.name}
              </span>
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                Popular
              </span>
            </div>
            <p className="text-xs text-blue-800 mb-2">{popularPackage.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-blue-900">
                {formatPrice(popularPackage.price)}
              </span>
              <button
                onClick={() => setShowPackages(!showPackages)}
                className="text-blue-600 text-xs hover:text-blue-800"
              >
                {showPackages ? 'Hide' : 'View'} Details
              </button>
            </div>
          </div>
        )}

        {/* Package Details */}
        {showPackages && popularPackage && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Package Includes:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              {popularPackage.inclusions.map((inclusion, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-1 h-1 bg-blue-600 rounded-full mr-2"></span>
                  {inclusion}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleContact}
            className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Contact Host</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Share2 className="h-4 w-4 text-gray-600" />
            </button>
            
            {property.contact.whatsapp && (
              <button
                onClick={() => window.open(`https://wa.me/${property.contact.whatsapp}`, '_blank')}
                className="bg-green-500 text-white px-3 py-2 rounded-lg text-xs hover:bg-green-600 transition-colors"
              >
                WhatsApp
              </button>
            )}
          </div>
        </div>

        {/* Nearby Attractions Preview */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-600">
            <span className="font-medium">Nearby: </span>
            {monthlyStay.touristAttractions.slice(0, 2).map((attraction, index) => (
              <span key={index}>
                {attraction.name} ({attraction.walkingTime}min)
                {index < 1 && monthlyStay.touristAttractions.length > 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}