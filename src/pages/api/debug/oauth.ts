import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 환경변수 확인 (실제 값은 노출하지 않고 존재 여부만)
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const facebookClientId = process.env.FACEBOOK_CLIENT_ID;
  const facebookClientSecret = process.env.FACEBOOK_CLIENT_SECRET;
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  const nextAuthSecret = process.env.NEXTAUTH_SECRET;

  return res.status(200).json({
    google: {
      clientId: googleClientId ? `${googleClientId.substring(0, 10)}...` : 'NOT_SET',
      clientSecret: googleClientSecret ? 'SET' : 'NOT_SET',
      length: googleClientId?.length || 0
    },
    facebook: {
      clientId: facebookClientId ? `${facebookClientId.substring(0, 10)}...` : 'NOT_SET',
      clientSecret: facebookClientSecret ? 'SET' : 'NOT_SET',
      length: facebookClientId?.length || 0
    },
    nextAuth: {
      url: nextAuthUrl || 'NOT_SET',
      secret: nextAuthSecret ? 'SET' : 'NOT_SET'
    },
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
}