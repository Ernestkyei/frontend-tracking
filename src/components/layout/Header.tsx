// src/components/layout/Header.tsx
import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Truck, Menu, X, User, Settings, HelpCircle, LogOut, 
  ChevronDown, Package,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER';
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsDropdownOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role === 'CUSTOMER') {
        setIsLoggedIn(true);
        setUser(parsedUser);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [location.pathname, checkAuthStatus]);

  const handleLogout = () => {
    toast.success('Logged out successfully!');
    setIsDropdownOpen(false);
    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setUser(null);
      navigate('/');
    }, 1000);
  };

  const getUserInitials = (name: string) => {
    if (!name) return 'U';
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  const publicLinks = [
    { path: '/', label: 'Home' },
    { path: '/how-it-works', label: 'How it works' },
    { path: '/about-us', label: 'About us' },
  ];

  const dropdownItems = [
    { 
      icon: <User className="w-4 h-4" />, 
      label: 'My Profile', 
      path: '/profile',
      onClick: () => navigate('/profile')
    },
    { 
      icon: <Package className="w-4 h-4" />, 
      label: 'My Shipments', 
      path: '/dashboard',
      onClick: () => navigate('/dashboard')
    },
    { 
      icon: <Settings className="w-4 h-4" />, 
      label: 'Settings', 
      path: '/settings',
      onClick: () => navigate('/settings')
    },
    { 
      icon: <HelpCircle className="w-4 h-4" />, 
      label: 'Help & Support', 
      path: '/support',
      onClick: () => navigate('/support')
    },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white shadow-md'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo - Warm, human, natural colors */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-emerald-700 to-teal-700 rounded-lg p-1.5 transition-transform group-hover:scale-105">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              SwiftTrack
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {publicLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link key={link.path} to={link.path} className={`relative px-4 py-2 rounded-lg transition-all duration-200 ${isActive ? 'text-emerald-700 font-semibold' : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'}`}>
                  {link.label}
                  {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />}
                </Link>
              );
            })}

            {isLoggedIn && (
              <Link to="/dashboard" className={`relative px-4 py-2 rounded-lg transition-all duration-200 ${location.pathname === '/dashboard' ? 'text-emerald-700 font-semibold' : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'}`}>
                Dashboard
              </Link>
            )}

            {isLoggedIn ? (
              <div className="relative ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(!isDropdownOpen);
                  }}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-r from-emerald-700 to-teal-700 text-white font-semibold text-sm shadow-md hover:scale-105 transition-transform">
                    {getUserInitials(user?.name || 'User')}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in duration-200">
                    {/* User Info Section */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      {dropdownItems.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setIsDropdownOpen(false);
                            item.onClick();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          {item.icon}
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100 my-1"></div>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="ml-4">
                <Link to="/auth" className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-1.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-gray-600 hover:text-emerald-700 focus:outline-none transition-colors" aria-label="Toggle menu">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-2">
              {publicLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link key={link.path} to={link.path} className={`px-3 py-2 rounded-lg transition-all ${isActive ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => setIsMobileMenuOpen(false)}>
                    {link.label}
                  </Link>
                );
              })}
              {isLoggedIn && (
                <Link to="/dashboard" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>
                  Dashboard
                </Link>
              )}
              {isLoggedIn ? (
                <div className="pt-3 mt-2 border-t border-gray-100">
                  {/* Mobile User Info */}
                  <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg mb-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-emerald-700 to-teal-700 text-white font-semibold text-sm">
                      {getUserInitials(user?.name || 'User')}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{user?.name}</div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                    </div>
                  </div>
                  
                  {/* Mobile Dropdown Items */}
                  {dropdownItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        item.onClick();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg mt-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-3 mt-2 border-t border-gray-100">
                  <Link to="/auth" className="block text-center px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}