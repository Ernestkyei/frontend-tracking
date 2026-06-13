// pages/dashboard/Dashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Plus, 
  Search, 
  Clock, 
  MapPin, 
  CheckCircle,
  Truck,
  Eye,
  Trash2,
  Copy, 
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Phone,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

// shadcn/ui imports
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Import API services
import { shipmentService } from '@/Services/shipmentService';
import { authService } from '@/Services/authService';

interface Shipment {
  id: string;
  trackingNumber: string;
  status: string;
  pickupAddress: string;
  deliveryAddress: string;
  expectedDelivery: string;
  createdAt: string;
  packageType: string;
  weight: number;
  description?: string;
  recipientName?: string;
  recipientPhone?: string;
  senderName?: string;
  senderPhone?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [shipmentToDelete, setShipmentToDelete] = useState<Shipment | null>(null);
  const [copiedTracking, setCopiedTracking] = useState<string | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isDeleting, setIsDeleting] = useState(false);

  // ========== FUNCTIONS ==========

  const loadUserData = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    }
  };

  const loadShipments = async () => {
    setLoading(true);
    try {
      const response = await shipmentService.getMyShipments();
      console.log('Shipments response:', response);
      
      if (response.success && response.data) {
        const formattedShipments = response.data.map((shipment: any) => ({
          id: shipment.id,
          trackingNumber: shipment.trackingNumber,
          status: shipment.status,
          pickupAddress: shipment.pickupAddress,
          deliveryAddress: shipment.deliveryAddress,
          expectedDelivery: shipment.expectedDelivery?.split('T')[0] || '',
          createdAt: shipment.createdAt?.split('T')[0] || '',
          packageType: shipment.packageType,
          weight: shipment.weight,
          description: shipment.description,
          recipientName: shipment.recipientName,
          recipientPhone: shipment.recipientPhone,
          senderName: shipment.senderName,
          senderPhone: shipment.senderPhone,
        }));
        setShipments(formattedShipments);
        setFilteredShipments(formattedShipments);
      }
    } catch (error) {
      console.error('Failed to load shipments:', error);
      toast.error('Failed to load shipments');
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setShowDetailsModal(true);
  };

  const handleCopyTrackingNumber = (trackingNumber: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(trackingNumber);
    setCopiedTracking(trackingNumber);
    setTimeout(() => setCopiedTracking(null), 2000);
    toast.success('Tracking number copied!');
  };

  const handleDeleteClick = (shipment: Shipment, e: React.MouseEvent) => {
    e.stopPropagation();
    setShipmentToDelete(shipment);
    setShowDeleteConfirm(true);
  };

  // ✅ FIXED: updates both shipments and filteredShipments
  const confirmDelete = async () => {
    if (!shipmentToDelete) return;

    setIsDeleting(true);
    const toastId = toast.loading('Deleting shipment...');

    try {
      const response = await shipmentService.deleteShipment(shipmentToDelete.id);

      if (response.success) {
        // ✅ Remove from both states so UI updates immediately
        setShipments(prev => prev.filter(s => s.id !== shipmentToDelete.id));
        setFilteredShipments(prev => prev.filter(s => s.id !== shipmentToDelete.id));
        toast.success('Shipment deleted successfully', { id: toastId });
      } else {
        toast.error(response.message || 'Failed to delete shipment', { id: toastId });
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete shipment', { id: toastId });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setShipmentToDelete(null);
    }
  };

  const getStatusColorClass = (status: string): string => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'IN_TRANSIT':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PICKED_UP':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle className="w-3.5 h-3.5" />;
      case 'IN_TRANSIT':
        return <Truck className="w-3.5 h-3.5" />;
      case 'PICKED_UP':
        return <Package className="w-3.5 h-3.5" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  // ========== EFFECTS ==========

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }
    loadUserData();
    loadShipments();
  }, [navigate]);

  useEffect(() => {
    let filtered = [...shipments];

    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.packageType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    setFilteredShipments(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, shipments]);

  // Pagination logic
  const totalPages = Math.ceil(filteredShipments.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedShipments = filteredShipments.slice(startIndex, startIndex + rowsPerPage);

  const stats = {
    total: shipments.length,
    inTransit: shipments.filter(s => s.status === 'IN_TRANSIT').length,
    delivered: shipments.filter(s => s.status === 'DELIVERED').length,
    pending: shipments.filter(s => s.status === 'PENDING').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your shipments...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Welcome back, {user?.name?.split(' ')[0] || 'Customer'}!
              </h1>
              <p className="text-gray-500 mt-1">Track and manage all your shipments</p>
            </div>
            <Button
              onClick={() => navigate('/create-shipment')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Shipment
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Shipments</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">In Transit</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">{stats.inTransit}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Delivered</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">{stats.delivered}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Shipments Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Shipment History</h2>
                <p className="text-sm text-gray-500 mt-0.5">Click on any row to view details</p>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search tracking #..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-64 border-gray-200 focus:border-emerald-300"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] border-gray-200">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PICKED_UP">Picked Up</SelectItem>
                    <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {filteredShipments.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No shipments found</h3>
              <p className="text-gray-500 mb-4">Create your first shipment to get started</p>
              <Button onClick={() => navigate('/create-shipment')} className="mt-4">
                Create Shipment
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 border-b border-gray-100">
                      <TableHead className="font-semibold text-gray-600">Tracking Number</TableHead>
                      <TableHead className="font-semibold text-gray-600">Status</TableHead>
                      <TableHead className="font-semibold text-gray-600">Route</TableHead>
                      <TableHead className="font-semibold text-gray-600">Package</TableHead>
                      <TableHead className="font-semibold text-gray-600">Expected</TableHead>
                      <TableHead className="font-semibold text-gray-600 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedShipments.map((shipment) => (
                      <TableRow
                        key={shipment.id}
                        className="cursor-pointer hover:bg-gray-50/80 transition-all duration-200 group border-b border-gray-50"
                        onClick={() => handleRowClick(shipment)}
                      >
                        <TableCell
                          onClick={(e) => e.stopPropagation()}
                          className="font-mono text-sm font-medium"
                        >
                          <button
                            onClick={() => handleCopyTrackingNumber(shipment.trackingNumber)}
                            className="flex items-center gap-2 group/tracking hover:text-emerald-600 transition-colors"
                          >
                            <span>{shipment.trackingNumber}</span>
                            {copiedTracking === shipment.trackingNumber ? (
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover/tracking:opacity-100 transition-opacity" />
                            )}
                          </button>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Badge
                            className={`flex items-center gap-1.5 w-fit px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColorClass(shipment.status)}`}
                          >
                            {getStatusIcon(shipment.status)}
                            {shipment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-600 truncate max-w-[120px]">{shipment.pickupAddress.split(',')[0]}</span>
                            <ArrowRight className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600 truncate max-w-[120px]">{shipment.deliveryAddress.split(',')[0]}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-800">{shipment.packageType}</span>
                            <span className="text-xs text-gray-400">{shipment.weight} kg</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {shipment.expectedDelivery
                              ? new Date(shipment.expectedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                              : 'N/A'}
                          </span>
                        </TableCell>
                        <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/track/${shipment.trackingNumber}`)}
                              className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              title="Track Shipment"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleDeleteClick(shipment, e)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Delete Shipment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">Rows per page</span>
                  <Select value={String(rowsPerPage)} onValueChange={(value) => {
                    setRowsPerPage(Number(value));
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger className="w-[70px] h-8 border-gray-200 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    Showing {filteredShipments.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + rowsPerPage, filteredShipments.length)} of {filteredShipments.length}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0 border-gray-200"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="h-8 w-8 p-0 border-gray-200"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Shipment Details Modal */}
      {showDetailsModal && selectedShipment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Shipment Details</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-sm text-gray-500">Tracking #{selectedShipment.trackingNumber}</p>
                  <button
                    onClick={() => handleCopyTrackingNumber(selectedShipment.trackingNumber)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {copiedTracking === selectedShipment.trackingNumber ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex justify-center">
                <Badge
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full ${getStatusColorClass(selectedShipment.status)}`}
                >
                  {getStatusIcon(selectedShipment.status)}
                  {selectedShipment.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-semibold text-gray-900">Package Details</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-1">
                      <span className="text-gray-500">Type:</span>
                      <span className="font-medium">{selectedShipment.packageType}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-500">Weight:</span>
                      <span className="font-medium">{selectedShipment.weight} kg</span>
                    </div>
                    {selectedShipment.description && (
                      <div className="flex justify-between py-1">
                        <span className="text-gray-500">Description:</span>
                        <span className="font-medium text-right max-w-[200px]">{selectedShipment.description}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-semibold text-gray-900">Delivery Timeline</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-1">
                      <span className="text-gray-500">Created:</span>
                      <span className="font-medium">{new Date(selectedShipment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-500">Expected Delivery:</span>
                      <span className="font-medium">
                        {selectedShipment.expectedDelivery
                          ? new Date(selectedShipment.expectedDelivery).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-semibold text-gray-900">Sender Information</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 py-1">
                      <User className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-500">Name:</span>
                      <span className="font-medium">{selectedShipment.senderName || 'N/A'}</span>
                    </div>
                    {selectedShipment.senderPhone && (
                      <div className="flex items-center gap-2 py-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-500">Phone:</span>
                        <span className="font-medium">{selectedShipment.senderPhone}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2 mt-2">
                      <MapPin className="w-3 h-3 text-gray-400 mt-0.5" />
                      <div>
                        <span className="text-gray-500">Pickup Address:</span>
                        <p className="font-medium text-sm mt-1">{selectedShipment.pickupAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Recipient Information</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 py-1">
                      <User className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-500">Name:</span>
                      <span className="font-medium">{selectedShipment.recipientName || 'N/A'}</span>
                    </div>
                    {selectedShipment.recipientPhone && (
                      <div className="flex items-center gap-2 py-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-500">Phone:</span>
                        <span className="font-medium">{selectedShipment.recipientPhone}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2 mt-2">
                      <MapPin className="w-3 h-3 text-gray-400 mt-0.5" />
                      <div>
                        <span className="text-gray-500">Delivery Address:</span>
                        <p className="font-medium text-sm mt-1">{selectedShipment.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button
                  onClick={() => {
                    setShowDetailsModal(false);
                    navigate(`/track/${selectedShipment.trackingNumber}`);
                  }}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Track Shipment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && shipmentToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete shipment{' '}
              <span className="font-mono font-semibold">{shipmentToDelete.trackingNumber}</span>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setShipmentToDelete(null);
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700" disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}