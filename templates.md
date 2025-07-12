# 템플릿 시스템 설계

## 템플릿 시스템 개요

### 목적
- 관리자의 빠른 매물 등록 지원
- 페이스북 그룹에서의 반자동 데이터 전송
- 일관된 데이터 구조 유지
- 다국어 입력 효율성 향상

## 1. 매물 유형별 템플릿

### 1.1 하우스 템플릿 (House Template)
```json
{
  "templateId": "house_template_v1",
  "templateName": "Single House Template",
  "templateType": "house",
  "defaultValues": {
    "type": "house",
    "currency": "PHP",
    "furnished": false,
    "amenities": [
      "parking",
      "security",
      "water_supply",
      "electricity"
    ],
    "contact": {
      "whatsapp": "",
      "telegram": "",
      "email": "",
      "phone": ""
    }
  },
  "formFields": [
    {
      "name": "title",
      "type": "text",
      "required": true,
      "maxLength": 100,
      "placeholder": "예: 2-Bedroom House in Makati"
    },
    {
      "name": "region",
      "type": "select",
      "required": true,
      "options": [
        { "value": "manila", "label": "Manila" },
        { "value": "cebu", "label": "Cebu" },
        { "value": "davao", "label": "Davao" },
        { "value": "boracay", "label": "Boracay" },
        { "value": "baguio", "label": "Baguio" }
      ]
    },
    {
      "name": "price",
      "type": "number",
      "required": true,
      "min": 5000,
      "max": 200000,
      "step": 1000,
      "placeholder": "Monthly rent in PHP"
    },
    {
      "name": "deposit",
      "type": "number",
      "required": true,
      "min": 0,
      "max": 500000,
      "step": 1000,
      "placeholder": "Security deposit in PHP"
    },
    {
      "name": "bedrooms",
      "type": "select",
      "required": true,
      "options": [
        { "value": 1, "label": "1 Bedroom" },
        { "value": 2, "label": "2 Bedrooms" },
        { "value": 3, "label": "3 Bedrooms" },
        { "value": 4, "label": "4 Bedrooms" },
        { "value": 5, "label": "5+ Bedrooms" }
      ]
    },
    {
      "name": "bathrooms",
      "type": "select",
      "required": true,
      "options": [
        { "value": 1, "label": "1 Bathroom" },
        { "value": 2, "label": "2 Bathrooms" },
        { "value": 3, "label": "3 Bathrooms" },
        { "value": 4, "label": "4+ Bathrooms" }
      ]
    },
    {
      "name": "area",
      "type": "number",
      "required": true,
      "min": 20,
      "max": 1000,
      "step": 5,
      "placeholder": "Area in square meters"
    },
    {
      "name": "amenities",
      "type": "checkbox",
      "required": false,
      "options": [
        { "value": "parking", "label": "Parking" },
        { "value": "security", "label": "24/7 Security" },
        { "value": "water_supply", "label": "Water Supply" },
        { "value": "electricity", "label": "Electricity" },
        { "value": "internet", "label": "Internet Ready" },
        { "value": "aircon", "label": "Air Conditioning" },
        { "value": "garden", "label": "Garden" },
        { "value": "balcony", "label": "Balcony" },
        { "value": "garage", "label": "Garage" }
      ]
    },
    {
      "name": "furnished",
      "type": "radio",
      "required": true,
      "options": [
        { "value": true, "label": "Fully Furnished" },
        { "value": false, "label": "Unfurnished" }
      ]
    }
  ],
  "validationRules": {
    "priceRange": {
      "min": 5000,
      "max": 200000,
      "message": "Price should be between PHP 5,000 and PHP 200,000"
    },
    "areaRange": {
      "min": 20,
      "max": 1000,
      "message": "Area should be between 20 and 1,000 square meters"
    }
  }
}
```

### 1.2 콘도 템플릿 (Condo Template)
```json
{
  "templateId": "condo_template_v1",
  "templateName": "Condominium Template",
  "templateType": "condo",
  "defaultValues": {
    "type": "condo",
    "currency": "PHP",
    "furnished": true,
    "amenities": [
      "elevator",
      "security",
      "gym",
      "swimming_pool",
      "parking"
    ]
  },
  "formFields": [
    {
      "name": "title",
      "type": "text",
      "required": true,
      "maxLength": 100,
      "placeholder": "예: 1BR Condo in BGC Taguig"
    },
    {
      "name": "buildingName",
      "type": "text",
      "required": true,
      "maxLength": 100,
      "placeholder": "Condominium building name"
    },
    {
      "name": "floor",
      "type": "number",
      "required": true,
      "min": 1,
      "max": 100,
      "placeholder": "Floor number"
    },
    {
      "name": "amenities",
      "type": "checkbox",
      "required": false,
      "options": [
        { "value": "elevator", "label": "Elevator" },
        { "value": "security", "label": "24/7 Security" },
        { "value": "gym", "label": "Gymnasium" },
        { "value": "swimming_pool", "label": "Swimming Pool" },
        { "value": "parking", "label": "Parking Slot" },
        { "value": "playground", "label": "Playground" },
        { "value": "function_room", "label": "Function Room" },
        { "value": "business_center", "label": "Business Center" },
        { "value": "laundry", "label": "Laundry Area" }
      ]
    }
  ]
}
```

### 1.3 빌리지 템플릿 (Village Template)
```json
{
  "templateId": "village_template_v1",
  "templateName": "Village House Template",
  "templateType": "village",
  "defaultValues": {
    "type": "village",
    "currency": "PHP",
    "furnished": false,
    "amenities": [
      "security",
      "clubhouse",
      "playground",
      "basketball_court"
    ]
  },
  "formFields": [
    {
      "name": "villageName",
      "type": "text",
      "required": true,
      "maxLength": 100,
      "placeholder": "Subdivision/Village name"
    },
    {
      "name": "houseModel",
      "type": "text",
      "required": false,
      "maxLength": 50,
      "placeholder": "House model (e.g., Bungalow, Two-story)"
    },
    {
      "name": "lotArea",
      "type": "number",
      "required": true,
      "min": 50,
      "max": 2000,
      "placeholder": "Lot area in square meters"
    },
    {
      "name": "amenities",
      "type": "checkbox",
      "required": false,
      "options": [
        { "value": "security", "label": "24/7 Security" },
        { "value": "clubhouse", "label": "Clubhouse" },
        { "value": "playground", "label": "Playground" },
        { "value": "basketball_court", "label": "Basketball Court" },
        { "value": "swimming_pool", "label": "Swimming Pool" },
        { "value": "tennis_court", "label": "Tennis Court" },
        { "value": "jogging_path", "label": "Jogging Path" },
        { "value": "chapel", "label": "Chapel" },
        { "value": "commercial_area", "label": "Commercial Area" }
      ]
    }
  ]
}
```

## 2. 페이스북 임포트 템플릿

### 2.1 Facebook Post Parser Template
```json
{
  "templateId": "facebook_import_v1",
  "templateName": "Facebook Post Import",
  "parsingRules": {
    "priceRegex": [
      "PHP\\s*([0-9,]+)",
      "₱\\s*([0-9,]+)",
      "([0-9,]+)\\s*php",
      "([0-9,]+)\\s*pesos"
    ],
    "locationRegex": [
      "in\\s+([A-Za-z\\s]+)",
      "located\\s+in\\s+([A-Za-z\\s]+)",
      "at\\s+([A-Za-z\\s]+)"
    ],
    "bedroomRegex": [
      "([0-9]+)\\s*br",
      "([0-9]+)\\s*bedroom",
      "([0-9]+)\\s*bed"
    ],
    "bathroomRegex": [
      "([0-9]+)\\s*bath",
      "([0-9]+)\\s*bathroom",
      "([0-9]+)\\s*toilet"
    ],
    "areaRegex": [
      "([0-9,]+)\\s*sqm",
      "([0-9,]+)\\s*sq\\.?m",
      "([0-9,]+)\\s*square\\s*meters?"
    ]
  },
  "mappingRules": {
    "title": {
      "source": "postTitle",
      "fallback": "auto_generate",
      "maxLength": 100
    },
    "description": {
      "source": "postContent",
      "cleanUp": [
        "remove_hashtags",
        "remove_excessive_whitespace",
        "remove_contact_info"
      ],
      "maxLength": 1000
    },
    "price": {
      "source": "parsed_price",
      "validation": {
        "min": 1000,
        "max": 1000000
      }
    },
    "region": {
      "source": "parsed_location",
      "mapping": {
        "makati": "manila",
        "bgc": "manila",
        "ortigas": "manila",
        "alabang": "manila",
        "lahug": "cebu",
        "it park": "cebu"
      }
    },
    "contact": {
      "whatsapp": {
        "source": "extracted_phone",
        "format": "international"
      },
      "telegram": {
        "source": "extracted_telegram",
        "format": "username"
      }
    }
  }
}
```

### 2.2 Facebook Import Workflow Template
```json
{
  "workflowId": "facebook_import_workflow_v1",
  "steps": [
    {
      "stepId": "1",
      "name": "paste_facebook_content",
      "description": "Paste Facebook post content",
      "fields": [
        {
          "name": "postUrl",
          "type": "url",
          "required": false,
          "placeholder": "Facebook post URL (optional)"
        },
        {
          "name": "postContent",
          "type": "textarea",
          "required": true,
          "rows": 10,
          "placeholder": "Paste the Facebook post content here"
        },
        {
          "name": "postImages",
          "type": "file",
          "multiple": true,
          "accept": "image/*",
          "required": false
        }
      ]
    },
    {
      "stepId": "2",
      "name": "auto_parse_content",
      "description": "Automatically parse the content",
      "action": "parse_facebook_content",
      "showParsedData": true
    },
    {
      "stepId": "3",
      "name": "review_and_edit",
      "description": "Review and edit parsed data",
      "editableFields": [
        "title",
        "description",
        "price",
        "region",
        "type",
        "bedrooms",
        "bathrooms",
        "area",
        "amenities",
        "contact"
      ]
    },
    {
      "stepId": "4",
      "name": "upload_images",
      "description": "Upload and organize images",
      "features": [
        "drag_and_drop",
        "image_preview",
        "set_main_image",
        "image_order"
      ]
    },
    {
      "stepId": "5",
      "name": "set_location",
      "description": "Set property location on map",
      "mapProvider": "google_maps",
      "features": [
        "address_search",
        "drag_marker",
        "auto_geocoding"
      ]
    },
    {
      "stepId": "6",
      "name": "add_translations",
      "description": "Add translations (optional)",
      "languages": ["ko", "zh", "ja", "en"],
      "aiTranslationSupport": true
    },
    {
      "stepId": "7",
      "name": "preview_and_save",
      "description": "Preview and save property",
      "features": [
        "desktop_preview",
        "mobile_preview",
        "save_as_draft",
        "publish_immediately"
      ]
    }
  ]
}
```

## 3. 관리자 빠른 입력 템플릿

### 3.1 Quick Input Template
```json
{
  "templateId": "quick_input_v1",
  "templateName": "Quick Property Input",
  "layout": "compact",
  "formSections": [
    {
      "sectionId": "basic_info",
      "title": "Basic Information",
      "layout": "grid",
      "columns": 2,
      "fields": [
        "title",
        "type",
        "region",
        "price",
        "bedrooms",
        "bathrooms"
      ]
    },
    {
      "sectionId": "details",
      "title": "Property Details",
      "layout": "grid",
      "columns": 3,
      "fields": [
        "area",
        "furnished",
        "floor",
        "deposit"
      ]
    },
    {
      "sectionId": "amenities",
      "title": "Amenities",
      "layout": "checkbox_grid",
      "columns": 4,
      "fields": ["amenities"]
    },
    {
      "sectionId": "contact",
      "title": "Contact Information",
      "layout": "grid",
      "columns": 2,
      "fields": [
        "contact.whatsapp",
        "contact.telegram",
        "contact.email",
        "contact.phone"
      ]
    }
  ],
  "shortcuts": [
    {
      "key": "ctrl+s",
      "action": "save_draft"
    },
    {
      "key": "ctrl+enter",
      "action": "publish"
    },
    {
      "key": "ctrl+p",
      "action": "preview"
    }
  ]
}
```

## 4. 템플릿 관리 시스템

### 4.1 Template Manager Interface
```typescript
interface TemplateManager {
  // 템플릿 로드
  loadTemplate(templateId: string): Promise<Template>;
  
  // 템플릿 저장
  saveTemplate(template: Template): Promise<string>;
  
  // 템플릿 목록 조회
  getTemplates(type?: TemplateType): Promise<Template[]>;
  
  // 템플릿 복사
  duplicateTemplate(templateId: string, newName: string): Promise<string>;
  
  // 템플릿 삭제
  deleteTemplate(templateId: string): Promise<boolean>;
  
  // 템플릿 유효성 검사
  validateTemplate(template: Template): ValidationResult;
  
  // 기본 템플릿 복원
  restoreDefaultTemplate(type: TemplateType): Promise<string>;
}
```

### 4.2 Template Types
```typescript
type TemplateType = 'property' | 'facebook_import' | 'quick_input' | 'bulk_import';

interface Template {
  id: string;
  name: string;
  type: TemplateType;
  version: string;
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
  isActive: boolean;
  metadata: {
    description?: string;
    author?: string;
    tags?: string[];
  };
  schema: TemplateSchema;
}

interface TemplateSchema {
  fields: TemplateField[];
  validationRules: ValidationRule[];
  defaultValues: Record<string, any>;
  layout: LayoutConfig;
}
```

## 5. 사용자 정의 템플릿

### 5.1 Custom Template Builder
```typescript
interface CustomTemplateBuilder {
  // 필드 추가
  addField(field: TemplateField): void;
  
  // 필드 제거
  removeField(fieldName: string): void;
  
  // 필드 순서 변경
  reorderFields(fieldNames: string[]): void;
  
  // 유효성 규칙 추가
  addValidationRule(rule: ValidationRule): void;
  
  // 레이아웃 설정
  setLayout(layout: LayoutConfig): void;
  
  // 템플릿 미리보기
  preview(): TemplatePreview;
  
  // 템플릿 저장
  save(): Promise<string>;
}
```

### 5.2 Template Field Types
```typescript
interface TemplateField {
  name: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'radio' | 'date' | 'file' | 'url' | 'email' | 'phone';
  label: string;
  placeholder?: string;
  required: boolean;
  defaultValue?: any;
  options?: SelectOption[];
  validation?: FieldValidation;
  conditional?: ConditionalLogic;
  helpText?: string;
  maxLength?: number;
  minLength?: number;
  min?: number;
  max?: number;
  step?: number;
  accept?: string; // for file inputs
  multiple?: boolean;
}
```

## 6. 템플릿 사용 통계 및 최적화

### 6.1 Usage Analytics
```typescript
interface TemplateUsageAnalytics {
  templateId: string;
  usageCount: number;
  averageCompletionTime: number;
  abandonmentRate: number;
  errorRate: number;
  mostUsedFields: string[];
  leastUsedFields: string[];
  userFeedback: TemplateFeedback[];
}
```

### 6.2 Template Optimization
```typescript
interface TemplateOptimization {
  // 사용 빈도 기반 필드 순서 최적화
  optimizeFieldOrder(analytics: TemplateUsageAnalytics): void;
  
  // 불필요한 필드 식별
  identifyUnusedFields(analytics: TemplateUsageAnalytics): string[];
  
  // 자동 완성 제안
  suggestAutoComplete(fieldName: string): string[];
  
  // 템플릿 성능 점수
  calculatePerformanceScore(analytics: TemplateUsageAnalytics): number;
}
```