import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { 
  BarChart3, 
  Building, 
  Users, 
  MessageCircle, 
  TrendingUp,
  Eye,
  Calendar,
  DollarSign,
  Clock,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState('7days');
  const { stats, recentActivities, isLoading, error, refresh } = useDashboardStats(dateRange);

  const quickActions = [
    { title: '매물 승인', description: '대기중인 매물 검토', count: 8, color: 'bg-blue-500', url: '/admin/properties' },
    { title: '문의 답변', description: '답변 대기중인 문의', count: 5, color: 'bg-green-500', url: '/admin/messages' },
    { title: '사용자 관리', description: '신규 가입자 확인', count: 12, color: 'bg-purple-500', url: '/admin/users' },
    { title: '메뉴 관리', description: '사이트 메뉴 설정', count: 0, color: 'bg-orange-500', url: '/admin/menu' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'success': return 'bg-green-100 text-green-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'property': return <Building className="h-4 w-4" />;
      case 'user': return <Users className="h-4 w-4" />;
      case 'inquiry': return <MessageCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <AdminLayout
      title="관리자 대시보드"
      description="Philippines Rental 관리자 대시보드"
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-600 mt-2">Philippines Rental 관리 현황</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={refresh}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="7days">최근 7일</option>
            <option value="30days">최근 30일</option>
            <option value="90days">최근 90일</option>
          </select>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">총 매물</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
              <p className="text-xs text-green-600 mt-1">활성: {stats.activeProperties}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">총 사용자</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              <p className="text-xs text-green-600 mt-1">신규: +{stats.newUsers}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">문의</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInquiries}</p>
              <p className="text-xs text-red-600 mt-1">미답변: {stats.newInquiries}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <MessageCircle className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">월 수익</p>
              <p className="text-2xl font-bold text-gray-900">₱{stats.monthlyRevenue.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">+{stats.revenueGrowth}%</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 빠른 작업 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">빠른 작업</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <a
                  key={index}
                  href={action.url}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <div className="w-6 h-6 text-white">
                        {action.title === '매물 승인' && <Building className="h-6 w-6" />}
                        {action.title === '문의 답변' && <MessageCircle className="h-6 w-6" />}
                        {action.title === '사용자 관리' && <Users className="h-6 w-6" />}
                        {action.title === '메뉴 관리' && <BarChart3 className="h-6 w-6" />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                    {action.count > 0 && (
                      <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {action.count}
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* 최근 활동 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">최근 활동</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                    {getStatusIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button className="w-full text-sm text-primary hover:text-blue-700 font-medium">
                모든 활동 보기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 추가 정보 */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">인기 지역</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">마닐라</span>
              <span className="text-sm font-medium text-gray-900">45 매물</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">세부</span>
              <span className="text-sm font-medium text-gray-900">38 매물</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">보라카이</span>
              <span className="text-sm font-medium text-gray-900">22 매물</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">시스템 상태</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">웹사이트</span>
              <span className="text-sm font-medium text-green-600">정상</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">데이터베이스</span>
              <span className="text-sm font-medium text-green-600">정상</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">백업</span>
              <span className="text-sm font-medium text-green-600">최신</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}