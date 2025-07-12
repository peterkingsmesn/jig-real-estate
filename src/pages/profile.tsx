import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import FacebookLayout from '@/components/layout/FacebookLayout';
import SEOHead from '@/components/seo/SEOHead';

interface UserProfile {
  name: string;
  email: string;
  image?: string;
  bio?: string;
  location?: string;
  phone?: string;
  whatsapp?: string;
  joinedAt: string;
  postsCount: number;
  propertiesCount: number;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }

    // 프로필 정보 로드 (실제로는 API에서 가져옴)
    setProfile({
      name: session.user?.name || '',
      email: session.user?.email || '',
      image: session.user?.image || '',
      bio: '필직에서 활동하는 사용자입니다.',
      location: '필리핀',
      phone: '',
      whatsapp: '',
      joinedAt: '2024-01-01',
      postsCount: 5,
      propertiesCount: 2
    });
    setLoading(false);
  }, [session, router]);

  if (!session) {
    return (
      <FacebookLayout>
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">로그인이 필요합니다</h1>
          <p className="text-gray-600">프로필을 보려면 먼저 로그인해주세요.</p>
        </div>
      </FacebookLayout>
    );
  }

  if (loading) {
    return (
      <FacebookLayout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">프로필을 불러오는 중...</p>
          </div>
        </div>
      </FacebookLayout>
    );
  }

  return (
    <>
      <SEOHead
        title="내 프로필 - 필직"
        description="필직에서의 내 프로필과 활동 정보"
        keywords="프로필, 사용자, 필직"
      />

      <FacebookLayout>
        <div className="max-w-4xl mx-auto">
          {/* 프로필 헤더 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex-shrink-0">
                {profile?.image ? (
                  <img 
                    src={profile.image} 
                    alt={profile.name}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{profile?.name}</h1>
                <p className="text-gray-600 mb-2">{profile?.email}</p>
                {profile?.bio && (
                  <p className="text-gray-700 mb-4">{profile.bio}</p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {profile?.location && (
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span>가입일: {new Date(profile?.joinedAt || '').toLocaleDateString('ko-KR')}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => router.push('/profile/edit')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  프로필 수정
                </button>
              </div>
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{profile?.postsCount}</div>
              <div className="text-gray-600">작성한 게시글</div>
              <button
                onClick={() => router.push('/my-posts')}
                className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                게시글 보기 →
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{profile?.propertiesCount}</div>
              <div className="text-gray-600">등록한 매물</div>
              <button
                onClick={() => router.push('/my-properties')}
                className="mt-3 text-green-600 hover:text-green-800 text-sm font-medium"
              >
                매물 보기 →
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
              <div className="text-gray-600">받은 좋아요</div>
              <div className="mt-3 text-gray-400 text-sm">
                활동하며 좋아요를 받아보세요
              </div>
            </div>
          </div>

          {/* 연락처 정보 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">연락처 정보</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-gray-800">{profile?.email}</span>
                </div>
              </div>

              {profile?.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span className="text-gray-800">{profile.phone}</span>
                  </div>
                </div>
              )}

              {profile?.whatsapp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.520-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106"/>
                    </svg>
                    <span className="text-gray-800">{profile.whatsapp}</span>
                  </div>
                </div>
              )}
            </div>

            {(!profile?.phone && !profile?.whatsapp) && (
              <div className="text-center py-8 text-gray-500">
                <p>연락처 정보를 추가하여 다른 사용자들과 소통해보세요.</p>
                <button
                  onClick={() => router.push('/profile/edit')}
                  className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  연락처 추가하기 →
                </button>
              </div>
            )}
          </div>

          {/* 빠른 액션 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">빠른 작업</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => router.push('/properties/add')}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-800">매물 등록</div>
                  <div className="text-sm text-gray-600">새로운 부동산 매물을 등록하세요</div>
                </div>
              </button>

              <button
                onClick={() => router.push('/community')}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-800">게시글 작성</div>
                  <div className="text-sm text-gray-600">커뮤니티에 새 글을 작성하세요</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </FacebookLayout>
    </>
  );
}