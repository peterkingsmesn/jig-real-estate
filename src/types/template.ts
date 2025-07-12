// Template System Types
// Based on templates.md design specifications

export type TemplateType = 'property' | 'facebook_import' | 'quick_input' | 'bulk_import';

export type FieldType = 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'radio' | 'date' | 'file' | 'url' | 'email' | 'phone';

export type PropertyType = 'house' | 'condo' | 'village';

// Template Interfaces
export interface Template {
  id: string;
  name: string;
  type: TemplateType;
  version: string;
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
  isActive: boolean;
  metadata: TemplateMetadata;
  schema: TemplateSchema;
}

export interface TemplateMetadata {
  description?: string;
  author?: string;
  tags?: string[];
  propertyType?: PropertyType;
}

export interface TemplateSchema {
  fields: TemplateField[];
  validationRules: ValidationRule[];
  defaultValues: Record<string, FormFieldValue>;
  layout: LayoutConfig;
  formSections?: FormSection[];
}

// Template Field Definition
export interface TemplateField {
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  defaultValue?: FormFieldValue;
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
  section?: string; // which section this field belongs to
  gridColumn?: number; // for grid layout
}

export interface SelectOption {
  value: string | number | boolean;
  label: string;
  disabled?: boolean;
}

export interface FieldValidation {
  pattern?: string;
  message?: string;
  customValidator?: string; // function name for custom validation
}

export interface ConditionalLogic {
  field: string;
  condition: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: FormFieldValue;
  action: 'show' | 'hide' | 'require' | 'disable';
}

export interface ValidationRule {
  field: string;
  rule: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: string | number;
  message: string;
}

// Layout Configuration
export interface LayoutConfig {
  type: 'grid' | 'stack' | 'tabs' | 'wizard' | 'compact';
  columns?: number;
  spacing?: 'tight' | 'normal' | 'loose';
  responsive?: boolean;
}

export interface FormSection {
  sectionId: string;
  title: string;
  description?: string;
  layout: LayoutConfig;
  fields: string[]; // field names
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

// Facebook Import Template
export interface FacebookImportTemplate extends Template {
  parsingRules: FacebookParsingRules;
  mappingRules: FacebookMappingRules;
  workflowSteps: ImportWorkflowStep[];
}

export interface FacebookParsingRules {
  priceRegex: string[];
  locationRegex: string[];
  bedroomRegex: string[];
  bathroomRegex: string[];
  areaRegex: string[];
  contactRegex: string[];
  typeRegex: string[];
  amenitiesRegex: string[];
}

export interface FacebookMappingRules {
  title: FieldMapping;
  description: FieldMapping;
  price: FieldMapping;
  region: FieldMapping;
  contact: ContactMapping;
  [key: string]: FieldMapping | ContactMapping;
}

export interface FieldMapping {
  source: string;
  fallback?: string;
  maxLength?: number;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  mapping?: Record<string, string>; // value mappings
  cleanUp?: string[]; // cleanup operations
}

export interface ContactMapping {
  whatsapp?: FieldMapping;
  telegram?: FieldMapping;
  email?: FieldMapping;
  phone?: FieldMapping;
}

export interface ImportWorkflowStep {
  stepId: string;
  name: string;
  description: string;
  action?: string;
  fields?: TemplateField[];
  features?: string[];
  showParsedData?: boolean;
  editableFields?: string[];
}

// Template Manager Interfaces
export interface TemplateManager {
  loadTemplate(templateId: string): Promise<Template>;
  saveTemplate(template: Template): Promise<string>;
  getTemplates(type?: TemplateType): Promise<Template[]>;
  duplicateTemplate(templateId: string, newName: string): Promise<string>;
  deleteTemplate(templateId: string): Promise<boolean>;
  validateTemplate(template: Template): ValidationResult;
  restoreDefaultTemplate(type: TemplateType): Promise<string>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings?: ValidationWarning[];
}

export interface ValidationError {
  field?: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field?: string;
  message: string;
  suggestion?: string;
}

// Template Usage Analytics
export interface TemplateUsageAnalytics {
  templateId: string;
  usageCount: number;
  averageCompletionTime: number;
  abandonmentRate: number;
  errorRate: number;
  mostUsedFields: string[];
  leastUsedFields: string[];
  userFeedback: TemplateFeedback[];
}

export interface TemplateFeedback {
  id: string;
  userId: string;
  rating: number; // 1-5
  comment?: string;
  suggestions?: string;
  createdAt: string;
}

// Template Optimization
export interface TemplateOptimization {
  fieldOrderScore: number;
  performanceScore: number;
  usabilityScore: number;
  suggestions: OptimizationSuggestion[];
}

export interface OptimizationSuggestion {
  type: 'field_order' | 'field_removal' | 'validation' | 'ui_improvement';
  description: string;
  impact: 'low' | 'medium' | 'high';
  implementationCost: 'low' | 'medium' | 'high';
}

// Quick Input Template
export interface QuickInputTemplate extends Template {
  shortcuts: KeyboardShortcut[];
  autoSave: boolean;
  autoSaveInterval?: number; // seconds
}

export interface KeyboardShortcut {
  key: string;
  action: string;
  description?: string;
}

// 폼 필드 값의 타입 정의
export type FormFieldValue = string | number | boolean | string[] | File | File[] | null | undefined;

// Template Form Data
export interface TemplateFormData {
  [fieldName: string]: FormFieldValue;
}

export interface TemplateSubmission {
  templateId: string;
  formData: TemplateFormData;
  submittedAt: string;
  userId?: string;
  status: 'draft' | 'submitted' | 'processed' | 'error';
  processingResult?: ProcessingResult;
}

// 처리 결과 타입 정의
export interface ProcessingResult {
  success: boolean;
  errors?: ProcessingError[];
  warnings?: ProcessingWarning[];
  data?: Record<string, FormFieldValue>;
  processedAt: string;
  processingTime: number; // milliseconds
}

export interface ProcessingError {
  field?: string;
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ProcessingWarning {
  field?: string;
  code: string;
  message: string;
  suggestion?: string;
}

// Property Template Specific Types
export interface PropertyTemplateConfig {
  propertyType: PropertyType;
  regions: SelectOption[];
  amenities: AmenityOption[];
  priceRange: {
    min: number;
    max: number;
    step: number;
  };
  areaRange: {
    min: number;
    max: number;
    step: number;
  };
}

export interface AmenityOption extends SelectOption {
  category: 'essential' | 'comfort' | 'security' | 'entertainment' | 'business';
  icon?: string;
  description?: string;
  propertyTypes?: PropertyType[]; // which property types this amenity applies to
}

// Template Builder Interface
export interface TemplateBuilder {
  addField(field: TemplateField): void;
  removeField(fieldName: string): void;
  reorderFields(fieldNames: string[]): void;
  addValidationRule(rule: ValidationRule): void;
  setLayout(layout: LayoutConfig): void;
  addSection(section: FormSection): void;
  preview(): TemplatePreview;
  save(): Promise<string>;
  reset(): void;
}

export interface TemplatePreview {
  html: string;
  css?: string;
  estimatedCompletionTime: number; // minutes
  complexityScore: number; // 1-10
  accessibilityScore: number; // 1-10
}

// Template Import/Export
export interface TemplateExport {
  template: Template;
  version: string;
  exportedAt: string;
  exportedBy?: string;
  dependencies?: string[]; // other template IDs this depends on
}

export interface TemplateImport {
  file: File;
  overwriteExisting: boolean;
  validateOnly: boolean;
}

// Default Template Configurations
export const DEFAULT_PROPERTY_TEMPLATES: Record<PropertyType, Partial<Template>> = {
  house: {
    name: 'House Template',
    metadata: { propertyType: 'house', tags: ['residential', 'house'] }
  },
  condo: {
    name: 'Condominium Template', 
    metadata: { propertyType: 'condo', tags: ['residential', 'condo', 'high-rise'] }
  },
  village: {
    name: 'Village House Template',
    metadata: { propertyType: 'village', tags: ['residential', 'village', 'subdivision'] }
  }
};