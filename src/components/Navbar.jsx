import { Link, useLocation } from 'react-router-dom';
import { Youtube, BarChart3, Search, Home, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/video-analysis', label: 'Video Analysis', icon: Youtube },
    { path: '/channel-analysis', label: 'Channel Analysis', icon: BarChart3 },
    { path: '/video-search', label: 'Video Search', icon: Search },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <Youtube className="h-8 w-8 text-red-600" />
              <h1 className="text-xl font-bold text-gray-900">YouTube Research Tool</h1>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">{user.email}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/account"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Account Settings
                    </Link>
                    {user.isAdmin && (
                      <Link
                        to="/admin/users"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 