import { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import FacebookImporter from '@/components/template/FacebookImporter';
import { TemplateFormData } from '@/types/template';
import { ArrowLeft, Facebook, Upload, FileText, Zap } from 'lucide-react';

export default function PropertyImport() {
  const router = useRouter();
  const [showImporter, setShowImporter] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImportComplete = async (data: TemplateFormData) => {
    setIsProcessing(true);
    
    try {
      // In a real app, this would be an API call
      console.log('Importing property data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - redirect to property list
      router.push('/admin/properties?success=imported');
    } catch (error) {
      console.error('Error importing property:', error);
      alert('매물 가져오기 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setShowImporter(false);
  };

  const handleBack = () => {
    router.push('/admin');
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
                매물 가져오기
              </h1>
              <p className="text-gray-600">
                Facebook 그룹 포스트에서 매물 정보를 자동으로 추출합니다
              </p>
            </div>
          </div>
        </div>

        {showImporter ? (
          <FacebookImporter
            onComplete={handleImportComplete}
            onCancel={handleCancel}
          />
        ) : (
          <div className="space-y-8">
            {/* Import Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => setShowImporter(true)}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Facebook className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Facebook 그룹
                    </h3>
                    <p className="text-sm text-gray-600">
                      가장 많이 사용하는 방법
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">
                  Facebook 그룹 포스트에서 매물 정보를 복사하여 자동으로 추출합니다.
                </p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Zap className="h-4 w-4" />
                    <span>자동 분석</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4" />
                    <span>텍스트 추출</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 opacity-50 cursor-not-allowed">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Upload className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      CSV 파일
                    </h3>
                    <p className="text-sm text-gray-600">
                      곧 출시 예정
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">
                  CSV 파일을 업로드하여 대량의 매물 정보를 한 번에 가져옵니다.
                </p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4" />
                    <span>대량 처리</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Zap className="h-4 w-4" />
                    <span>일괄 가져오기</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 opacity-50 cursor-not-allowed">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-4 w-4 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      웹 스크래핑
                    </h3>
                    <p className="text-sm text-gray-600">
                      곧 출시 예정
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">
                  다른 부동산 사이트에서 매물 정보를 자동으로 수집합니다.
                </p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Zap className="h-4 w-4" />
                    <span>자동 수집</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4" />
                    <span>실시간 동기화</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📈 매물 가져오기의 장점
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">
                      <strong>시간 절약:</strong> 수동 입력 대비 80% 시간 단축
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">
                      <strong>정확도 향상:</strong> 자동 추출로 오타 및 실수 방지
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">
                      <strong>일관성 유지:</strong> 동일한 형식으로 매물 정보 관리
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">
                      <strong>효율성 증대:</strong> 대량 매물 처리 가능
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">
                      <strong>품질 관리:</strong> 자동 검증 및 정리 기능
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">
                      <strong>즉시 활용:</strong> 가져온 즉시 웹사이트에 게시
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* How it works */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🚀 Facebook 가져오기 과정
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">포스트 복사</h4>
                    <p className="text-sm text-gray-600">
                      Facebook 그룹에서 매물 포스트 전체를 복사합니다
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-green-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">자동 분석</h4>
                    <p className="text-sm text-gray-600">
                      AI가 텍스트를 분석하여 가격, 위치, 방 개수 등을 자동 추출
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-purple-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">정보 확인</h4>
                    <p className="text-sm text-gray-600">
                      추출된 정보를 확인하고 필요한 경우 수정합니다
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-yellow-600">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">이미지 업로드</h4>
                    <p className="text-sm text-gray-600">
                      저장해둔 매물 이미지를 업로드하고 순서를 정합니다
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-red-600">5</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">매물 등록</h4>
                    <p className="text-sm text-gray-600">
                      모든 정보를 최종 확인 후 매물을 웹사이트에 등록합니다
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">
                💡 더 나은 결과를 위한 팁
              </h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• 포스트 전체 내용을 복사하세요 (제목, 설명, 가격, 연락처 모두 포함)</li>
                <li>• 숫자 정보(가격, 면적, 방 개수)가 명확히 표시된 포스트를 선택하세요</li>
                <li>• 이미지는 별도로 저장한 후 업로드하세요</li>
                <li>• 자동 추출 결과를 항상 확인하고 필요시 수정하세요</li>
                <li>• 연락처 정보가 정확한지 반드시 확인하세요</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}