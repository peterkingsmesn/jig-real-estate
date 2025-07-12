import React, { useState, useEffect } from 'react';
import { Template, TemplateType, PropertyType } from '@/types/template';
import { propertyTemplates } from '@/data/propertyTemplates';
import { facebookImportTemplate } from '@/data/facebookImportTemplate';
import { 
  Plus, 
  Edit, 
  Copy, 
  Trash2, 
  Eye, 
  EyeOff, 
  Download, 
  Upload,
  Settings,
  Search,
  Filter,
  MoreVertical,
  Home,
  Building,
  TreePine,
  Facebook,
  FileText,
  Clock,
  Users,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface TemplateManagerProps {
  onEdit?: (template: Template) => void;
  onView?: (template: Template) => void;
  className?: string;
}

const templateTypeIcons = {
  property: Home,
  facebook_import: Facebook,
  quick_input: FileText,
  bulk_import: Upload
};

const propertyTypeIcons = {
  house: Home,
  condo: Building,
  village: TreePine
};

export default function TemplateManager({ 
  onEdit, 
  onView, 
  className = '' 
}: TemplateManagerProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<TemplateType | 'all'>('all');
  const [showInactive, setShowInactive] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load templates
  useEffect(() => {
    const allTemplates = [
      ...Object.values(propertyTemplates),
      facebookImportTemplate
    ];
    setTemplates(allTemplates);
    setFilteredTemplates(allTemplates);
  }, []);

  // Filter templates
  useEffect(() => {
    let filtered = templates;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.metadata.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.metadata.tags?.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(template => template.type === filterType);
    }

    // Filter by active status
    if (!showInactive) {
      filtered = filtered.filter(template => template.isActive);
    }

    setFilteredTemplates(filtered);
  }, [templates, searchTerm, filterType, showInactive]);

  const handleToggleActive = (templateId: string) => {
    setTemplates(prev => prev.map(template =>
      template.id === templateId
        ? { ...template, isActive: !template.isActive, updatedAt: new Date().toISOString() }
        : template
    ));
  };

  const handleDuplicate = (template: Template) => {
    const duplicated: Template = {
      ...template,
      id: `${template.id}_copy_${Date.now()}`,
      name: `${template.name} (복사본)`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTemplates(prev => [...prev, duplicated]);
  };

  const handleDelete = (template: Template) => {
    if (template.isDefault) {
      alert('기본 템플릿은 삭제할 수 없습니다.');
      return;
    }
    
    setSelectedTemplate(template);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedTemplate) {
      setTemplates(prev => prev.filter(t => t.id !== selectedTemplate.id));
      setSelectedTemplate(null);
      setShowDeleteConfirm(false);
    }
  };

  const handleExport = (template: Template) => {
    const exportData = {
      template,
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      exportedBy: 'admin'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template_${template.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getTemplateStats = (template: Template) => {
    // Mock stats - in real app, would come from analytics
    return {
      usageCount: Math.floor(Math.random() * 100),
      lastUsed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      averageTime: Math.floor(Math.random() * 15) + 5
    };
  };

  const renderTemplateCard = (template: Template) => {
    const TypeIcon = templateTypeIcons[template.type];
    const PropertyIcon = template.metadata.propertyType 
      ? propertyTypeIcons[template.metadata.propertyType as PropertyType]
      : TypeIcon;
    
    const stats = getTemplateStats(template);

    return (
      <div
        key={template.id}
        className={`
          bg-white border-2 rounded-xl p-6 transition-all duration-200
          ${template.isActive 
            ? 'border-gray-200 hover:border-gray-300 hover:shadow-md' 
            : 'border-gray-300 bg-gray-50 opacity-75'
          }
        `}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`
              w-12 h-12 rounded-lg flex items-center justify-center
              ${template.isActive ? 'bg-blue-100' : 'bg-gray-100'}
            `}>
              <PropertyIcon className={`h-6 w-6 ${template.isActive ? 'text-blue-600' : 'text-gray-400'}`} />
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {template.name}
                </h3>
                {template.isDefault && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    기본
                  </span>
                )}
                {!template.isActive && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    비활성
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {template.metadata.description}
              </p>
            </div>
          </div>

          {/* Actions dropdown */}
          <div className="relative group">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="h-4 w-4" />
            </button>
            
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="p-1">
                {onView && (
                  <button
                    onClick={() => onView(template)}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <Eye className="h-4 w-4" />
                    <span>미리보기</span>
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={() => onEdit(template)}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <Edit className="h-4 w-4" />
                    <span>편집</span>
                  </button>
                )}
                <button
                  onClick={() => handleDuplicate(template)}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <Copy className="h-4 w-4" />
                  <span>복제</span>
                </button>
                <button
                  onClick={() => handleExport(template)}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <Download className="h-4 w-4" />
                  <span>내보내기</span>
                </button>
                <button
                  onClick={() => handleToggleActive(template.id)}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  {template.isActive ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                      <span>비활성화</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      <span>활성화</span>
                    </>
                  )}
                </button>
                {!template.isDefault && (
                  <button
                    onClick={() => handleDelete(template)}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>삭제</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Template info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">필드 수</span>
            <span className="font-medium">{template.schema.fields.length}개</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">섹션 수</span>
            <span className="font-medium">{template.schema.formSections?.length || 0}개</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">사용 횟수</span>
            <span className="font-medium">{stats.usageCount}회</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">평균 완료 시간</span>
            <span className="font-medium">{stats.averageTime}분</span>
          </div>
        </div>

        {/* Tags */}
        {template.metadata.tags && template.metadata.tags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {template.metadata.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
              {template.metadata.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  +{template.metadata.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>
              업데이트: {new Date(template.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <span>v{template.version}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            템플릿 관리
          </h2>
          <p className="text-gray-600">
            매물 등록 템플릿을 관리하고 사용 현황을 확인하세요
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
            <Upload className="h-4 w-4" />
            <span>템플릿 가져오기</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span>새 템플릿</span>
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">전체 템플릿</p>
              <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">활성 템플릿</p>
              <p className="text-2xl font-bold text-gray-900">
                {templates.filter(t => t.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">이번 달 사용</p>
              <p className="text-2xl font-bold text-gray-900">
                {templates.reduce((sum, t) => sum + getTemplateStats(t).usageCount, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">평균 완료율</p>
              <p className="text-2xl font-bold text-gray-900">92%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="템플릿 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as TemplateType | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="all">모든 유형</option>
              <option value="property">매물 템플릿</option>
              <option value="facebook_import">Facebook 가져오기</option>
              <option value="quick_input">빠른 입력</option>
              <option value="bulk_import">대량 가져오기</option>
            </select>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">비활성 포함</span>
            </label>
          </div>
        </div>
      </div>

      {/* Templates grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(renderTemplateCard)}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FileText className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            템플릿이 없습니다
          </h3>
          <p className="text-gray-600 mb-4">
            검색 조건을 변경하거나 새 템플릿을 만들어보세요.
          </p>
          <button className="flex items-center space-x-2 mx-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span>새 템플릿 만들기</span>
          </button>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                템플릿 삭제
              </h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              <strong>{selectedTemplate.name}</strong> 템플릿을 삭제하시겠습니까?
            </p>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-800">
                <strong>주의:</strong> 삭제된 템플릿은 복구할 수 없습니다.
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                삭제하기
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}