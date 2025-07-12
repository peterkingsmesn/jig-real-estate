import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

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

// 이미지 업로드 요청 인터페이스
interface ImageUploadRequest {
  files: File[];
  propertyId?: string;
  category: 'property' | 'thumbnail' | 'temp';
}

// 이미지 업로드 응답
interface ImageUploadResponse {
  images: {
    id: string;
    url: string;
    thumbnailUrl: string;
    originalName: string;
    size: number;
    width: number;
    height: number;
  }[];
}

// 에러 코드 정의
const ErrorCodes = {
  FILE_TOO_LARGE: 'FILE_001',
  INVALID_FILE_TYPE: 'FILE_002',
  UPLOAD_FAILED: 'FILE_003',
  VALIDATION_ERROR: 'DATA_001',
  INTERNAL_SERVER_ERROR: 'SERVER_001',
} as const;

// Next.js API 설정
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Method not allowed'
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/upload/images'
    } as ApiErrorResponse);
  }

  try {
    // multipart/form-data 파싱
    const { files, fields } = await parseFormData(req);
    
    // 요청 데이터 검증
    const validationResult = validateUploadRequest(files, fields);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: ErrorCodes.VALIDATION_ERROR,
          message: validationResult.message,
          details: validationResult.details
        },
        timestamp: new Date().toISOString(),
        path: req.url || '/api/upload/images'
      } as ApiErrorResponse);
    }

    // 이미지 업로드 처리
    const uploadedImages = await processImageUploads(files, fields);

    // 성공 응답
    res.status(200).json({
      success: true,
      data: { images: uploadedImages },
      message: `Successfully uploaded ${uploadedImages.length} images`
    } as ApiResponse<ImageUploadResponse>);

  } catch (error) {
    console.error('Error uploading images:', error);
    
    if (error instanceof FileUploadError) {
      return res.status(400).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        },
        timestamp: new Date().toISOString(),
        path: req.url || '/api/upload/images'
      } as ApiErrorResponse);
    }
    
    return res.status(500).json({
      success: false,
      error: {
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: 'Internal server error'
      },
      timestamp: new Date().toISOString(),
      path: req.url || '/api/upload/images'
    } as ApiErrorResponse);
  }
}

// Form data 파싱
async function parseFormData(req: NextApiRequest): Promise<{
  files: formidable.File[];
  fields: formidable.Fields;
}> {
  return new Promise((resolve, reject) => {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 10,
      allowEmptyFiles: false,
      filter: (part) => {
        return part.mimetype?.startsWith('image/') || false;
      }
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }

      // files를 배열로 변환
      const fileArray: formidable.File[] = [];
      Object.values(files).forEach(file => {
        if (Array.isArray(file)) {
          fileArray.push(...file);
        } else if (file) {
          fileArray.push(file);
        }
      });

      resolve({ files: fileArray, fields });
    });
  });
}

// 업로드 요청 검증
function validateUploadRequest(files: formidable.File[], fields: formidable.Fields): {
  success: boolean;
  message?: string;
  details?: any;
} {
  const errors: any = {};

  // 파일 개수 검증
  if (!files || files.length === 0) {
    errors.files = 'At least one file is required';
  } else if (files.length > 10) {
    errors.files = 'Maximum 10 files allowed';
  }

  // 파일 검증
  files.forEach((file, index) => {
    // 파일 크기 검증
    if (file.size > 10 * 1024 * 1024) {
      errors[`file_${index}_size`] = `File ${file.originalFilename} is too large (max 10MB)`;
    }

    // MIME 타입 검증
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!file.mimetype || !allowedTypes.includes(file.mimetype)) {
      errors[`file_${index}_type`] = `File ${file.originalFilename} has invalid type. Allowed: JPEG, PNG, WebP`;
    }

    // 파일 이름 검증
    if (!file.originalFilename) {
      errors[`file_${index}_name`] = 'File name is required';
    }
  });

  // 카테고리 검증
  const category = Array.isArray(fields.category) ? fields.category[0] : fields.category;
  if (!category || !['property', 'thumbnail', 'temp'].includes(category)) {
    errors.category = 'Category must be property, thumbnail, or temp';
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

// 이미지 업로드 처리
async function processImageUploads(files: formidable.File[], fields: formidable.Fields): Promise<{
  id: string;
  url: string;
  thumbnailUrl: string;
  originalName: string;
  size: number;
  width: number;
  height: number;
}[]> {
  const category = Array.isArray(fields.category) ? fields.category[0] : fields.category;
  const propertyId = Array.isArray(fields.propertyId) ? fields.propertyId[0] : fields.propertyId;
  
  const uploadedImages = [];

  for (const file of files) {
    try {
      // 이미지 ID 생성
      const imageId = generateImageId();
      
      // 파일 확장자 추출
      const ext = path.extname(file.originalFilename || '').toLowerCase();
      const fileNameWithoutExt = path.basename(file.originalFilename || '', ext);
      
      // 업로드 디렉토리 생성
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', category || 'temp');
      await ensureDirectoryExists(uploadDir);
      
      // 원본 이미지 파일명
      const originalFileName = `${imageId}_original${ext}`;
      const thumbnailFileName = `${imageId}_thumb.jpg`;
      
      const originalPath = path.join(uploadDir, originalFileName);
      const thumbnailPath = path.join(uploadDir, thumbnailFileName);
      
      // 이미지 메타데이터 추출
      const metadata = await sharp(file.filepath).metadata();
      
      if (!metadata.width || !metadata.height) {
        throw new FileUploadError(
          ErrorCodes.INVALID_FILE_TYPE,
          `Invalid image file: ${file.originalFilename}`,
          { file: file.originalFilename }
        );
      }

      // 원본 이미지 최적화 및 저장
      await sharp(file.filepath)
        .jpeg({ quality: 85 })
        .png({ compressionLevel: 8 })
        .webp({ quality: 85 })
        .toFile(originalPath);

      // 썸네일 생성
      await sharp(file.filepath)
        .resize(300, 200, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath);

      // 원본 임시 파일 삭제
      await fs.promises.unlink(file.filepath);

      // URL 생성
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const originalUrl = `${baseUrl}/uploads/${category}/${originalFileName}`;
      const thumbnailUrl = `${baseUrl}/uploads/${category}/${thumbnailFileName}`;

      // 데이터베이스에 이미지 정보 저장 (실제 환경에서)
      await saveImageMetadata({
        id: imageId,
        originalName: file.originalFilename || '',
        originalUrl,
        thumbnailUrl,
        size: file.size,
        width: metadata.width,
        height: metadata.height,
        category: category || 'temp',
        propertyId,
        createdAt: new Date().toISOString()
      });

      uploadedImages.push({
        id: imageId,
        url: originalUrl,
        thumbnailUrl,
        originalName: file.originalFilename || '',
        size: file.size,
        width: metadata.width,
        height: metadata.height
      });

    } catch (error) {
      console.error(`Error processing file ${file.originalFilename}:`, error);
      
      // 임시 파일 정리
      try {
        await fs.promises.unlink(file.filepath);
      } catch {}
      
      throw new FileUploadError(
        ErrorCodes.UPLOAD_FAILED,
        `Failed to process file: ${file.originalFilename}`,
        { file: file.originalFilename, error: error instanceof Error ? error.message : 'Unknown error' }
      );
    }
  }

  return uploadedImages;
}

// 이미지 ID 생성
function generateImageId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `img_${timestamp}_${random}`;
}

// 디렉토리 존재 확인 및 생성
async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.promises.access(dirPath);
  } catch {
    await fs.promises.mkdir(dirPath, { recursive: true });
  }
}

// 이미지 메타데이터 저장
async function saveImageMetadata(imageData: any): Promise<void> {
  // 실제 환경에서는 데이터베이스에 저장
  // await db.collection('images').insertOne(imageData);
  console.log(`Image metadata saved: ${imageData.id}`);
}

// 커스텀 에러 클래스
class FileUploadError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'FileUploadError';
  }
}