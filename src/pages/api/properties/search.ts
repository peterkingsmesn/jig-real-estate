import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      region,
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      search,
      page = '1',
      limit = '20'
    } = req.query;

    // 검색 조건 구성
    const where: any = {
      status: 'active'
    };

    if (region) {
      where.location = {
        contains: region as string,
        mode: 'insensitive'
      };
    }

    if (propertyType) {
      where.propertyType = propertyType;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    if (bedrooms) {
      where.bedrooms = parseInt(bedrooms as string);
    }

    if (bathrooms) {
      where.bathrooms = parseInt(bathrooms as string);
    }

    if (minArea || maxArea) {
      where.area = {};
      if (minArea) where.area.gte = parseFloat(minArea as string);
      if (maxArea) where.area.lte = parseFloat(maxArea as string);
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { location: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // 페이지네이션 계산
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // 총 개수 조회
    const total = await prisma.property.count({ where });

    // 매물 조회
    const properties = await prisma.property.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum
    });

    return res.status(200).json({
      properties,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Property search error:', error);
    return res.status(500).json({ error: 'Failed to search properties' });
  }
}