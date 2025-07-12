const Property = require('../models/Property');
const { successResponse, errorResponse, paginationMeta } = require('../utils/responseFormatter');
const ErrorCodes = require('../utils/errorCodes');

// 매물 목록 조회
const getProperties = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      region,
      type,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      furnished,
      sortBy = 'createdAt',
      order = 'desc',
      language = 'ko'
    } = req.query;

    // 쿼리 조건 설정
    const query = { status: 'active' };
    
    if (region) query.region = region;
    if (type) query.type = type;
    if (bedrooms) query.bedrooms = parseInt(bedrooms);
    if (bathrooms) query.bathrooms = parseInt(bathrooms);
    if (furnished !== undefined) query.furnished = furnished === 'true';
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    // 페이지네이션
    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100); // 최대 100개
    const skip = (pageNum - 1) * limitNum;

    // 정렬
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    // 전체 개수
    const total = await Property.countDocuments(query);

    // 매물 조회
    let properties = await Property.find(query)
      .sort(sortOptions)
      .limit(limitNum)
      .skip(skip)
      .lean();

    // 언어별 번역 적용
    if (language !== 'en' && ['ko', 'zh', 'ja'].includes(language)) {
      properties = properties.map(property => {
        if (property.translations && property.translations[language]) {
          return {
            ...property,
            title: property.translations[language].title || property.title,
            description: property.translations[language].description || property.description
          };
        }
        return property;
      });
    }

    const meta = paginationMeta(total, pageNum, limitNum);

    res.json(successResponse({
      properties,
      ...meta
    }));
  } catch (error) {
    next(error);
  }
};

// 매물 상세 조회
const getProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { language = 'ko' } = req.query;

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json(
        errorResponse(
          ErrorCodes.RESOURCE_NOT_FOUND,
          'Property not found',
          null,
          req.path
        )
      );
    }

    // 조회수 증가
    property.viewCount += 1;
    await property.save();

    // 관련 매물 조회 (같은 지역, 유사한 가격대)
    const relatedProperties = await Property.find({
      _id: { $ne: property._id },
      status: 'active',
      region: property.region,
      price: {
        $gte: property.price * 0.8,
        $lte: property.price * 1.2
      }
    })
    .limit(4)
    .select('title price bedrooms bathrooms images region address');

    let propertyData = property.toObject();

    // 언어별 번역 적용
    if (language !== 'en' && ['ko', 'zh', 'ja'].includes(language)) {
      if (propertyData.translations && propertyData.translations[language]) {
        propertyData.title = propertyData.translations[language].title || propertyData.title;
        propertyData.description = propertyData.translations[language].description || propertyData.description;
      }
    }

    res.json(successResponse({
      property: propertyData,
      relatedProperties,
      viewCount: property.viewCount
    }));
  } catch (error) {
    next(error);
  }
};

// 매물 등록 (관리자)
const createProperty = async (req, res, next) => {
  try {
    const propertyData = req.body;

    // 새 매물 생성
    const property = new Property(propertyData);
    await property.save();

    res.status(201).json(
      successResponse(property, 'Property created successfully')
    );
  } catch (error) {
    next(error);
  }
};

// 매물 수정 (관리자)
const updateProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const property = await Property.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!property) {
      return res.status(404).json(
        errorResponse(
          ErrorCodes.RESOURCE_NOT_FOUND,
          'Property not found',
          null,
          req.path
        )
      );
    }

    res.json(successResponse(property, 'Property updated successfully'));
  } catch (error) {
    next(error);
  }
};

// 매물 삭제 (관리자)
const deleteProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    const property = await Property.findByIdAndDelete(id);

    if (!property) {
      return res.status(404).json(
        errorResponse(
          ErrorCodes.RESOURCE_NOT_FOUND,
          'Property not found',
          null,
          req.path
        )
      );
    }

    res.json(successResponse(null, 'Property deleted successfully'));
  } catch (error) {
    next(error);
  }
};

// 매물 검색
const searchProperties = async (req, res, next) => {
  try {
    const { q, ...otherParams } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json(
        errorResponse(
          ErrorCodes.VALIDATION_ERROR,
          'Search query must be at least 2 characters',
          null,
          req.path
        )
      );
    }

    // 검색 쿼리 생성
    const searchRegex = new RegExp(q, 'i');
    const searchQuery = {
      status: 'active',
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { address: searchRegex },
        { region: searchRegex },
        { 'location.city': searchRegex },
        { 'location.landmark': searchRegex }
      ]
    };

    // 추가 필터 적용
    req.query = { ...otherParams, q: undefined };
    
    // getProperties 로직 재사용
    const properties = await Property.find(searchQuery)
      .limit(50)
      .select('title price bedrooms bathrooms images region address type');

    res.json(successResponse({
      properties,
      total: properties.length,
      query: q
    }));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  searchProperties
};