import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import { propertiesData, getPropertyStats } from '@/data/propertiesData';
import { Property, PropertyImage } from '@/types/property';
import { 
  Building, 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2, 
  Star,
  MapPin,
  Calendar,
  TrendingUp,
  Plus,
  Download,
  Upload,
  MoreVertical,
  Home,
  Users,
  DollarSign,
  Image as ImageIcon,
  X
} from 'lucide-react';

export default function AdminProperties() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>(propertiesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [savedFilters, setSavedFilters] = useState<{[key: string]: any}>({});
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterType, setFilterType] = useState<'all' | 'house' | 'condo' | 'village'>('all');
  const [filterRegion, setFilterRegion] = useState<'all' | 'manila' | 'cebu' | 'davao' | 'boracay' | 'baguio'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'views' | 'title'>('date');
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

  // 통계 데이터
  const stats = getPropertyStats();

  // 필터링된 매물
  const filteredProperties = useMemo(() => {
    let filtered = [...properties];

    // 검색
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.contact.contactName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 상태 필터
    if (filterStatus !== 'all') {
      filtered = filtered.filter(property => property.status === filterStatus);
    }

    // 유형 필터
    if (filterType !== 'all') {
      filtered = filtered.filter(property => property.type === filterType);
    }

    // 지역 필터
    if (filterRegion !== 'all') {
      filtered = filtered.filter(property => property.region === filterRegion);
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'price':
          return b.price - a.price;
        case 'views':
          return (b.viewCount || 0) - (a.viewCount || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [properties, searchTerm, filterStatus, filterType, filterRegion, sortBy]);

  const handleToggleStatus = (propertyId: string) => {
    setProperties(prev => prev.map(property =>
      property.id === propertyId
        ? { ...property, status: property.status === 'active' ? 'inactive' : 'active' }
        : property
    ));
  };

  const handleToggleFeatured = (propertyId: string) => {
    setProperties(prev => prev.map(property =>
      property.id === propertyId
        ? { ...property, featured: !property.featured }
        : property
    ));
  };

  const handleDelete = (propertyId: string) => {
    if (confirm('이 매물을 삭제하시겠습니까?')) {
      setProperties(prev => prev.filter(property => property.id !== propertyId));
    }
  };

  const handleSelectProperty = (propertyId: string) => {
    setSelectedProperties(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProperties.length === filteredProperties.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(filteredProperties.map(p => p.id));
    }
  };

  const handleBulkAction = (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedProperties.length === 0) return;

    const confirmMessages = {
      activate: `${selectedProperties.length}개 매물을 일괄 활성화하시겠습니까?`,
      deactivate: `${selectedProperties.length}개 매물을 일괄 비활성화하시겠습니까?`,
      delete: `${selectedProperties.length}개 매물을 일괄 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`
    };

    if (confirm(confirmMessages[action])) {
      setProperties(prev => {
        let updated = [...prev];
        
        switch (action) {
          case 'activate':
            updated = updated.map(property =>
              selectedProperties.includes(property.id)
                ? { ...property, status: 'active' as const }
                : property
            );
            break;
          case 'deactivate':
            updated = updated.map(property =>
              selectedProperties.includes(property.id)
                ? { ...property, status: 'inactive' as const }
                : property
            );
            break;
          case 'delete':
            updated = updated.filter(property => !selectedProperties.includes(property.id));
            break;
        }
        
        return updated;
      });
      
      setSelectedProperties([]);
      
      const successMessages = {
        activate: `${selectedProperties.length}개 매물이 활성화되었습니다.`,
        deactivate: `${selectedProperties.length}개 매물이 비활성화되었습니다.`,
        delete: `${selectedProperties.length}개 매물이 삭제되었습니다.`
      };
      
      alert(successMessages[action]);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'house': return Home;
      case 'condo': return Building;
      case 'village': return Users;
      default: return Building;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">매물 관리</h1>
            <p className="text-gray-600">등록된 매물을 관리하고 승인 처리를 진행하세요</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/admin/property-import')}
              className="flex items-center space-x-2 px-4 py-2 text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span>Facebook 가져오기</span>
            </button>
            <button
              onClick={() => router.push('/admin/property-add')}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>새 매물 등록</span>
            </button>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">전체 매물</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">활성 매물</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">추천 매물</p>
                <p className="text-2xl font-bold text-gray-900">{stats.featured}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <EyeOff className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">비활성 매물</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 필터 및 검색 */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* 검색 */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="매물명, 주소, 집주인 이름으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              {/* 검색 통계 */}
              {searchTerm && (
                <div className="mt-2 text-sm text-gray-500">
                  "{searchTerm}"에 대한 검색결과: {filteredProperties.length}개
                </div>
              )}
            </div>

            {/* 필터들 */}
            <div className="flex items-center space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">모든 상태</option>
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">모든 유형</option>
                <option value="house">하우스</option>
                <option value="condo">콘도</option>
                <option value="village">빌리지</option>
              </select>

              <select
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">모든 지역</option>
                <option value="manila">Manila</option>
                <option value="cebu">Cebu</option>
                <option value="davao">Davao</option>
                <option value="boracay">Boracay</option>
                <option value="baguio">Baguio</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="date">최신순</option>
                <option value="price">가격순</option>
                <option value="views">조회순</option>
                <option value="title">이름순</option>
              </select>
            </div>
          </div>

          {/* 선택된 매물 액션 */}
          {selectedProperties.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800">
                  {selectedProperties.length}개 매물 선택됨
                </span>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleBulkAction('activate')}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    일괄 활성화
                  </button>
                  <button 
                    onClick={() => handleBulkAction('deactivate')}
                    className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    일괄 비활성화
                  </button>
                  <button 
                    onClick={() => handleBulkAction('delete')}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    일괄 삭제
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 매물 목록 */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-12 px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProperties.length === filteredProperties.length && filteredProperties.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">매물 정보</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">유형/지역</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">가격</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">상태</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">조회수</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">업데이트</th>
                  <th className="text-center px-6 py-4 text-sm font-medium text-gray-700">액션</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((property) => {
                  const TypeIcon = getTypeIcon(property.type);
                  const mainImage = typeof property.images[0] === 'string' 
                    ? property.images[0] 
                    : (property.images as PropertyImage[]).find(img => img.isMain) || property.images[0];
                  
                  return (
                    <tr key={property.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProperties.includes(property.id)}
                          onChange={() => handleSelectProperty(property.id)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {mainImage ? (
                            <img
                              src={typeof mainImage === 'string' ? mainImage : mainImage.thumbnailUrl}
                              alt={property.title}
                              className="w-16 h-12 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-medium text-gray-900 line-clamp-1">{property.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-1">{property.address}</p>
                            <p className="text-xs text-gray-400">{property.contact.contactName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <TypeIcon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-900 capitalize">{property.type}</span>
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500 capitalize">{property.region}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(property.price)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {property.bedrooms}BR / {property.bathrooms}BA
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status || 'active')}`}>
                            {property.status === 'active' ? '활성' : '비활성'}
                          </span>
                          {property.featured && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full text-yellow-700 bg-yellow-100">
                              추천
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{property.viewCount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{formatDate(property.updatedAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleStatus(property.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              property.status === 'active'
                                ? 'text-green-600 hover:bg-green-100'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                            title={property.status === 'active' ? '비활성화' : '활성화'}
                          >
                            {property.status === 'active' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </button>
                          
                          <button
                            onClick={() => handleToggleFeatured(property.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              property.featured
                                ? 'text-yellow-600 hover:bg-yellow-100'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                            title={property.featured ? '추천 해제' : '추천 설정'}
                          >
                            <Star className={`h-4 w-4 ${property.featured ? 'fill-current' : ''}`} />
                          </button>
                          
                          <button
                            onClick={() => router.push(`/admin/property-edit/${property.id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="편집"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(property.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="삭제"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 빈 상태 */}
          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">매물이 없습니다</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterStatus !== 'all' || filterType !== 'all' || filterRegion !== 'all'
                  ? '검색 조건에 맞는 매물이 없습니다. 필터를 조정해보세요.'
                  : '첫 번째 매물을 등록해보세요!'
                }
              </p>
              <button
                onClick={() => router.push('/admin/property-add')}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>새 매물 등록</span>
              </button>
            </div>
          )}
        </div>

        {/* 페이지네이션 (나중에 구현) */}
        <div className="flex justify-center">
          <div className="text-sm text-gray-500">
            총 {filteredProperties.length}개의 매물
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}