// pages/track/Track.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Package,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  Calendar,
  User,
  Phone,
  AlertCircle,
  Copy,
  ArrowLeft,
  Search,
  Check,
  X,
  Mail,
  Map,
  Info,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Input } from '@/components/ui/input';
import { shipmentService } from '@/Services/shipmentService';
import type { Shipment as BackendShipment } from '@/Services/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface LocationUpdate {
  id: string;
  location: string;
  status: string;
  note?: string;
  timestamp: string;
}

interface Shipment {
  id: string;
  trackingNumber: string;
  status: string;
  currentLocation: string;
  pickupAddress: string;
  deliveryAddress: string;
  expectedDelivery: string;
  actualDelivery?: string;
  createdAt: string;
  packageType: string;
  weight: number;
  description: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail?: string;
  senderName: string;
  senderPhone: string;
  senderEmail?: string;
  locationUpdates: LocationUpdate[];
}

// ─── Modal Component ──────────────────────────────────────────────────────────

interface PersonDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  person: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    role: 'sender' | 'recipient';
  };
}

function PersonDetailsModal({ isOpen, onClose, title, person }: PersonDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className={`sticky top-0 px-6 py-4 border-b flex justify-between items-center ${person.role === 'sender' ? 'bg-gray-50' : 'bg-blue-50'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${person.role === 'sender' ? 'bg-gray-200' : 'bg-blue-200'}`}>
              <User className={`w-5 h-5 ${person.role === 'sender' ? 'text-gray-600' : 'text-blue-600'}`} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              <p className="text-xs text-gray-500">{person.role === 'sender' ? 'Package sender details' : 'Package recipient details'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Full Name */}
          <div className="flex items-start gap-3">
            <User className="w-4 h-4 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Full Name</p>
              <p className="text-sm font-medium text-gray-900 mt-1">{person.name || 'Not provided'}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3">
            <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Phone Number</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm font-medium text-gray-900">{person.phone || 'Not provided'}</p>
                {person.phone && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(person.phone);
                      toast.success('Phone number copied!');
                    }}
                    className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <Copy className="w-3 h-3 text-gray-400" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Email (if available) */}
          {person.email && (
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Email Address</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm font-medium text-gray-900">{person.email}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(person.email!);
                      toast.success('Email copied!');
                    }}
                    className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <Copy className="w-3 h-3 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Address (if available) */}
          {person.address && (
            <div className="flex items-start gap-3">
              <Map className="w-4 h-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Address</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{person.address}</p>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-100 my-2"></div>

          {/* Additional Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-3.5 h-3.5 text-gray-400" />
              <p className="text-xs font-medium text-gray-500">Additional Information</p>
            </div>
            <div className="space-y-2 text-xs text-gray-600">
              <p>• This person is the {person.role === 'sender' ? 'one who shipped the package' : 'intended recipient of the package'}</p>
              <p>• {person.role === 'sender' ? 'Contact them for pickup-related queries' : 'Contact them for delivery-related queries'}</p>
              <p>• {person.role === 'sender' ? 'Tracking updates are sent to this number' : 'Delivery confirmation will be sent to this number'}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 border-t bg-white">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_META: Record<string, { label: string; chip: string; dot: string; icon: React.ReactNode }> = {
  DELIVERED: {
    label: 'Delivered',
    chip: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dot: 'bg-emerald-500',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
  IN_TRANSIT: {
    label: 'In Transit',
    chip: 'bg-blue-50 text-blue-700 border border-blue-200',
    dot: 'bg-blue-500',
    icon: <Truck className="w-3.5 h-3.5" />,
  },
  PICKED_UP: {
    label: 'Picked Up',
    chip: 'bg-violet-50 text-violet-700 border border-violet-200',
    dot: 'bg-violet-500',
    icon: <Package className="w-3.5 h-3.5" />,
  },
  PENDING: {
    label: 'Pending',
    chip: 'bg-amber-50 text-amber-700 border border-amber-200',
    dot: 'bg-amber-400',
    icon: <Clock className="w-3.5 h-3.5" />,
  },
};

function StatusChip({ status }: { status: string }) {
  const m = STATUS_META[status] ?? { 
    label: status, 
    chip: 'bg-gray-50 text-gray-600 border border-gray-200', 
    icon: <Clock className="w-3.5 h-3.5" /> 
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${m.chip}`}>
      {m.icon}{m.label}
    </span>
  );
}

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

const fmtLong = (d: string) =>
  new Date(d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

// ─── Timeline step ────────────────────────────────────────────────────────────

function TimelineStep({
  update,
  isLatest,
  isLast,
}: {
  update: LocationUpdate;
  isLatest: boolean;
  isLast: boolean;
}) {
  const done = !isLatest;
  const delivered = update.status === 'DELIVERED';

  return (
    <div className="relative flex gap-4">
      {!isLast && (
        <div className={`absolute left-[15px] top-8 bottom-0 w-px ${done ? 'bg-emerald-200' : 'bg-gray-200'}`} />
      )}
      <div className="shrink-0 relative z-10">
        {isLatest ? (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${delivered ? 'bg-emerald-500' : 'bg-gray-900'}`}>
            {delivered
              ? <CheckCircle className="w-4 h-4 text-white" />
              : <div className="w-2 h-2 rounded-full bg-white" />
            }
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          </div>
        )}
      </div>
      <div className={`flex-1 pb-7 ${isLast ? 'pb-0' : ''}`}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
          <div>
            <p className={`text-sm font-semibold ${isLatest ? 'text-gray-900' : 'text-gray-500'}`}>
              {update.location}
            </p>
            {update.note && (
              <p className="text-xs text-gray-400 mt-0.5">{update.note}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusChip status={update.status} />
            <span className="text-xs text-gray-400 whitespace-nowrap">{fmt(update.timestamp)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Info card ────────────────────────────────────────────────────────────────

function InfoCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <div className="text-gray-400">{icon}</div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start gap-4 py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 shrink-0">{label}</span>
      <span className="text-xs font-medium text-gray-800 text-right">{value}</span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Track() {
  const { trackingNumber } = useParams<{ trackingNumber: string }>();
  const navigate = useNavigate();
  const [searchNumber, setSearchNumber] = useState('');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<{
    name: string;
    phone: string;
    email?: string;
    address?: string;
    role: 'sender' | 'recipient';
  } | null>(null);

  // Fetch shipment from backend
  const fetchShipment = useCallback(async (num: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await shipmentService.trackShipment(num);
      console.log('Track response:', response);
      
      // Extract shipment data from response
      let backendShipment: BackendShipment | null = null;
      
      if (response) {
        // Handle different response structures
        if (response.data && typeof response.data === 'object' && 'id' in response.data) {
          backendShipment = response.data as BackendShipment;
        } else if (response && typeof response === 'object' && 'id' in response) {
          backendShipment = response as BackendShipment;
        }
      }
      
      if (backendShipment && backendShipment.id) {
        // Map backend shipment to our Shipment interface
        const formattedShipment: Shipment = {
          id: backendShipment.id,
          trackingNumber: backendShipment.trackingNumber,
          status: backendShipment.status || 'PENDING',
          currentLocation: backendShipment.currentLocation || backendShipment.pickupAddress || 'Not available',
          pickupAddress: backendShipment.pickupAddress || '',
          deliveryAddress: backendShipment.deliveryAddress || '',
          expectedDelivery: backendShipment.expectedDelivery || new Date().toISOString(),
          actualDelivery: backendShipment.actualDelivery,
          createdAt: backendShipment.createdAt || new Date().toISOString(),
          packageType: backendShipment.packageType || 'Standard',
          weight: backendShipment.weight || 0,
          description: backendShipment.description || '',
          recipientName: backendShipment.recipientName || '',
          recipientPhone: backendShipment.recipientPhone || '',
          recipientEmail: backendShipment.recipientEmail,
          senderName: backendShipment.senderName || '',
          senderPhone: backendShipment.senderPhone || '',
          senderEmail: backendShipment.senderEmail,
          locationUpdates: (backendShipment.locationUpdates || []).map(update => ({
            id: update.id,
            location: update.location,
            status: update.status,
            note: update.note,
            timestamp: update.timestamp
          })),
        };
        setShipment(formattedShipment);
      } else {
        setShipment(null);
        setError('No shipment found with this tracking number.');
      }
    } catch (err) {
      console.error('Error fetching shipment:', err);
      const errorMessage = err instanceof Error ? err.message : 'No shipment found with this tracking number.';
      setShipment(null);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load shipment when tracking number changes - using a flag to prevent the warning
  useEffect(() => {
    let isSubscribed = true;
    
    const loadShipment = async () => {
      if (trackingNumber && isSubscribed) {
        await fetchShipment(trackingNumber);
      }
    };
    
    loadShipment();
    
    return () => {
      isSubscribed = false;
    };
  }, [trackingNumber, fetchShipment]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchNumber.trim()) {
      navigate(`/track/${searchNumber.trim()}`);
      setSearchNumber('');
    }
  };

  const handleCopy = () => {
    if (!shipment) return;
    navigator.clipboard.writeText(shipment.trackingNumber);
    setCopied(true);
    toast.success('Tracking number copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const openSenderModal = () => {
    if (!shipment) return;
    setSelectedPerson({
      name: shipment.senderName,
      phone: shipment.senderPhone,
      email: shipment.senderEmail,
      address: shipment.pickupAddress,
      role: 'sender',
    });
    setModalTitle('Sender Details');
    setModalOpen(true);
  };

  const openRecipientModal = () => {
    if (!shipment) return;
    setSelectedPerson({
      name: shipment.recipientName,
      phone: shipment.recipientPhone,
      email: shipment.recipientEmail,
      address: shipment.deliveryAddress,
      role: 'recipient',
    });
    setModalTitle('Recipient Details');
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 font-medium">Loading shipment details…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] font-sans">
      {/* Modal */}
      {selectedPerson && (
        <PersonDetailsModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={modalTitle}
          person={selectedPerson}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <Truck className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900 tracking-tight">SwiftShip</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 hidden sm:block">Real-time delivery tracking</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">

        {/* Search bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <Input
                placeholder="Enter tracking number — e.g. TRK-2026-001"
                value={searchNumber}
                onChange={e => setSearchNumber(e.target.value)}
                className="pl-9 h-10 text-sm rounded-xl border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              />
            </div>
            <button
              type="submit"
              className="h-10 px-5 text-sm font-medium rounded-xl bg-gray-900 hover:bg-gray-800 text-white inline-flex items-center gap-2 transition-colors shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              Track
            </button>
          </form>
          {!trackingNumber && (
            <p className="text-xs text-gray-400 mt-3">
              Enter any tracking number from your shipments
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-1">Shipment not found</p>
            <p className="text-xs text-gray-400 mb-5">{error}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="h-9 px-5 text-sm font-medium rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors"
            >
              Back to dashboard
            </button>
          </div>
        )}

        {/* Shipment found */}
        {shipment && !error && (
          <>
            {/* Hero card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gray-900 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Tracking number</p>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-semibold text-white">{shipment.trackingNumber}</span>
                    <button
                      onClick={handleCopy}
                      title="Copy tracking number"
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${copied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 hover:bg-white/20 text-gray-300'}`}
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <StatusChip status={shipment.status} />
              </div>

              {/* Three-stat strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                {[
                  {
                    icon: <MapPin className="w-4 h-4 text-blue-500" />,
                    label: 'Current location',
                    value: shipment.currentLocation,
                  },
                  {
                    icon: <Calendar className="w-4 h-4 text-blue-500" />,
                    label: shipment.actualDelivery ? 'Delivered on' : 'Expected delivery',
                    value: fmtLong(shipment.actualDelivery ?? shipment.expectedDelivery),
                  },
                  {
                    icon: <Clock className="w-4 h-4 text-blue-500" />,
                    label: 'Last update',
                    value: shipment.locationUpdates.length > 0 
                      ? fmt(shipment.locationUpdates[shipment.locationUpdates.length - 1]?.timestamp ?? shipment.createdAt)
                      : fmt(shipment.createdAt),
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 px-6 py-4">
                    <div className="mt-0.5 shrink-0">{item.icon}</div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                      <p className="text-sm font-medium text-gray-900">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            {shipment.locationUpdates.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gray-400" />
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Delivery progress</h2>
                  <span className="ml-auto text-xs text-gray-400">{shipment.locationUpdates.length} events</span>
                </div>
                <div className="px-6 py-6">
                  {[...shipment.locationUpdates].reverse().map((update, idx, arr) => (
                    <TimelineStep
                      key={update.id}
                      update={update}
                      isLatest={idx === 0}
                      isLast={idx === arr.length - 1}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoCard title="Package" icon={<Package className="w-4 h-4" />}>
                <DetailRow label="Type" value={shipment.packageType} />
                <DetailRow label="Weight" value={`${shipment.weight} kg`} />
                <DetailRow label="Created" value={fmt(shipment.createdAt)} />
                <DetailRow label="Description" value={<span className="text-right leading-snug">{shipment.description || 'No description'}</span>} />
              </InfoCard>

              <InfoCard title="Route" icon={<MapPin className="w-4 h-4" />}>
                <div className="space-y-4">
                  <div className="relative pl-5">
                    <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-gray-400" />
                    <div className="absolute left-[3px] top-4 bottom-0 w-px bg-gray-200" />
                    <p className="text-xs text-gray-400 mb-0.5">Pickup</p>
                    <p className="text-xs font-medium text-gray-800">{shipment.pickupAddress}</p>
                  </div>
                  <div className="relative pl-5">
                    <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-blue-500" />
                    <p className="text-xs text-gray-400 mb-0.5">Delivery</p>
                    <p className="text-xs font-medium text-gray-800">{shipment.deliveryAddress}</p>
                  </div>
                </div>
              </InfoCard>

              {/* Sender Card - Clickable */}
              <div 
                onClick={openSenderModal}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md hover:border-gray-200 transition-all duration-200"
              >
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                  <div className="text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">SENDER</h3>
                  <span className="ml-auto text-xs text-blue-500">Click to view details →</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700 shrink-0">
                      {shipment.senderName?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{shipment.senderName || 'Not provided'}</p>
                      <p className="text-xs text-gray-400">Click for full details</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{shipment.senderPhone || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              {/* Recipient Card - Clickable */}
              <div 
                onClick={openRecipientModal}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md hover:border-gray-200 transition-all duration-200"
              >
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                  <div className="text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">RECIPIENT</h3>
                  <span className="ml-auto text-xs text-blue-500">Click to view details →</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700 shrink-0">
                      {shipment.recipientName?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{shipment.recipientName || 'Not provided'}</p>
                      <p className="text-xs text-gray-400">Click for full details</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{shipment.recipientPhone || 'Not provided'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex flex-col sm:flex-row gap-3 pb-4">
              <button
                onClick={() => {
                  setSearchNumber('');
                  navigate('/track');
                }}
                className="flex-1 h-10 text-sm font-medium rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 inline-flex items-center justify-center gap-2 transition-colors"
              >
                <Search className="w-4 h-4" />
                Track another package
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 h-10 text-sm font-medium rounded-xl bg-gray-900 hover:bg-gray-800 text-white inline-flex items-center justify-center gap-2 transition-colors"
              >
                Go to dashboard
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}