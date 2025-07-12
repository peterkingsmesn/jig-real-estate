import { useState } from 'react';
import { Calendar, Eye, CheckCircle, XCircle, Clock, DollarSign, MapPin } from 'lucide-react';

export interface AdRequest {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  adType: 'banner' | 'featured' | 'sponsored';
  position: 'left' | 'right' | 'top' | 'main';
  budget: number;
  duration: number; // days
  targetAudience: string;
  adContent: {
    title: string;
    description: string;
    imageUrl?: string;
    linkUrl: string;
    buttonText: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'expired';
  submittedAt: string;
  reviewedAt?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

interface AdRequestCardProps {
  adRequest: AdRequest;
  onApprove: (id: string, notes?: string) => void;
  onReject: (id: string, notes?: string) => void;
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
  active: {
    icon: CheckCircle,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    label: 'Active'
  },
  expired: {
    icon: Clock,
    color: 'text-gray-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    label: 'Expired'
  }
};

export default function AdRequestCard({ adRequest, onApprove, onReject }: AdRequestCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const status = statusConfig[adRequest.status];
  const StatusIcon = status.icon;

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await onApprove(adRequest.id, reviewNotes);
      setReviewNotes('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      await onReject(adRequest.id, reviewNotes);
      setReviewNotes('');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-card border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="font-semibold text-gray-900 text-lg">
                {adRequest.companyName}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${adRequest.adType === 'featured' ? 'bg-purple-100 text-purple-700' : adRequest.adType === 'sponsored' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                {adRequest.adType}
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

        <div className="mt-3 text-sm text-gray-600 grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Submitted: {formatDate(adRequest.submittedAt)}</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-1" />
            <span>Budget: {formatCurrency(adRequest.budget)}</span>
          </div>
        </div>
      </div>

      {/* Ad Preview */}
      <div className="p-4 bg-gray-50">
        <h4 className="font-medium text-gray-900 mb-3">Ad Preview</h4>
        <div className={`border-2 border-dashed rounded-lg p-3 text-center ${
          adRequest.position === 'left' || adRequest.position === 'right' 
            ? 'w-48 mx-auto' 
            : 'w-full'
        }`}>
          <div className="text-sm font-semibold text-gray-800 mb-1">
            {adRequest.adContent.title}
          </div>
          <div className="text-xs text-gray-600 mb-2">
            {adRequest.adContent.description}
          </div>
          <button className="bg-primary text-white px-3 py-1 rounded text-xs">
            {adRequest.adContent.buttonText}
          </button>
          <div className="text-xs text-gray-400 mt-2">
            Position: {adRequest.position} sidebar
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <div className="border-t border-gray-200">
          {/* Contact Information */}
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Contact Person:</span>
                <span className="ml-2">{adRequest.contactName}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <span className="ml-2">{adRequest.email}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Phone:</span>
                <span className="ml-2">{adRequest.phone}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Duration:</span>
                <span className="ml-2">{adRequest.duration} days</span>
              </div>
            </div>
          </div>

          {/* Campaign Details */}
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Campaign Details</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-700">Target Audience:</span>
                <span className="ml-2">{adRequest.targetAudience}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Landing URL:</span>
                <a 
                  href={adRequest.adContent.linkUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 text-primary hover:underline"
                >
                  {adRequest.adContent.linkUrl}
                </a>
              </div>
              {adRequest.adContent.imageUrl && (
                <div>
                  <span className="font-medium text-gray-700">Ad Image:</span>
                  <a 
                    href={adRequest.adContent.imageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 text-primary hover:underline"
                  >
                    View Image
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Previous Review Notes */}
          {adRequest.notes && (
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Previous Notes</h4>
              <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                {adRequest.notes}
              </p>
            </div>
          )}

          {/* Admin Actions */}
          {adRequest.status === 'pending' && (
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
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Approve</span>
                </button>

                <button
                  onClick={handleReject}
                  disabled={isProcessing}
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