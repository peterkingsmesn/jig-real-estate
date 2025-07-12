import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

interface PropertySubmission {
  title: string;
  description: string;
  type: 'house' | 'condo' | 'village';
  region: string;
  city: string;
  district: string;
  address: string;
  price: number;
  deposit: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  floor?: number;
  furnished: boolean;
  amenities: string[];
  contactName: string;
  whatsapp: string;
  email: string;
  phone: string;
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' } 
    });
  }

  try {
    const session = await getSession({ req });
    
    const {
      title,
      description,
      type,
      region,
      city,
      district,
      address,
      price,
      deposit,
      bedrooms,
      bathrooms,
      area,
      floor,
      furnished,
      amenities,
      contactName,
      whatsapp,
      email,
      phone
    } = req.body;

    // 유효성 검사
    const requiredFields = ['title', 'description', 'type', 'region', 'city', 'address', 'price', 'deposit', 'bedrooms', 'bathrooms', 'area', 'contactName', 'whatsapp'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: { 
          code: 'VALIDATION_ERROR', 
          message: `Missing required fields: ${missingFields.join(', ')}` 
        }
      });
    }

    // 데이터베이스에 저장
    const property = await prisma.property.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        location: `${region}, ${city}, ${district || ''}`,
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        area: parseFloat(area),
        propertyType: type,
        images: '[]', // 이미지 업로드는 추후 구현 (JSON string)
        features: JSON.stringify(amenities || []),
        ownerId: session?.user?.email || 'anonymous',
        status: 'active'
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        id: property.id,
        status: 'active',
        message: '매물이 성공적으로 등록되었습니다.'
      }
    });

  } catch (error) {
    console.error('Error submitting property:', error);
    
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to submit property'
      }
    });
  }
}

