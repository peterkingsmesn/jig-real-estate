import { useState } from 'react';
import { useQuery } from 'react-query';
import { propertiesAPI } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import PropertyFilters from '../components/PropertyFilters';

const PropertiesPage = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    region: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    furnished: '',
    sortBy: 'createdAt',
    order: 'desc',
  });

  const { data, isLoading, error } = useQuery(
    ['properties', filters],
    () => propertiesAPI.getAll(filters),
    {
      keepPreviousData: true,
    }
  );

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">매물 목록</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <PropertyFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>
        
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              오류가 발생했습니다. 다시 시도해주세요.
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-gray-600">
                  총 {data?.data?.total || 0}개의 매물
                </p>
                <select
                  value={`${filters.sortBy}-${filters.order}`}
                  onChange={(e) => {
                    const [sortBy, order] = e.target.value.split('-');
                    handleFilterChange({ sortBy, order });
                  }}
                  className="input w-auto"
                >
                  <option value="createdAt-desc">최신순</option>
                  <option value="createdAt-asc">오래된순</option>
                  <option value="price-asc">가격 낮은순</option>
                  <option value="price-desc">가격 높은순</option>
                </select>
              </div>
              
              {data?.data?.properties?.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  검색 결과가 없습니다.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data?.data?.properties?.map((property) => (
                      <PropertyCard key={property._id || property.id} property={property} />
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {data?.data?.totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                      <nav className="flex space-x-2">
                        <button
                          onClick={() => handlePageChange(filters.page - 1)}
                          disabled={!data?.data?.hasPrev}
                          className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          이전
                        </button>
                        
                        {[...Array(Math.min(5, data?.data?.totalPages))].map((_, i) => {
                          const pageNum = i + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-3 py-2 border rounded-md ${
                                pageNum === filters.page
                                  ? 'bg-primary-600 text-white border-primary-600'
                                  : 'border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        
                        <button
                          onClick={() => handlePageChange(filters.page + 1)}
                          disabled={!data?.data?.hasNext}
                          className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          다음
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;