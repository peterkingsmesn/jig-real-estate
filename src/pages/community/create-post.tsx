import { useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '@/components/layout/PortalLayout';
import SEOHead from '@/components/seo/SEOHead';
import { ArrowLeft, Image, MapPin, Tag, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CreatePost() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    group: '',
    tags: [] as string[],
    images: [] as File[],
    anonymous: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const categories = [
    { id: 'general', name: '일반', nameEn: 'General', icon: '💬' },
    { id: 'questions', name: '질문', nameEn: 'Questions', icon: '❓' },
    { id: 'housing', name: '주거정보', nameEn: 'Housing Info', icon: '🏠' },
    { id: 'jobs', name: '구인구직', nameEn: 'Jobs', icon: '💼' },
    { id: 'buy-sell', name: '중고거래', nameEn: 'Buy & Sell', icon: '🛒' },
    { id: 'events', name: '이벤트', nameEn: 'Events', icon: '🎉' },
    { id: 'life', name: '일상생활', nameEn: 'Daily Life', icon: '☕' },
    { id: 'tips', name: '팁과 정보', nameEn: 'Tips & Info', icon: '💡' }
  ];

  const groups = [
    { id: 'manila-korean', name: '마닐라 한인회', nameEn: 'Manila Korean Community' },
    { id: 'angeles-korean', name: '앙헬레스 한인회', nameEn: 'Angeles Korean Community' },
    { id: 'cebu-korean', name: '세부 한인회', nameEn: 'Cebu Korean Community' },
    { id: 'business-owners', name: '사업자 모임', nameEn: 'Business Owners' },
    { id: 'students', name: '유학생 모임', nameEn: 'Students' },
    { id: 'moms', name: '필리핀 맘카페', nameEn: 'Filipino Moms' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('제목과 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/community/create-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          category: formData.category,
          tags: formData.tags
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('게시글이 작성되었습니다!');
        router.push('/community?posted=true');
      } else {
        throw new Error(data.error || 'Failed to create post');
      }
    } catch (error) {
      toast.error('게시글 작성에 실패했습니다. 다시 시도해주세요.');
      console.error('Post creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <PortalLayout>
      <SEOHead
        title="게시글 작성 | 필리핀 한인 커뮤니티"
        description="필리핀 한인 커뮤니티에 새로운 게시글을 작성하세요"
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>돌아가기</span>
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">
            {(currentLanguage as string) === 'ko' ? '새 게시글 작성' : 'Create New Post'}
          </h1>
          <p className="text-gray-600 mt-2">
            {(currentLanguage as string) === 'ko' 
              ? '커뮤니티 회원들과 정보를 공유하세요' 
              : 'Share information with community members'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="게시글 제목을 입력하세요"
              maxLength={100}
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.title.length}/100
            </p>
          </div>

          {/* Category and Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {(currentLanguage as string) === 'ko' ? cat.name : cat.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                그룹 (선택사항)
              </label>
              <select
                value={formData.group}
                onChange={(e) => setFormData(prev => ({ ...prev, group: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">그룹 선택</option>
                {groups.map(group => (
                  <option key={group.id} value={group.id}>
                    {(currentLanguage as string) === 'ko' ? group.name : group.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용 *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={10}
              placeholder="내용을 입력하세요..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              태그 (최대 5개)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center space-x-2"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="태그를 입력하고 Enter를 누르세요"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const input = e.currentTarget;
                  addTag(input.value.trim());
                  input.value = '';
                }
              }}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이미지 첨부 (선택사항)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <Image className="h-12 w-12 text-gray-400 mb-2" />
                <span className="text-gray-600">클릭하여 이미지를 업로드하세요</span>
                <span className="text-sm text-gray-500 mt-1">최대 5장, 각 5MB 이하</span>
              </label>
            </div>
            
            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-4">
                {formData.images.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={formData.anonymous}
              onChange={(e) => setFormData(prev => ({ ...prev, anonymous: e.target.checked }))}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="anonymous" className="text-sm text-gray-700">
              익명으로 작성하기
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>게시 중...</span>
                </>
              ) : (
                <span>게시하기</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </PortalLayout>
  );
}