import { Link, useLocation } from 'react-router-dom';
import {  Home, Youtube, BarChart3, User, Search,  DollarSign, HelpCircle, Mail, LogOut, Menu, X} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setShowMobileMenu(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  const navItems = [
    { path: '/', label: 'ホーム' },
    // { path: '/feature', label: '機能' },
    { path: '/tools', label: 'ツール' },
    { path: '/howtouse', label: '使い方' },
    { path: '/pricing', label: '料金' },
    { path: '/faq', label: 'よくある質問' },
    { path: '/contact', label: 'お問い合わせ' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        scrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100' : 'bg-white border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <div className="flex items-center group">
              <Link to="/" className="flex items-center transform hover:scale-105 transition-transform duration-300 ease-out">
                <div className="relative">
                  <img src='/src/assets/unnamed.jpg' className="h-14 w-[50px] mt-1 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-300" />
                  {/* <div className="absolute inset-0 bg-indigo-500/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out"></div> */}
                </div>
                <span className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight group-hover:text-gray-800 transition-colors duration-300">
                  VizzTube
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-4 py-2 text-sm xl:text-base font-medium transition-all duration-300 ease-out group ${
                      isActive
                        ? 'text-indigo-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="relative z-10">{item.label}</span>
                    {/* Animated background */}
                    <div className={`absolute inset-0 rounded-lg transition-all duration-300 ease-out ${
                      isActive 
                        ? 'bg-indigo-50 scale-100' 
                        : 'bg-gray-50 scale-0 group-hover:scale-100'
                    }`}></div>
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full animate-pulse"></div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
              {/* User Menu or Auth Buttons */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-300 ease-out transform hover:scale-105 group"
                  >
                    <div className="relative">
                      <User className="h-5 w-5 text-gray-500 group-hover:text-indigo-500 transition-colors duration-300" />
                      <div className="absolute inset-0 bg-indigo-500/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-32 truncate">
                      {user.email}
                    </span>
                  </button>
                  
                  {/* User Dropdown */}
                  <div className={`absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 transition-all duration-300 ease-out transform ${
                    showUserMenu ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }`}>
                    <Link 
                      to="/dashboard" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 transform hover:translate-x-1" 
                      onClick={() => setShowUserMenu(false)}
                    >
                      ダッシュボード
                    </Link>
                    <Link 
                      to="/account" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 transform hover:translate-x-1" 
                      onClick={() => setShowUserMenu(false)}
                    >
                      アカウント
                    </Link>
                    {user.isAdmin && (
                      <Link 
                        to="/admin/users" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 transform hover:translate-x-1" 
                        onClick={() => setShowUserMenu(false)}
                      >
                        管理者
                      </Link>
                    )}
                    <hr className="my-2 border-gray-100" />
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center space-x-2 group"
                    >
                      <LogOut className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                      <span>ログアウト</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Link 
                    to="/login" 
                    className="text-sm lg:text-base font-medium text-gray-600 hover:text-gray-900 transition-all duration-300 ease-out transform hover:scale-105 px-3 py-2 rounded-lg hover:bg-gray-50"
                  >
                    ログイン
                  </Link>
                  <Link 
                    to="/register" 
                    className="group relative inline-flex items-center px-4 py-2 lg:px-6 lg:py-2.5 text-sm lg:text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25 overflow-hidden"
                  >
                    <span className="relative z-10">新規登録</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden relative p-2 rounded-lg hover:bg-gray-50 transition-all duration-300 ease-out transform hover:scale-110 group"
              >
                <div className="relative w-6 h-6">
                  <Menu className={`absolute inset-0 h-6 w-6 text-gray-600 transition-all duration-300 ease-out ${
                    showMobileMenu ? 'opacity-0 rotate-180 scale-0' : 'opacity-100 rotate-0 scale-100'
                  }`} />
                  <X className={`absolute inset-0 h-6 w-6 text-gray-600 transition-all duration-300 ease-out ${
                    showMobileMenu ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-0'
                  }`} />
                </div>
                <div className="absolute inset-0 bg-indigo-500/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-out ${
          showMobileMenu ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-4 pt-2 pb-4 space-y-1 bg-white/95 backdrop-blur-lg border-t border-gray-100">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 ease-out transform ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50 translate-x-2'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:translate-x-2'
                  }`}
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    transform: showMobileMenu ? 'translateX(0)' : 'translateX(-20px)'
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
      
      {/* Spacer for fixed navbar */}
      <div className="h-16 lg:h-18"></div>
      
      {/* Backdrop for mobile menu */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setShowMobileMenu(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;