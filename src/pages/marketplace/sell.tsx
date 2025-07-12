import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import DynamicHeader from '@/components/common/DynamicHeader';
import PortalLayout from '@/components/layout/PortalLayout';
import SEOHead from '@/components/seo/SEOHead';
import { MarketplaceCategory, MARKETPLACE_SUBCATEGORIES, POPULAR_CATEGORIES } from '@/types/marketplace';
import { allPhilippinesRegions } from '@/data/philippinesRegions';
import { 
  Upload, 
  X, 
  Camera,
  MapPin,
  DollarSign,
  Package,
  Info,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
  ArrowLeft,
  Save
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ListingFormData {
  title: string;
  description: string;
  category: MarketplaceCategory | '';
  subcategory: string;
  price: string;
  currency: 'PHP' | 'USD';
  priceType: 'fixed' | 'negotiable' | 'free';
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  brand: string;
  model: string;
  regionId: string;
  districtId: string;
  meetupLocations: string[];
  tradingOptions: {
    delivery: boolean;
    pickup: boolean;
    meetup: boolean;
    cash: boolean;
    bankTransfer: boolean;
  };
  images: File[];
}

export default function SellItemPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState<ListingFormData>({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    price: '',
    currency: 'PHP',
    priceType: 'fixed',
    condition: 'good',
    brand: '',
    model: '',
    regionId: '',
    districtId: '',
    meetupLocations: [],
    tradingOptions: {
      delivery: false,
      pickup: true,
      meetup: true,
      cash: true,
      bankTransfer: false
    },
    images: []
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
  };

  const handleInputChange = (field: keyof ListingFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleTradingOptionChange = (option: keyof ListingFormData['tradingOptions']) => {
    setFormData(prev => ({
      ...prev,
      tradingOptions: {
        ...prev.tradingOptions,
        [option]: !prev.tradingOptions[option]
      }
    }));
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).slice(0, 10 - formData.images.length);
    const newPreviews: string[] = [];

    newFiles.forEach(file => {
      if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target?.result as string);
          if (newPreviews.length === newFiles.length) {
            setImagePreviews(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newFiles]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        if (!formData.title.trim() || !formData.description.trim()) {
          setError('상품명과 상세 설명을 입력해주세요.');
          return false;
        }
        if (formData.title.length < 5) {
          setError('상품명은 최소 5글자 이상 입력해주세요.');
          return false;
        }
        break;
      case 2:
        if (!formData.category || !formData.subcategory) {
          setError('카테고리를 선택해주세요.');
          return false;
        }
        if (!formData.price.trim() && formData.priceType !== 'free') {
          setError('가격을 입력해주세요.');
          return false;
        }
        break;
      case 3:
        if (formData.images.length === 0) {
          setError('최소 1장의 사진을 업로드해주세요.');
          return false;
        }
        break;
      case 4:
        if (!formData.regionId) {
          setError('거래 지역을 선택해주세요.');
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/marketplace/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: formData.priceType === 'free' ? 0 : parseFloat(formData.price),
          category: formData.category,
          condition: formData.condition,
          location: `${getSelectedRegion()?.name}, ${formData.districtId || ''}`,
          sellerName: 'User', // TODO: Get from session
          sellerContact: 'Contact via platform',
          images: [] // 이미지 업로드는 추후 구현
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('상품이 성공적으로 등록되었습니다!');
        setTimeout(() => {
          router.push('/marketplace');
        }, 1500);
      } else {
        throw new Error(data.error || 'Failed to create listing');
      }
    } catch (err) {
      toast.error('상품 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error('Listing creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedRegion = () => {
    return allPhilippinesRegions.find(region => region.id === formData.regionId);
  };

  const getConditionText = (condition: string) => {
    const conditionMap = {
      'new': '새 상품',
      'like_new': '거의 새것',
      'good': '좋음',
      'fair': '보통',
      'poor': '나쁨'
    };
    return conditionMap[condition as keyof typeof conditionMap] || condition;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">기본 정보</h3>
              <p className="text-sm text-gray-600">상품의 기본 정보를 입력해주세요</p>
            </div>

            {/* 상품명 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상품명 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="예: iPhone 14 Pro Max 256GB 스페이스 블랙"
                maxLength={100}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.title.length}/100 - 구체적이고 명확하게 작성해주세요
              </p>
            </div>

            {/* 상세 설명 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상세 설명 *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={6}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="상품의 상태, 구매 시기, 사용 빈도, 포함된 구성품 등을 자세히 설명해주세요. 정확한 정보를 제공하면 빠른 거래에 도움이 됩니다."
                maxLength={2000}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.description.length}/2000
              </p>
            </div>

            {/* 브랜드/모델 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  브랜드
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="예: Apple, Samsung"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  모델명
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="예: iPhone 14 Pro Max"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">카테고리 & 가격</h3>
              <p className="text-sm text-gray-600">상품 분류와 가격을 설정해주세요</p>
            </div>

            {/* 카테고리 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {POPULAR_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      handleInputChange('category', category.id);
                      handleInputChange('subcategory', '');
                    }}
                    className={`p-4 text-center border rounded-lg transition-all ${
                      formData.category === category.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{category.icon}</div>
                    <div className="text-sm font-medium">{category.nameKo}</div>
                  </button>
                ))}
              </div>

              {/* 서브카테고리 */}
              {formData.category && MARKETPLACE_SUBCATEGORIES[formData.category as MarketplaceCategory] && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    세부 카테고리 *
                  </label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => handleInputChange('subcategory', e.target.value)}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">세부 카테고리를 선택하세요</option>
                    {MARKETPLACE_SUBCATEGORIES[formData.category as MarketplaceCategory].map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* 상품 상태 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상품 상태 *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {(['new', 'like_new', 'good', 'fair', 'poor'] as const).map((condition) => (
                  <button
                    key={condition}
                    type="button"
                    onClick={() => handleInputChange('condition', condition)}
                    className={`p-3 text-center border rounded-lg transition-all ${
                      formData.condition === condition
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-sm font-medium">{getConditionText(condition)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 가격 설정 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                가격 설정 *
              </label>
              
              <div className="flex space-x-3 mb-3">
                {([
                  { value: 'fixed', label: '정가' },
                  { value: 'negotiable', label: '협상 가능' },
                  { value: 'free', label: '무료' }
                ] as const).map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange('priceType', type.value)}
                    className={`px-4 py-2 border rounded-lg transition-all ${
                      formData.priceType === type.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {formData.priceType !== 'free' && (
                <div className="flex space-x-3">
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="PHP">₱ PHP</option>
                    <option value="USD">$ USD</option>
                  </select>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="가격을 입력하세요"
                    min="0"
                    required
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">사진 업로드</h3>
              <p className="text-sm text-gray-600">상품 사진을 업로드해주세요 (최대 10장)</p>
            </div>

            {/* 이미지 업로드 영역 */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e.target.files)}
                className="hidden"
              />
              
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    사진을 드래그하거나 클릭해서 업로드
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    첫 번째 사진이 대표 사진이 됩니다
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    사진 선택
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  JPG, PNG 파일만 가능 • 최대 5MB • 최대 10장
                </p>
              </div>
            </div>

            {/* 업로드된 이미지 미리보기 */}
            {imagePreviews.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  업로드된 사진 ({imagePreviews.length}/10)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          대표
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">거래 정보</h3>
              <p className="text-sm text-gray-600">거래 방법과 위치를 설정해주세요</p>
            </div>

            {/* 거래 지역 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                거래 지역 *
              </label>
              <select
                value={formData.regionId}
                onChange={(e) => handleInputChange('regionId', e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">거래 지역을 선택하세요</option>
                {allPhilippinesRegions.map(region => (
                  <option key={region.id} value={region.id}>
                    {region.nameKo} ({region.name})
                  </option>
                ))}
              </select>
            </div>

            {/* 거래 방법 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                거래 방법 *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.tradingOptions.pickup}
                    onChange={() => handleTradingOptionChange('pickup')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                  />
                  <div>
                    <div className="font-medium">직접 만나서 거래</div>
                    <div className="text-sm text-gray-600">안전한 공공장소에서 직접 만나서 거래</div>
                  </div>
                </label>

                <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.tradingOptions.delivery}
                    onChange={() => handleTradingOptionChange('delivery')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                  />
                  <div>
                    <div className="font-medium">배송</div>
                    <div className="text-sm text-gray-600">택배나 퀵서비스를 통한 배송</div>
                  </div>
                </label>

                <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.tradingOptions.meetup}
                    onChange={() => handleTradingOptionChange('meetup')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                  />
                  <div>
                    <div className="font-medium">지정 장소 만남</div>
                    <div className="text-sm text-gray-600">지하철역, 쇼핑몰 등 지정 장소</div>
                  </div>
                </label>
              </div>
            </div>

            {/* 결제 방법 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                결제 방법 *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.tradingOptions.cash}
                    onChange={() => handleTradingOptionChange('cash')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                  />
                  <div>
                    <div className="font-medium">현금</div>
                    <div className="text-sm text-gray-600">직접 만나서 현금 거래</div>
                  </div>
                </label>

                <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.tradingOptions.bankTransfer}
                    onChange={() => handleTradingOptionChange('bankTransfer')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                  />
                  <div>
                    <div className="font-medium">계좌 이체</div>
                    <div className="text-sm text-gray-600">온라인 계좌 이체</div>
                  </div>
                </label>
              </div>
            </div>

            {/* 안전 거래 안내 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">💡 안전한 거래를 위한 팁</p>
                  <ul className="text-xs space-y-1">
                    <li>• 공공장소에서 만나서 거래하세요 (쇼핑몰, 지하철역 등)</li>
                    <li>• 상품을 꼼꼼히 확인한 후 거래하세요</li>
                    <li>• 선입금 요구는 사기일 가능성이 높습니다</li>
                    <li>• 의심스러운 거래는 즉시 신고해주세요</li>
                  </ul>
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
    <>
      <SEOHead
        title="Sell Item - Philippines Marketplace"
        description="Sell your items safely on Philippines marketplace"
        type="website"
        locale={currentLanguage}
      />

      <div className="min-h-screen bg-gray-50">
        <DynamicHeader 
          currentLanguage={currentLanguage} 
          onLanguageChange={handleLanguageChange} 
        />
        
        <PortalLayout>
          <div className="py-8">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">상품 등록하기</h1>
                  <p className="text-gray-600">간단하게 상품을 등록하고 안전하게 거래하세요</p>
                </div>
              </div>
            </div>

            {/* 진행률 표시 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">단계 {currentStep} / 4</span>
                <span className="text-sm text-gray-500">{Math.round((currentStep / 4) * 100)}% 완료</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
              
              <div className="flex justify-between mt-4 text-sm">
                <span className={currentStep >= 1 ? 'text-blue-600 font-medium' : 'text-gray-400'}>
                  기본 정보
                </span>
                <span className={currentStep >= 2 ? 'text-blue-600 font-medium' : 'text-gray-400'}>
                  카테고리 & 가격
                </span>
                <span className={currentStep >= 3 ? 'text-blue-600 font-medium' : 'text-gray-400'}>
                  사진 업로드
                </span>
                <span className={currentStep >= 4 ? 'text-blue-600 font-medium' : 'text-gray-400'}>
                  거래 정보
                </span>
              </div>
            </div>

            {/* 단계별 폼 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              {renderStep()}

              {/* 에러/성공 메시지 */}
              {error && (
                <div className="mt-6 flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="text-sm text-red-800">{error}</span>
                </div>
              )}

              {success && (
                <div className="mt-6 flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-green-800">{success}</span>
                </div>
              )}

              {/* 버튼들 */}
              <div className="mt-8 flex space-x-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    이전
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={currentStep === 4 ? handleSubmit : nextStep}
                  disabled={isSubmitting}
                  className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      등록 중...
                    </div>
                  ) : currentStep === 4 ? (
                    <div className="flex items-center">
                      <Save className="h-4 w-4 mr-2" />
                      상품 등록 완료
                    </div>
                  ) : (
                    '다음'
                  )}
                </button>
              </div>
            </div>
          </div>
        </PortalLayout>
      </div>
    </>
  );
}