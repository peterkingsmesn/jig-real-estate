import { Template, PropertyType, TemplateField, FormSection } from '@/types/template';

// Common field definitions
const commonFields = {
  title: {
    name: 'title',
    type: 'text' as const,
    label: '매물 제목',
    placeholder: '예: 2-Bedroom House in Makati',
    required: true,
    maxLength: 100,
    section: 'basic_info'
  },
  
  region: {
    name: 'region',
    type: 'select' as const,
    label: '지역',
    required: true,
    options: [
      { value: 'manila', label: 'Manila' },
      { value: 'cebu', label: 'Cebu' },
      { value: 'davao', label: 'Davao' },
      { value: 'boracay', label: 'Boracay' },
      { value: 'baguio', label: 'Baguio' }
    ],
    section: 'basic_info'
  },

  price: {
    name: 'price',
    type: 'number' as const,
    label: '월 렌트비 (PHP)',
    required: true,
    min: 5000,
    max: 200000,
    step: 1000,
    placeholder: 'Monthly rent in PHP',
    section: 'basic_info'
  },

  deposit: {
    name: 'deposit',
    type: 'number' as const,
    label: '보증금 (PHP)',
    required: true,
    min: 0,
    max: 500000,
    step: 1000,
    placeholder: 'Security deposit in PHP',
    section: 'basic_info'
  },

  bedrooms: {
    name: 'bedrooms',
    type: 'select' as const,
    label: '침실 수',
    required: true,
    options: [
      { value: 1, label: '1 Bedroom' },
      { value: 2, label: '2 Bedrooms' },
      { value: 3, label: '3 Bedrooms' },
      { value: 4, label: '4 Bedrooms' },
      { value: 5, label: '5+ Bedrooms' }
    ],
    section: 'details'
  },

  bathrooms: {
    name: 'bathrooms',
    type: 'select' as const,
    label: '화장실 수',
    required: true,
    options: [
      { value: 1, label: '1 Bathroom' },
      { value: 2, label: '2 Bathrooms' },
      { value: 3, label: '3 Bathrooms' },
      { value: 4, label: '4+ Bathrooms' }
    ],
    section: 'details'
  },

  area: {
    name: 'area',
    type: 'number' as const,
    label: '면적 (sqm)',
    required: true,
    min: 20,
    max: 1000,
    step: 5,
    placeholder: 'Area in square meters',
    section: 'details'
  },

  furnished: {
    name: 'furnished',
    type: 'radio' as const,
    label: '가구 포함 여부',
    required: true,
    options: [
      { value: true, label: 'Fully Furnished' },
      { value: false, label: 'Unfurnished' }
    ],
    section: 'details'
  },

  description: {
    name: 'description',
    type: 'textarea' as const,
    label: '매물 설명',
    required: true,
    maxLength: 1000,
    placeholder: 'Describe the property in detail...',
    section: 'basic_info'
  },

  address: {
    name: 'address',
    type: 'text' as const,
    label: '상세 주소',
    required: true,
    maxLength: 200,
    placeholder: '123 Ayala Avenue, Makati City',
    section: 'location'
  }
};

// Contact fields
const contactFields = {
  whatsapp: {
    name: 'contact.whatsapp',
    type: 'phone' as const,
    label: 'WhatsApp 번호',
    required: false,
    placeholder: '+63 912 345 6789',
    section: 'contact'
  },
  
  telegram: {
    name: 'contact.telegram',
    type: 'text' as const,
    label: 'Telegram ID',
    required: false,
    placeholder: '@username',
    section: 'contact'
  },

  email: {
    name: 'contact.email',
    type: 'email' as const,
    label: '이메일',
    required: false,
    placeholder: 'contact@example.com',
    section: 'contact'
  },

  phone: {
    name: 'contact.phone',
    type: 'phone' as const,
    label: '전화번호',
    required: false,
    placeholder: '+63 912 345 6789',
    section: 'contact'
  }
};

// House Template
export const houseTemplate: Template = {
  id: 'house_template_v1',
  name: 'Single House Template',
  type: 'property',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isDefault: true,
  isActive: true,
  metadata: {
    description: 'Template for single house properties',
    propertyType: 'house',
    tags: ['residential', 'house', 'single-family']
  },
  schema: {
    fields: [
      commonFields.title,
      commonFields.region,
      commonFields.price,
      commonFields.deposit,
      commonFields.bedrooms,
      commonFields.bathrooms,
      commonFields.area,
      commonFields.furnished,
      commonFields.description,
      commonFields.address,
      {
        name: 'amenities',
        type: 'checkbox' as const,
        label: '편의시설',
        required: false,
        options: [
          { value: 'parking', label: 'Parking' },
          { value: 'security', label: '24/7 Security' },
          { value: 'water_supply', label: 'Water Supply' },
          { value: 'electricity', label: 'Electricity' },
          { value: 'internet', label: 'Internet Ready' },
          { value: 'aircon', label: 'Air Conditioning' },
          { value: 'garden', label: 'Garden' },
          { value: 'balcony', label: 'Balcony' },
          { value: 'garage', label: 'Garage' }
        ],
        section: 'amenities'
      },
      contactFields.whatsapp,
      contactFields.telegram,
      contactFields.email,
      contactFields.phone
    ],
    validationRules: [
      {
        field: 'price',
        rule: 'min',
        value: 5000,
        message: 'Price should be at least PHP 5,000'
      },
      {
        field: 'price',
        rule: 'max',
        value: 200000,
        message: 'Price should not exceed PHP 200,000'
      },
      {
        field: 'area',
        rule: 'min',
        value: 20,
        message: 'Area should be at least 20 square meters'
      }
    ],
    defaultValues: {
      type: 'house',
      currency: 'PHP',
      furnished: false,
      amenities: ['parking', 'security', 'water_supply', 'electricity']
    },
    layout: {
      type: 'grid',
      columns: 2,
      spacing: 'normal',
      responsive: true
    },
    formSections: [
      {
        sectionId: 'basic_info',
        title: '기본 정보',
        layout: { type: 'grid', columns: 2 },
        fields: ['title', 'region', 'price', 'deposit', 'description']
      },
      {
        sectionId: 'details',
        title: '매물 상세',
        layout: { type: 'grid', columns: 3 },
        fields: ['bedrooms', 'bathrooms', 'area', 'furnished']
      },
      {
        sectionId: 'location',
        title: '위치 정보',
        layout: { type: 'stack' },
        fields: ['address']
      },
      {
        sectionId: 'amenities',
        title: '편의시설',
        layout: { type: 'grid', columns: 3 },
        fields: ['amenities']
      },
      {
        sectionId: 'contact',
        title: '연락처 정보',
        layout: { type: 'grid', columns: 2 },
        fields: ['contact.whatsapp', 'contact.telegram', 'contact.email', 'contact.phone']
      }
    ]
  }
};

// Condo Template
export const condoTemplate: Template = {
  id: 'condo_template_v1',
  name: 'Condominium Template',
  type: 'property',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isDefault: true,
  isActive: true,
  metadata: {
    description: 'Template for condominium units',
    propertyType: 'condo',
    tags: ['residential', 'condo', 'high-rise']
  },
  schema: {
    fields: [
      commonFields.title,
      {
        name: 'buildingName',
        type: 'text' as const,
        label: '건물명',
        required: true,
        maxLength: 100,
        placeholder: 'Condominium building name',
        section: 'basic_info'
      },
      commonFields.region,
      commonFields.price,
      commonFields.deposit,
      commonFields.bedrooms,
      commonFields.bathrooms,
      commonFields.area,
      {
        name: 'floor',
        type: 'number' as const,
        label: '층수',
        required: true,
        min: 1,
        max: 100,
        placeholder: 'Floor number',
        section: 'details'
      },
      commonFields.furnished,
      commonFields.description,
      commonFields.address,
      {
        name: 'amenities',
        type: 'checkbox' as const,
        label: '편의시설',
        required: false,
        options: [
          { value: 'elevator', label: 'Elevator' },
          { value: 'security', label: '24/7 Security' },
          { value: 'gym', label: 'Gymnasium' },
          { value: 'swimming_pool', label: 'Swimming Pool' },
          { value: 'parking', label: 'Parking Slot' },
          { value: 'playground', label: 'Playground' },
          { value: 'function_room', label: 'Function Room' },
          { value: 'business_center', label: 'Business Center' },
          { value: 'laundry', label: 'Laundry Area' },
          { value: 'balcony', label: 'Balcony' },
          { value: 'aircon', label: 'Air Conditioning' }
        ],
        section: 'amenities'
      },
      contactFields.whatsapp,
      contactFields.telegram,
      contactFields.email,
      contactFields.phone
    ],
    validationRules: [
      {
        field: 'price',
        rule: 'min',
        value: 10000,
        message: 'Condo price should be at least PHP 10,000'
      },
      {
        field: 'floor',
        rule: 'min',
        value: 1,
        message: 'Floor number should be at least 1'
      }
    ],
    defaultValues: {
      type: 'condo',
      currency: 'PHP',
      furnished: true,
      amenities: ['elevator', 'security', 'gym', 'swimming_pool', 'parking']
    },
    layout: {
      type: 'grid',
      columns: 2,
      spacing: 'normal',
      responsive: true
    },
    formSections: [
      {
        sectionId: 'basic_info',
        title: '기본 정보',
        layout: { type: 'grid', columns: 2 },
        fields: ['title', 'buildingName', 'region', 'price', 'deposit', 'description']
      },
      {
        sectionId: 'details',
        title: '매물 상세',
        layout: { type: 'grid', columns: 3 },
        fields: ['bedrooms', 'bathrooms', 'area', 'floor', 'furnished']
      },
      {
        sectionId: 'location',
        title: '위치 정보',
        layout: { type: 'stack' },
        fields: ['address']
      },
      {
        sectionId: 'amenities',
        title: '편의시설',
        layout: { type: 'grid', columns: 3 },
        fields: ['amenities']
      },
      {
        sectionId: 'contact',
        title: '연락처 정보',
        layout: { type: 'grid', columns: 2 },
        fields: ['contact.whatsapp', 'contact.telegram', 'contact.email', 'contact.phone']
      }
    ]
  }
};

// Village Template
export const villageTemplate: Template = {
  id: 'village_template_v1',
  name: 'Village House Template',
  type: 'property',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isDefault: true,
  isActive: true,
  metadata: {
    description: 'Template for village/subdivision houses',
    propertyType: 'village',
    tags: ['residential', 'village', 'subdivision']
  },
  schema: {
    fields: [
      commonFields.title,
      {
        name: 'villageName',
        type: 'text' as const,
        label: '빌리지/단지명',
        required: true,
        maxLength: 100,
        placeholder: 'Subdivision/Village name',
        section: 'basic_info'
      },
      {
        name: 'houseModel',
        type: 'text' as const,
        label: '주택 모델',
        required: false,
        maxLength: 50,
        placeholder: 'House model (e.g., Bungalow, Two-story)',
        section: 'basic_info'
      },
      commonFields.region,
      commonFields.price,
      commonFields.deposit,
      commonFields.bedrooms,
      commonFields.bathrooms,
      commonFields.area,
      {
        name: 'lotArea',
        type: 'number' as const,
        label: '대지 면적 (sqm)',
        required: true,
        min: 50,
        max: 2000,
        placeholder: 'Lot area in square meters',
        section: 'details'
      },
      commonFields.furnished,
      commonFields.description,
      commonFields.address,
      {
        name: 'amenities',
        type: 'checkbox' as const,
        label: '편의시설',
        required: false,
        options: [
          { value: 'security', label: '24/7 Security' },
          { value: 'clubhouse', label: 'Clubhouse' },
          { value: 'playground', label: 'Playground' },
          { value: 'basketball_court', label: 'Basketball Court' },
          { value: 'swimming_pool', label: 'Swimming Pool' },
          { value: 'tennis_court', label: 'Tennis Court' },
          { value: 'jogging_path', label: 'Jogging Path' },
          { value: 'chapel', label: 'Chapel' },
          { value: 'commercial_area', label: 'Commercial Area' },
          { value: 'parking', label: 'Parking' },
          { value: 'garden', label: 'Garden' }
        ],
        section: 'amenities'
      },
      contactFields.whatsapp,
      contactFields.telegram,
      contactFields.email,
      contactFields.phone
    ],
    validationRules: [
      {
        field: 'price',
        rule: 'min',
        value: 15000,
        message: 'Village house price should be at least PHP 15,000'
      },
      {
        field: 'lotArea',
        rule: 'min',
        value: 50,
        message: 'Lot area should be at least 50 square meters'
      }
    ],
    defaultValues: {
      type: 'village',
      currency: 'PHP',
      furnished: false,
      amenities: ['security', 'clubhouse', 'playground', 'basketball_court']
    },
    layout: {
      type: 'grid',
      columns: 2,
      spacing: 'normal',
      responsive: true
    },
    formSections: [
      {
        sectionId: 'basic_info',
        title: '기본 정보',
        layout: { type: 'grid', columns: 2 },
        fields: ['title', 'villageName', 'houseModel', 'region', 'price', 'deposit', 'description']
      },
      {
        sectionId: 'details',
        title: '매물 상세',
        layout: { type: 'grid', columns: 3 },
        fields: ['bedrooms', 'bathrooms', 'area', 'lotArea', 'furnished']
      },
      {
        sectionId: 'location',
        title: '위치 정보',
        layout: { type: 'stack' },
        fields: ['address']
      },
      {
        sectionId: 'amenities',
        title: '편의시설',
        layout: { type: 'grid', columns: 3 },
        fields: ['amenities']
      },
      {
        sectionId: 'contact',
        title: '연락처 정보',
        layout: { type: 'grid', columns: 2 },
        fields: ['contact.whatsapp', 'contact.telegram', 'contact.email', 'contact.phone']
      }
    ]
  }
};

// Template registry
export const propertyTemplates: Record<PropertyType, Template> = {
  house: houseTemplate,
  condo: condoTemplate,
  village: villageTemplate
};

// Helper function to get template by property type
export function getPropertyTemplate(propertyType: PropertyType): Template {
  return propertyTemplates[propertyType];
}

// Helper function to get all property templates
export function getAllPropertyTemplates(): Template[] {
  return Object.values(propertyTemplates);
}