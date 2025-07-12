import React, { useState } from 'react';
import { FacebookImportTemplate, TemplateFormData } from '@/types/template';
import { facebookImportTemplate, FacebookContentParser } from '@/data/facebookImportTemplate';
import { 
  Facebook, 
  Copy, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  Upload,
  MapPin,
  Globe,
  Eye,
  Save,
  ArrowRight,
  ArrowLeft,
  Info
} from 'lucide-react';

interface FacebookImporterProps {
  onComplete: (data: TemplateFormData) => void;
  onCancel: () => void;
  className?: string;
}

interface ParsedData {
  title: string;
  description: string;
  price: number | null;
  region: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  contacts: {
    whatsapp?: string;
    telegram?: string;
    email?: string;
  };
  raw: string;
}

export default function FacebookImporter({ 
  onComplete, 
  onCancel, 
  className = '' 
}: FacebookImporterProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<TemplateFormData>({});
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = facebookImportTemplate.workflowSteps;

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleParse = async () => {
    if (!formData.postContent) return;

    setIsProcessing(true);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const parsed = FacebookContentParser.parseAll(String(formData.postContent));
      setParsedData(parsed);
      
      // Update form data with parsed values
      setFormData(prev => ({
        ...prev,
        title: parsed.title,
        description: parsed.description,
        price: parsed.price,
        region: parsed.region,
        bedrooms: parsed.bedrooms,
        bathrooms: parsed.bathrooms,
        area: parsed.area,
        'contact.whatsapp': parsed.contacts.whatsapp,
        'contact.telegram': parsed.contacts.telegram,
        'contact.email': parsed.contacts.email
      }));
      
    } catch (error) {
      console.error('Parsing error:', error);
      alert('내용 분석 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 0 && formData.postContent) {
      handleParse();
    }
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleComplete = () => {
    onComplete(formData);
  };

  const renderStep = () => {
    const step = steps[currentStep];

    switch (step.stepId) {
      case '1':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Facebook className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-2">Facebook 포스트 가져오기</p>
                  <ol className="space-y-1 text-xs list-decimal list-inside">
                    <li>Facebook 그룹에서 매물 포스트를 찾습니다</li>
                    <li>포스트 내용을 전체 선택하여 복사합니다</li>
                    <li>아래 텍스트 영역에 붙여넣습니다</li>
                    <li>이미지도 함께 저장해두세요</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook 포스트 URL (선택사항)
                </label>
                <input
                  type="url"
                  value={String(formData.postUrl || '')}
                  onChange={(e) => handleInputChange('postUrl', e.target.value)}
                  placeholder="https://www.facebook.com/groups/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <p className="text-xs text-gray-500 mt-1">
                  원본 포스트 참조를 위한 링크 (선택사항)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook 포스트 내용 *
                </label>
                <textarea
                  value={String(formData.postContent || '')}
                  onChange={(e) => handleInputChange('postContent', e.target.value)}
                  placeholder="Facebook 포스트의 전체 내용을 복사하여 붙여넣으세요..."
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  포스트 텍스트를 전체 선택하여 복사 후 붙여넣기
                </p>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.hasImages) || false}
                    onChange={(e) => handleInputChange('hasImages', e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">이미지가 포함된 포스트입니다</span>
                </label>
              </div>
            </div>

            {formData.postContent && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">내용이 입력되었습니다</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  다음 단계에서 자동으로 분석합니다
                </p>
              </div>
            )}
          </div>
        );

      case '2':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                {isProcessing ? (
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                ) : (
                  <Search className="h-12 w-12 text-green-600" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isProcessing ? '내용 분석 중...' : '분석 완료'}
              </h3>
              <p className="text-gray-600">
                {isProcessing 
                  ? 'Facebook 포스트 내용을 분석하고 있습니다'
                  : '다음 정보를 자동으로 추출했습니다'
                }
              </p>
            </div>

            {parsedData && !isProcessing && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">추출된 정보</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">제목:</span>
                      <span className="text-sm font-medium">{parsedData.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">가격:</span>
                      <span className="text-sm font-medium">
                        {parsedData.price ? `PHP ${parsedData.price.toLocaleString()}` : '미발견'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">지역:</span>
                      <span className="text-sm font-medium">{parsedData.region || '미발견'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">침실:</span>
                      <span className="text-sm font-medium">{parsedData.bedrooms || '미발견'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">화장실:</span>
                      <span className="text-sm font-medium">{parsedData.bathrooms || '미발견'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">면적:</span>
                      <span className="text-sm font-medium">
                        {parsedData.area ? `${parsedData.area} sqm` : '미발견'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">WhatsApp:</span>
                      <span className="text-sm font-medium">{parsedData.contacts.whatsapp || '미발견'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Telegram:</span>
                      <span className="text-sm font-medium">{parsedData.contacts.telegram || '미발견'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {parsedData && !isProcessing && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">확인 필요</p>
                    <p>자동 추출된 정보가 정확한지 다음 단계에서 확인하고 수정해주세요.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case '3':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">정보 검토 및 수정</p>
                  <p>자동 추출된 정보를 확인하고 필요한 경우 수정해주세요.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    매물 제목
                  </label>
                  <input
                    type="text"
                    value={String(formData.title || '')}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    월 렌트비 (PHP)
                  </label>
                  <input
                    type="number"
                    value={String(formData.price || '')}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    지역
                  </label>
                  <select
                    value={String(formData.region || '')}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">선택하세요</option>
                    <option value="manila">Manila</option>
                    <option value="cebu">Cebu</option>
                    <option value="davao">Davao</option>
                    <option value="boracay">Boracay</option>
                    <option value="baguio">Baguio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    매물 유형
                  </label>
                  <select
                    value={String(formData.type || '')}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">선택하세요</option>
                    <option value="house">House</option>
                    <option value="condo">Condominium</option>
                    <option value="village">Village</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    침실 수
                  </label>
                  <select
                    value={String(formData.bedrooms || '')}
                    onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">선택하세요</option>
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4">4 Bedrooms</option>
                    <option value="5">5+ Bedrooms</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    화장실 수
                  </label>
                  <select
                    value={String(formData.bathrooms || '')}
                    onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">선택하세요</option>
                    <option value="1">1 Bathroom</option>
                    <option value="2">2 Bathrooms</option>
                    <option value="3">3 Bathrooms</option>
                    <option value="4">4+ Bathrooms</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    면적 (sqm)
                  </label>
                  <input
                    type="number"
                    value={String(formData.area || '')}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="text"
                    value={String(formData['contact.whatsapp'] || '')}
                    onChange={(e) => handleInputChange('contact.whatsapp', e.target.value)}
                    placeholder="+63 912 345 6789"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                매물 설명
              </label>
              <textarea
                value={String(formData.description || '')}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        );

      case '4':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Upload className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">이미지 업로드</p>
                  <p>Facebook에서 저장한 매물 이미지를 업로드하세요.</p>
                </div>
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleInputChange('images', Array.from(e.target.files || []))}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <span className="text-lg font-medium text-gray-700">
                  이미지 업로드
                </span>
                <span className="text-sm text-gray-500">
                  또는 이미지를 여기로 드래그하세요
                </span>
              </label>
            </div>

            <div className="text-sm text-gray-600">
              <p>• 최대 10장까지 업로드 가능합니다</p>
              <p>• JPG, PNG 형식만 지원합니다</p>
              <p>• 파일 크기는 각각 5MB 이하여야 합니다</p>
            </div>
          </div>
        );

      case '5':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">위치 설정</p>
                  <p>정확한 주소를 입력하여 지도에 표시하세요.</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상세 주소
              </label>
              <input
                type="text"
                value={String(formData.address || '')}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="예: 123 Ayala Avenue, Makati City"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <p className="text-xs text-gray-500 mt-1">
                정확한 주소를 입력하면 지도에 자동으로 표시됩니다
              </p>
            </div>

            <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-2" />
                <p>지도가 여기에 표시됩니다</p>
                <p className="text-sm">Google Maps API 연동 필요</p>
              </div>
            </div>
          </div>
        );

      case '6':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">다국어 번역</p>
                  <p>매물 정보를 다른 언어로 번역할 수 있습니다 (선택사항).</p>
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={Boolean(formData.autoTranslate) || false}
                  onChange={(e) => handleInputChange('autoTranslate', e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">
                  AI 자동 번역 사용 (한국어, 중국어, 일본어)
                </span>
              </label>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">번역 안내</p>
                  <p>자동 번역은 참고용으로만 사용하고, 정확한 번역은 별도로 확인해주세요.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case '7':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-1">가져오기 완료</p>
                  <p>Facebook 포스트에서 매물 정보를 성공적으로 가져왔습니다.</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">최종 확인</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">매물 제목:</span>
                  <span className="font-medium">{String(formData.title || '미입력')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">가격:</span>
                  <span className="font-medium">
                    {formData.price ? `PHP ${Number(formData.price).toLocaleString()}` : '미입력'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">지역:</span>
                  <span className="font-medium">{String(formData.region || '미입력')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">매물 유형:</span>
                  <span className="font-medium">{String(formData.type || '미입력')}</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Facebook 매물 가져오기
        </h2>
        <p className="text-gray-600">
          Facebook 그룹 포스트에서 매물 정보를 자동으로 추출합니다
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">
            단계 {currentStep + 1} / {steps.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(((currentStep + 1) / steps.length) * 100)}% 완료
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {steps[currentStep].description}
          </h3>
        </div>

        {renderStep()}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            currentStep === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>이전</span>
        </button>

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            취소
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={nextStep}
              disabled={currentStep === 0 && !formData.postContent}
              className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>다음</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>가져오기 완료</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}