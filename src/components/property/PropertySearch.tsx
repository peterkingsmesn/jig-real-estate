import { useState } from 'react';
import { Search, MapPin, Home, DollarSign, Filter } from 'lucide-react';
import { PropertyFilters } from '@/types/property';

interface PropertySearchProps {
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
  onSearch: () => void;
  language?: string;
}

const regions = [
  { value: 'manila', label: 'Manila' },
  { value: 'cebu', label: 'Cebu' },
  { value: 'davao', label: 'Davao' },
  { value: 'boracay', label: 'Boracay' },
  { value: 'baguio', label: 'Baguio' },
];

const propertyTypes = [
  { value: 'house', label: { ko: '단독주택', zh: '独栋房', ja: '一戸建て', en: 'House' } },
  { value: 'condo', label: { ko: '콘도', zh: '公寓', ja: 'コンド', en: 'Condo' } },
  { value: 'village', label: { ko: '빌리지', zh: '别墅区', ja: 'ビレッジ', en: 'Village' } },
];

const priceRanges = [
  { value: '0-15000', label: '₱0 - ₱15,000' },
  { value: '15000-25000', label: '₱15,000 - ₱25,000' },
  { value: '25000-40000', label: '₱25,000 - ₱40,000' },
  { value: '40000-60000', label: '₱40,000 - ₱60,000' },
  { value: '60000+', label: '₱60,000+' },
];

export default function PropertySearch({ 
  filters, 
  onFiltersChange,
  onSearch, 
  language = 'en' 
}: PropertySearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({
      ...filters,
      search: searchTerm
    } as PropertyFilters);
    onSearch();
  };

  const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handlePriceRangeChange = (range: string) => {
    if (range === '60000+') {
      handleFilterChange('minPrice', 60000);
      handleFilterChange('maxPrice', undefined);
    } else {
      const [min, max] = range.split('-').map(Number);
      handleFilterChange('minPrice', min);
      handleFilterChange('maxPrice', max);
    }
  };

  const getTypeLabel = (type: string) => {
    const typeData = propertyTypes.find(t => t.value === type);
    return typeData?.label[language as keyof typeof typeData.label] || type;
  };

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      {/* Main Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap lg:flex-nowrap gap-2">
          {/* Location Filter */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={filters.region || ''}
              onChange={(e) => handleFilterChange('region', e.target.value || undefined)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary appearance-none bg-white min-w-[140px]"
            >
              <option value="">All Locations</option>
              {regions.map((region) => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
            </select>
          </div>

          {/* Property Type Filter */}
          <div className="relative">
            <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={filters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary appearance-none bg-white min-w-[120px]"
            >
              <option value="">All Types</option>
              {propertyTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {getTypeLabel(type.value)}
                </option>
              ))}
            </select>
          </div>

          {/* Price Filter */}
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={
                filters.minPrice === 60000 && !filters.maxPrice
                  ? '60000+'
                  : filters.minPrice && filters.maxPrice
                  ? `${filters.minPrice}-${filters.maxPrice}`
                  : ''
              }
              onChange={(e) => handlePriceRangeChange(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary appearance-none bg-white min-w-[160px]"
            >
              <option value="">All Prices</option>
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* More Filters Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span className="text-sm">More</span>
          </button>

          {/* Search Button */}
          <button 
            type="submit"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Search
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <select
                value={filters.bedrooms || ''}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms
              </label>
              <select
                value={filters.bathrooms || ''}
                onChange={(e) => handleFilterChange('bathrooms', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
              </select>
            </div>

            {/* Furnished */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Furnished
              </label>
              <select
                value={filters.furnished === undefined ? '' : filters.furnished.toString()}
                onChange={(e) => handleFilterChange('furnished', e.target.value === '' ? undefined : e.target.value === 'true')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Any</option>
                <option value="true">Furnished</option>
                <option value="false">Unfurnished</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy || 'date'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="date">Newest</option>
                <option value="price">Price: Low to High</option>
                <option value="popularity">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => onFiltersChange({})}
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}
    </form>
  );
}