const PropertyFilters = ({ filters, onFilterChange }) => {
  const regions = [
    'Manila',
    'Cebu',
    'Davao',
    'Angeles',
    'Baguio',
    'Boracay',
    'Palawan',
    'Siargao',
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFilterChange({
      [name]: type === 'checkbox' ? (checked ? 'true' : '') : value,
    });
  };

  const handleReset = () => {
    onFilterChange({
      region: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      furnished: '',
    });
  };

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold mb-4">필터</h2>
      
      <div className="space-y-4">
        {/* 지역 */}
        <div>
          <label className="label">지역</label>
          <select
            name="region"
            value={filters.region}
            onChange={handleInputChange}
            className="input"
          >
            <option value="">전체</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        {/* 유형 */}
        <div>
          <label className="label">유형</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleInputChange}
            className="input"
          >
            <option value="">전체</option>
            <option value="house">단독주택</option>
            <option value="condo">콘도</option>
            <option value="village">빌리지</option>
          </select>
        </div>

        {/* 가격 범위 */}
        <div>
          <label className="label">가격 범위 (PHP)</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleInputChange}
              placeholder="최소"
              className="input"
            />
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleInputChange}
              placeholder="최대"
              className="input"
            />
          </div>
        </div>

        {/* 침실 */}
        <div>
          <label className="label">침실 수</label>
          <select
            name="bedrooms"
            value={filters.bedrooms}
            onChange={handleInputChange}
            className="input"
          >
            <option value="">전체</option>
            <option value="1">1개</option>
            <option value="2">2개</option>
            <option value="3">3개</option>
            <option value="4">4개 이상</option>
          </select>
        </div>

        {/* 욕실 */}
        <div>
          <label className="label">욕실 수</label>
          <select
            name="bathrooms"
            value={filters.bathrooms}
            onChange={handleInputChange}
            className="input"
          >
            <option value="">전체</option>
            <option value="1">1개</option>
            <option value="2">2개</option>
            <option value="3">3개 이상</option>
          </select>
        </div>

        {/* 가구 포함 */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="furnished"
              checked={filters.furnished === 'true'}
              onChange={handleInputChange}
              className="mr-2"
            />
            <span className="text-sm">가구 포함</span>
          </label>
        </div>

        <button
          onClick={handleReset}
          className="w-full btn-secondary"
        >
          필터 초기화
        </button>
      </div>
    </div>
  );
};

export default PropertyFilters;