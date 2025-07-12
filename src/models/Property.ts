import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProperty extends Document {
  title: string;
  titleKo?: string;
  titleZh?: string;
  titleJa?: string;
  description: string;
  descriptionKo?: string;
  descriptionZh?: string;
  descriptionJa?: string;
  type: 'condo' | 'house' | 'apartment' | 'studio' | 'villa' | 'townhouse';
  category: 'long_term' | 'short_term' | 'monthly_stay';
  price: number;
  currency: string;
  region: string;
  city: string;
  district: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  bedrooms: number;
  bathrooms: number;
  area: number;
  furnished: boolean;
  amenities: string[];
  images: string[];
  contact: {
    name: string;
    phone?: string;
    email?: string;
    whatsapp?: string;
    telegram?: string;
    kakao?: string;
    line?: string;
    wechat?: string;
  };
  owner: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected' | 'inactive';
  featured: boolean;
  views: number;
  likes: number;
  monthlyStay?: {
    available: boolean;
    minimumStay: number;
    maximumStay: number;
    utilities: string[];
    nearbyPlaces: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  titleKo: String,
  titleZh: String,
  titleJa: String,
  description: {
    type: String,
    required: true
  },
  descriptionKo: String,
  descriptionZh: String,
  descriptionJa: String,
  type: {
    type: String,
    enum: ['condo', 'house', 'apartment', 'studio', 'villa', 'townhouse'],
    required: true
  },
  category: {
    type: String,
    enum: ['long_term', 'short_term', 'monthly_stay'],
    default: 'long_term'
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'PHP'
  },
  region: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  bedrooms: {
    type: Number,
    required: true,
    min: 0
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 0
  },
  area: {
    type: Number,
    required: true,
    min: 0
  },
  furnished: {
    type: Boolean,
    default: false
  },
  amenities: [{
    type: String
  }],
  images: [{
    type: String
  }],
  contact: {
    name: {
      type: String,
      required: true
    },
    phone: String,
    email: String,
    whatsapp: String,
    telegram: String,
    kakao: String,
    line: String,
    wechat: String
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'inactive'],
    default: 'pending'
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  monthlyStay: {
    available: {
      type: Boolean,
      default: false
    },
    minimumStay: Number,
    maximumStay: Number,
    utilities: [String],
    nearbyPlaces: [String]
  }
}, {
  timestamps: true
});

// Indexes for better query performance
propertySchema.index({ region: 1, city: 1 });
propertySchema.index({ type: 1 });
propertySchema.index({ category: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ owner: 1 });
propertySchema.index({ featured: -1 });
propertySchema.index({ createdAt: -1 });

// Text index for search
propertySchema.index({
  title: 'text',
  titleKo: 'text',
  description: 'text',
  descriptionKo: 'text'
});

const Property: Model<IProperty> = mongoose.models.Property || mongoose.model<IProperty>('Property', propertySchema);

export default Property;