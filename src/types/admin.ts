export interface PendingProperty {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  
  // Property data from submission form
  title: string;
  description: string;
  type: 'house' | 'condo' | 'village';
  region: string;
  address: string;
  price: number;
  deposit: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  floor?: number;
  furnished: boolean;
  amenities: string[];
  images: PropertyImage[];
  
  // Owner contact information
  owner: {
    name: string;
    phone: string;
    email: string;
    whatsapp?: string;
    telegram?: string;
    preferredLanguage: string;
  };
  
  // Admin review fields
  adminNotes?: string;
  suggestedPrice?: number;
  marketingNotes?: string;
  priorityLevel: 'low' | 'medium' | 'high';
}

export interface PropertyImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  alt: string;
  order: number;
  isMain: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
  permissions: AdminPermission[];
  lastLogin?: string;
  isActive: boolean;
}

export interface AdminPermission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface AdminStats {
  totalProperties: number;
  pendingApprovals: number;
  activeListings: number;
  totalInquiries: number;
  monthlyRevenue: number;
  conversionRate: number;
}

export interface PropertyReviewAction {
  type: 'approve' | 'reject' | 'request_revision';
  notes?: string;
  suggestedChanges?: string[];
  adminId: string;
}