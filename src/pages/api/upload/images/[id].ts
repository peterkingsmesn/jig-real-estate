import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

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

// 이미지 삭제 응답
interface ImageDeleteResponse {
  deleted: boolean;
  message: string;
}

// 에러 코드 정의
const ErrorCodes = {
  UNAUTHORIZED: 'AUTH_001',
  FORBIDDEN: 'PERM_001',
  VALIDATION_ERROR: 'DATA_001',
  RESOURCE_NOT_FOUND: 'DATA_002',
  INTERNAL_SERVER_ERROR: 'SERVER_001',
} as const;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Method not allowed'
      },
      timestamp: new Date().toISOString(),
      path: req.url || `/api/upload/images/${req.query.id}`
    } as ApiErrorResponse);
  }

  try {
    const { id } = req.query;
    
    // ID 유효성 검증
    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          code: ErrorCodes.VALIDATION_ERROR,
          message: 'Image ID is required and must be a string',
          details: { id }
        },
        timestamp: new Date().toISOString(),
        path: req.url || `/api/upload/images/${id}`
      } as ApiErrorResponse);
    }

    // 관리자 권한 검증 (실제 환경에서는 JWT 토큰 확인)
    const authResult = await verifyAdminAuth(req);
    if (!authResult.success) {
      return res.status(authResult.status || 401).json({
        success: false,
        error: authResult.error,
        timestamp: new Date().toISOString(),
        path: req.url || `/api/upload/images/${id}`
      } as ApiErrorResponse);
    }

    // 이미지 정보 조회
    const imageInfo = await getImageInfo(id);
    
    if (!imageInfo) {
      return res.status(404).json({
        success: false,
        error: {
          code: ErrorCodes.RESOURCE_NOT_FOUND,
          message: 'Image not found',
          details: { id }
        },
        timestamp: new Date().toISOString(),
        path: req.url || `/api/upload/images/${id}`
      } as ApiErrorResponse);
    }

    // 이미지 파일 삭제
    await deleteImageFiles(imageInfo);
    
    // 데이터베이스에서 이미지 정보 삭제
    await deleteImageFromDatabase(id);

    // 성공 응답
    const response: ImageDeleteResponse = {
      deleted: true,
      message: 'Image deleted successfully'
    };

    res.status(200).json({
      success: true,
      data: response,
      message: 'Image deleted successfully'
    } as ApiResponse<ImageDeleteResponse>);

  } catch (error) {
    console.error('Error deleting image:', error);
    
    return res.status(500).json({
      success: false,
      error: {
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: 'Internal server error'
      },
      timestamp: new Date().toISOString(),
      path: req.url || `/api/upload/images/${req.query.id}`
    } as ApiErrorResponse);
  }
}

// 관리자 권한 검증 (간단한 예시)
async function verifyAdminAuth(req: NextApiRequest): Promise<{
  success: boolean;
  status?: number;
  error?: any;
}> {
  // 실제 환경에서는 JWT 토큰 검증
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

  // JWT 토큰 검증 로직 (실제 구현 필요)
  // const token = authHeader.substring(7);
  // const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // if (!decoded.role || !['admin', 'super_admin'].includes(decoded.role)) {
  //   return { success: false, status: 403, error: { code: ErrorCodes.FORBIDDEN, message: 'Admin access required' } };
  // }

  return { success: true };
}

// 이미지 정보 조회
async function getImageInfo(id: string): Promise<{
  id: string;
  originalUrl: string;
  thumbnailUrl: string;
  category: string;
  propertyId?: string;
  createdAt: string;
} | null> {
  // 실제 환경에서는 데이터베이스에서 조회
  // const imageInfo = await db.collection('images').findOne({ id });
  
  // 현재는 모의 데이터
  const mockImages = await getMockImageData();
  return mockImages.find(img => img.id === id) || null;
}

// 이미지 파일 삭제
async function deleteImageFiles(imageInfo: {
  originalUrl: string;
  thumbnailUrl: string;
  category: string;
}): Promise<void> {
  try {
    // URL에서 파일 경로 추출
    const originalFileName = path.basename(imageInfo.originalUrl);
    const thumbnailFileName = path.basename(imageInfo.thumbnailUrl);
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', imageInfo.category);
    const originalPath = path.join(uploadDir, originalFileName);
    const thumbnailPath = path.join(uploadDir, thumbnailFileName);

    // 원본 파일 삭제
    try {
      await fs.promises.unlink(originalPath);
      console.log(`Deleted original file: ${originalPath}`);
    } catch (error) {
      console.warn(`Could not delete original file: ${originalPath}`, error);
    }

    // 썸네일 파일 삭제
    try {
      await fs.promises.unlink(thumbnailPath);
      console.log(`Deleted thumbnail file: ${thumbnailPath}`);
    } catch (error) {
      console.warn(`Could not delete thumbnail file: ${thumbnailPath}`, error);
    }

  } catch (error) {
    console.error('Error deleting image files:', error);
    // 파일 삭제 실패는 치명적이지 않으므로 계속 진행
  }
}

// 데이터베이스에서 이미지 정보 삭제
async function deleteImageFromDatabase(id: string): Promise<void> {
  // 실제 환경에서는 데이터베이스에서 삭제
  // await db.collection('images').deleteOne({ id });
  
  // 연관된 매물에서도 이미지 참조 제거
  // await db.collection('properties').updateMany(
  //   { 'images.id': id },
  //   { $pull: { images: { id } } }
  // );
  
  console.log(`Image ${id} deleted from database`);
}

// 모의 이미지 데이터
async function getMockImageData(): Promise<{
  id: string;
  originalUrl: string;
  thumbnailUrl: string;
  category: string;
  propertyId?: string;
  createdAt: string;
}[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  return [
    {
      id: 'img_1625097600000_123',
      originalUrl: `${baseUrl}/uploads/property/img_1625097600000_123_original.jpg`,
      thumbnailUrl: `${baseUrl}/uploads/property/img_1625097600000_123_thumb.jpg`,
      category: 'property',
      propertyId: 'prop_1625097600000_456',
      createdAt: '2023-07-01T00:00:00.000Z'
    },
    {
      id: 'img_1625097600000_456',
      originalUrl: `${baseUrl}/uploads/property/img_1625097600000_456_original.jpg`,
      thumbnailUrl: `${baseUrl}/uploads/property/img_1625097600000_456_thumb.jpg`,
      category: 'property',
      propertyId: 'prop_1625097600000_789',
      createdAt: '2023-07-01T00:00:00.000Z'
    },
    {
      id: 'img_1625097600000_789',
      originalUrl: `${baseUrl}/uploads/temp/img_1625097600000_789_original.jpg`,
      thumbnailUrl: `${baseUrl}/uploads/temp/img_1625097600000_789_thumb.jpg`,
      category: 'temp',
      createdAt: '2023-07-01T00:00:00.000Z'
    }
  ];
}