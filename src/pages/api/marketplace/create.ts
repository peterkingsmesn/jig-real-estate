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
      title,
      description,
      price,
      category,
      condition,
      location,
      sellerName,
      sellerContact,
      images
    } = req.body;

    // 입력값 검증
    if (!title || !description || !price || !category || !condition || !location || !sellerName || !sellerContact) {
      return res.status(400).json({ error: '모든 필수 항목을 입력해주세요.' });
    }

    const item = await prisma.marketplaceItem.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        category,
        condition,
        location,
        sellerName,
        sellerContact,
        sellerId: req.headers['user-id'] as string || 'anonymous',
        images: images || [],
        status: 'active'
      }
    });

    return res.status(201).json({
      success: true,
      message: '상품이 등록되었습니다.',
      itemId: item.id
    });
  } catch (error) {
    console.error('Marketplace item creation error:', error);
    return res.status(500).json({ 
      error: '상품 등록 중 오류가 발생했습니다.' 
    });
  }
}