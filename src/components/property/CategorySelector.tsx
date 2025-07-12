import { PropertyFilters } from '@/types/property';
import { Home, Calendar, MapPin } from 'lucide-react';

interface CategorySelectorProps {
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
  language?: string;
}

const categories = [
  {
    key: 'all',
    icon: Home,
    label: {
      ko: '전체 매물',
      zh: '所有房源',
      ja: '全ての物件',
      en: 'All Properties',
    },
    description: {
      ko: '전체 임대 매물',
      zh: '所有租赁房源',
      ja: '全ての賃貸物件',
      en: 'All rental properties',
    },
  },
  {
    key: 'long_term',
    icon: Home,
    label: {
      ko: '장기 임대',
      zh: '长期租赁',
      ja: '長期賃貸',
      en: 'Long-term Rental',
    },
    description: {
      ko: '6개월 이상 거주용',
      zh: '6个月以上居住',
      ja: '6ヶ月以上の居住用',
      en: 'For 6+ months living',
    },
  },
  {
    key: 'monthly_stay',
    icon: Calendar,
    label: {
      ko: '한달살기',
      zh: '月租生活',
      ja: '1ヶ月滞在',
      en: 'Monthly Stay',
    },
    description: {
      ko: '여행객 & 디지털 노마드',
      zh: '旅客和数字游牧民',
      ja: '旅行者＆デジタルノマド',
      en: 'Travelers & Digital Nomads',
    },
  },
];

export default function CategorySelector({ 
  filters, 
  onFiltersChange, 
  language = 'en' 
}: CategorySelectorProps) {
  const currentCategory = filters.category || 'all';

  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      ...filters,
      category: category as PropertyFilters['category'],
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center mb-4">
        <MapPin className="h-5 w-5 text-primary mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">
          {language === 'ko' && '카테고리 선택'}
          {language === 'zh' && '选择类别'}
          {language === 'ja' && 'カテゴリー選択'}
          {language === 'en' && 'Choose Category'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((category) => {
          const CategoryIcon = category.icon;
          const isActive = currentCategory === category.key;
          const label = category.label[language as keyof typeof category.label];
          const description = category.description[language as keyof typeof category.description];

          return (
            <button
              key={category.key}
              onClick={() => handleCategoryChange(category.key)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                isActive
                  ? 'border-primary bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center mb-2">
                <CategoryIcon className={`h-6 w-6 mr-3 ${
                  isActive ? 'text-primary' : 'text-gray-600'
                }`} />
                <h3 className={`font-semibold ${
                  isActive ? 'text-primary' : 'text-gray-900'
                }`}>
                  {label}
                </h3>
              </div>
              <p className={`text-sm ${
                isActive ? 'text-blue-700' : 'text-gray-600'
              }`}>
                {description}
              </p>
              
              {category.key === 'monthly_stay' && isActive && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                      🏖️ Vacation
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                      💼 Remote Work
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                      ✈️ Digital Nomad
                    </span>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Additional Filters for Monthly Stay */}
      {currentCategory === 'monthly_stay' && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-md font-medium text-gray-900 mb-4">
            {language === 'ko' && '한달살기 옵션'}
            {language === 'zh' && '月租选项'}
            {language === 'ja' && '1ヶ月滞在オプション'}
            {language === 'en' && 'Monthly Stay Options'}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.travelerFriendly || false}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  travelerFriendly: e.target.checked,
                })}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">
                {language === 'ko' && '여행자 친화적'}
                {language === 'zh' && '旅客友好'}
                {language === 'ja' && '旅行者向け'}
                {language === 'en' && 'Traveler Friendly'}
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.nearTouristSpots || false}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  nearTouristSpots: e.target.checked,
                })}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">
                {language === 'ko' && '관광지 근처'}
                {language === 'zh' && '靠近景点'}
                {language === 'ja' && '観光地近く'}
                {language === 'en' && 'Near Tourist Spots'}
              </span>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ko' && 'WiFi 속도'}
                {language === 'zh' && 'WiFi速度'}
                {language === 'ja' && 'WiFi速度'}
                {language === 'en' && 'WiFi Speed'}
              </label>
              <select
                value={filters.wifiSpeed || ''}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  wifiSpeed: e.target.value as PropertyFilters['wifiSpeed'],
                })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Any</option>
                <option value="basic">Basic (10+ Mbps)</option>
                <option value="fast">Fast (50+ Mbps)</option>
                <option value="ultra">Ultra (100+ Mbps)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ko' && '체류 기간'}
                {language === 'zh' && '停留时间'}
                {language === 'ja' && '滞在期間'}
                {language === 'en' && 'Stay Duration'}
              </label>
              <select
                value={filters.duration || ''}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  duration: e.target.value as PropertyFilters['duration'],
                })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Any</option>
                <option value="short">1-2 weeks</option>
                <option value="medium">1 month</option>
                <option value="long">2-3 months</option>
                <option value="extended">3+ months</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}