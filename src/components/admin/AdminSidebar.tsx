import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  Home, 
  Settings, 
  Users, 
  FileText, 
  BarChart3, 
  Menu as MenuIcon, 
  Building, 
  MessageCircle,
  Shield,
  Calendar,
  ChevronRight,
  X,
  ExternalLink,
  Plus,
  Upload,
  Layout
} from 'lucide-react';

interface AdminSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

interface MenuItem {
  id: string;
  title: string;
  icon: any;
  url: string;
  description: string;
  submenu?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    title: '대시보드',
    icon: BarChart3,
    url: '/admin',
    description: '전체 현황 및 통계'
  },
  {
    id: 'properties',
    title: '매물 관리',
    icon: Building,
    url: '/admin/properties',
    description: '매물 승인 및 관리',
    submenu: [
      {
        id: 'property-add',
        title: '새 매물 등록',
        icon: Plus,
        url: '/admin/property-add',
        description: '템플릿으로 매물 등록'
      },
      {
        id: 'property-import',
        title: 'Facebook 가져오기',
        icon: Upload,
        url: '/admin/property-import',
        description: 'Facebook 포스트 임포트'
      }
    ]
  },
  {
    id: 'templates',
    title: '템플릿 관리',
    icon: Layout,
    url: '/admin/templates',
    description: '매물 등록 템플릿 관리'
  },
  {
    id: 'users',
    title: '사용자 관리',
    icon: Users,
    url: '/admin/users',
    description: '회원 및 집주인 관리'
  },
  {
    id: 'menu',
    title: '메뉴 관리',
    icon: MenuIcon,
    url: '/admin/menu',
    description: '사이트 메뉴 설정'
  },
  {
    id: 'messages',
    title: '문의 관리',
    icon: MessageCircle,
    url: '/admin/messages',
    description: '고객 문의 답변'
  },
  {
    id: 'monthly-stay',
    title: '한달살기 관리',
    icon: Calendar,
    url: '/admin/monthly-stay',
    description: '한달살기 매물 관리'
  },
  {
    id: 'settings',
    title: '사이트 설정',
    icon: Settings,
    url: '/admin/settings',
    description: '기본 설정 및 환경설정'
  }
];

export default function AdminSidebar({ isCollapsed = false, onToggle }: AdminSidebarProps) {
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentPath = mounted ? router.pathname : '';

  const handleNavigation = (url: string) => {
    router.push(url);
    setIsMobileOpen(false);
  };

  const isActive = (url: string) => {
    if (!mounted) return false;
    if (url === '/admin') {
      return currentPath === '/admin';
    }
    return currentPath.startsWith(url);
  };

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      {mounted && (
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-lg shadow-lg"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white shadow-xl border-r border-gray-200 z-50
        transition-all duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static
        ${isCollapsed ? 'lg:w-20' : 'lg:w-80'}
        w-80
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-3 ${isCollapsed ? 'lg:justify-center' : ''}`}>
              <div className="p-2 bg-primary rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-xl font-bold text-gray-900">관리자 모드</h1>
                  <p className="text-sm text-gray-600">Philippines Rental</p>
                </div>
              )}
            </div>
            
            {/* Close button (mobile) */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.url);
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isExpanded = expandedMenus.includes(item.id);
              
              return (
                <div key={item.id}>
                  <button
                    onClick={() => {
                      if (hasSubmenu && !isCollapsed) {
                        toggleSubmenu(item.id);
                      } else {
                        handleNavigation(item.url);
                      }
                    }}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-xl
                      transition-all duration-200 text-left
                      ${active 
                        ? 'bg-primary text-white shadow-md' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                      ${isCollapsed ? 'lg:justify-center lg:px-2' : ''}
                    `}
                  >
                    <Icon className={`h-5 w-5 ${active ? 'text-white' : 'text-gray-500'}`} />
                    {!isCollapsed && (
                      <>
                        <div className="flex-1">
                          <div className="font-medium">{item.title}</div>
                          <div className={`text-xs ${active ? 'text-blue-100' : 'text-gray-400'}`}>
                            {item.description}
                          </div>
                        </div>
                        {hasSubmenu ? (
                          <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''} ${active ? 'text-white' : 'text-gray-400'}`} />
                        ) : active && (
                          <ChevronRight className="h-4 w-4 text-white" />
                        )}
                      </>
                    )}
                  </button>

                  {/* Submenu */}
                  {hasSubmenu && !isCollapsed && isExpanded && item.submenu && (
                    <div className="ml-4 mt-2 space-y-1">
                      {item.submenu.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const subActive = isActive(subItem.url);
                        
                        return (
                          <button
                            key={subItem.id}
                            onClick={() => handleNavigation(subItem.url)}
                            className={`
                              w-full flex items-center space-x-3 px-3 py-2 rounded-lg
                              transition-all duration-200 text-left text-sm
                              ${subActive 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }
                            `}
                          >
                            <SubIcon className={`h-4 w-4 ${subActive ? 'text-blue-600' : 'text-gray-400'}`} />
                            <div className="flex-1">
                              <div className="font-medium">{subItem.title}</div>
                              <div className={`text-xs ${subActive ? 'text-blue-600' : 'text-gray-400'}`}>
                                {subItem.description}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => router.push('/')}
            className={`
              w-full flex items-center space-x-3 px-4 py-3 rounded-xl
              text-gray-600 hover:bg-gray-50 hover:text-gray-900
              transition-all duration-200
              ${isCollapsed ? 'lg:justify-center lg:px-2' : ''}
            `}
          >
            <Home className="h-5 w-5" />
            {!isCollapsed && (
              <>
                <span className="font-medium">사이트로 돌아가기</span>
                <ExternalLink className="h-4 w-4 ml-auto" />
              </>
            )}
          </button>
          
          {!isCollapsed && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 text-center">
                <p>Philippines Rental Admin</p>
                <p className="mt-1">v1.0.0</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle (desktop) */}
      {mounted && onToggle && (
        <button
          onClick={onToggle}
          className="hidden lg:block fixed top-6 left-6 z-30 p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          style={{ left: isCollapsed ? '90px' : '320px' }}
        >
          <MenuIcon className="h-5 w-5 text-gray-600" />
        </button>
      )}
    </>
  );
}