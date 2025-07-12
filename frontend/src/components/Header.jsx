import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow">
      <nav className="container">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600">
              JIG
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              홈
            </Link>
            <Link to="/properties" className="text-gray-700 hover:text-primary-600 transition-colors">
              매물 목록
            </Link>
            {user ? (
              <>
                {(user.role === 'admin' || user.role === 'super_admin') && (
                  <Link to="/admin" className="text-gray-700 hover:text-primary-600 transition-colors">
                    관리자
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="btn-secondary"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary">
                로그인
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
                홈
              </Link>
              <Link to="/properties" className="text-gray-700 hover:text-primary-600 transition-colors">
                매물 목록
              </Link>
              {user ? (
                <>
                  {(user.role === 'admin' || user.role === 'super_admin') && (
                    <Link to="/admin" className="text-gray-700 hover:text-primary-600 transition-colors">
                      관리자
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-left text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
                  로그인
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;