import { useState } from 'react';
import Head from 'next/head';
import AdRequestCard, { AdRequest } from '@/components/admin/AdRequestCard';
import { 
  BarChart3, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Target,
  Search,
  Filter
} from 'lucide-react';

// Mock ad requests data
const mockAdRequests: AdRequest[] = [
  {
    id: 'ad-001',
    companyName: '한국마트 Manila',
    contactName: 'Kim Min-soo',
    email: 'marketing@koreanmart.ph',
    phone: '+63 917 123 4567',
    adType: 'banner',
    position: 'left',
    budget: 15000,
    duration: 30,
    targetAudience: 'Korean residents in Manila',
    adContent: {
      title: '🇰🇷 한국마트',
      description: '김치, 라면, 한국식품 배송',
      linkUrl: 'https://koreanmart.ph',
      buttonText: '주문하기'
    },
    status: 'pending',
    submittedAt: '2024-01-15T09:30:00Z'
  },
  {
    id: 'ad-002',
    companyName: 'Globe Telecom',
    contactName: 'Maria Santos',
    email: 'partnerships@globe.com.ph',
    phone: '+63 905 987 6543',
    adType: 'featured',
    position: 'right',
    budget: 50000,
    duration: 60,
    targetAudience: 'All foreign residents',
    adContent: {
      title: '📱 Globe',
      description: '외국인 전용 요금제 50% 할인',
      linkUrl: 'https://globe.com.ph/expat-plans',
      buttonText: '가입하기'
    },
    status: 'approved',
    submittedAt: '2024-01-14T14:15:00Z',
    reviewedAt: '2024-01-14T16:30:00Z',
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-03-15T23:59:59Z',
    notes: 'Approved for premium placement'
  },
  {
    id: 'ad-003',
    companyName: 'ABC Moving Services',
    contactName: 'John Cruz',
    email: 'info@abcmoving.ph',
    phone: '+63 912 345 6789',
    adType: 'banner',
    position: 'left',
    budget: 8000,
    duration: 15,
    targetAudience: 'People looking for moving services',
    adContent: {
      title: '🚚 이사업체',
      description: '안전하고 빠른 이사 서비스',
      linkUrl: 'https://abcmoving.ph',
      buttonText: '견적 문의'
    },
    status: 'active',
    submittedAt: '2024-01-10T11:20:00Z',
    reviewedAt: '2024-01-10T15:45:00Z',
    startDate: '2024-01-11T00:00:00Z',
    endDate: '2024-01-26T23:59:59Z'
  },
  {
    id: 'ad-004',
    companyName: 'Suspicious Company Inc',
    contactName: 'Fake Name',
    email: 'fake@suspicious.com',
    phone: '+63 900 000 0000',
    adType: 'banner',
    position: 'right',
    budget: 5000,
    duration: 7,
    targetAudience: 'Everyone',
    adContent: {
      title: 'Get Rich Quick!',
      description: 'Make money fast with this trick',
      linkUrl: 'https://suspicious-site.com',
      buttonText: 'Click Now!'
    },
    status: 'rejected',
    submittedAt: '2024-01-12T08:00:00Z',
    reviewedAt: '2024-01-12T09:15:00Z',
    notes: 'Rejected due to suspicious content and unrealistic claims'
  }
];

const statusTabs = [
  { key: 'all', label: 'All Requests', icon: Target },
  { key: 'pending', label: 'Pending', icon: Clock },
  { key: 'approved', label: 'Approved', icon: CheckCircle },
  { key: 'active', label: 'Active', icon: CheckCircle },
  { key: 'rejected', label: 'Rejected', icon: XCircle },
];

export default function AdManagement() {
  const [adRequests, setAdRequests] = useState<AdRequest[]>(mockAdRequests);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleApprove = async (id: string, notes?: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setAdRequests(prev => prev.map(request => 
      request.id === id 
        ? { 
            ...request, 
            status: 'approved',
            reviewedAt: new Date().toISOString(),
            notes: notes || undefined
          }
        : request
    ));
    
    alert('Ad request approved successfully!');
  };

  const handleReject = async (id: string, notes?: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setAdRequests(prev => prev.map(request => 
      request.id === id 
        ? { 
            ...request, 
            status: 'rejected',
            reviewedAt: new Date().toISOString(),
            notes: notes || undefined
          }
        : request
    ));
    
    alert('Ad request rejected.');
  };

  const filteredAdRequests = adRequests
    .filter(request => {
      if (activeTab === 'all') return true;
      return request.status === activeTab;
    })
    .filter(request => {
      if (!searchTerm) return true;
      return request.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             request.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             request.email.toLowerCase().includes(searchTerm.toLowerCase());
    });

  const getStatusCount = (status: string) => {
    if (status === 'all') return adRequests.length;
    return adRequests.filter(r => r.status === status).length;
  };

  const stats = {
    total: adRequests.length,
    pending: adRequests.filter(r => r.status === 'pending').length,
    approved: adRequests.filter(r => r.status === 'approved').length,
    active: adRequests.filter(r => r.status === 'active').length,
    rejected: adRequests.filter(r => r.status === 'rejected').length,
    totalRevenue: adRequests
      .filter(r => r.status === 'approved' || r.status === 'active')
      .reduce((sum, r) => sum + r.budget, 0)
  };

  return (
    <>
      <Head>
        <title>Ad Management - Philippines Rental Admin</title>
        <meta name="description" content="Manage advertising requests and campaigns" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <a href="/admin" className="text-xl font-bold text-primary">
                  🏠 Philippines Rental - Admin
                </a>
                <span className="text-gray-300">|</span>
                <h1 className="text-lg font-medium text-gray-700">Ad Management</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, Admin</span>
                <button className="text-sm text-gray-600 hover:text-primary">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-card p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-card p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-card p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.approved}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-card p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-card p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.rejected}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-card p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-green-600 text-lg">₱</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ₱{stats.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-card p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Status Tabs */}
              <div className="flex flex-wrap gap-2">
                {statusTabs.map((tab) => {
                  const TabIcon = tab.icon;
                  const count = getStatusCount(tab.key);
                  const isActive = activeTab === tab.key;
                  
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <TabIcon className="h-4 w-4" />
                      <span>{tab.label}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-300 text-gray-700'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search companies, contacts, emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary w-full lg:w-80"
                />
              </div>
            </div>
          </div>

          {/* Ad Requests List */}
          <div className="space-y-6">
            {filteredAdRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">
                  No ad requests found
                </div>
                <div className="text-gray-400 text-sm">
                  {searchTerm 
                    ? 'Try adjusting your search criteria'
                    : 'No requests match the selected status'
                  }
                </div>
              </div>
            ) : (
              filteredAdRequests.map((request) => (
                <AdRequestCard
                  key={request.id}
                  adRequest={request}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))
            )}
          </div>

          {/* Load More Button */}
          {filteredAdRequests.length > 0 && (
            <div className="text-center mt-8">
              <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                Load More Requests
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}