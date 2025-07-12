import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import FacebookLayout from '@/components/layout/FacebookLayout';
import SEOHead from '@/components/seo/SEOHead';

interface PropertySubmission {
  id: string;
  title: string;
  description: string;
  type: 'house' | 'condo' | 'village';
  region: string;
  city: string;
  district: string;
  address: string;
  price: number;
  deposit: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  floor?: number;
  furnished: boolean;
  amenities: string[];
  contactName: string;
  whatsapp: string;
  email: string;
  phone: string;
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export default function PropertyApprovalsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [pendingProperties, setPendingProperties] = useState<PropertySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<PropertySubmission | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }

    // 관리자 권한 확인 (실제로는 세션에서 role 확인)
    // if (session.user?.role !== 'admin') {
    //   router.push('/');
    //   return;
    // }

    fetchPendingProperties();
  }, [session, router]);

  const fetchPendingProperties = async () => {
    try {
      const response = await fetch('/api/admin/pending-properties');
      if (response.ok) {
        const data = await response.json();
        setPendingProperties(data.properties || []);
      }
    } catch (error) {
      console.error('Error fetching pending properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (propertyId: string) => {
    try {
      const response = await fetch('/api/admin/approve-property', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId })
      });

      if (response.ok) {
        alert('매물이 승인되었습니다.');
        fetchPendingProperties();
      } else {
        alert('승인 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error approving property:', error);
      alert('승인 처리 중 오류가 발생했습니다.');
    }
  };

  const handleReject = async (propertyId: string) => {
    if (!rejectionReason.trim()) {
      alert('거부 사유를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('/api/admin/reject-property', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId, reason: rejectionReason })
      });

      if (response.ok) {
        alert('매물이 거부되었습니다.');
        setSelectedProperty(null);
        setRejectionReason('');
        fetchPendingProperties();
      } else {
        alert('거부 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error rejecting property:', error);
      alert('거부 처리 중 오류가 발생했습니다.');
    }
  };

  if (!session) {
    return (
      <FacebookLayout>
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">접근 권한이 없습니다</h1>
          <p className="text-gray-600">이 페이지는 관리자만 접근할 수 있습니다.</p>
        </div>
      </FacebookLayout>
    );
  }

  return (
    <>
      <SEOHead
        title="매물 승인 관리 - 필직 Admin"
        description="등록된 매물을 검토하고 승인하는 관리자 페이지"
        keywords="관리자, 매물승인, 부동산관리"
      />

      <FacebookLayout>
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">매물 승인 관리</h1>
            <p className="text-gray-600 mb-6">
              등록된 매물을 검토하고 승인 또는 거부할 수 있습니다.
            </p>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">로딩 중...</p>
              </div>
            ) : pendingProperties.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <h3 className="text-lg font-medium text-gray-800 mb-2">승인 대기 중인 매물이 없습니다</h3>
                <p className="text-gray-600">새로운 매물 등록을 기다려주세요.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingProperties.map((property) => (
                  <div key={property.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{property.title}</h3>
                        <p className="text-sm text-gray-500">
                          등록자: {property.submittedBy} | 
                          등록일: {new Date(property.submittedAt).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        승인 대기
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">기본 정보</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li><strong>유형:</strong> {property.type}</li>
                          <li><strong>위치:</strong> {property.region}, {property.city}</li>
                          <li><strong>주소:</strong> {property.address}</li>
                          <li><strong>면적:</strong> {property.area}㎡</li>
                          <li><strong>방/욕실:</strong> {property.bedrooms}개/{property.bathrooms}개</li>
                          <li><strong>가구:</strong> {property.furnished ? '포함' : '미포함'}</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">가격 및 연락처</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li><strong>월세:</strong> ₱{property.price.toLocaleString()}</li>
                          <li><strong>보증금:</strong> ₱{property.deposit.toLocaleString()}</li>
                          <li><strong>담당자:</strong> {property.contactName}</li>
                          <li><strong>WhatsApp:</strong> {property.whatsapp}</li>
                          {property.email && <li><strong>이메일:</strong> {property.email}</li>}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium text-gray-800 mb-2">설명</h4>
                      <p className="text-sm text-gray-600">{property.description}</p>
                    </div>

                    {property.amenities.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-800 mb-2">편의시설</h4>
                        <div className="flex flex-wrap gap-2">
                          {property.amenities.map((amenity) => (
                            <span
                              key={amenity}
                              className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        onClick={() => setSelectedProperty(property)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        거부
                      </button>
                      <button
                        onClick={() => handleApprove(property.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        승인
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 거부 사유 입력 모달 */}
        {selectedProperty && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-medium text-gray-800 mb-4">매물 거부</h3>
              <p className="text-sm text-gray-600 mb-4">
                <strong>{selectedProperty.title}</strong>을(를) 거부하는 이유를 입력해주세요.
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="거부 사유를 입력하세요..."
              />
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setSelectedProperty(null);
                    setRejectionReason('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={() => handleReject(selectedProperty.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  거부
                </button>
              </div>
            </div>
          </div>
        )}
      </FacebookLayout>
    </>
  );
}