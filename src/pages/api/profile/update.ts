import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getSession({ req });
  
  if (!session || !session.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const {
      name,
      bio,
      location,
      phone,
      whatsapp
    } = req.body;

    // 사용자 정보 업데이트
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: name || session.user.name,
        bio,
        location,
        phone,
        whatsapp,
        updatedAt: new Date()
      }
    });

    return res.status(200).json({
      success: true,
      message: '프로필이 업데이트되었습니다.',
      user: {
        email: user.email,
        name: user.name,
        bio: user.bio,
        location: user.location,
        phone: user.phone,
        whatsapp: user.whatsapp
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    
    // 사용자가 없는 경우
    if ((error as any).code === 'P2025') {
      // 새 사용자 생성
      try {
        const newUser = await prisma.user.create({
          data: {
            email: session.user.email,
            name: req.body.name || session.user.name || 'Anonymous',
            bio: req.body.bio,
            location: req.body.location,
            phone: req.body.phone,
            whatsapp: req.body.whatsapp
          }
        });

        return res.status(200).json({
          success: true,
          message: '프로필이 생성되었습니다.',
          user: {
            email: newUser.email,
            name: newUser.name,
            bio: newUser.bio,
            location: newUser.location,
            phone: newUser.phone,
            whatsapp: newUser.whatsapp
          }
        });
      } catch (createError) {
        console.error('Profile creation error:', createError);
        return res.status(500).json({ error: 'Failed to create profile' });
      }
    }
    
    return res.status(500).json({ error: 'Failed to update profile' });
  }
}