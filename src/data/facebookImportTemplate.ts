import { FacebookImportTemplate, ImportWorkflowStep } from '@/types/template';

export const facebookImportTemplate: FacebookImportTemplate = {
  id: 'facebook_import_v1',
  name: 'Facebook Post Import',
  type: 'facebook_import',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isDefault: true,
  isActive: true,
  metadata: {
    description: 'Facebook 그룹 포스트에서 매물 정보를 반자동으로 추출하는 템플릿',
    tags: ['facebook', 'import', 'automation', 'parsing']
  },
  schema: {
    fields: [],
    validationRules: [],
    defaultValues: {},
    layout: { type: 'wizard' }
  },
  parsingRules: {
    priceRegex: [
      'PHP\\s*([0-9,]+)',
      '₱\\s*([0-9,]+)',
      'php\\s*([0-9,]+)',
      'pesos\\s*([0-9,]+)',
      '([0-9,]+)\\s*php',
      '([0-9,]+)\\s*pesos',
      '([0-9,]+)\\s*PHP',
      '([0-9,]+)\\s*per\\s*month',
      '([0-9,]+)/month',
      '([0-9,]+)k\\s*php',
      '([0-9,]+)k\\s*PHP',
      '([0-9,]+)k\\s*pesos',
      '([0-9,]+)k(?!\\w)',
      '([0-9,]+)K(?!\\w)',
      'price[:\\s]*([0-9,]+)',
      'rent[:\\s]*([0-9,]+)',
      'monthly[:\\s]*([0-9,]+)'
    ],
    locationRegex: [
      '(?:in|at|located\\s+(?:in|at))\\s+([A-Za-z\\s,.-]+?)(?:\\s|$|,|\\.|!|\\?)',
      '([A-Za-z\\s,.-]+?)\\s+(?:area|city|district)',
      '(BGC|Bonifacio\\s+Global\\s+City)',
      '(Makati\\s+(?:City|CBD|Business\\s+District)?)',
      '(Taguig\\s+City?)',
      '(Ortigas\\s+(?:Center|CBD|Business\\s+District)?)',
      '(Quezon\\s+City)',
      '(Manila\\s+(?:City|Bay)?)',
      '(Cebu\\s+(?:City|IT\\s+Park)?)',
      '(Davao\\s+City?)',
      '(Boracay\\s+Island?)',
      '(Baguio\\s+City?)',
      '(Alabang|Muntinlupa)',
      '(Pasig\\s+City?)',
      '(Mandaluyong\\s+City?)',
      '(Pasay\\s+City?)',
      '(Paranaque\\s+City?)',
      '(Las\\s+Pinas\\s+City?)',
      '(Antipolo\\s+City?)'
    ],
    bedroomRegex: [
      '([0-9]+)\\s*(?:br|bedroom|bed|BR|Bedroom|Bed)(?:s|room)?',
      '([0-9]+)\\s*(?:-|–)\\s*(?:bedroom|bed|BR)',
      '(?:bedroom|bed|BR)[s\\s]*:?\\s*([0-9]+)',
      'studio(?:\\s+type)?(?:\\s+unit)?',
      'single\\s+(?:room|bed)',
      'double\\s+(?:room|bed)'
    ],
    bathroomRegex: [
      '([0-9]+)\\s*(?:bath|bathroom|toilet|Bath|Bathroom|T&B|CR|washroom)(?:s|room)?',
      '([0-9]+)\\s*(?:-|–)\\s*(?:bathroom|bath)',
      '(?:bathroom|bath|toilet|T&B|CR)[s\\s]*:?\\s*([0-9]+)',
      '([0-9]+)\\s*toilet\\s*(?:and|&)\\s*bath',
      'shared\\s+(?:bathroom|bath|CR)',
      'private\\s+(?:bathroom|bath|CR)'
    ],
    areaRegex: [
      '([0-9,]+(?:\\.[0-9]+)?)\\s*(?:sqm|sq\\.?m|square\\s*meters?|SQM|Sqm|m²|m2)',
      '([0-9,]+(?:\\.[0-9]+)?)\\s*(?:-|–)\\s*(?:sqm|sq\\.?m)',
      '(?:area|size|floor\\s+area)[:\\s]*([0-9,]+(?:\\.[0-9]+)?)\\s*(?:sqm|sq\\.?m|m²)',
      '([0-9,]+(?:\\.[0-9]+)?)\\s*square\\s*meters?'
    ],
    contactRegex: [
      '(?:\\+63|0063)\\s*[0-9]{10}',
      '(?:\\+63|0063)\\s*[0-9]{3}\\s*[0-9]{3}\\s*[0-9]{4}',
      '09[0-9]{9}',
      '09[0-9]{2}\\s*[0-9]{3}\\s*[0-9]{4}',
      '@[A-Za-z0-9_]+(?:[A-Za-z0-9_]*[A-Za-z0-9])?',
      '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}',
      'viber[:\\s]*(?:\\+63|0)\\s*[0-9]{10}',
      'whatsapp[:\\s]*(?:\\+63|0)\\s*[0-9]{10}',
      'telegram[:\\s]*@[A-Za-z0-9_]+',
      'contact[:\\s]*(?:\\+63|0)\\s*[0-9]{10}'
    ],
    typeRegex: [
      'studio(?:\\s+(?:type|unit|apartment|condo))?',
      'condo(?:minium)?(?:\\s+unit)?',
      'apartment(?:\\s+unit)?',
      'house(?:\\s+and\\s+lot)?',
      'townhouse',
      'villa',
      'room(?:\\s+(?:for\\s+rent|rental))?',
      'bed\\s*space',
      'dormitory',
      'boarding\\s+house'
    ],
    amenitiesRegex: [
      'fully?\\s*furnished',
      'semi\\s*furnished',
      'unfurnished',
      'air\\s*con(?:ditioned)?',
      'aircon',
      'A/C',
      'parking(?:\\s+(?:slot|space))?',
      'garage',
      'elevator',
      'security',
      'guard',
      'CCTV',
      'swimming\\s*pool',
      'gym(?:nasium)?',
      'fitness\\s*(?:center|gym)',
      'balcony',
      'terrace',
      'garden',
      'wifi',
      'internet',
      'cable\\s*tv',
      'kitchen',
      'laundry',
      'washing\\s*machine'
    ]
  },
  mappingRules: {
    title: {
      source: 'generated',
      fallback: 'auto_generate',
      maxLength: 100
    },
    description: {
      source: 'postContent',
      maxLength: 1000,
      cleanUp: [
        'remove_hashtags',
        'remove_excessive_whitespace',
        'remove_contact_info',
        'remove_price_info'
      ]
    },
    price: {
      source: 'parsed_price',
      validation: {
        min: 1000,
        max: 1000000
      }
    },
    region: {
      source: 'parsed_location',
      mapping: {
        'makati': 'manila',
        'makati city': 'manila',
        'bgc': 'manila',
        'bonifacio global city': 'manila',
        'taguig': 'manila',
        'taguig city': 'manila',
        'ortigas': 'manila',
        'ortigas center': 'manila',
        'quezon city': 'manila',
        'qc': 'manila',
        'manila': 'manila',
        'manila city': 'manila',
        'manila bay': 'manila',
        'pasig': 'manila',
        'pasig city': 'manila',
        'mandaluyong': 'manila',
        'mandaluyong city': 'manila',
        'pasay': 'manila',
        'pasay city': 'manila',
        'paranaque': 'manila',
        'paranaque city': 'manila',
        'muntinlupa': 'manila',
        'alabang': 'manila',
        'las pinas': 'manila',
        'las pinas city': 'manila',
        'antipolo': 'manila',
        'antipolo city': 'manila',
        'cebu': 'cebu',
        'cebu city': 'cebu',
        'cebu it park': 'cebu',
        'lahug': 'cebu',
        'davao': 'davao',
        'davao city': 'davao',
        'boracay': 'boracay',
        'boracay island': 'boracay',
        'aklan': 'boracay',
        'baguio': 'baguio',
        'baguio city': 'baguio'
      }
    },
    contact: {
      whatsapp: {
        source: 'extracted_phone',
        validation: {
          pattern: '^\\+63[0-9]{10}$'
        }
      },
      telegram: {
        source: 'extracted_telegram',
        validation: {
          pattern: '^@[A-Za-z0-9_]+$'
        }
      }
    }
  },
  workflowSteps: [
    {
      stepId: '1',
      name: 'paste_facebook_content',
      description: 'Facebook 포스트 내용 붙여넣기',
      fields: [
        {
          name: 'postUrl',
          type: 'url',
          label: 'Facebook 포스트 URL (선택사항)',
          required: false,
          placeholder: 'https://www.facebook.com/groups/...',
          helpText: '원본 포스트 참조를 위한 링크 (선택사항)'
        },
        {
          name: 'postContent',
          type: 'textarea',
          label: 'Facebook 포스트 내용',
          required: true,
          placeholder: 'Facebook 포스트의 전체 내용을 복사하여 붙여넣으세요...',
          helpText: '포스트 텍스트를 전체 선택하여 복사 후 붙여넣기'
        },
        {
          name: 'hasImages',
          type: 'checkbox',
          label: '이미지 포함 여부',
          required: false,
          options: [
            { value: true, label: '이미지가 포함된 포스트입니다' }
          ]
        }
      ]
    },
    {
      stepId: '2',
      name: 'auto_parse_content',
      description: '내용 자동 분석',
      action: 'parse_facebook_content',
      showParsedData: true
    },
    {
      stepId: '3',
      name: 'review_and_edit',
      description: '분석 결과 검토 및 수정',
      editableFields: [
        'title',
        'description',
        'price',
        'region',
        'type',
        'bedrooms',
        'bathrooms',
        'area',
        'amenities',
        'contact'
      ]
    },
    {
      stepId: '4',
      name: 'upload_images',
      description: '이미지 업로드',
      features: [
        'drag_and_drop',
        'image_preview',
        'set_main_image',
        'image_order'
      ],
      fields: [
        {
          name: 'images',
          type: 'file',
          label: '매물 이미지',
          required: false,
          multiple: true,
          accept: 'image/*',
          helpText: 'Facebook에서 저장한 이미지를 업로드하세요 (최대 10장)'
        }
      ]
    },
    {
      stepId: '5',
      name: 'set_location',
      description: '위치 설정',
      features: [
        'address_search',
        'drag_marker',
        'auto_geocoding'
      ],
      fields: [
        {
          name: 'address',
          type: 'text',
          label: '상세 주소',
          required: true,
          placeholder: '예: 123 Ayala Avenue, Makati City',
          helpText: '정확한 주소를 입력하면 지도에 자동으로 표시됩니다'
        }
      ]
    },
    {
      stepId: '6',
      name: 'add_translations',
      description: '다국어 번역 추가 (선택사항)',
      fields: [
        {
          name: 'autoTranslate',
          type: 'checkbox',
          label: '자동 번역 사용',
          required: false,
          options: [
            { value: true, label: 'AI 자동 번역 사용 (한국어, 중국어, 일본어)' }
          ]
        }
      ]
    },
    {
      stepId: '7',
      name: 'preview_and_save',
      description: '미리보기 및 저장',
      features: [
        'desktop_preview',
        'mobile_preview',
        'save_as_draft',
        'publish_immediately'
      ]
    }
  ]
};

// Facebook content parsing utilities
export class FacebookContentParser {
  static parsePrice(content: string): number | null {
    const priceRegexes = facebookImportTemplate.parsingRules.priceRegex;
    
    for (const regex of priceRegexes) {
      const match = content.match(new RegExp(regex, 'i'));
      if (match) {
        let price = match[1] || match[0];
        
        // Remove commas and convert to number
        price = price.replace(/,/g, '');
        
        // Handle 'k' or 'K' notation
        if (price.toLowerCase().includes('k')) {
          price = price.replace(/k/i, '');
          return parseInt(price) * 1000;
        }
        
        const numericPrice = parseInt(price);
        if (!isNaN(numericPrice) && numericPrice > 0) {
          return numericPrice;
        }
      }
    }
    
    return null;
  }

  static parseLocation(content: string): string | null {
    const locationRegexes = facebookImportTemplate.parsingRules.locationRegex;
    
    for (const regex of locationRegexes) {
      const match = content.match(new RegExp(regex, 'i'));
      if (match) {
        let location = match[1] || match[0];
        location = location.trim().toLowerCase();
        
        // Map to standard region names
        const mapping = facebookImportTemplate.mappingRules.region.mapping;
        if (mapping && mapping[location]) {
          return mapping[location];
        }
        
        // Direct matches
        const directMatches = ['manila', 'cebu', 'davao', 'boracay', 'baguio'];
        for (const direct of directMatches) {
          if (location.includes(direct)) {
            return direct;
          }
        }
      }
    }
    
    return null;
  }

  static parseBedrooms(content: string): number | null {
    const bedroomRegexes = facebookImportTemplate.parsingRules.bedroomRegex;
    
    for (const regex of bedroomRegexes) {
      const match = content.match(new RegExp(regex, 'i'));
      if (match) {
        const bedrooms = parseInt(match[1]);
        if (!isNaN(bedrooms) && bedrooms > 0 && bedrooms <= 10) {
          return bedrooms;
        }
      }
    }
    
    return null;
  }

  static parseBathrooms(content: string): number | null {
    const bathroomRegexes = facebookImportTemplate.parsingRules.bathroomRegex;
    
    for (const regex of bathroomRegexes) {
      const match = content.match(new RegExp(regex, 'i'));
      if (match) {
        const bathrooms = parseInt(match[1]);
        if (!isNaN(bathrooms) && bathrooms > 0 && bathrooms <= 10) {
          return bathrooms;
        }
      }
    }
    
    return null;
  }

  static parseArea(content: string): number | null {
    const areaRegexes = facebookImportTemplate.parsingRules.areaRegex;
    
    for (const regex of areaRegexes) {
      const match = content.match(new RegExp(regex, 'i'));
      if (match) {
        let area = match[1];
        area = area.replace(/,/g, '');
        
        const numericArea = parseInt(area);
        if (!isNaN(numericArea) && numericArea > 0 && numericArea <= 10000) {
          return numericArea;
        }
      }
    }
    
    return null;
  }

  static parseContacts(content: string): { whatsapp?: string; telegram?: string; email?: string } {
    const contactRegexes = facebookImportTemplate.parsingRules.contactRegex;
    const contacts: { whatsapp?: string; telegram?: string; email?: string } = {};
    
    for (const regex of contactRegexes) {
      const matches = content.match(new RegExp(regex, 'gi'));
      if (matches) {
        for (const match of matches) {
          if (match.startsWith('+63') || match.startsWith('09')) {
            contacts.whatsapp = match;
          } else if (match.startsWith('@')) {
            contacts.telegram = match;
          } else if (match.includes('@') && match.includes('.')) {
            contacts.email = match;
          }
        }
      }
    }
    
    return contacts;
  }

  static cleanContent(content: string): string {
    let cleaned = content;
    
    // Remove hashtags
    cleaned = cleaned.replace(/#\w+/g, '');
    
    // Remove excessive whitespace
    cleaned = cleaned.replace(/\s+/g, ' ');
    
    // Remove contact info
    cleaned = cleaned.replace(/\+63\s*[0-9]{10}/g, '');
    cleaned = cleaned.replace(/09[0-9]{9}/g, '');
    cleaned = cleaned.replace(/@[A-Za-z0-9_]+/g, '');
    
    // Remove price info
    cleaned = cleaned.replace(/PHP\s*[0-9,]+/gi, '');
    cleaned = cleaned.replace(/₱\s*[0-9,]+/gi, '');
    
    return cleaned.trim();
  }

  static parseType(content: string): string | null {
    const typeRegexes = facebookImportTemplate.parsingRules.typeRegex || [];
    
    for (const regex of typeRegexes) {
      const match = content.match(new RegExp(regex, 'i'));
      if (match) {
        const type = match[0].toLowerCase();
        
        if (type.includes('studio')) return 'condo';
        if (type.includes('condo') || type.includes('apartment')) return 'condo';
        if (type.includes('house') || type.includes('villa') || type.includes('townhouse')) return 'house';
        if (type.includes('room') || type.includes('bed space') || type.includes('dormitory') || type.includes('boarding')) return 'house';
      }
    }
    
    // Default fallback based on bedrooms
    const bedrooms = this.parseBedrooms(content);
    if (bedrooms && bedrooms >= 3) return 'house';
    return 'condo';
  }
  
  static parseAmenities(content: string): string[] {
    const amenitiesRegexes = facebookImportTemplate.parsingRules.amenitiesRegex || [];
    const foundAmenities: string[] = [];
    
    for (const regex of amenitiesRegexes) {
      const match = content.match(new RegExp(regex, 'i'));
      if (match) {
        const amenity = match[0].toLowerCase();
        
        if (amenity.includes('furnished')) {
          if (amenity.includes('fully')) foundAmenities.push('furnished');
          else if (amenity.includes('semi')) foundAmenities.push('semi_furnished');
          else if (amenity.includes('un')) foundAmenities.push('unfurnished');
          else foundAmenities.push('furnished');
        }
        if (amenity.includes('aircon') || amenity.includes('air con') || amenity.includes('a/c')) foundAmenities.push('aircon');
        if (amenity.includes('parking') || amenity.includes('garage')) foundAmenities.push('parking');
        if (amenity.includes('elevator')) foundAmenities.push('elevator');
        if (amenity.includes('security') || amenity.includes('guard') || amenity.includes('cctv')) foundAmenities.push('security');
        if (amenity.includes('pool')) foundAmenities.push('swimming_pool');
        if (amenity.includes('gym') || amenity.includes('fitness')) foundAmenities.push('gym');
        if (amenity.includes('balcony') || amenity.includes('terrace')) foundAmenities.push('balcony');
        if (amenity.includes('garden')) foundAmenities.push('garden');
        if (amenity.includes('wifi') || amenity.includes('internet')) foundAmenities.push('wifi');
        if (amenity.includes('kitchen')) foundAmenities.push('kitchen');
        if (amenity.includes('laundry') || amenity.includes('washing')) foundAmenities.push('laundry');
      }
    }
    
    return Array.from(new Set(foundAmenities)); // Remove duplicates
  }

  static parseAll(content: string) {
    const price = this.parsePrice(content);
    const location = this.parseLocation(content);
    const bedrooms = this.parseBedrooms(content);
    const bathrooms = this.parseBathrooms(content);
    const area = this.parseArea(content);
    const contacts = this.parseContacts(content);
    const type = this.parseType(content);
    const amenities = this.parseAmenities(content);
    const cleanedContent = this.cleanContent(content);
    
    // Generate title
    const title = this.generateTitle(bedrooms, bathrooms, location, type);
    
    return {
      title,
      description: cleanedContent,
      price,
      region: location,
      type,
      bedrooms,
      bathrooms,
      area,
      amenities,
      contacts,
      raw: content
    };
  }

  static generateTitle(bedrooms?: number | null, bathrooms?: number | null, location?: string | null, type?: string | null): string {
    let title = '';
    
    // Add property type prefix
    if (type === 'house') {
      title += 'House ';
    } else if (type === 'condo') {
      title += 'Condo ';
    }
    
    // Add bedroom/bathroom info
    if (bedrooms && bedrooms > 0) {
      title += `${bedrooms}BR`;
      
      if (bathrooms && bathrooms > 0) {
        title += `/${bathrooms}Bath`;
      }
    } else if (bathrooms && bathrooms > 0) {
      title += `${bathrooms}Bath`;
    }
    
    // Add location
    if (location) {
      const locationName = location.charAt(0).toUpperCase() + location.slice(1);
      title += ` in ${locationName}`;
    }
    
    // Fallback title
    if (!title.trim()) {
      if (type === 'house') return 'House for Rent';
      if (type === 'condo') return 'Condo for Rent';
      return 'Property for Rent';
    }
    
    return title.trim();
  }
}