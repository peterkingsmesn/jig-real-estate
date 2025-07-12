import { useState } from 'react';
import { PendingProperty, PropertyReviewAction } from '@/types/admin';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Eye, 
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Home,
  Bed,
  Bath,
  Square,
  DollarSign
} from 'lucide-react';
import Image from 'next/image';

interface PropertyReviewCardProps {
  property: PendingProperty;
  onReview: (propertyId: string, action: PropertyReviewAction) => void;
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    label: 'Pending Review'
  },
  approved: {
    icon: CheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    label: 'Approved'
  },
  rejected: {
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    label: 'Rejected'
  },
  needs_revision: {
    icon: AlertCircle,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    label: 'Needs Revision'
  }
};

const priorityConfig = {
  low: { color: 'text-gray-600', bg: 'bg-gray-100' },
  medium: { color: 'text-blue-600', bg: 'bg-blue-100' },
  high: { color: 'text-red-600', bg: 'bg-red-100' }
};

export default function PropertyReviewCard({ property, onReview }: PropertyReviewCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);

  const status = statusConfig[property.status];
  const priority = priorityConfig[property.priorityLevel];
  const StatusIcon = status.icon;

  const handleReview = async (actionType: PropertyReviewAction['type']) => {
    setIsReviewing(true);
    
    const action: PropertyReviewAction = {
      type: actionType,
      notes: reviewNotes || undefined,
      adminId: 'current-admin-id', // In real app, get from auth context
    };

    try {
      await onReview(property.id, action);
      setReviewNotes('');
      setShowDetails(false);
    } catch (error) {
      console.error('Review action failed:', error);
    } finally {
      setIsReviewing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const mainImage = property.images.find(img => img.isMain) || property.images[0];

  return (
    <div className="bg-white rounded-lg shadow-card border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="font-semibold text-gray-900 text-lg">
                {property.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priority.bg} ${priority.color}`}>
                {property.priorityLevel.toUpperCase()}
              </span>
            </div>
            
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color} ${status.border} border`}>
              <StatusIcon className="h-4 w-4 mr-2" />
              {status.label}
            </div>
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center space-x-1 text-primary hover:text-blue-700 font-medium"
          >
            <Eye className="h-4 w-4" />
            <span>{showDetails ? 'Hide' : 'View'} Details</span>
          </button>
        </div>

        <div className="mt-3 text-sm text-gray-600">
          <p>Submitted: {formatDate(property.submittedAt)}</p>
          {property.reviewedAt && (
            <p>Reviewed: {formatDate(property.reviewedAt)}</p>
          )}
        </div>
      </div>

      {/* Property Summary */}
      <div className="p-4">
        <div className="flex items-start space-x-4">
          {/* Image */}
          <div className="flex-shrink-0">
            {mainImage ? (
              <Image
                src={mainImage.url}
                alt={mainImage.alt}
                width={120}
                height={90}
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="w-[120px] h-[90px] bg-gray-200 rounded-lg flex items-center justify-center">
                <Home className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{property.address}</span>
              </div>
              <div className="flex items-center">
                <Home className="h-4 w-4 mr-1" />
                <span className="capitalize">{property.type}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span>{property.bedrooms} bed</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>{property.bathrooms} bath</span>
              </div>
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                <span>{property.area}m²</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-secondary">
                {formatPrice(property.price)}/month
              </div>
              <div className="text-sm text-gray-500">
                Deposit: {formatPrice(property.deposit)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <div className="border-t border-gray-200">
          {/* Property Description */}
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-gray-600 text-sm">{property.description}</p>
            
            {property.amenities.length > 0 && (
              <div className="mt-3">
                <h5 className="font-medium text-gray-900 mb-2">Amenities</h5>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Owner Information */}
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Owner Contact</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Name:</span>
                <span>{property.owner.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{property.owner.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{property.owner.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Language:</span>
                <span className="capitalize">{property.owner.preferredLanguage}</span>
              </div>
              {property.owner.whatsapp && (
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">📱</span>
                  <span>{property.owner.whatsapp}</span>
                </div>
              )}
              {property.owner.telegram && (
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">✈️</span>
                  <span>{property.owner.telegram}</span>
                </div>
              )}
            </div>
          </div>

          {/* Previous Review Notes */}
          {property.reviewNotes && (
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Previous Review Notes</h4>
              <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                {property.reviewNotes}
              </p>
            </div>
          )}

          {/* Admin Actions */}
          {property.status === 'pending' && (
            <div className="p-4 bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-3">Review Actions</h4>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Notes
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add notes about your decision..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleReview('approve')}
                  disabled={isReviewing}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Approve</span>
                </button>

                <button
                  onClick={() => handleReview('request_revision')}
                  disabled={isReviewing}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>Request Revision</span>
                </button>

                <button
                  onClick={() => handleReview('reject')}
                  disabled={isReviewing}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}