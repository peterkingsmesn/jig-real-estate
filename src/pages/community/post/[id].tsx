import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '@/components/layout/PortalLayout';
import SEOHead from '@/components/seo/SEOHead';
import { 
  ArrowLeft, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Clock, 
  MapPin,
  MoreVertical,
  Send
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

interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  replies: Reply[];
}

interface Reply {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

export default function PostDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (id) {
      fetchPostDetail();
    }
  }, [id]);

  const fetchPostDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/community/posts/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setPost(data.data.post);
        setComments(data.data.comments);
      }
    } catch (error) {
      console.error('Failed to fetch post detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = () => {
    if (!post) return;
    setPost({
      ...post,
      isLiked: !post.isLiked,
      likes: post.isLiked ? post.likes - 1 : post.likes + 1
    });
  };

  const handleBookmarkToggle = () => {
    if (!post) return;
    setPost({
      ...post,
      isBookmarked: !post.isBookmarked
    });
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      author: {
        id: 'current_user',
        name: '현재 사용자',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        verified: false
      },
      content: commentText,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      replies: []
    };

    setComments([newComment, ...comments]);
    setCommentText('');
    if (post) {
      setPost({ ...post, comments: post.comments + 1 });
    }
  };

  const handleReplySubmit = (commentId: string) => {
    if (!replyText.trim()) return;

    const newReply: Reply = {
      id: `reply_${Date.now()}`,
      author: {
        id: 'current_user',
        name: '현재 사용자',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        verified: false
      },
      content: replyText,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false
    };

    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, replies: [...comment.replies, newReply] }
        : comment
    ));
    setReplyText('');
    setReplyTo(null);
  };

  const handleCommentLike = (commentId: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          }
        : comment
    ));
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;
    if (diffInSeconds < 2628000) return `${Math.floor(diffInSeconds / 604800)}주 전`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2628000)}개월 전`;
    return `${Math.floor(diffInSeconds / 31536000)}년 전`;
  };

  if (loading) {
    return (
      <PortalLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </PortalLayout>
    );
  }

  if (!post) {
    return (
      <PortalLayout>
        <div className="text-center py-16">
          <p className="text-gray-600">게시글을 찾을 수 없습니다.</p>
          <button
            onClick={() => router.push('/community')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            커뮤니티로 돌아가기
          </button>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <SEOHead
        title={`${post.titleKo} | 필리핀 한인 커뮤니티`}
        description={post.contentKo.substring(0, 160)}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>돌아가기</span>
        </button>

        {/* Post Content */}
        <article className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          {/* Post Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                    {post.author.verified && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{post.author.location}</span>
                    <span>•</span>
                    <Clock className="h-4 w-4" />
                    <span>{getRelativeTime(post.createdAt)}</span>
                    <span>•</span>
                    <span>{post.views} 조회</span>
                  </div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">{post.titleKo}</h1>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Post Body */}
          <div className="p-6">
            <div className="prose max-w-none text-gray-800 whitespace-pre-wrap">
              {post.contentKo}
            </div>

            {/* Images */}
            {post.images.length > 0 && (
              <div className="mt-6 space-y-4">
                {post.images.map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`이미지 ${index + 1}`}
                    className="w-full rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Post Actions */}
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button 
                  onClick={handleLikeToggle}
                  className={`flex items-center space-x-2 ${post.isLiked ? 'text-red-600' : 'text-gray-600'} hover:text-red-600 transition-colors`}
                >
                  <ThumbsUp className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span className="font-medium">{post.likes}</span>
                </button>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MessageSquare className="h-5 w-5" />
                  <span className="font-medium">{post.comments}</span>
                </div>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
                  <Share2 className="h-5 w-5" />
                  <span className="font-medium">{post.shares}</span>
                </button>
              </div>
              <button 
                onClick={handleBookmarkToggle}
                className={`${post.isBookmarked ? 'text-yellow-600' : 'text-gray-600'} hover:text-yellow-600 transition-colors`}
              >
                <Bookmark className={`h-5 w-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </article>

        {/* Comment Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">댓글 작성</h2>
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="댓글을 입력하세요..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
            />
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>댓글 달기</span>
              </button>
            </div>
          </form>
        </div>

        {/* Comments Section */}
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start space-x-3">
                <img 
                  src={comment.author.avatar} 
                  alt={comment.author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{comment.author.name}</h4>
                    {comment.author.verified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    <span className="text-sm text-gray-500">{getRelativeTime(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-800 mb-3">{comment.content}</p>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleCommentLike(comment.id)}
                      className={`flex items-center space-x-1 text-sm ${comment.isLiked ? 'text-red-600' : 'text-gray-600'} hover:text-red-600 transition-colors`}
                    >
                      <ThumbsUp className={`h-4 w-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                      <span>{comment.likes}</span>
                    </button>
                    <button
                      onClick={() => setReplyTo(comment.id)}
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      답글
                    </button>
                  </div>

                  {/* Reply Form */}
                  {replyTo === comment.id && (
                    <div className="mt-4">
                      <div className="flex space-x-3">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="답글을 입력하세요..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          onClick={() => handleReplySubmit(comment.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          답글
                        </button>
                        <button
                          onClick={() => {
                            setReplyTo(null);
                            setReplyText('');
                          }}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="mt-4 space-y-3 ml-8 border-l-2 border-gray-100 pl-4">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="flex items-start space-x-3">
                          <img 
                            src={reply.author.avatar} 
                            alt={reply.author.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h5 className="font-medium text-gray-900 text-sm">{reply.author.name}</h5>
                              {reply.author.verified && (
                                <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              )}
                              <span className="text-xs text-gray-500">{getRelativeTime(reply.createdAt)}</span>
                            </div>
                            <p className="text-gray-700 text-sm">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}