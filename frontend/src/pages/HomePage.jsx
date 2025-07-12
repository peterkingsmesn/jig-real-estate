import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { propertiesAPI } from '../services/api';
import PropertyCard from '../components/PropertyCard';

const HomePage = () => {
  const { data: featuredProperties, isLoading } = useQuery(
    'featured-properties',
    () => propertiesAPI.getAll({ limit: 6, featured: true })
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              필리핀에서 당신의 꿈의 집을 찾아보세요
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              다양한 지역의 주택, 콘도, 빌리지를 쉽고 빠르게 검색하세요
            </p>
            <Link to="/properties" className="btn bg-white text-primary-600 hover:bg-gray-100">
              매물 둘러보기
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">왜 JIG를 선택해야 할까요?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">손쉬운 검색</h3>
              <p className="text-gray-600">지역, 가격, 유형별로 원하는 매물을 쉽게 찾을 수 있습니다</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">검증된 매물</h3>
              <p className="text-gray-600">모든 매물은 관리자의 검증을 거쳐 등록됩니다</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">다국어 지원</h3>
              <p className="text-gray-600">한국어, 중국어, 일본어, 영어를 지원합니다</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">추천 매물</h2>
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {featuredProperties?.data?.properties?.slice(0, 6).map((property) => (
                  <PropertyCard key={property._id || property.id} property={property} />
                ))}
              </div>
              <div className="text-center">
                <Link to="/properties" className="btn-primary">
                  더 많은 매물 보기
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">지금 바로 시작하세요</h2>
          <p className="text-xl mb-8 text-primary-100">
            필리핀에서의 새로운 시작을 JIG와 함께하세요
          </p>
          <Link to="/properties" className="btn bg-white text-primary-700 hover:bg-gray-100">
            매물 검색하기
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;