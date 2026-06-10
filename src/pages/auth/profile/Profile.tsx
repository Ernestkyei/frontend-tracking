import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Phone,
  Calendar,
  Edit,
  Save,
  X,
  User,
  Truck,
  Package,
  Clock,
  CheckCircle,
  ArrowLeft,
  Shield,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '@/Services/authService';
import { shipmentService } from '@/Services/shipmentService';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface Shipment {
  id: string;
  trackingNumber: string;
  status: string;
  expectedDelivery: string;
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem('user_profile');
    return cached ? JSON.parse(cached) : null;
  });
  const [recentShipments, setRecentShipments] = useState<Shipment[]>(() => {
    const cached = localStorage.getItem('recent_shipments');
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(!user);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user_profile', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    if (recentShipments.length > 0) {
      localStorage.setItem('recent_shipments', JSON.stringify(recentShipments));
    }
  }, [recentShipments]);

  // ========== DATA FETCHING ==========

  const loadUserProfile = async () => {
    try {
      const response = await authService.getProfile();
      
      // Handle different possible response structures
      let userData = null;
      
      if (response?.user) {
        userData = response.user;
      } else if (response?.data?.user) {
        userData = response.data.user;
      } else if (response?.data) {
        userData = response.data;
      } else if (response?.id) {
        userData = response;
      } else {
        userData = response;
      }
      
      if (userData?.id) {
        setUser(userData);
        setFormData({
          name: userData.name || '',
          phone: userData.phone || '',
        });
      } else {
        toast.error('Failed to load profile data');
      }
    } catch (error) {
      console.error('Profile load error:', error);
      toast.error('Failed to load profile');
    }
  };

  const loadRecentShipments = async () => {
    try {
      const response = await shipmentService.getMyShipments();
      
      // Handle different possible response structures
      let shipmentsData: Shipment[] = [];
      
      if (response?.data?.data && Array.isArray(response.data.data)) {
        shipmentsData = response.data.data;
      } else if (response?.data && Array.isArray(response.data)) {
        shipmentsData = response.data;
      } else if (response?.data?.shipments && Array.isArray(response.data.shipments)) {
        shipmentsData = response.data.shipments;
      } else if (Array.isArray(response)) {
        shipmentsData = response;
      } else if (response?.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
        // If data is an object, try to find array property
        for (const key in response.data) {
          if (Array.isArray(response.data[key])) {
            shipmentsData = response.data[key];
            break;
          }
        }
      }
      
      if (shipmentsData.length > 0) {
        setRecentShipments(shipmentsData.slice(0, 3));
      }
    } catch (error) {
      // Silent fail - not critical
      console.error('Shipments load error:', error);
    }
  };

  // ========== PROFILE ACTIONS ==========

  const handleUpdateProfile = async () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setIsUpdating(true);
    try {
      if (user) {
        const updatedUser = { ...user, name: formData.name, phone: formData.phone };
        setUser(updatedUser);
        localStorage.setItem('user_profile', JSON.stringify(updatedUser));
      }
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await authService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      toast.success('Password changed successfully!');
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      toast.error('Failed to change password');
    }
  };

  // ========== HELPER FUNCTIONS ==========

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'DELIVERED': return 'text-emerald-600 bg-emerald-50';
      case 'IN_TRANSIT': return 'text-blue-600 bg-blue-50';
      case 'PICKED_UP': return 'text-purple-600 bg-purple-50';
      default: return 'text-amber-600 bg-amber-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'DELIVERED': return <CheckCircle className="w-3.5 h-3.5" />;
      case 'IN_TRANSIT': return <Truck className="w-3.5 h-3.5" />;
      case 'PICKED_UP': return <Package className="w-3.5 h-3.5" />;
      default: return <Clock className="w-3.5 h-3.5" />;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Recently';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Recently';
    }
  };

  // ========== EFFECT ==========

  useEffect(() => {
    const token = authService.getToken();
    
    if (!token) {
      navigate('/auth');
      return;
    }
    
    const fetchData = async () => {
      if (!user) {
        setLoading(true);
        await loadUserProfile();
        await loadRecentShipments();
        setLoading(false);
      } else {
        // Refresh shipments in background without affecting loading state
        loadRecentShipments().catch(() => {});
      }
    };
    
    fetchData();
  }, [navigate, user]);

  // ========== RENDER ==========

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
          <p className="text-gray-600 mb-4">Unable to load profile data</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">My Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="bg-gradient-to-r from-emerald-700 to-teal-700 px-6 py-8 text-center">
                <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-3">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white mt-2">{user.name}</h2>
                <p className="text-emerald-100 text-sm mt-1">{user.role}</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{user.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Joined {formatDate(user.createdAt)}</span>
                </div>
                <button
                  onClick={() => setIsChangingPassword(!isChangingPassword)}
                  className="w-full mt-4 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit Profile Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({ name: user.name, phone: user.phone || '' });
                      }}
                      className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleUpdateProfile}
                      disabled={isUpdating}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-60 transition-colors"
                    >
                      {isUpdating ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save
                    </button>
                  </div>
                )}
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <p className="text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+233 24 000 0000"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user.phone || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Change Password Modal */}
            {isChangingPassword && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Change Password</h3>
                    <button onClick={() => setIsChangingPassword(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        placeholder="Minimum 6 characters"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button onClick={() => setIsChangingPassword(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
                        Cancel
                      </button>
                      <button onClick={handleChangePassword} className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Shipments */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Recent Shipments</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {recentShipments.length === 0 ? (
                  <div className="p-12 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No shipments yet</p>
                    <button onClick={() => navigate('/create-shipment')} className="mt-3 text-sm text-emerald-600 hover:text-emerald-700">
                      Create your first shipment →
                    </button>
                  </div>
                ) : (
                  recentShipments.map((shipment) => (
                    <div key={shipment.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-mono text-sm font-medium text-gray-900">{shipment.trackingNumber}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                              {getStatusIcon(shipment.status)}
                              {shipment.status}
                            </span>
                            <span className="text-xs text-gray-400">{new Date(shipment.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <button onClick={() => navigate(`/track/${shipment.trackingNumber}`)} className="text-sm text-emerald-600 hover:text-emerald-700">
                          Track →
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {recentShipments.length > 0 && (
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                  <button onClick={() => navigate('/dashboard')} className="text-sm text-emerald-600 hover:text-emerald-700">
                    View all shipments →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}