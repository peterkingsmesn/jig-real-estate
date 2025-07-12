const mongoose = require('mongoose');

const propertyImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  alt: String,
  order: {
    type: Number,
    default: 0
  },
  isMain: {
    type: Boolean,
    default: false
  }
});

const locationSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  landmark: String,
  district: String,
  city: {
    type: String,
    required: true
  },
  province: {
    type: String,
    required: true
  }
});

const contactInfoSchema = new mongoose.Schema({
  whatsapp: String,
  telegram: String,
  email: String,
  phone: String,
  contactName: String
});

const translationSchema = new mongoose.Schema({
  title: String,
  description: String
});

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['house', 'condo', 'village']
  },
  region: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'PHP'
  },
  deposit: {
    type: Number,
    default: 0
  },
  bedrooms: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  area: {
    type: Number,
    required: true
  },
  floor: Number,
  furnished: {
    type: Boolean,
    default: false
  },
  amenities: [String],
  images: [propertyImageSchema],
  location: {
    type: locationSchema,
    required: true
  },
  contact: contactInfoSchema,
  translations: {
    ko: translationSchema,
    zh: translationSchema,
    ja: translationSchema,
    en: translationSchema
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'rented'],
    default: 'active'
  },
  viewCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// 인덱스 설정
propertySchema.index({ region: 1, type: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ 'location.city': 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Property', propertySchema);