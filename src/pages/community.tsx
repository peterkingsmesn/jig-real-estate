import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react';
import SEOHead from '@/components/seo/SEOHead';
import FacebookLayout from '@/components/layout/FacebookLayout';
import { 
  MessageCircle, 
  Users, 
  Calendar,
  MapPin,
  Heart,
  Share2,
  Plus,
  Star,
  Flag,
  Clock,
  ThumbsUp,
  MessageSquare,
  Bookmark,
  Camera,
  Video,
  MoreVertical,
  Globe,
  Home,
  Store,
  Tv,
  Search
} from 'lucide-react';

interface CommunityPost {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    location: string;
  };
  category: string;
  title: string;
  titleKo: string;
  titleTl: string;
  content: string;
  contentKo: string;
  contentTl: string;
  images: string[];
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
  isBookmarked: boolean;
  isPinned: boolean;
  status: 'active' | 'hidden' | 'reported';
}

export default function CommunityPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeCategory, setActiveCategory] = useState('all');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    { id: 'all', name: '전체', icon: '🏠' },
    { id: 'housing', name: '주거정보', icon: '🏘️' },
    { id: 'jobs', name: '구인구직', icon: '💼' },
    { id: 'marketplace', name: '중고거래', icon: '🛒' },
    { id: 'events', name: '이벤트', icon: '🎉' },
    { id: 'life', name: '일상', icon: '☕' },
    { id: 'questions', name: '질문', icon: '❓' },
    { id: 'help', name: '도움요청', icon: '🤝' },
    { id: 'business', name: '비즈니스', icon: '💰' },
    { id: 'travel', name: '여행', icon: '✈️' }
  ];

  useEffect(() => {
    fetchPosts();
  }, [activeCategory, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/community/posts?category=${activeCategory}&page=${currentPage}&limit=10`);
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.data);
        setTotalPages(Math.ceil(data.meta.total / data.meta.limit));
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;
    return `${Math.floor(diffInSeconds / 604800)}주 전`;
  };

  return (
    <>
      <SEOHead
        title="커뮤니티 - 필직"
        description="필리핀 한인 커뮤니티에서 정보를 공유하고 소통하세요"
        keywords="커뮤니티, 필리핀, 한인, 정보공유"
      />

      <FacebookLayout section="community">
          {/* Create Post Box */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <button
                  onClick={() => {
                    if (session) {
                      router.push('/community/create-post');
                    } else {
                      signIn();
                    }
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 text-left text-gray-500 transition-colors"
                >
                  {session ? '무슨 생각을 하고 계신가요?' : '로그인해서 글을 작성해보세요!'}
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="bg-white rounded-lg shadow mb-6 p-4">
            <div className="flex items-center space-x-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm ${
                    activeCategory === category.id
                      ? 'bg-blue-100 text-blue-600 font-semibold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium'
                  }`}
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {loading ? (
              <div className="bg-white rounded-lg shadow p-8">
                <div className="animate-pulse space-y-4">
                  <div className="flex space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600">게시글이 없습니다.</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow">
                  {/* Post Header */}
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <img 
                          src={post.author.avatar} 
                          alt={post.author.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center space-x-1">
                            <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                            {post.author.verified && (
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <span>{getRelativeTime(post.createdAt)}</span>
                            <span>·</span>
                            <Globe className="h-3 w-3" />
                          </div>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <MoreVertical className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="px-4 pb-3">
                    <h2 className="font-semibold text-gray-900 mb-1">{post.titleKo}</h2>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {post.contentKo.length > 200 
                        ? `${post.contentKo.substring(0, 200)}...` 
                        : post.contentKo}
                    </p>
                    {post.contentKo.length > 200 && (
                      <button 
                        onClick={() => router.push(`/community/post/${post.id}`)}
                        className="text-gray-500 hover:underline text-sm mt-1"
                      >
                        더 보기
                      </button>
                    )}
                  </div>

                  {/* Post Images */}
                  {post.images.length > 0 && (
                    <div className="px-4 pb-3">
                      <div className="grid grid-cols-2 gap-2">
                        {post.images.slice(0, 4).map((image, index) => (
                          <img 
                            key={index}
                            src={image} 
                            alt={`Post image ${index + 1}`}
                            className="w-full h-40 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Post Stats */}
                  <div className="px-4 py-2 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>좋아요 {post.likes}개</span>
                        <span>댓글 {post.comments}개</span>
                        <span>공유 {post.shares}회</span>
                      </div>
                      <span>조회수 {post.views}회</span>
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className="px-4 py-2 border-t border-gray-200">
                    <div className="flex items-center justify-around">
                      <button 
                        onClick={() => handleLikeToggle(post.id)}
                        className={`flex items-center justify-center space-x-2 px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors flex-1 ${
                          post.isLiked ? 'text-blue-600' : 'text-gray-600'
                        }`}
                      >
                        <ThumbsUp className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`} />
                        <span className="font-medium text-sm">좋아요</span>
                      </button>
                      <button 
                        onClick={() => router.push(`/community/post/${post.id}`)}
                        className="flex items-center justify-center space-x-2 px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors flex-1 text-gray-600"
                      >
                        <MessageSquare className="h-5 w-5" />
                        <span className="font-medium text-sm">댓글 달기</span>
                      </button>
                      <button className="flex items-center justify-center space-x-2 px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors flex-1 text-gray-600">
                        <Share2 className="h-5 w-5" />
                        <span className="font-medium text-sm">공유하기</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Load More Button */}
            {!loading && totalPages > 1 && currentPage < totalPages && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-6 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                >
                  더 보기
                </button>
              </div>
            )}
          </div>
      </FacebookLayout>
    </>
  );
}