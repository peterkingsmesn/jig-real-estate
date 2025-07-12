import React, { useState } from 'react';
import { Template, PropertyType } from '@/types/template';
import { propertyTemplates } from '@/data/propertyTemplates';
import { Home, Building, TreePine, Check, Info } from 'lucide-react';

interface TemplateSelectorProps {
  onSelect: (template: Template) => void;
  selectedTemplate?: Template;
  className?: string;
}

const propertyTypeIcons = {
  house: Home,
  condo: Building,
  village: TreePine
};

const propertyTypeLabels = {
  house: '단독주택',
  condo: '콘도미니엄',
  village: '빌리지/단지'
};

const propertyTypeDescriptions = {
  house: '단독주택, 타운하우스 등 독립적인 주택',
  condo: '콘도미니엄, 아파트 등 고층 건물 내 유닛',
  village: '빌리지, 단지 내 주택 (보안, 공용시설 포함)'
};

export default function TemplateSelector({ 
  onSelect, 
  selectedTemplate, 
  className = '' 
}: TemplateSelectorProps) {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const handleTemplateSelect = (propertyType: PropertyType) => {
    const template = propertyTemplates[propertyType];
    onSelect(template);
  };

  const renderTemplateCard = (propertyType: PropertyType) => {
    const template = propertyTemplates[propertyType];
    const Icon = propertyTypeIcons[propertyType];
    const isSelected = selectedTemplate?.id === template.id;
    const isHovered = hoveredTemplate === template.id;

    return (
      <div
        key={propertyType}
        className={`
          relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200
          ${isSelected 
            ? 'border-primary bg-blue-50 shadow-lg' 
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
          }
          ${isHovered ? 'transform scale-105' : ''}
        `}
        onClick={() => handleTemplateSelect(propertyType)}
        onMouseEnter={() => setHoveredTemplate(template.id)}
        onMouseLeave={() => setHoveredTemplate(null)}
      >
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <Check className="h-4 w-4 text-white" />
          </div>
        )}

        {/* Icon */}
        <div className={`
          w-16 h-16 rounded-lg flex items-center justify-center mb-4
          ${isSelected ? 'bg-primary' : 'bg-gray-100'}
        `}>
          <Icon className={`h-8 w-8 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
        </div>

        {/* Title */}
        <h3 className={`
          text-xl font-semibold mb-2
          ${isSelected ? 'text-primary' : 'text-gray-900'}
        `}>
          {propertyTypeLabels[propertyType]}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4">
          {propertyTypeDescriptions[propertyType]}
        </p>

        {/* Template info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>필드 수</span>
            <span>{template.schema.fields.length}개</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>섹션 수</span>
            <span>{template.schema.formSections?.length || 0}개</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>예상 작성 시간</span>
            <span>5-10분</span>
          </div>
        </div>

        {/* Template features */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {template.metadata.tags?.slice(0, 3).map(tag => (
              <span
                key={tag}
                className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${isSelected 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-600'
                  }
                `}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          매물 유형 선택
        </h2>
        <p className="text-gray-600">
          매물 유형에 따라 최적화된 입력 양식을 제공합니다
        </p>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">템플릿 기능</p>
            <ul className="space-y-1 text-xs">
              <li>• 매물 유형별 맞춤형 입력 필드</li>
              <li>• 자동 유효성 검증</li>
              <li>• 단계별 안내 및 도움말</li>
              <li>• 임시저장 및 미리보기 기능</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Template cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.keys(propertyTemplates).map(propertyType => 
          renderTemplateCard(propertyType as PropertyType)
        )}
      </div>

      {/* Selected template info */}
      {selectedTemplate && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Check className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="text-sm text-green-800">
              <p className="font-medium mb-1">
                선택됨: {selectedTemplate.name}
              </p>
              <p className="text-xs">
                {selectedTemplate.metadata.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Template comparison */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          템플릿 비교
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-4">특징</th>
                <th className="text-center py-2 px-4">단독주택</th>
                <th className="text-center py-2 px-4">콘도미니엄</th>
                <th className="text-center py-2 px-4">빌리지/단지</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              <tr className="border-b border-gray-100">
                <td className="py-2 px-4 font-medium">층수 정보</td>
                <td className="text-center py-2 px-4">-</td>
                <td className="text-center py-2 px-4">✓</td>
                <td className="text-center py-2 px-4">-</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 px-4 font-medium">건물명</td>
                <td className="text-center py-2 px-4">-</td>
                <td className="text-center py-2 px-4">✓</td>
                <td className="text-center py-2 px-4">-</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 px-4 font-medium">빌리지명</td>
                <td className="text-center py-2 px-4">-</td>
                <td className="text-center py-2 px-4">-</td>
                <td className="text-center py-2 px-4">✓</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 px-4 font-medium">대지면적</td>
                <td className="text-center py-2 px-4">-</td>
                <td className="text-center py-2 px-4">-</td>
                <td className="text-center py-2 px-4">✓</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 px-4 font-medium">주택모델</td>
                <td className="text-center py-2 px-4">-</td>
                <td className="text-center py-2 px-4">-</td>
                <td className="text-center py-2 px-4">✓</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-medium">특화 편의시설</td>
                <td className="text-center py-2 px-4">정원, 차고</td>
                <td className="text-center py-2 px-4">엘리베이터, 체육관</td>
                <td className="text-center py-2 px-4">클럽하우스, 운동시설</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}