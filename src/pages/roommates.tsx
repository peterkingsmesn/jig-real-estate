import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import FacebookLayout from '@/components/layout/FacebookLayout';
import SEOHead from '@/components/seo/SEOHead';
import SendMessageButton from '@/components/messages/SendMessageButton';

interface RoommatePost {
  id: string;
  title: string;
  description: string;
  location: string;
  priceRange: string;
  roomType: string;
  preferences: string[];
  author: {
    name: string;
    email: string;
    image?: string;
  };
  createdAt: string;
  images: string[];
}

const SAMPLE_POSTS: RoommatePost[] = [
  {
    id: '1',
    title: 'BGC 콘도 룸메이트 구합니다 - 외국인 환영',
    description: '보니파시오 글로벌 시티 내 고급 콘도에서 함께 지낼 룸메이트를 찾고 있습니다. 깨끗하고 조용한 환경을 선호합니다.',
    location: 'BGC, Taguig City',
    priceRange: '₱15,000 - ₱20,000',
    roomType: '개인실',
    preferences: ['금연', '애완동물 불가', '외국인 환영', '직장인'],
    author: {
      name: '김민수',
      email: 'minsu.kim@example.com',
      image: '/images/avatars/user1.jpg'
    },
    createdAt: '2024-01-15T10:30:00Z',
    images: ['/images/roommate1.jpg', '/images/roommate1-2.jpg']
  },
  {
    id: '2',
    title: 'Makati CBD 근처 룸메이트 찾습니다',
    description: '직장인 대상으로 깨끗하고 편안한 공간을 공유할 룸메이트를 찾고 있습니다. 대중교통 접근 용이.',
    location: 'Makati City',
    priceRange: '₱12,000 - ₱18,000',
    roomType: '공용실',
    preferences: ['금연', '조용한 환경', '직장인', '국제적'],
    author: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com'
    },
    createdAt: '2024-01-14T14:20:00Z',
    images: ['/images/roommate2.jpg']
  },
  {
    id: '3',
    title: 'Ortigas 고급 콘도 룸메이트 모집',
    description: '쇼핑몰과 비즈니스 센터가 가까운 콘도에서 함께 지낼 룸메이트를 찾습니다. 국제적인 환경을 원합니다.',
    location: 'Ortigas Center, Pasig',
    priceRange: '₱10,000 - ₱16,000',
    roomType: '개인실',
    preferences: ['애완동물 환영', '다국적', '사교적', '학생/직장인'],
    author: {
      name: 'Tanaka Hiroshi',
      email: 'hiroshi.tanaka@example.com'
    },
    createdAt: '2024-01-13T09:15:00Z',
    images: ['/images/roommate3.jpg']
  }
];

export default function RoommatesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [showPostForm, setShowPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    location: '',
    priceRange: '',
    roomType: '',
    preferences: [] as string[]
  });

  const filteredPosts = SAMPLE_POSTS.filter(post => {
    return (
      (!selectedLocation || post.location.toLowerCase().includes(selectedLocation.toLowerCase())) &&
      (!selectedPriceRange || post.priceRange === selectedPriceRange) &&
      (!selectedRoomType || post.roomType === selectedRoomType)
    );
  });

  const handlePostSubmit = () => {
    if (!session) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    if (!newPost.title || !newPost.description || !newPost.location) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    alert('룸메이트 구하기 게시글이 등록되었습니다!');
    setShowPostForm(false);
    setNewPost({
      title: '',
      description: '',
      location: '',
      priceRange: '',
      roomType: '',
      preferences: []
    });
  };

  const togglePreference = (preference: string) => {
    setNewPost(prev => ({
      ...prev,
      preferences: prev.preferences.includes(preference)
        ? prev.preferences.filter(p => p !== preference)
        : [...prev.preferences, preference]
    }));
  };

  return (
    <>
      <SEOHead
        title="룸메이트 구하기 - 필직"
        description="필리핀에서 함께 지낼 룸메이트를 찾아보세요. 다양한 지역과 조건의 룸메이트 매칭 서비스"
        keywords="룸메이트, 하우스메이트, 필리핀, 마닐라, 세부, 쉐어하우스, 필직"
      />

      <FacebookLayout>
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">룸메이트 구하기</h1>
                <p className="text-gray-600">필리핀에서 함께 지낼 룸메이트를 찾아보세요</p>
              </div>
              <button
                onClick={() => setShowPostForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>룸메이트 구하기 글쓰기</span>
              </button>
            </div>
          </div>

          {/* 필터 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">필터</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">지역</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">전체 지역</option>
                  <option value="BGC">BGC</option>
                  <option value="Makati">Makati</option>
                  <option value="Ortigas">Ortigas</option>
                  <option value="Alabang">Alabang</option>
                  <option value="Quezon City">Quezon City</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">가격대</label>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">전체 가격대</option>
                  <option value="₱10,000 - ₱16,000">₱10,000 - ₱16,000</option>
                  <option value="₱12,000 - ₱18,000">₱12,000 - ₱18,000</option>
                  <option value="₱15,000 - ₱20,000">₱15,000 - ₱20,000</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">방 타입</label>
                <select
                  value={selectedRoomType}
                  onChange={(e) => setSelectedRoomType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">전체 타입</option>
                  <option value="개인실">개인실</option>
                  <option value="공용실">공용실</option>
                </select>
              </div>
            </div>
          </div>

          {/* 룸메이트 목록 */}
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700">{post.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700">{post.priceRange}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        <span className="text-sm text-gray-700">{post.roomType}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">선호 조건</h4>
                      <div className="flex flex-wrap gap-2">
                        {post.preferences.map((pref, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {pref}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {post.author.image ? (
                          <img
                            src={post.author.image}
                            alt={post.author.name}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-800">{post.author.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                          </p>
                        </div>
                      </div>
                      <SendMessageButton
                        recipientEmail={post.author.email}
                        recipientName={post.author.name}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 게시글 작성 모달 */}
          {showPostForm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800">룸메이트 구하기 글쓰기</h3>
                  <button
                    onClick={() => setShowPostForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handlePostSubmit(); }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
                    <input
                      type="text"
                      value={newPost.title}
                      onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="룸메이트 구하기 제목을 입력하세요"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">상세 설명 *</label>
                    <textarea
                      value={newPost.description}
                      onChange={(e) => setNewPost(prev => ({ ...prev, description: e.target.value }))}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="룸메이트 조건, 생활 스타일, 기타 정보를 입력하세요"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">지역 *</label>
                      <input
                        type="text"
                        value={newPost.location}
                        onChange={(e) => setNewPost(prev => ({ ...prev, location: e.target.value }))}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="예: BGC, Makati City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">가격대</label>
                      <input
                        type="text"
                        value={newPost.priceRange}
                        onChange={(e) => setNewPost(prev => ({ ...prev, priceRange: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="예: ₱15,000 - ₱20,000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">방 타입</label>
                    <select
                      value={newPost.roomType}
                      onChange={(e) => setNewPost(prev => ({ ...prev, roomType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">선택하세요</option>
                      <option value="개인실">개인실</option>
                      <option value="공용실">공용실</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">선호 조건</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['금연', '애완동물 불가', '애완동물 환영', '외국인 환영', '직장인', '학생', '조용한 환경', '사교적'].map((pref) => (
                        <label key={pref} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newPost.preferences.includes(pref)}
                            onChange={() => togglePreference(pref)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{pref}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowPostForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      게시글 등록
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </FacebookLayout>
    </>
  );
}