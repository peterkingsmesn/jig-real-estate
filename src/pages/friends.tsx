import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import FacebookLayout from '@/components/layout/FacebookLayout';
import SEOHead from '@/components/seo/SEOHead';
import SendMessageButton from '@/components/messages/SendMessageButton';

interface FriendPost {
  id: string;
  title: string;
  description: string;
  location: string;
  interests: string[];
  languages: string[];
  nationality: string;
  age: string;
  gender: string;
  author: {
    name: string;
    email: string;
    image?: string;
  };
  createdAt: string;
  contactPreference: string;
}

const SAMPLE_POSTS: FriendPost[] = [
  {
    id: '1',
    title: '필리핀 문화 체험하고 싶은 한국인입니다',
    description: '필리핀에 온 지 3개월 된 한국인입니다. 현지 문화를 배우고 언어 교환도 하고 싶어요. 함께 맛집 탐방이나 여행도 다녀요!',
    location: 'BGC, Taguig City',
    interests: ['음식', '여행', '문화 체험', '언어 교환'],
    languages: ['Korean', 'English', 'Basic Tagalog'],
    nationality: '한국',
    age: '25-30',
    gender: '남성',
    author: {
      name: '이준호',
      email: 'junho.lee@example.com',
      image: '/images/friends/user1.jpg'
    },
    createdAt: '2024-01-15T10:30:00Z',
    contactPreference: '쪽지'
  },
  {
    id: '2',
    title: 'Looking for Filipino friends to explore Manila!',
    description: 'American expat working in Manila. Love trying local food, visiting museums, and weekend trips. Would love to meet local friends who can show me the best spots!',
    location: 'Makati City',
    interests: ['Food', 'Museums', 'Weekend trips', 'Local culture'],
    languages: ['English', 'Learning Tagalog'],
    nationality: '미국',
    age: '30-35',
    gender: '여성',
    author: {
      name: 'Jessica Miller',
      email: 'jessica.miller@example.com'
    },
    createdAt: '2024-01-14T14:20:00Z',
    contactPreference: '쪽지'
  },
  {
    id: '3',
    title: '일본인과 친구가 되고 싶어요',
    description: '안녕하세요! 필리핀 사람입니다. 일본 문화에 관심이 많고 일본어를 배우고 있어요. 일본 음식과 애니메이션을 좋아합니다.',
    location: 'Quezon City',
    interests: ['일본 문화', '애니메이션', '일본 음식', '언어 교환'],
    languages: ['Tagalog', 'English', 'Basic Japanese'],
    nationality: '필리핀',
    age: '20-25',
    gender: '여성',
    author: {
      name: 'Maria Santos',
      email: 'maria.santos@example.com'
    },
    createdAt: '2024-01-13T09:15:00Z',
    contactPreference: '쪽지'
  },
  {
    id: '4',
    title: '中国朋友想认识更多国际朋友',
    description: '我是在菲律宾工作的中国人，希望认识更多来自不同国家的朋友。喜欢运动、音乐和旅游。可以用中文、英文交流。',
    location: 'Ortigas Center, Pasig',
    interests: ['운동', '음악', '여행', '국제 친구'],
    languages: ['Chinese', 'English', 'Basic Tagalog'],
    nationality: '중국',
    age: '25-30',
    gender: '남성',
    author: {
      name: 'Chen Wei',
      email: 'chen.wei@example.com'
    },
    createdAt: '2024-01-12T16:45:00Z',
    contactPreference: '쪽지'
  }
];

export default function FriendsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedNationality, setSelectedNationality] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [showPostForm, setShowPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    location: '',
    interests: [] as string[],
    languages: [] as string[],
    nationality: '',
    age: '',
    gender: '',
    contactPreference: '쪽지'
  });

  const filteredPosts = SAMPLE_POSTS.filter(post => {
    return (
      (!selectedLocation || post.location.toLowerCase().includes(selectedLocation.toLowerCase())) &&
      (!selectedNationality || post.nationality === selectedNationality) &&
      (!selectedAge || post.age === selectedAge) &&
      (!selectedGender || post.gender === selectedGender)
    );
  });

  const handlePostSubmit = () => {
    if (!session) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    if (!newPost.title || !newPost.description || !newPost.location || !newPost.nationality) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    alert('친구 찾기 게시글이 등록되었습니다!');
    setShowPostForm(false);
    setNewPost({
      title: '',
      description: '',
      location: '',
      interests: [],
      languages: [],
      nationality: '',
      age: '',
      gender: '',
      contactPreference: '쪽지'
    });
  };

  const toggleInterest = (interest: string) => {
    setNewPost(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const toggleLanguage = (language: string) => {
    setNewPost(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  return (
    <>
      <SEOHead
        title="외국인 친구 사귀기 - 필직"
        description="필리핀에서 다양한 국적의 친구들과 만나보세요. 언어 교환, 문화 체험, 친구 만들기"
        keywords="외국인 친구, 국제 친구, 언어 교환, 문화 체험, 필리핀, 필직"
      />

      <FacebookLayout>
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">외국인 친구 사귀기</h1>
                <p className="text-gray-600">다양한 국적의 친구들과 만나 문화를 교류해보세요</p>
              </div>
              <button
                onClick={() => setShowPostForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>친구 찾기 글쓰기</span>
              </button>
            </div>
          </div>

          {/* 필터 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">필터</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <option value="Quezon City">Quezon City</option>
                  <option value="Alabang">Alabang</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">국적</label>
                <select
                  value={selectedNationality}
                  onChange={(e) => setSelectedNationality(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">전체 국적</option>
                  <option value="한국">한국</option>
                  <option value="일본">일본</option>
                  <option value="중국">중국</option>
                  <option value="미국">미국</option>
                  <option value="필리핀">필리핀</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">나이</label>
                <select
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">전체 나이</option>
                  <option value="20-25">20-25세</option>
                  <option value="25-30">25-30세</option>
                  <option value="30-35">30-35세</option>
                  <option value="35-40">35-40세</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">성별</label>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">전체</option>
                  <option value="남성">남성</option>
                  <option value="여성">여성</option>
                </select>
              </div>
            </div>
          </div>

          {/* 친구 찾기 목록 */}
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
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700">{post.nationality} • {post.age}세 • {post.gender}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">관심사</h4>
                      <div className="flex flex-wrap gap-2">
                        {post.interests.map((interest, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">사용 언어</h4>
                      <div className="flex flex-wrap gap-2">
                        {post.languages.map((language, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {language}
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
                  <h3 className="text-lg font-medium text-gray-800">친구 찾기 글쓰기</h3>
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
                      placeholder="친구 찾기 제목을 입력하세요"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">자기소개 *</label>
                    <textarea
                      value={newPost.description}
                      onChange={(e) => setNewPost(prev => ({ ...prev, description: e.target.value }))}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="자신에 대해 소개하고 어떤 친구를 찾고 있는지 설명해주세요"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">국적 *</label>
                      <select
                        value={newPost.nationality}
                        onChange={(e) => setNewPost(prev => ({ ...prev, nationality: e.target.value }))}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">선택하세요</option>
                        <option value="한국">한국</option>
                        <option value="일본">일본</option>
                        <option value="중국">중국</option>
                        <option value="미국">미국</option>
                        <option value="필리핀">필리핀</option>
                        <option value="기타">기타</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">나이대</label>
                      <select
                        value={newPost.age}
                        onChange={(e) => setNewPost(prev => ({ ...prev, age: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">선택하세요</option>
                        <option value="20-25">20-25세</option>
                        <option value="25-30">25-30세</option>
                        <option value="30-35">30-35세</option>
                        <option value="35-40">35-40세</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
                      <select
                        value={newPost.gender}
                        onChange={(e) => setNewPost(prev => ({ ...prev, gender: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">선택하세요</option>
                        <option value="남성">남성</option>
                        <option value="여성">여성</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">관심사</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['음식', '여행', '문화 체험', '언어 교환', '운동', '음악', '영화', '쇼핑'].map((interest) => (
                        <label key={interest} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newPost.interests.includes(interest)}
                            onChange={() => toggleInterest(interest)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{interest}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">사용 언어</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Korean', 'English', 'Chinese', 'Japanese', 'Tagalog', 'Spanish'].map((language) => (
                        <label key={language} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newPost.languages.includes(language)}
                            onChange={() => toggleLanguage(language)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{language}</span>
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