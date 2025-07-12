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
      pickupLocation,
      destination,
      date,
      time,
      vehicleType,
      passengers,
      specialRequests
    } = req.body;

    // 입력값 검증
    if (!pickupLocation || !destination || !date || !time) {
      return res.status(400).json({ error: '필수 정보를 모두 입력해주세요.' });
    }

    // 트립 요청 생성
    const trip = await prisma.tripRequest.create({
      data: {
        pickupLocation,
        destination,
        date: new Date(date),
        time,
        vehicleType: vehicleType || 'any',
        passengers: parseInt(passengers) || 1,
        specialRequests: specialRequests || '',
        status: 'pending',
        userId: req.headers['user-id'] as string || 'anonymous', // 실제로는 인증된 사용자 ID를 사용해야 함
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    // 드라이버들에게 알림 전송 (추후 구현)
    // await notifyDrivers(trip);

    return res.status(201).json({
      success: true,
      message: '드라이버 찾기 요청이 등록되었습니다.',
      trip: {
        id: trip.id,
        pickupLocation: trip.pickupLocation,
        destination: trip.destination
      }
    });
  } catch (error) {
    console.error('Trip request error:', error);
    return res.status(500).json({ 
      error: '요청 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' 
    });
  }
}