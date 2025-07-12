import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { propertiesAPI } from '../services/api';
import PropertyCard from '../components/PropertyCard';

const PropertyDetailPage = () => {
  const { id } = useParams();
  
  const { data, isLoading, error } = useQuery(
    ['property', id],
    () => propertiesAPI.getById(id)
  );

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">매물을 불러올 수 없습니다.</p>
          <Link to="/properties" className="btn-primary">
            매물 목록으로
          </Link>
        </div>
      </div>
    );
  }

  const property = data?.data?.property;
  const relatedProperties = data?.data?.relatedProperties || [];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="container py-8">
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link to="/" className="text-primary-600 hover:text-primary-800">
              홈
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li>
            <Link to="/properties" className="text-primary-600 hover:text-primary-800">
              매물 목록
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-gray-700">{property?.title}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* 이미지 갤러리 */}
          <div className="mb-6">
            {property?.images?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={image.alt || `${property.title} - ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ))}
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">이미지 없음</span>
              </div>
            )}
          </div>

          {/* 기본 정보 */}
          <div className="card p-6 mb-6">
            <h1 className="text-2xl font-bold mb-4">{property?.title}</h1>
            
            <div className="flex items-center text-gray-600 mb-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{property?.address}</span>
            </div>

            <p className="text-gray-700 mb-6 whitespace-pre-line">
              {property?.description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">침실</p>
                <p className="text-lg font-semibold">{property?.bedrooms}개</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">욕실</p>
                <p className="text-lg font-semibold">{property?.bathrooms}개</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">면적</p>
                <p className="text-lg font-semibold">{property?.area}㎡</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">층수</p>
                <p className="text-lg font-semibold">{property?.floor || '-'}층</p>
              </div>
            </div>

            {/* 편의시설 */}
            {property?.amenities?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">편의시설</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 위치 정보 */}
          {property?.location && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">위치 정보</h3>
              <div className="space-y-2 text-gray-700">
                <p>주소: {property.location.address}</p>
                <p>도시: {property.location.city}</p>
                <p>지역: {property.location.province}</p>
                {property.location.landmark && (
                  <p>주요 랜드마크: {property.location.landmark}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          {/* 가격 및 연락처 */}
          <div className="card p-6 sticky top-4">
            <div className="mb-6">
              <p className="text-3xl font-bold text-primary-600">
                {formatPrice(property?.price)}
              </p>
              {property?.deposit > 0 && (
                <p className="text-gray-600">
                  보증금: {formatPrice(property.deposit)}
                </p>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-600">유형</span>
                <span className="font-medium">
                  {property?.type === 'house' ? '단독주택' : 
                   property?.type === 'condo' ? '콘도' : '빌리지'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-600">가구</span>
                <span className="font-medium">
                  {property?.furnished ? '포함' : '미포함'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-600">조회수</span>
                <span className="font-medium">{data?.data?.viewCount}회</span>
              </div>
            </div>

            {property?.contact && (
              <div className="space-y-3">
                <h4 className="font-semibold">연락처</h4>
                {property.contact.contactName && (
                  <p className="text-gray-700">담당자: {property.contact.contactName}</p>
                )}
                {property.contact.phone && (
                  <a
                    href={`tel:${property.contact.phone}`}
                    className="btn-primary w-full mb-2"
                  >
                    전화: {property.contact.phone}
                  </a>
                )}
                {property.contact.whatsapp && (
                  <a
                    href={`https://wa.me/${property.contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary w-full mb-2"
                  >
                    WhatsApp으로 문의
                  </a>
                )}
                {property.contact.email && (
                  <a
                    href={`mailto:${property.contact.email}`}
                    className="btn-secondary w-full"
                  >
                    이메일 문의
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 관련 매물 */}
      {relatedProperties.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">비슷한 매물</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProperties.map((relatedProperty) => (
              <PropertyCard
                key={relatedProperty._id || relatedProperty.id}
                property={relatedProperty}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailPage;