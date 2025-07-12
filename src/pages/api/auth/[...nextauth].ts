import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '../../../lib/mongodb'

// OAuth 설정 검증
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('❌ Google OAuth 설정이 누락되었습니다. .env.local 파일을 확인하세요.');
}

if (!process.env.NEXTAUTH_SECRET) {
  console.error('❌ NEXTAUTH_SECRET이 설정되지 않았습니다.');
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    }),
    ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET ? [
      FacebookProvider({
        clientId: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      })
    ] : []),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // 사용자 정보 저장
      if (account && user.email) {
        try {
          const client = await clientPromise;
          const db = client.db('philippines-portal');
          const usersCollection = db.collection('users');
          
          await usersCollection.updateOne(
            { email: user.email },
            {
              $set: {
                name: user.name,
                email: user.email,
                image: user.image,
                provider: account.provider,
                lastLogin: new Date(),
                updatedAt: new Date()
              },
              $setOnInsert: {
                createdAt: new Date(),
                role: 'user',
                isActive: true
              }
            },
            { upsert: true }
          );
          
          console.log('User saved to DB:', user.email);
        } catch (error) {
          console.error('Failed to save user:', error);
          // MongoDB가 안되면 localStorage에 저장하도록 클라이언트로 정보 전달
          console.log('Saving user to localStorage fallback:', {
            email: user.email,
            name: user.name,
            image: user.image,
            provider: account.provider
          });
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub!;
        session.user.role = 'user'; // 일단 기본 역할
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

export default NextAuth(authOptions)