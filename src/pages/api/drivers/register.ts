import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      name,
      contact,
      vehicleType,
      vehicleModel,
      plateNumber,
      experience,
      serviceArea,
      serviceTypes,
      hourlyRate,
      about
    } = req.body;

    // 입력값 검증
    if (!name || !contact || !vehicleType || !vehicleModel || !plateNumber || !experience || !serviceArea || !hourlyRate) {
      return res.status(400).json({ error: '필수 정보를 모두 입력해주세요.' });
    }

    // 드라이버 생성
    const driver = await prisma.driver.create({
      data: {
        name,
        contact,
        vehicleType,
        vehicleModel,
        plateNumber,
        experience,
        serviceArea,
        serviceTypes: JSON.stringify(serviceTypes),
        hourlyRate: parseFloat(hourlyRate),
        about: about || '',
        rating: 0,
        reviews: 0,
        completedTrips: 0,
        verified: false,
        availability: 'available',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    return res.status(201).json({
      success: true,
      message: '드라이버 등록이 완료되었습니다.',
      driver: {
        id: driver.id,
        name: driver.name
      }
    });
  } catch (error) {
    console.error('Driver registration error:', error);
    return res.status(500).json({ 
      error: '등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' 
    });
  }
}