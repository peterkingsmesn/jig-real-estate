import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import FacebookLayout from '@/components/layout/FacebookLayout';
import SEOHead from '@/components/seo/SEOHead';

interface UserPost {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: number;
  views: number;
  status: 'active' | 'hidden' | 'reported';
}

export default function MyPostsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }

    // 사용자 게시글 로드 (실제로는 API에서 가져옴)
    setPosts([
      {
        id: '1',
        title: 'BGC 맛집 추천해주세요',
        content: 'BGC에서 한식당 찾고 있는데 추천 부탁드려요...',
        category: 'food',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        likes: 12,
        comments: 5,
        views: 45,
        status: 'active'
      },
      {
        id: '2',
        title: '마닐라 교통 정보 문의',
        content: '공항에서 BGC까지 가는 가장 좋은 방법이 뭘까요?',
        category: 'transport',
        createdAt: '2024-01-10T15:20:00Z',
        updatedAt: '2024-01-10T15:20:00Z',
        likes: 8,
        comments: 12,
        views: 67,
        status: 'active'
      }
    ]);
    setLoading(false);
  }, [session, router]);

  const getCategoryName = (category: string) => {
    const categories: { [key: string]: string } = {
      housing: '부동산',
      jobs: '구인구직',
      events: '이벤트',
      help: '도움요청',
      life: '생활정보',
      questions: '질문',
      social: '모임',
      marketplace: '장터',
      food: '맛집',
      transport: '교통'
    };
    return categories[category] || category;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">활성</span>;
      case 'hidden':
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">숨김</span>;
      case 'reported':
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">신고됨</span>;
      default:
        return null;
    }
  };

  if (!session) {
    return (
      <FacebookLayout>
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">로그인이 필요합니다</h1>
          <p className="text-gray-600">내 게시글을 보려면 먼저 로그인해주세요.</p>
        </div>
      </FacebookLayout>
    );
  }

  return (
    <>
      <SEOHead
        title="내 게시글 - 필직"
        description="내가 작성한 게시글 목록을 확인하고 관리하세요"
        keywords="내게시글, 포스트관리, 필직"
      />

      <FacebookLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-800">내 게시글</h1>
              <button
                onClick={() => router.push('/community')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>새 게시글 작성</span>
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">게시글을 불러오는 중...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <h3 className="text-lg font-medium text-gray-800 mb-2">아직 작성한 게시글이 없습니다</h3>
                <p className="text-gray-600 mb-4">커뮤니티에 첫 번째 글을 작성해보세요!</p>
                <button
                  onClick={() => router.push('/community')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  게시글 작성하기
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {getCategoryName(post.category)}
                        </span>
                        {getStatusBadge(post.status)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600 cursor-pointer">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {post.content}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                          </svg>
                          <span>{post.comments}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          <span>{post.views}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => router.push(`/community/post/${post.id}`)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          보기
                        </button>
                        <button
                          onClick={() => router.push(`/community/post/${post.id}/edit`)}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
                              // 삭제 로직
                              console.log('Delete post:', post.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* 페이지네이션 */}
                <div className="flex justify-center mt-8">
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                      이전
                    </button>
                    <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">
                      1
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                      다음
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </FacebookLayout>
    </>
  );
}