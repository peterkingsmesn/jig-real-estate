import React, { useState, useEffect } from 'react';
import { Template, TemplateField, TemplateFormData, FormSection } from '@/types/template';
import { Save, Eye, AlertCircle, Info } from 'lucide-react';

interface TemplateRendererProps {
  template: Template;
  initialData?: TemplateFormData;
  onSubmit: (data: TemplateFormData) => void;
  onSave?: (data: TemplateFormData) => void;
  onPreview?: (data: TemplateFormData) => void;
  isSubmitting?: boolean;
  showPreview?: boolean;
  className?: string;
}

export default function TemplateRenderer({
  template,
  initialData = {},
  onSubmit,
  onSave,
  onPreview,
  isSubmitting = false,
  showPreview = false,
  className = ''
}: TemplateRendererProps) {
  const [formData, setFormData] = useState<TemplateFormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentSection, setCurrentSection] = useState<string | null>(null);

  // Initialize form data with template defaults
  useEffect(() => {
    const defaultData = { ...template.schema.defaultValues, ...initialData };
    setFormData(defaultData);
  }, [template, initialData]);

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev };
      
      // Handle nested field names (e.g., 'contact.whatsapp')
      if (fieldName.includes('.')) {
        const parts = fieldName.split('.');
        let current = newData;
        
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = {} as any;
          }
          current = current[parts[i]] as any;
        }
        
        current[parts[parts.length - 1]] = value;
      } else {
        newData[fieldName] = value;
      }
      
      return newData;
    });
    
    // Clear error when field is changed
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate required fields
    template.schema.fields.forEach(field => {
      if (field.required) {
        const value = getFieldValue(field.name);
        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[field.name] = `${field.label}은(는) 필수 항목입니다.`;
        }
      }
    });
    
    // Validate using template validation rules
    template.schema.validationRules.forEach(rule => {
      const value = getFieldValue(rule.field);
      
      switch (rule.rule) {
        case 'min':
          if (value && Number(value) < Number(rule.value)) {
            newErrors[rule.field] = rule.message;
          }
          break;
        case 'max':
          if (value && Number(value) > Number(rule.value)) {
            newErrors[rule.field] = rule.message;
          }
          break;
        case 'pattern':
          if (value && !new RegExp(String(rule.value)).test(String(value))) {
            newErrors[rule.field] = rule.message;
          }
          break;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getFieldValue = (fieldName: string): any => {
    if (fieldName.includes('.')) {
      const parts = fieldName.split('.');
      let current = formData;
      
      for (const part of parts) {
        if (current && typeof current === 'object') {
          current = (current as any)[part];
        } else {
          return undefined;
        }
      }
      
      return current;
    }
    
    return formData[fieldName];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview(formData);
    }
  };

  const renderField = (field: TemplateField): React.ReactNode => {
    const value = getFieldValue(field.name);
    const error = errors[field.name];
    const commonProps = {
      id: field.name,
      name: field.name,
      required: field.required,
      placeholder: field.placeholder,
      className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
        error ? 'border-red-500' : 'border-gray-300'
      }`
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'url':
        return (
          <input
            {...commonProps}
            type={field.type}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            maxLength={field.maxLength}
          />
        );

      case 'textarea':
        return (
          <textarea
            {...commonProps}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            rows={4}
            maxLength={field.maxLength}
          />
        );

      case 'number':
        return (
          <input
            {...commonProps}
            type="number"
            value={value || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            min={field.min}
            max={field.max}
            step={field.step}
          />
        );

      case 'select':
        return (
          <select
            {...commonProps}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
          >
            <option value="">선택하세요</option>
            {field.options?.map(option => (
              <option key={String(option.value)} value={String(option.value)} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {field.options?.map(option => (
              <label key={String(option.value)} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={Array.isArray(value) ? value.includes(option.value) : false}
                  onChange={(e) => {
                    const currentArray = Array.isArray(value) ? value : [];
                    if (e.target.checked) {
                      handleFieldChange(field.name, [...currentArray, option.value]);
                    } else {
                      handleFieldChange(field.name, currentArray.filter(v => v !== option.value));
                    }
                  }}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <label key={String(option.value)} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={field.name}
                  value={String(option.value)}
                  checked={value === option.value}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  className="border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'file':
        return (
          <input
            {...commonProps}
            type="file"
            multiple={field.multiple}
            accept={field.accept}
            onChange={(e) => handleFieldChange(field.name, Array.from(e.target.files || []))}
          />
        );

      case 'date':
        return (
          <input
            {...commonProps}
            type="date"
            value={value || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
          />
        );

      default:
        return null;
    }
  };

  const renderSection = (section: FormSection): React.ReactNode => {
    const sectionFields = template.schema.fields.filter(field => 
      section.fields.includes(field.name)
    );

    const gridClass = section.layout.type === 'grid' 
      ? `grid grid-cols-1 md:grid-cols-${section.layout.columns || 2} gap-4`
      : 'space-y-4';

    return (
      <div key={section.sectionId} className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {section.title}
        </h3>
        {section.description && (
          <p className="text-sm text-gray-600 mb-4">{section.description}</p>
        )}
        
        <div className={gridClass}>
          {sectionFields.map(field => (
            <div key={field.name} className="space-y-2">
              <label 
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {renderField(field)}
              
              {field.helpText && (
                <p className="text-xs text-gray-500 flex items-center space-x-1">
                  <Info className="h-3 w-3" />
                  <span>{field.helpText}</span>
                </p>
              )}
              
              {errors[field.name] && (
                <p className="text-xs text-red-600 flex items-center space-x-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors[field.name]}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Template Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {template.name}
        </h2>
        {template.metadata.description && (
          <p className="text-gray-600">{template.metadata.description}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Render sections */}
        {template.schema.formSections?.map(section => renderSection(section))}

        {/* Render fields without sections */}
        {template.schema.fields.filter(field => 
          !template.schema.formSections?.some(section => 
            section.fields.includes(field.name)
          )
        ).length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              기타 정보
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {template.schema.fields
                .filter(field => 
                  !template.schema.formSections?.some(section => 
                    section.fields.includes(field.name)
                  )
                )
                .map(field => (
                  <div key={field.name} className="space-y-2">
                    <label 
                      htmlFor={field.name}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {renderField(field)}
                    
                    {field.helpText && (
                      <p className="text-xs text-gray-500">{field.helpText}</p>
                    )}
                    
                    {errors[field.name] && (
                      <p className="text-xs text-red-600">{errors[field.name]}</p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex space-x-4">
            {onSave && (
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>임시저장</span>
              </button>
            )}
            
            {onPreview && (
              <button
                type="button"
                onClick={handlePreview}
                className="flex items-center space-x-2 px-4 py-2 text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>미리보기</span>
              </button>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>처리중...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>저장</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}