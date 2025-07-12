import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import { propertiesData } from '@/data/propertiesData';
import { Property } from '@/types/property';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Trash2, 
  Upload, 
  X, 
  Star,
  MapPin,
  Home,
  Building,
  Users,
  Plus,
  GripVertical,
  ExternalLink
} from 'lucide-react';

export default function PropertyEdit() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'images' | 'location' | 'translations'>('basic');

  // 폼 데이터
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'condo' as 'house' | 'condo' | 'apartment' | 'studio' | 'villa' | 'townhouse' | 'village',
    region: '',
    address: '',
    price: 0,
    deposit: 0,
    bedrooms: 1,
    bathrooms: 1,
    area: 0,
    floor: 0,
    furnished: false,
    amenities: [] as string[],
    status: 'active' as 'active' | 'inactive' | 'rented',
    featured: false,
    contact: {
      contactName: '',
      phone: '',
      email: '',
      whatsapp: '',
      telegram: ''
    },
    translations: {
      ko: { title: '', description: '' },
      zh: { title: '', description: '' },
      ja: { title: '', description: '' },
      en: { title: '', description: '' },
      tl: { title: '', description: '' }
    }
  });

  const [images, setImages] = useState<any[]>([]);
  const [draggedImage, setDraggedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  // 데이터 로드
  useEffect(() => {
    if (id) {
      const foundProperty = propertiesData.find(p => p.id === id);
      if (foundProperty) {
        setProperty(foundProperty);
        setFormData({
          title: foundProperty.title,
          description: foundProperty.description,
          type: foundProperty.type,
          region: foundProperty.region,
          address: foundProperty.address,
          price: foundProperty.price,
          deposit: foundProperty.deposit || 0,
          bedrooms: foundProperty.bedrooms,
          bathrooms: foundProperty.bathrooms,
          area: foundProperty.area,
          floor: foundProperty.floor || 0,
          furnished: foundProperty.furnished,
          amenities: foundProperty.amenities,
          status: foundProperty.status || 'active',
          featured: foundProperty.featured,
          contact: {
            contactName: foundProperty.contact.contactName || '',
            phone: foundProperty.contact.phone || '',
            email: foundProperty.contact.email || '',
            whatsapp: foundProperty.contact.whatsapp || '',
            telegram: foundProperty.contact.telegram || ''
          },
          translations: {
            ko: foundProperty.translations?.ko || { title: '', description: '' },
            zh: foundProperty.translations?.zh || { title: '', description: '' },
            ja: foundProperty.translations?.ja || { title: '', description: '' },
            en: foundProperty.translations?.en || { title: '', description: '' },
            tl: foundProperty.translations?.tl || { title: '', description: '' }
          }
        });
        setImages(foundProperty.images || []);
      }
      setIsLoading(false);
    }
  }, [id]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleTranslationChange = (lang: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [lang]: {
          ...prev.translations[lang as keyof typeof prev.translations],
          [field]: value
        }
      }
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    
    setUploadErrors([]);
    
    Array.from(files).forEach(file => {
      // 파일 유효성 검사
      if (!file.type.startsWith('image/')) {
        setUploadErrors(prev => [...prev, `${file.name}: 이미지 파일만 업로드 가능합니다.`]);
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setUploadErrors(prev => [...prev, `${file.name}: 파일 크기는 5MB 이하여야 합니다.`]);
        return;
      }
      
      const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setUploadProgress(prev => ({ ...prev, [imageId]: 0 }));
      
      const reader = new FileReader();
      
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          setUploadProgress(prev => ({ ...prev, [imageId]: progress }));
        }
      };
      
      reader.onload = (e) => {
        const newImage = {
          id: imageId,
          url: e.target?.result as string,
          thumbnailUrl: e.target?.result as string,
          alt: `매물 이미지 ${images.length + 1}`,
          order: images.length + 1,
          isMain: images.length === 0,
          file: file,
          fileName: file.name,
          fileSize: file.size
        };
        
        setImages(prev => [...prev, newImage]);
        setUploadProgress(prev => ({ ...prev, [imageId]: 100 }));
        
        // 진행률 표시를 잠시 유지한 후 제거
        setTimeout(() => {
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[imageId];
            return newProgress;
          });
        }, 1000);
      };
      
      reader.onerror = () => {
        setUploadErrors(prev => [...prev, `${file.name}: 파일 읽기 중 오류가 발생했습니다.`]);
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[imageId];
          return newProgress;
        });
      };
      
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteImage = (imageId: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== imageId);
      if (filtered.length > 0 && !filtered.some(img => img.isMain)) {
        filtered[0].isMain = true;
      }
      return filtered.map((img, index) => ({
        ...img,
        order: index + 1
      }));
    });
  };

  const handleSetMainImage = (imageId: string) => {
    setImages(prev => prev.map(img => ({
      ...img,
      isMain: img.id === imageId
    })));
  };

  const handleDragStart = (e: React.DragEvent, imageId: string) => {
    setDraggedImage(imageId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetImageId: string) => {
    e.preventDefault();
    
    if (draggedImage && draggedImage !== targetImageId) {
      setImages(prev => {
        const draggedIndex = prev.findIndex(img => img.id === draggedImage);
        const targetIndex = prev.findIndex(img => img.id === targetImageId);
        
        const reorderedImages = [...prev];
        const [draggedItem] = reorderedImages.splice(draggedIndex, 1);
        reorderedImages.splice(targetIndex, 0, draggedItem);
        
        return reorderedImages.map((img, index) => ({
          ...img,
          order: index + 1
        }));
      });
    }
    
    setDraggedImage(null);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  const handleFileDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleFileDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('saving');
    setSaveMessage('매물 정보를 저장하는 중...');
    
    try {
      // 폼 유효성 검사
      if (!formData.title || !formData.price || !formData.region) {
        throw new Error('필수 필드가 누락되었습니다. 제목, 가격, 지역을 모두 입력해주세요.');
      }

      // 실제로는 API 호출
      const saveData = {
        ...formData,
        images: images,
        updatedAt: new Date().toISOString()
      };
      
      console.log('Saving property:', saveData);
      
      // 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSaveStatus('success');
      setSaveMessage('매물이 성공적으로 저장되었습니다!');
      
      // 3초 후 목록으로 이동
      setTimeout(() => {
        router.push('/admin/properties');
      }, 2000);
      
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage(error instanceof Error ? error.message : '저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'house': return Home;
      case 'condo': return Building;
      case 'village': return Users;
      default: return Building;
    }
  };

  const TypeIcon = getTypeIcon(formData.type);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!property) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">매물을 찾을 수 없습니다</h3>
          <button
            onClick={() => router.push('/admin/properties')}
            className="text-primary hover:underline"
          >
            매물 목록으로 돌아가기
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/admin/properties')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>매물 목록</span>
            </button>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                <TypeIcon className="h-6 w-6 text-primary" />
                <span>매물 편집</span>
              </h1>
              <p className="text-gray-600">{property.title}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.open(`/property/${property.id}`, '_blank')}
              className="flex items-center space-x-2 px-4 py-2 text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>미리보기</span>
            </button>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{isSaving ? '저장 중...' : '저장'}</span>
            </button>
          </div>
        </div>

        {/* 상태 표시 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">상태:</span>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="active">활성</option>
                  <option value="inactive">비활성</option>
                </select>
              </div>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Star className={`h-4 w-4 ${formData.featured ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                <span className="text-sm text-gray-700">추천 매물</span>
              </label>
            </div>
            
            <div className="text-sm text-gray-500">
              조회수: {property.viewCount} • 
              생성: {new Date(property.createdAt).toLocaleDateString()} • 
              수정: {new Date(property.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="bg-white border border-gray-200 rounded-xl">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'basic', label: '기본 정보' },
                { id: 'details', label: '상세 정보' },
                { id: 'images', label: '이미지' },
                { id: 'location', label: '위치' },
                { id: 'translations', label: '다국어' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* 기본 정보 탭 */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      매물 제목 *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="매물 제목을 입력하세요"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      매물 유형 *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="house">House</option>
                      <option value="condo">Condominium</option>
                      <option value="village">Village</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      지역 *
                    </label>
                    <select
                      value={formData.region}
                      onChange={(e) => handleInputChange('region', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="">지역 선택</option>
                      <option value="manila">Manila</option>
                      <option value="cebu">Cebu</option>
                      <option value="davao">Davao</option>
                      <option value="boracay">Boracay</option>
                      <option value="baguio">Baguio</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      매물 설명 *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="매물에 대한 상세한 설명을 입력하세요"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 상세 정보 탭 */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      월 렌트비 (PHP) *
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      보증금 (PHP) *
                    </label>
                    <input
                      type="number"
                      value={formData.deposit}
                      onChange={(e) => handleInputChange('deposit', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      면적 (sqm) *
                    </label>
                    <input
                      type="number"
                      value={formData.area}
                      onChange={(e) => handleInputChange('area', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      침실 수 *
                    </label>
                    <select
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num} Bedroom{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      화장실 수 *
                    </label>
                    <select
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num} Bathroom{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  {formData.type === 'condo' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        층수
                      </label>
                      <input
                        type="number"
                        value={formData.floor}
                        onChange={(e) => handleInputChange('floor', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        min="1"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.furnished}
                      onChange={(e) => handleInputChange('furnished', e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">가구 포함</span>
                  </label>
                </div>

                {/* 편의시설 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    편의시설
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      'parking', 'security', 'aircon', 'wifi', 'balcony', 'garden',
                      'swimming_pool', 'gym', 'elevator', 'playground', 'laundry'
                    ].map(amenity => (
                      <label key={amenity} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700 capitalize">
                          {amenity.replace('_', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 연락처 정보 */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">연락처 정보</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        담당자명
                      </label>
                      <input
                        type="text"
                        value={formData.contact.contactName}
                        onChange={(e) => handleInputChange('contact.contactName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        전화번호
                      </label>
                      <input
                        type="tel"
                        value={formData.contact.phone}
                        onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        이메일
                      </label>
                      <input
                        type="email"
                        value={formData.contact.email}
                        onChange={(e) => handleInputChange('contact.email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formData.contact.whatsapp}
                        onChange={(e) => handleInputChange('contact.whatsapp', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 이미지 탭 */}
            {activeTab === 'images' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">매물 이미지</h3>
                  <div className="flex items-center space-x-3">
                    <input
                      type="file"
                      id="image-upload"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="hidden"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      <span>이미지 추가</span>
                    </label>
                    {images.length > 0 && (
                      <div className="text-sm text-gray-500">
                        {images.length}개 이미지
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={image.id}
                      className={`relative group cursor-move ${
                        draggedImage === image.id ? 'opacity-50' : ''
                      }`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, image.id)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, image.id)}
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      
                      {/* 업로드 진행률 */}
                      {uploadProgress[image.id] !== undefined && uploadProgress[image.id] < 100 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                            <div className="text-sm">{Math.round(uploadProgress[image.id])}%</div>
                          </div>
                        </div>
                      )}
                      
                      {/* 메인 이미지 표시 */}
                      {image.isMain && (
                        <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded text-xs font-medium">
                          메인
                        </div>
                      )}
                      
                      {/* 순서 표시 */}
                      <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                        {index + 1}
                      </div>
                      
                      {/* 파일 정보 */}
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                        {image.fileName && (
                          <div className="truncate max-w-24" title={image.fileName}>
                            {image.fileName}
                          </div>
                        )}
                        {image.fileSize && (
                          <div className="text-xs opacity-75">
                            {(image.fileSize / 1024 / 1024).toFixed(1)}MB
                          </div>
                        )}
                      </div>
                      
                      {/* 호버 오버레이 */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex items-center space-x-2">
                          {!image.isMain && (
                            <button
                              onClick={() => handleSetMainImage(image.id)}
                              className="p-2 bg-white text-primary rounded-lg hover:bg-gray-100"
                              title="메인 이미지로 설정"
                            >
                              <Star className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100"
                            title="드래그하여 순서 변경"
                          >
                            <GripVertical className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteImage(image.id)}
                            className="p-2 bg-white text-red-600 rounded-lg hover:bg-red-50"
                            title="이미지 삭제"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* 업로드 중인 진행률 표시 */}
                  {Object.entries(uploadProgress).map(([id, progress]) => (
                    progress < 100 && (
                      <div key={id} className="border-2 border-dashed border-blue-300 rounded-lg h-48 flex items-center justify-center bg-blue-50">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                          <div className="text-sm text-blue-800">업로드 중...</div>
                          <div className="text-xs text-blue-600">{Math.round(progress)}%</div>
                        </div>
                      </div>
                    )
                  ))}
                  
                  {/* 이미지 추가 영역 (드래그 앤 드롭) */}
                  <div
                    className={`border-2 border-dashed rounded-lg h-48 flex items-center justify-center transition-colors cursor-pointer ${
                      isDragging
                        ? 'border-primary bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDrop={handleFileDrop}
                    onDragOver={handleFileDragOver}
                    onDragLeave={handleFileDragLeave}
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <div className="text-center">
                      <Upload className={`h-8 w-8 mx-auto mb-2 ${
                        isDragging ? 'text-primary' : 'text-gray-400'
                      }`} />
                      <span className={`text-sm ${
                        isDragging ? 'text-primary' : 'text-gray-500'
                      }`}>
                        {isDragging ? '파일을 놓으세요' : '이미지 추가 또는 드래그'}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        JPG, PNG, GIF 파일 지원
                      </p>
                    </div>
                  </div>
                </div>

                {/* 업로드 에러 표시 */}
                {uploadErrors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-900 mb-2">업로드 오류</h4>
                    <ul className="text-sm text-red-800 space-y-1">
                      {uploadErrors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                    <button
                      onClick={() => setUploadErrors([])}
                      className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                    >
                      오류 메시지 닫기
                    </button>
                  </div>
                )}

                {/* 이미지 관리 도움말 */}
                {images.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">이미지 관리 가이드</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• 드래그 앤 드롭으로 이미지 순서를 변경할 수 있습니다</li>
                      <li>• 별표 아이콘을 클릭하여 메인 이미지를 설정하세요</li>
                      <li>• 메인 이미지는 매물 목록에서 대표 이미지로 표시됩니다</li>
                      <li>• 고화질 이미지를 업로드하면 더 좋은 효과를 얻을 수 있습니다</li>
                      <li>• 최대 파일 크기: 5MB, 지원 형식: JPG, PNG, GIF</li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* 위치 탭 */}
            {activeTab === 'location' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    상세 주소 *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="상세 주소를 입력하세요"
                  />
                </div>

                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p>지도 컴포넌트</p>
                    <p className="text-sm">Google Maps API 연동 필요</p>
                  </div>
                </div>
              </div>
            )}

            {/* 다국어 탭 */}
            {activeTab === 'translations' && (
              <div className="space-y-6">
                {[
                  { code: 'ko', name: '한국어', flag: '🇰🇷' },
                  { code: 'zh', name: '중국어', flag: '🇨🇳' },
                  { code: 'ja', name: '일본어', flag: '🇯🇵' },
                  { code: 'en', name: '영어', flag: '🇺🇸' }
                ].map(lang => (
                  <div key={lang.code} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          제목
                        </label>
                        <input
                          type="text"
                          value={formData.translations[lang.code as keyof typeof formData.translations]?.title || ''}
                          onChange={(e) => handleTranslationChange(lang.code, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          설명
                        </label>
                        <textarea
                          value={formData.translations[lang.code as keyof typeof formData.translations]?.description || ''}
                          onChange={(e) => handleTranslationChange(lang.code, 'description', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 저장 상태 알림 */}
        {saveStatus !== 'idle' && (
          <div className={`bg-white border rounded-xl p-4 ${
            saveStatus === 'success' ? 'border-green-200 bg-green-50' :
            saveStatus === 'error' ? 'border-red-200 bg-red-50' :
            'border-blue-200 bg-blue-50'
          }`}>
            <div className="flex items-center space-x-3">
              {saveStatus === 'saving' && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              )}
              {saveStatus === 'success' && (
                <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
              <span className={`text-sm font-medium ${
                saveStatus === 'success' ? 'text-green-800' :
                saveStatus === 'error' ? 'text-red-800' :
                'text-blue-800'
              }`}>
                {saveMessage}
              </span>
            </div>
          </div>
        )}

        {/* 저장 버튼 (하단 고정) */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              마지막 저장: {new Date(property.updatedAt).toLocaleString()}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/admin/properties')}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isSaving}
              >
                취소
              </button>
              
              <button
                onClick={handleSave}
                disabled={isSaving || saveStatus === 'success'}
                className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors ${
                  saveStatus === 'success' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-primary text-white hover:bg-blue-700'
                } disabled:opacity-50`}
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : saveStatus === 'success' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>
                  {isSaving ? '저장 중...' : 
                   saveStatus === 'success' ? '저장 완료' : 
                   '저장'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}