import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  provider: string;
  role: string;
  isActive: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // 세션 확인
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized' 
      });
    }

    // 관리자 권한 확인
    if (session.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Forbidden - Admin access required' 
      });
    }

    const client = await clientPromise;
    const db = client.db('philippines-portal');

    switch (req.method) {
      case 'GET':
        // 사용자 목록 조회
        const { page = '1', limit = '20', search = '', provider = '', role = '' } = req.query;
        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        // 필터 조건 구성
        const filter: any = {};
        if (search) {
          filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ];
        }
        if (provider) {
          filter.provider = provider;
        }
        if (role) {
          filter.role = role;
        }

        // 사용자 조회
        const users = await db.collection('users')
          .find(filter)
          .sort({ lastLogin: -1 })
          .skip(skip)
          .limit(limitNum)
          .toArray();

        // 전체 사용자 수
        const total = await db.collection('users').countDocuments(filter);

        // 통계 정보
        const stats = await db.collection('users').aggregate([
          {
            $facet: {
              byProvider: [
                { $group: { _id: '$provider', count: { $sum: 1 } } }
              ],
              byRole: [
                { $group: { _id: '$role', count: { $sum: 1 } } }
              ],
              activeUsers: [
                { $match: { isActive: true } },
                { $count: 'count' }
              ],
              todayLogins: [
                {
                  $match: {
                    lastLogin: {
                      $gte: new Date(new Date().setHours(0, 0, 0, 0))
                    }
                  }
                },
                { $count: 'count' }
              ]
            }
          }
        ]).toArray();

        return res.status(200).json({
          success: true,
          data: users,
          meta: {
            total,
            page: pageNum,
            limit: limitNum,
            hasNext: (pageNum * limitNum) < total,
            hasPrev: pageNum > 1
          },
          stats: stats[0]
        });

      case 'PUT':
        // 사용자 정보 업데이트 (역할, 활성화 상태 등)
        const { userId } = req.query;
        const { role: newRole, isActive } = req.body;

        if (!userId) {
          return res.status(400).json({
            success: false,
            error: 'User ID is required'
          });
        }

        const updateData: any = { updatedAt: new Date() };
        if (newRole) updateData.role = newRole;
        if (typeof isActive === 'boolean') updateData.isActive = isActive;

        // userId가 배열인 경우 첫 번째 값 사용
        const userIdString = Array.isArray(userId) ? userId[0] : userId;
        
        // ObjectId 유효성 검사
        if (!ObjectId.isValid(userIdString)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid user ID format'
          });
        }

        const result = await db.collection('users').updateOne(
          { _id: new ObjectId(userIdString) },
          { $set: updateData }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({
            success: false,
            error: 'User not found'
          });
        }

        return res.status(200).json({
          success: true,
          message: 'User updated successfully'
        });

      case 'DELETE':
        // 사용자 삭제 (soft delete)
        const { userId: deleteUserId } = req.query;

        if (!deleteUserId) {
          return res.status(400).json({
            success: false,
            error: 'User ID is required'
          });
        }

        // deleteUserId가 배열인 경우 첫 번째 값 사용
        const deleteUserIdString = Array.isArray(deleteUserId) ? deleteUserId[0] : deleteUserId;
        
        // ObjectId 유효성 검사
        if (!ObjectId.isValid(deleteUserIdString)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid user ID format'
          });
        }

        const deleteResult = await db.collection('users').updateOne(
          { _id: new ObjectId(deleteUserIdString) },
          { 
            $set: { 
              isActive: false,
              deletedAt: new Date(),
              updatedAt: new Date()
            }
          }
        );

        if (deleteResult.matchedCount === 0) {
          return res.status(404).json({
            success: false,
            error: 'User not found'
          });
        }

        return res.status(200).json({
          success: true,
          message: 'User deactivated successfully'
        });

      default:
        return res.status(405).json({
          success: false,
          error: 'Method not allowed'
        });
    }
  } catch (error) {
    console.error('Admin users API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}