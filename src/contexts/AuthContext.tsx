import React, { createContext, useContext, ReactNode } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'super_admin';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === 'loading';

  // NextAuth 세션을 사용자 객체로 변환
  const user: User | null = session?.user ? {
    id: session.user.id || '',
    email: session.user.email || '',
    name: session.user.name || '',
    role: (session.user as any).role || 'user',
    avatar: session.user.image || undefined,
  } : null;

  // 기존 이메일/비밀번호 로그인 (JWT 방식)
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Login failed');
      }

      const data = await response.json();
      const { token, refreshToken, user } = data.data;

      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);

      // 관리자 페이지로 리다이렉트
      if (user.role === 'admin' || user.role === 'super_admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (error) {
      throw error;
    }
  };

  // Google OAuth 로그인
  const loginWithGoogle = async () => {
    try {
      await signIn('google', { 
        callbackUrl: '/',
        redirect: true 
      });
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    }
  };

  // Facebook OAuth 로그인
  const loginWithFacebook = async () => {
    try {
      await signIn('facebook', { 
        callbackUrl: '/',
        redirect: true 
      });
    } catch (error) {
      console.error('Facebook login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    // NextAuth 세션이 있는 경우
    if (session) {
      await signOut({ redirect: false });
    }
    
    // JWT 토큰 제거
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    router.push('/');
  };

  const refreshToken = async () => {
    try {
      const refresh = localStorage.getItem('refreshToken');
      if (!refresh) {
        throw new Error('No refresh token');
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken: refresh })
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      const { token, refreshToken: newRefreshToken } = data.data;

      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', newRefreshToken);
    } catch (error) {
      await logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      loginWithGoogle,
      loginWithFacebook,
      logout,
      refreshToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};