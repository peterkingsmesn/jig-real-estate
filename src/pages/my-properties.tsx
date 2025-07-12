import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import FacebookLayout from '@/components/layout/FacebookLayout';
import SEOHead from '@/components/seo/SEOHead';

interface UserProperty {
  id: string;
  title: string;
  type: 'house' | 'condo' | 'village';
  region: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  status: 'pending' | 'approved' | 'rejected' | 'active';
  createdAt: string;
  updatedAt: string;
  views: number;
  inquiries: number;
  rejectionReason?: string;
}

export default function MyPropertiesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [properties, setProperties] = useState<UserProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }

    // 사용자 매물 로드 (실제로는 API에서 가져옴)
    setProperties([
      {
        id: '1',
        title: 'BGC 모던 2베드룸 콘도',
        type: 'condo',
        region: 'Metro Manila',
        city: 'Taguig',
        price: 45000,
        bedrooms: 2,
        bathrooms: 2,
        area: 65,
        status: 'approved',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        views: 156,
        inquiries: 8
      },
      {
        id: '2',
        title: '마카티 원룸 스튜디오',
        type: 'condo',
        region: 'Metro Manila',
        city: 'Makati',
        price: 25000,
        bedrooms: 1,
        bathrooms: 1,
        area: 35,
        status: 'pending',
        createdAt: '2024-01-20T15:20:00Z',
        updatedAt: '2024-01-20T15:20:00Z',
        views: 0,
        inquiries: 0
      },
      {
        id: '3',
        title: '케손 패밀리 하우스',
        type: 'house',
        region: 'Metro Manila',
        city: 'Quezon City',
        price: 60000,
        bedrooms: 3,
        bathrooms: 3,
        area: 120,
        status: 'rejected',
        createdAt: '2024-01-10T09:15:00Z',
        updatedAt: '2024-01-11T14:30:00Z',
        views: 0,
        inquiries: 0,
        rejectionReason: '연락처 정보가 불완전합니다. WhatsApp 번호를 확인해주세요.'
      }
    ]);
    setLoading(false);
  }, [session, router]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">승인 대기</span>;
      case 'approved':
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">승인됨</span>;
      case 'active':
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">활성</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">거부됨</span>;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      house: '단독주택',
      condo: '콘도미니엄',
      village: '빌리지'
    };
    return types[type] || type;
  };

  if (!session) {
    return (
      <FacebookLayout>
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">로그인이 필요합니다</h1>
          <p className="text-gray-600">내 매물을 보려면 먼저 로그인해주세요.</p>
        </div>
      </FacebookLayout>
    );
  }

  return (
    <>
      <SEOHead
        title="내 매물 - 필직"
        description="내가 등록한 부동산 매물을 확인하고 관리하세요"
        keywords="내매물, 부동산관리, 필직"
      />

      <FacebookLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-800">내 매물</h1>
              <button
                onClick={() => router.push('/properties/add')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>새 매물 등록</span>
              </button>
            </div>

            {/* 통계 요약 */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{properties.length}</div>
                <div className="text-sm text-blue-700">총 매물</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {properties.filter(p => p.status === 'approved' || p.status === 'active').length}
                </div>
                <div className="text-sm text-green-700">승인된 매물</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {properties.filter(p => p.status === 'pending').length}
                </div>
                <div className="text-sm text-yellow-700">승인 대기</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {properties.reduce((sum, p) => sum + p.inquiries, 0)}
                </div>
                <div className="text-sm text-purple-700">총 문의</div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">매물을 불러오는 중...</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-800 mb-2">아직 등록한 매물이 없습니다</h3>
                <p className="text-gray-600 mb-4">첫 번째 매물을 등록해보세요!</p>
                <button
                  onClick={() => router.push('/properties/add')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  매물 등록하기
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {properties.map((property) => (
                  <div key={property.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {getTypeLabel(property.type)}
                        </span>
                        {getStatusBadge(property.status)}
                      </div>
                      <div className="text-sm text-gray-500">
                        등록일: {new Date(property.createdAt).toLocaleDateString('ko-KR')}
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {property.title}
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-600 text-sm mb-1">
                          <span className="font-medium">위치:</span> {property.region}, {property.city}
                        </p>
                        <p className="text-gray-600 text-sm mb-1">
                          <span className="font-medium">면적:</span> {property.area}㎡
                        </p>
                        <p className="text-gray-600 text-sm">
                          <span className="font-medium">방/욕실:</span> {property.bedrooms}개/{property.bathrooms}개
                        </p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600 mb-2">
                          ₱{property.price.toLocaleString()}/월
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            <span>{property.views} 조회</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                            </svg>
                            <span>{property.inquiries} 문의</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 거부 사유 표시 */}
                    {property.status === 'rejected' && property.rejectionReason && (
                      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-700">
                              <strong>거부 사유:</strong> {property.rejectionReason}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end space-x-2">
                      {property.status === 'approved' || property.status === 'active' ? (
                        <>
                          <button
                            onClick={() => router.push(`/properties/${property.id}`)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            보기
                          </button>
                          <button
                            onClick={() => router.push(`/properties/${property.id}/edit`)}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            수정
                          </button>
                        </>
                      ) : property.status === 'rejected' ? (
                        <button
                          onClick={() => router.push(`/properties/${property.id}/edit`)}
                          className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                        >
                          수정 후 재신청
                        </button>
                      ) : (
                        <span className="text-gray-500 text-sm">승인 대기 중</span>
                      )}
                      
                      <button
                        onClick={() => {
                          if (confirm('정말로 이 매물을 삭제하시겠습니까?')) {
                            console.log('Delete property:', property.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </FacebookLayout>
    </>
  );
}