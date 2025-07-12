import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import FacebookLayout from '@/components/layout/FacebookLayout';
import SEOHead from '@/components/seo/SEOHead';
import { BreadcrumbSchema, RealEstateSchema, ReviewSchema } from '@/components/seo/JsonLd';
import { Property } from '@/types/property';
import { mockProperties } from '@/data/mockProperties';
import { mockMonthlyStayProperties } from '@/data/mockMonthlyStayProperties';
import { generatePropertySEO, generateBreadcrumbs } from '@/utils/seo';
import { 
  MapPin, Bed, Bath, Maximize, Car, Wifi, Shield, 
  Star, Heart, Share2, Phone, MessageCircle, Calendar,
  Users, Building, Waves, Home, Check, X, ChevronLeft,
  ChevronRight, Eye, Clock, Tag, MoreHorizontal
} from 'lucide-react';

interface PropertyPageProps {
  property: Property | null;
}

export default function PropertyPage({ property }: PropertyPageProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  // 매물이 없는 경우 로딩 또는 404 처리
  if (!property) {
    return (
      <FacebookLayout>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
            <div className="text-6xl mb-4">🏠</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">매물을 찾을 수 없습니다</h1>
            <p className="text-gray-600 mb-6">요청하신 매물이 존재하지 않거나 삭제되었습니다.</p>
            <button 
              onClick={() => router.push('/')}
              className="bg-[#1877f2] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#1664d8] transition-colors"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </FacebookLayout>
    );
  }

  // SEO 설정
  const seoConfig = useMemo(() => {
    const propertySEO = {
      id: property.id,
      title: property.title,
      description: property.description,
      location: property.address,
      price: property.price,
      currency: 'PHP',
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      images: property.images.map(img => typeof img === 'string' ? img : img.url),
      amenities: property.amenities,
      type: property.type as 'house' | 'condo' | 'apartment',
      availability: 'available' as const,
      publishedTime: property.createdAt,
      modifiedTime: property.updatedAt || property.createdAt
    };
    
    return generatePropertySEO(propertySEO);
  }, [property]);

  // 빵 부스러기 생성
  const breadcrumbs = [
    { name: '홈', url: '/' },
    { name: '부동산', url: '/properties' },
    { name: property.title, url: `/property/${property.id}` }
  ];

  const handleMessageClick = () => {
    // 페이스북 메신저 스타일 메시지
    alert('판매자에게 메시지를 보냅니다.');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: property.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  // 가격 포맷팅
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // 더미 리뷰 데이터
  const reviews = [
    {
      id: 1,
      author: 'John Smith',
      rating: 5,
      date: '2024-01-15',
      comment: 'Amazing apartment with great location. The owner was very helpful and responsive.',
      avatar: '/images/avatar1.jpg'
    },
    {
      id: 2,
      author: '김민수',
      rating: 4,
      date: '2024-01-10',
      comment: 'Good value for money. Clean and well-maintained property.',
      avatar: '/images/avatar2.jpg'
    }
  ];

  return (
    <>
      <SEOHead
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        image={typeof property.images[0] === 'string' ? property.images[0] : property.images[0]?.url}
        type="product"
        locale="ko"
        alternateLocales={['en', 'ko', 'zh', 'ja']}
        price={property.price.toString()}
        currency="PHP"
        availability={seoConfig.availability}
        publishedTime={property.createdAt}
        modifiedTime={property.updatedAt || property.createdAt}
      />
      
      <BreadcrumbSchema items={breadcrumbs} />
      
      <RealEstateSchema
        name={property.title}
        description={property.description}
        url={`${process.env.NEXT_PUBLIC_SITE_URL}/property/${property.id}`}
        image={property.images.map(img => typeof img === 'string' ? img : img.url)}
        address={{
          streetAddress: property.address,
          addressLocality: property.region.charAt(0).toUpperCase() + property.region.slice(1),
          addressRegion: property.region === 'manila' ? 'NCR' : property.region.charAt(0).toUpperCase() + property.region.slice(1),
          postalCode: property.region === 'manila' ? '1000' : '6000',
          addressCountry: 'Philippines'
        }}
        floorSize={{
          value: property.area,
          unitCode: 'SQM'
        }}
        numberOfRooms={property.bedrooms}
        numberOfBathroomsTotal={property.bathrooms}
        amenityFeature={property.amenities}
        offers={{
          price: property.price.toString(),
          priceCurrency: 'PHP',
          availability: 'InStock',
          validFrom: new Date().toISOString(),
          priceSpecification: {
            price: property.price.toString(),
            priceCurrency: 'PHP',
            unitCode: 'MON'
          }
        }}
      />

      {/* 리뷰 스키마 */}
      {reviews.map((review) => (
        <ReviewSchema
          key={review.id}
          itemReviewed={{
            name: property.title,
            description: property.description,
            image: typeof property.images[0] === 'string' ? property.images[0] : property.images[0]?.url
          }}
          author={typeof review.author === 'string' ? review.author : (review.author?.name || 'Anonymous')}
          reviewRating={{
            ratingValue: review.rating,
            bestRating: 5,
            worstRating: 1
          }}
          reviewBody={review.comment}
          datePublished={review.date}
        />
      ))}

      <FacebookLayout>
        {/* 페이스북 스타일 이미지 갤러리 */}
        <div className="bg-black">
          <div className="max-w-7xl mx-auto relative">
            <div className="relative h-[60vh] md:h-[70vh]">
              <Image
                src={(() => {
                  const currentImage = property.images[currentImageIndex];
                  return currentImage ? (typeof currentImage === 'string' ? currentImage : currentImage.url) : '';
                })()}
                alt={property.title}
                fill
                className="object-contain"
              />
              
              {/* 이미지 네비게이션 */}
              {currentImageIndex > 0 && (
                <button
                  onClick={() => setCurrentImageIndex(currentImageIndex - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}
              {currentImageIndex < property.images.length - 1 && (
                <button
                  onClick={() => setCurrentImageIndex(currentImageIndex + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}

              {/* 상단 액션 버튼 */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={handleLike}
                  className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                    isLiked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-white'
                  }`}
                >
                  <Heart className="h-5 w-5" fill={isLiked ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-full hover:bg-white transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>

              {/* 이미지 카운터 */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {property.images.length}
              </div>
            </div>

            {/* 썸네일 스트립 */}
            <div className="bg-white border-t">
              <div className="flex gap-1 p-2 overflow-x-auto">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-16 w-16 flex-shrink-0 rounded overflow-hidden ${
                      currentImageIndex === index ? 'ring-2 ring-[#1877f2]' : ''
                    }`}
                  >
                    <Image
                      src={typeof image === 'string' ? image : image?.url}
                      alt={`썸네일 ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="bg-gray-100 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 py-6">{/* 메인 컨텐츠 그리드 */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 왼쪽: 매물 정보 */}
              <div className="lg:col-span-2 space-y-4">
                {/* 가격 및 기본 정보 카드 */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h1 className="text-2xl font-semibold text-gray-900 mb-2">{property.title}</h1>
                        <div className="text-3xl font-bold text-[#1877f2] mb-2">
                          {formatPrice(property.price)}
                          <span className="text-base font-normal text-gray-600"> / 월</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600 text-sm">
                          <span className="flex items-center">
                            <Bed className="h-4 w-4 mr-1" />
                            {property.bedrooms}개 침실
                          </span>
                          <span className="text-gray-300">·</span>
                          <span className="flex items-center">
                            <Bath className="h-4 w-4 mr-1" />
                            {property.bathrooms}개 욕실
                          </span>
                          <span className="text-gray-300">·</span>
                          <span className="flex items-center">
                            <Maximize className="h-4 w-4 mr-1" />
                            {property.area}㎡
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 위치 정보 */}
                    <div className="border-t pt-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-gray-900 font-medium">{property.address}</p>
                          <p className="text-gray-600 text-sm">
                            {property.region === 'manila' ? '마닐라' : '세부'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 메타 정보 */}
                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        1시간 전 게시됨
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        조회 152회
                      </span>
                      <span className="flex items-center">
                        <Tag className="h-4 w-4 mr-1" />
                        {property.type === 'condo' ? '콘도' : property.type === 'house' ? '주택' : '아파트'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 상세 설명 */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-3">상세 설명</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</p>
                </div>

                {/* 편의시설 */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-3">편의시설</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center text-gray-700">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                          <Check className="h-4 w-4 text-[#1877f2]" />
                        </div>
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 추가 정보 */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-3">추가 정보</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 text-sm">매물 유형</p>
                      <p className="font-medium">{property.type === 'condo' ? '콘도' : property.type === 'house' ? '주택' : '아파트'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">가구 포함</p>
                      <p className="font-medium">{property.furnished ? '포함' : '미포함'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">월세</p>
                      <p className="font-medium">{formatPrice(property.price)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">면적</p>
                      <p className="font-medium">{property.area}㎡</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 오른쪽: 판매자 정보 (고정) */}
              <div className="lg:col-span-1">
                <div className="sticky top-20">
                  {/* 판매자 정보 카드 */}
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
                    <h3 className="text-lg font-semibold mb-4">판매자 정보</h3>
                    
                    {/* 판매자 프로필 */}
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <Users className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {property.contact.contactName || '부동산 에이전트'}
                        </p>
                        <p className="text-sm text-gray-600">인증된 판매자</p>
                      </div>
                    </div>

                    {/* 액션 버튼 */}
                    <button
                      onClick={handleMessageClick}
                      className="w-full bg-[#1877f2] text-white py-3 rounded-lg font-medium hover:bg-[#1664d8] transition-colors flex items-center justify-center gap-2 mb-3"
                    >
                      <MessageCircle className="h-5 w-5" />
                      메시지 보내기
                    </button>

                    {/* 추가 액션 */}
                    <div className="flex gap-2">
                      <button
                        onClick={handleLike}
                        className={`flex-1 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                          isLiked 
                            ? 'bg-red-50 text-red-600 border border-red-200' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Heart className="h-4 w-4" fill={isLiked ? 'currentColor' : 'none'} />
                        저장
                      </button>
                      <button
                        onClick={handleShare}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <Share2 className="h-4 w-4" />
                        공유
                      </button>
                    </div>

                    {/* 판매자 평가 */}
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">응답률</span>
                        <span className="font-medium">98%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-gray-600">평균 응답 시간</span>
                        <span className="font-medium">1시간 이내</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-gray-600">등록된 매물</span>
                        <span className="font-medium">15개</span>
                      </div>
                    </div>
                  </div>

                  {/* 신고하기 */}
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <button className="text-gray-600 text-sm hover:text-gray-900 flex items-center justify-center w-full">
                      <MoreHorizontal className="h-4 w-4 mr-2" />
                      이 매물 신고하기
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 비슷한 매물 섹션 */}
            <div className="mt-12">
              <h2 className="text-xl font-semibold mb-6">비슷한 매물</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mockProperties.slice(0, 4).map((similarProperty) => (
                  <div
                    key={similarProperty.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push(`/property/${similarProperty.id}`)}
                  >
                    <div className="relative h-48">
                      <Image
                        src={typeof similarProperty.images[0] === 'string' ? similarProperty.images[0] : similarProperty.images[0]?.url}
                        alt={similarProperty.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
                        {similarProperty.title}
                      </h3>
                      <p className="text-[#1877f2] font-bold text-lg mb-1">
                        {formatPrice(similarProperty.price)}
                      </p>
                      <p className="text-gray-600 text-sm line-clamp-1">
                        {similarProperty.address}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FacebookLayout>
    </>
  );
}

// Server-side rendering for SEO
export async function getServerSideProps({ params }: { params: { id: string } }) {
  const propertyId = params.id;
  
  // 모든 매물에서 해당 ID 찾기
  const allProperties = [...mockProperties, ...mockMonthlyStayProperties];
  const property = allProperties.find(p => p.id === propertyId);
  
  if (!property) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      property,
    },
  };
}