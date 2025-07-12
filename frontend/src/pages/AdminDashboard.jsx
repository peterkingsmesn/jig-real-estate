import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PropertyManagement from '../components/admin/PropertyManagement';
import PropertyForm from '../components/admin/PropertyForm';

const AdminDashboard = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navigation = [
    { name: '대시보드', href: '/admin', exact: true },
    { name: '매물 관리', href: '/admin/properties' },
    { name: '매물 추가', href: '/admin/properties/new' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md">
          <div className="p-6">
            <h2 className="text-lg font-semibold">관리자 패널</h2>
            <p className="text-sm text-gray-600">{user?.name}</p>
          </div>
          <nav className="mt-6">
            {navigation.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.href
                : location.pathname.startsWith(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="properties" element={<PropertyManagement />} />
            <Route path="properties/new" element={<PropertyForm />} />
            <Route path="properties/edit/:id" element={<PropertyForm />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const DashboardHome = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">대시보드</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-2">총 매물</h3>
          <p className="text-3xl font-bold text-primary-600">0</p>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-2">활성 매물</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-2">비활성 매물</h3>
          <p className="text-3xl font-bold text-gray-600">0</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;