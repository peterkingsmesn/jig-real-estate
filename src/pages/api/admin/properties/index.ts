import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

// API 계약에 따른 표준 응답 형식
interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  path: string;
}

// 매물 등록 요청 인터페이스
interface CreatePropertyRequest {
  basicInfo: {
    title: string;
    description: string;
    type: 'house' | 'condo' | 'village';
    region: string;
    address: string;
    price: number;
    currency: 'PHP';
    deposit: number;
  };
  details: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    floor: number;
    furnished: boolean;
    amenities: string[];
  };
  location: {
    latitude: number;
    longitude: number;
    address: string;
    landmark?: string;
  };
  contact: {
    whatsapp?: string;
    telegram?: string;
    email?: string;
    phone?: string;
  };
  images: string[];
  translations: {
    ko?: { title: string; description: string; };
    zh?: { title: string; description: string; };
    ja?: { title: string; description: string; };
    en?: { title: string; description: string; };
  };
}

// 생성된 매물 응답
interface CreatedProperty {
  id: string;
  title: string;
  type: string;
  region: string;
  price: number;
  status: string;
  createdAt: string;
}

// 에러 코드 정의
const ErrorCodes = {
  UNAUTHORIZED: 'AUTH_001',
  INVALID_TOKEN: 'AUTH_002',
  FORBIDDEN: 'PERM_001',
  VALIDATION_ERROR: 'DATA_001',
  INTERNAL_SERVER_ERROR: 'SERVER_001',
} as const;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Method not allowed'
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/admin/properties'
    } as ApiErrorResponse);
  }

  try {
    // 관리자 권한 검증
    const authResult = await verifyAdminAuth(req);
    if (!authResult.success) {
      return res.status(authResult.status || 401).json({
        success: false,
        error: authResult.error,
        timestamp: new Date().toISOString(),
        path: req.url || '/api/admin/properties'
      } as ApiErrorResponse);
    }

    // 요청 데이터 검증
    const validationResult = validatePropertyData(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: ErrorCodes.VALIDATION_ERROR,
          message: validationResult.message,
          details: validationResult.details
        },
        timestamp: new Date().toISOString(),
        path: req.url || '/api/admin/properties'
      } as ApiErrorResponse);
    }

    // 매물 생성
    const propertyData: CreatePropertyRequest = req.body;
    const createdProperty = await createProperty(propertyData, authResult.user);

    // 성공 응답
    res.status(201).json({
      success: true,
      data: createdProperty,
      message: 'Property created successfully'
    } as ApiResponse<CreatedProperty>);

  } catch (error) {
    console.error('Error creating property:', error);
    
    return res.status(500).json({
      success: false,
      error: {
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: 'Internal server error'
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/admin/properties'
    } as ApiErrorResponse);
  }
}

// 관리자 권한 검증
async function verifyAdminAuth(req: NextApiRequest): Promise<{
  success: boolean;
  status?: number;
  error?: any;
  user?: any;
}> {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        success: false,
        status: 401,
        error: {
          code: ErrorCodes.UNAUTHORIZED,
          message: 'Authorization header is required'
        }
      };
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    
    // JWT 토큰 검증
    const decoded = jwt.verify(token, jwtSecret) as any;
    
    // 관리자 권한 확인
    if (!decoded.role || !['admin', 'super_admin'].includes(decoded.role)) {
      return {
        success: false,
        status: 403,
        error: {
          code: ErrorCodes.FORBIDDEN,
          message: 'Admin access required'
        }
      };
    }

    return {
      success: true,
      user: decoded
    };

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return {
        success: false,
        status: 401,
        error: {
          code: ErrorCodes.INVALID_TOKEN,
          message: 'Invalid token'
        }
      };
    }
    
    throw error;
  }
}

// 매물 데이터 검증
function validatePropertyData(data: any): {
  success: boolean;
  message?: string;
  details?: any;
} {
  const errors: any = {};

  // basicInfo 검증
  if (!data.basicInfo) {
    errors.basicInfo = 'Basic info is required';
  } else {
    const { basicInfo } = data;
    
    if (!basicInfo.title || typeof basicInfo.title !== 'string' || basicInfo.title.trim().length < 5) {
      errors['basicInfo.title'] = 'Title is required and must be at least 5 characters';
    }
    
    if (!basicInfo.description || typeof basicInfo.description !== 'string' || basicInfo.description.trim().length < 20) {
      errors['basicInfo.description'] = 'Description is required and must be at least 20 characters';
    }
    
    if (!basicInfo.type || !['house', 'condo', 'village'].includes(basicInfo.type)) {
      errors['basicInfo.type'] = 'Type must be house, condo, or village';
    }
    
    if (!basicInfo.region || typeof basicInfo.region !== 'string') {
      errors['basicInfo.region'] = 'Region is required';
    }
    
    if (!basicInfo.address || typeof basicInfo.address !== 'string') {
      errors['basicInfo.address'] = 'Address is required';
    }
    
    if (!basicInfo.price || typeof basicInfo.price !== 'number' || basicInfo.price <= 0) {
      errors['basicInfo.price'] = 'Price must be a positive number';
    }
    
    if (basicInfo.currency !== 'PHP') {
      errors['basicInfo.currency'] = 'Currency must be PHP';
    }
    
    if (!basicInfo.deposit || typeof basicInfo.deposit !== 'number' || basicInfo.deposit <= 0) {
      errors['basicInfo.deposit'] = 'Deposit must be a positive number';
    }
  }

  // details 검증
  if (!data.details) {
    errors.details = 'Details are required';
  } else {
    const { details } = data;
    
    if (!details.bedrooms || typeof details.bedrooms !== 'number' || details.bedrooms < 1) {
      errors['details.bedrooms'] = 'Bedrooms must be at least 1';
    }
    
    if (!details.bathrooms || typeof details.bathrooms !== 'number' || details.bathrooms < 1) {
      errors['details.bathrooms'] = 'Bathrooms must be at least 1';
    }
    
    if (!details.area || typeof details.area !== 'number' || details.area <= 0) {
      errors['details.area'] = 'Area must be a positive number';
    }
    
    if (typeof details.furnished !== 'boolean') {
      errors['details.furnished'] = 'Furnished must be a boolean';
    }
    
    if (!Array.isArray(details.amenities)) {
      errors['details.amenities'] = 'Amenities must be an array';
    }
  }

  // location 검증
  if (!data.location) {
    errors.location = 'Location is required';
  } else {
    const { location } = data;
    
    if (typeof location.latitude !== 'number' || location.latitude < -90 || location.latitude > 90) {
      errors['location.latitude'] = 'Latitude must be between -90 and 90';
    }
    
    if (typeof location.longitude !== 'number' || location.longitude < -180 || location.longitude > 180) {
      errors['location.longitude'] = 'Longitude must be between -180 and 180';
    }
    
    if (!location.address || typeof location.address !== 'string') {
      errors['location.address'] = 'Location address is required';
    }
  }

  // contact 검증
  if (!data.contact) {
    errors.contact = 'Contact information is required';
  } else {
    const { contact } = data;
    const hasContact = contact.whatsapp || contact.telegram || contact.email || contact.phone;
    
    if (!hasContact) {
      errors['contact'] = 'At least one contact method is required';
    }
  }

  // images 검증
  if (!Array.isArray(data.images) || data.images.length === 0) {
    errors.images = 'At least one image is required';
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: 'Validation failed',
      details: errors
    };
  }

  return { success: true };
}

// 매물 생성
async function createProperty(data: CreatePropertyRequest, user: any): Promise<CreatedProperty> {
  // 실제 환경에서는 데이터베이스에 저장
  // const result = await db.collection('properties').insertOne({
  //   ...data,
  //   id: generateId(),
  //   status: 'active',
  //   viewCount: 0,
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  //   createdBy: user.id
  // });

  // 현재는 모의 응답
  const propertyId = generatePropertyId();
  const now = new Date().toISOString();

  // 이미지 처리 (실제로는 이미지 URL 검증 및 최적화)
  await processPropertyImages(data.images, propertyId);

  // 번역 데이터 처리
  if (!data.translations.en) {
    data.translations.en = {
      title: data.basicInfo.title,
      description: data.basicInfo.description
    };
  }

  // 검색 인덱싱 (실제로는 Elasticsearch 등 사용)
  await indexPropertyForSearch({
    id: propertyId,
    title: data.basicInfo.title,
    description: data.basicInfo.description,
    region: data.basicInfo.region,
    type: data.basicInfo.type,
    price: data.basicInfo.price,
    translations: data.translations
  });

  console.log(`Property ${propertyId} created by admin ${user.email}`);

  return {
    id: propertyId,
    title: data.basicInfo.title,
    type: data.basicInfo.type,
    region: data.basicInfo.region,
    price: data.basicInfo.price,
    status: 'active',
    createdAt: now
  };
}

// 매물 ID 생성
function generatePropertyId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `prop_${timestamp}_${random}`;
}

// 이미지 처리
async function processPropertyImages(imageUrls: string[], propertyId: string): Promise<void> {
  // 실제 환경에서는:
  // 1. 이미지 URL 검증
  // 2. 이미지 최적화 (리사이징, 압축)
  // 3. 썸네일 생성
  // 4. CDN 업로드
  
  console.log(`Processing ${imageUrls.length} images for property ${propertyId}`);
  
  for (const imageUrl of imageUrls) {
    // 이미지 검증
    if (!isValidImageUrl(imageUrl)) {
      throw new Error(`Invalid image URL: ${imageUrl}`);
    }
  }
}

// 검색 인덱싱
async function indexPropertyForSearch(propertyData: any): Promise<void> {
  // 실제 환경에서는 Elasticsearch, Algolia 등 사용
  console.log(`Indexing property ${propertyData.id} for search`);
}

// 이미지 URL 검증
function isValidImageUrl(url: string): boolean {
  try {
    const validUrl = new URL(url);
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const hasValidExtension = validExtensions.some(ext => 
      validUrl.pathname.toLowerCase().endsWith(ext)
    );
    return hasValidExtension;
  } catch {
    return false;
  }
}