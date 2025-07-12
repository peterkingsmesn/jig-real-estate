import { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import TemplateSelector from '@/components/template/TemplateSelector';
import TemplateRenderer from '@/components/template/TemplateRenderer';
import { Template, TemplateFormData } from '@/types/template';
import { ArrowLeft, Save, Eye, Upload } from 'lucide-react';

export default function PropertyAdd() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<TemplateFormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setFormData(template.schema.defaultValues || {});
  };

  const handleSubmit = async (data: TemplateFormData) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      console.log('Submitting property data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - redirect to property list
      router.push('/admin/properties?success=created');
    } catch (error) {
      console.error('Error creating property:', error);
      alert('매물 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = (data: TemplateFormData) => {
    // Save as draft
    console.log('Saving draft:', data);
    setFormData(data);
    alert('임시저장되었습니다.');
  };

  const handlePreview = (data: TemplateFormData) => {
    setFormData(data);
    setShowPreview(true);
  };

  const handleBack = () => {
    if (selectedTemplate) {
      setSelectedTemplate(null);
      setFormData({});
    } else {
      router.push('/admin');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>뒤로</span>
            </button>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                새 매물 등록
              </h1>
              <p className="text-gray-600">
                {selectedTemplate 
                  ? `${selectedTemplate.name} 템플릿 사용` 
                  : '매물 유형을 선택하세요'
                }
              </p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/admin/property-import')}
              className="flex items-center space-x-2 px-4 py-2 text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span>페이스북 임포트</span>
            </button>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center space-x-4">
          <div className={`
            flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium
            ${!selectedTemplate ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}
          `}>
            <span className="w-5 h-5 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-xs">
              1
            </span>
            <span>템플릿 선택</span>
          </div>
          
          <div className="flex-1 h-px bg-gray-200"></div>
          
          <div className={`
            flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium
            ${selectedTemplate ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}
          `}>
            <span className="w-5 h-5 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-xs">
              2
            </span>
            <span>매물 정보 입력</span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {!selectedTemplate ? (
            <div className="p-6">
              <TemplateSelector
                onSelect={handleTemplateSelect}
                selectedTemplate={selectedTemplate || undefined}
              />
            </div>
          ) : (
            <div className="p-6">
              <TemplateRenderer
                template={selectedTemplate}
                initialData={formData}
                onSubmit={handleSubmit}
                onSave={handleSave}
                onPreview={handlePreview}
                isSubmitting={isSubmitting}
              />
            </div>
          )}
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    매물 미리보기
                  </h3>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Preview content */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      입력된 데이터
                    </h4>
                    <pre className="text-sm text-gray-600 overflow-x-auto">
                      {JSON.stringify(formData, null, 2)}
                    </pre>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowPreview(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      닫기
                    </button>
                    <button
                      onClick={() => {
                        setShowPreview(false);
                        handleSubmit(formData);
                      }}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      등록하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            💡 매물 등록 팁
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 정확한 정보 입력으로 임차인의 신뢰도를 높이세요</li>
            <li>• 매물 사진은 밝고 깨끗한 상태로 촬영해주세요</li>
            <li>• 편의시설과 주변 환경을 상세히 기재하세요</li>
            <li>• 연락처 정보를 정확히 입력하여 원활한 소통을 도모하세요</li>
            <li>• 임시저장 기능을 활용하여 작성 중인 내용을 보관하세요</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}