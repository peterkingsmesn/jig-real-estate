import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { propertiesAPI } from '../../services/api';

const PropertyForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    basicInfo: {
      title: '',
      description: '',
      type: 'house',
      region: '',
      address: '',
      price: '',
      currency: 'PHP',
      deposit: 0,
    },
    details: {
      bedrooms: 1,
      bathrooms: 1,
      area: '',
      floor: '',
      furnished: false,
      amenities: [],
    },
    location: {
      latitude: '',
      longitude: '',
      address: '',
      landmark: '',
      city: '',
      province: '',
    },
    contact: {
      whatsapp: '',
      telegram: '',
      email: '',
      phone: '',
      contactName: '',
    },
    images: [],
    translations: {
      ko: { title: '', description: '' },
      zh: { title: '', description: '' },
      ja: { title: '', description: '' },
      en: { title: '', description: '' },
    },
  });

  const [errors, setErrors] = useState({});

  // 수정 모드일 때 데이터 로드
  const { data: propertyData } = useQuery(
    ['property', id],
    () => propertiesAPI.getById(id),
    {
      enabled: isEdit,
      onSuccess: (data) => {
        // 데이터 형식 변환
        const property = data.data.property;
        setFormData({
          basicInfo: {
            title: property.title,
            description: property.description,
            type: property.type,
            region: property.region,
            address: property.address,
            price: property.price,
            currency: property.currency,
            deposit: property.deposit,
          },
          details: {
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            area: property.area,
            floor: property.floor || '',
            furnished: property.furnished,
            amenities: property.amenities || [],
          },
          location: property.location,
          contact: property.contact || {},
          images: property.images || [],
          translations: property.translations || {
            ko: { title: '', description: '' },
            zh: { title: '', description: '' },
            ja: { title: '', description: '' },
            en: { title: '', description: '' },
          },
        });
      },
    }
  );

  const createMutation = useMutation(
    (data) => propertiesAPI.create(data),
    {
      onSuccess: () => {
        navigate('/admin/properties');
      },
    }
  );

  const updateMutation = useMutation(
    (data) => propertiesAPI.update(id, data),
    {
      onSuccess: () => {
        navigate('/admin/properties');
      },
    }
  );

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleTranslationChange = (lang, field, value) => {
    setFormData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [lang]: {
          ...prev.translations[lang],
          [field]: value,
        },
      },
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        amenities: prev.details.amenities.includes(amenity)
          ? prev.details.amenities.filter((a) => a !== amenity)
          : [...prev.details.amenities, amenity],
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 데이터 검증
    const newErrors = {};
    if (!formData.basicInfo.title) newErrors.title = '제목은 필수입니다';
    if (!formData.basicInfo.description) newErrors.description = '설명은 필수입니다';
    if (!formData.basicInfo.price) newErrors.price = '가격은 필수입니다';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const submitData = {
      ...formData,
      basicInfo: {
        ...formData.basicInfo,
        price: parseFloat(formData.basicInfo.price),
        deposit: parseFloat(formData.basicInfo.deposit) || 0,
      },
      details: {
        ...formData.details,
        area: parseFloat(formData.details.area),
        floor: formData.details.floor ? parseInt(formData.details.floor) : undefined,
      },
      location: {
        ...formData.location,
        latitude: parseFloat(formData.location.latitude),
        longitude: parseFloat(formData.location.longitude),
      },
    };

    if (isEdit) {
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate(submitData);
    }
  };

  const amenitiesList = [
    '에어컨', 'Wi-Fi', '주차장', '수영장', '헬스장', 
    '보안시스템', '정원', '발코니', '세탁기', '냉장고'
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? '매물 수정' : '새 매물 추가'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 기본 정보 */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">기본 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">제목 *</label>
              <input
                type="text"
                value={formData.basicInfo.title}
                onChange={(e) => handleChange('basicInfo', 'title', e.target.value)}
                className={`input ${errors.title ? 'border-red-500' : ''}`}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
            
            <div>
              <label className="label">유형</label>
              <select
                value={formData.basicInfo.type}
                onChange={(e) => handleChange('basicInfo', 'type', e.target.value)}
                className="input"
              >
                <option value="house">단독주택</option>
                <option value="condo">콘도</option>
                <option value="village">빌리지</option>
              </select>
            </div>

            <div>
              <label className="label">지역</label>
              <input
                type="text"
                value={formData.basicInfo.region}
                onChange={(e) => handleChange('basicInfo', 'region', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="label">가격 (PHP) *</label>
              <input
                type="number"
                value={formData.basicInfo.price}
                onChange={(e) => handleChange('basicInfo', 'price', e.target.value)}
                className={`input ${errors.price ? 'border-red-500' : ''}`}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="label">주소</label>
              <input
                type="text"
                value={formData.basicInfo.address}
                onChange={(e) => handleChange('basicInfo', 'address', e.target.value)}
                className="input"
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">설명 *</label>
              <textarea
                value={formData.basicInfo.description}
                onChange={(e) => handleChange('basicInfo', 'description', e.target.value)}
                rows={4}
                className={`input ${errors.description ? 'border-red-500' : ''}`}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>
        </div>

        {/* 상세 정보 */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">상세 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">침실 수</label>
              <input
                type="number"
                min="0"
                value={formData.details.bedrooms}
                onChange={(e) => handleChange('details', 'bedrooms', parseInt(e.target.value))}
                className="input"
              />
            </div>

            <div>
              <label className="label">욕실 수</label>
              <input
                type="number"
                min="0"
                value={formData.details.bathrooms}
                onChange={(e) => handleChange('details', 'bathrooms', parseInt(e.target.value))}
                className="input"
              />
            </div>

            <div>
              <label className="label">면적 (㎡)</label>
              <input
                type="number"
                value={formData.details.area}
                onChange={(e) => handleChange('details', 'area', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="label">층수</label>
              <input
                type="number"
                value={formData.details.floor}
                onChange={(e) => handleChange('details', 'floor', e.target.value)}
                className="input"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.details.furnished}
                  onChange={(e) => handleChange('details', 'furnished', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">가구 포함</span>
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="label">편의시설</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {amenitiesList.map((amenity) => (
                  <label key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.details.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="mr-2"
                    />
                    <span className="text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 위치 정보 */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">위치 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">위도</label>
              <input
                type="number"
                step="any"
                value={formData.location.latitude}
                onChange={(e) => handleChange('location', 'latitude', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="label">경도</label>
              <input
                type="number"
                step="any"
                value={formData.location.longitude}
                onChange={(e) => handleChange('location', 'longitude', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="label">도시</label>
              <input
                type="text"
                value={formData.location.city}
                onChange={(e) => handleChange('location', 'city', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="label">지역/주</label>
              <input
                type="text"
                value={formData.location.province}
                onChange={(e) => handleChange('location', 'province', e.target.value)}
                className="input"
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">주요 랜드마크</label>
              <input
                type="text"
                value={formData.location.landmark}
                onChange={(e) => handleChange('location', 'landmark', e.target.value)}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* 연락처 정보 */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">연락처 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">담당자 이름</label>
              <input
                type="text"
                value={formData.contact.contactName}
                onChange={(e) => handleChange('contact', 'contactName', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="label">전화번호</label>
              <input
                type="text"
                value={formData.contact.phone}
                onChange={(e) => handleChange('contact', 'phone', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="label">WhatsApp</label>
              <input
                type="text"
                value={formData.contact.whatsapp}
                onChange={(e) => handleChange('contact', 'whatsapp', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="label">이메일</label>
              <input
                type="email"
                value={formData.contact.email}
                onChange={(e) => handleChange('contact', 'email', e.target.value)}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/properties')}
            className="btn-secondary"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={createMutation.isLoading || updateMutation.isLoading}
            className="btn-primary"
          >
            {createMutation.isLoading || updateMutation.isLoading
              ? '저장 중...'
              : isEdit
              ? '수정하기'
              : '등록하기'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;