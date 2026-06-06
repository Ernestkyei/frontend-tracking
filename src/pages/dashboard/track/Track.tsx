// pages/track/Track.tsx
import { useState, useEffect, useCallback } from 'react';
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
} from 'lucide-react';

import { Input } from '@/components/ui/input';

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
  senderName: string;
  senderPhone: string;
  locationUpdates: LocationUpdate[];
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockShipmentData: Record<string, Shipment> = {
  'TRK-2026-001': {
    id: '1',
    trackingNumber: 'TRK-2026-001',
    status: 'IN_TRANSIT',
    currentLocation: 'Tema Motorway, Accra',
    pickupAddress: 'Accra Mall, Spintex Road, Accra',
    deliveryAddress: 'Tema Community 1, Site 20, Tema',
    expectedDelivery: '2026-03-25T14:00:00',
    createdAt: '2026-03-20T10:30:00',
    packageType: 'Electronics',
    weight: 2.5,
    description: 'MacBook Pro 14-inch, in original box. Fragile — handle with care.',
    recipientName: 'John Mensah',
    recipientPhone: '+233 24 123 4567',
    senderName: 'Mary Owusu',
    senderPhone: '+233 24 765 4321',
    locationUpdates: [
      { id: '1', location: 'Accra Mall, Spintex Road', status: 'PICKED_UP', note: 'Package picked up from sender', timestamp: '2026-03-20T12:00:00' },
      { id: '2', location: 'Tema Sorting Center', status: 'IN_TRANSIT', note: 'Package arrived at sorting facility', timestamp: '2026-03-21T08:30:00' },
      { id: '3', location: 'Tema Motorway', status: 'IN_TRANSIT', note: 'Out for delivery', timestamp: '2026-03-25T09:00:00' },
    ],
  },
  'TRK-2026-002': {
    id: '2',
    trackingNumber: 'TRK-2026-002',
    status: 'DELIVERED',
    currentLocation: 'Takoradi Market Circle',
    pickupAddress: 'Kumasi Central Market, Kumasi',
    deliveryAddress: 'Takoradi Market Circle, Takoradi',
    expectedDelivery: '2026-03-18T16:00:00',
    actualDelivery: '2026-03-18T15:30:00',
    createdAt: '2026-03-15T09:00:00',
    packageType: 'Clothing',
    weight: 1.5,
    description: 'Traditional fabrics — 6 yards. Well packed in plastic bag.',
    recipientName: 'Ama Serwaa',
    recipientPhone: '+233 20 123 4567',
    senderName: 'Kofi Asante',
    senderPhone: '+233 24 765 4321',
    locationUpdates: [
      { id: '1', location: 'Kumasi Central Market', status: 'PICKED_UP', note: 'Package picked up from sender', timestamp: '2026-03-15T11:00:00' },
      { id: '2', location: 'Kumasi Hub', status: 'IN_TRANSIT', note: 'Processed at sorting center', timestamp: '2026-03-16T10:00:00' },
      { id: '3', location: 'Takoradi Distribution Center', status: 'IN_TRANSIT', note: 'Arrived at destination city', timestamp: '2026-03-17T14:00:00' },
      { id: '4', location: 'Takoradi Market Circle', status: 'DELIVERED', note: 'Delivered to recipient. QR code scanned.', timestamp: '2026-03-18T15:30:00' },
    ],
  },
  'TRK-2026-003': {
    id: '3',
    trackingNumber: 'TRK-2026-003',
    status: 'PENDING',
    currentLocation: 'Tema Depot',
    pickupAddress: 'Tema Depot, Tema',
    deliveryAddress: 'Achimota Retail Centre, Accra',
    expectedDelivery: '2026-03-28T18:00:00',
    createdAt: '2026-03-22T14:00:00',
    packageType: 'Documents',
    weight: 0.5,
    description: 'Business contracts and legal documents',
    recipientName: 'Kwame Addo',
    recipientPhone: '+233 50 123 4567',
    senderName: 'Abena Osei',
    senderPhone: '+233 24 765 4321',
    locationUpdates: [
      { id: '1', location: 'Tema Depot', status: 'PENDING', note: 'Shipment created and pending driver assignment', timestamp: '2026-03-22T14:00:00' },
    ],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_META: Record<string, { label: string; chip: string; dot: string; icon: JSX.Element }> = {
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
  const m = STATUS_META[status] ?? { label: status, chip: 'bg-gray-50 text-gray-600 border border-gray-200', icon: <Clock className="w-3.5 h-3.5" /> };
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
      {/* Connector line */}
      {!isLast && (
        <div className={`absolute left-[15px] top-8 bottom-0 w-px ${done ? 'bg-emerald-200' : 'bg-gray-150 bg-gray-200'}`} />
      )}

      {/* Node */}
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

      {/* Content */}
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

function InfoCard({ title, icon, children }: { title: string; icon: JSX.Element; children: React.ReactNode }) {
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

  const fetchShipment = useCallback(async (num: string) => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      const data = mockShipmentData[num];
      if (data) { setShipment(data); } else { setShipment(null); setError('No shipment found with this tracking number.'); }
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (trackingNumber) fetchShipment(trackingNumber);
  }, [trackingNumber, fetchShipment]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchNumber.trim()) { navigate(`/track/${searchNumber.trim()}`); setSearchNumber(''); }
  };

  const handleCopy = () => {
    if (!shipment) return;
    navigator.clipboard.writeText(shipment.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

      {/* ── Header ───────────────────────────────────────────────── */}
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

        {/* ── Search bar (always visible) ───────────────────────── */}
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
              Demo: try <button onClick={() => navigate('/track/TRK-2026-001')} className="underline hover:text-gray-600">TRK-2026-001</button>,{' '}
              <button onClick={() => navigate('/track/TRK-2026-002')} className="underline hover:text-gray-600">TRK-2026-002</button>, or{' '}
              <button onClick={() => navigate('/track/TRK-2026-003')} className="underline hover:text-gray-600">TRK-2026-003</button>
            </p>
          )}
        </div>

        {/* ── Error ────────────────────────────────────────────────── */}
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

        {/* ── Shipment found ─────────────────────────────────────── */}
        {shipment && !error && (
          <>
            {/* Hero card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Top band */}
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
                    value: fmt(shipment.locationUpdates[shipment.locationUpdates.length - 1]?.timestamp ?? shipment.createdAt),
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

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Package */}
              <InfoCard title="Package" icon={<Package className="w-4 h-4" />}>
                <DetailRow label="Type" value={shipment.packageType} />
                <DetailRow label="Weight" value={`${shipment.weight} kg`} />
                <DetailRow label="Created" value={fmt(shipment.createdAt)} />
                <DetailRow label="Description" value={<span className="text-right leading-snug">{shipment.description}</span>} />
              </InfoCard>

              {/* Route */}
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

              {/* Sender */}
              <InfoCard title="Sender" icon={<User className="w-4 h-4" />}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-700 shrink-0">
                    {shipment.senderName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{shipment.senderName}</p>
                    <p className="text-xs text-gray-400">Sender</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  {shipment.senderPhone}
                </div>
              </InfoCard>

              {/* Recipient */}
              <InfoCard title="Recipient" icon={<User className="w-4 h-4" />}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700 shrink-0">
                    {shipment.recipientName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{shipment.recipientName}</p>
                    <p className="text-xs text-gray-400">Recipient</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  {shipment.recipientPhone}
                </div>
              </InfoCard>
            </div>

            {/* Footer actions */}
            <div className="flex flex-col sm:flex-row gap-3 pb-4">
              <button
                onClick={() => navigate('/track')}
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