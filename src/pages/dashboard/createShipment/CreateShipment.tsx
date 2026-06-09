// pages/dashboard/createShipment/CreateShipment.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  ArrowLeft,
  Send,
  CheckCircle,
  Truck,
  ChevronRight,
  ChevronLeft,
  Building2,
  Home,
  ArrowUpRight,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Import API service
import { shipmentService } from '@/Services/shipmentService';
import type { CreateShipmentData } from '@/Services/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  senderName: string;
  senderPhone: string;
  senderEmail: string;
  pickupAddress: string;
  pickupRegion: string;
  preferredPickupTime: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  deliveryAddress: string;
  deliveryRegion: string;
  landmark: string;
  packageType: string;
  estimatedWeight: string;
  estimatedValue: string;
  packageDescription: string;
  specialInstructions: string;
  deliveryUrgency: string;
  additionalNotes: string;
}

const EMPTY_FORM: FormData = {
  senderName: '', senderPhone: '', senderEmail: '',
  pickupAddress: '', pickupRegion: '', preferredPickupTime: '',
  recipientName: '', recipientPhone: '', recipientEmail: '',
  deliveryAddress: '', deliveryRegion: '', landmark: '',
  packageType: '', estimatedWeight: '', estimatedValue: '',
  packageDescription: '', specialInstructions: '',
  deliveryUrgency: '', additionalNotes: '',
};

const GHANA_REGIONS = [
  'Greater Accra', 'Ashanti', 'Central', 'Western',
  'Eastern', 'Volta', 'Northern', 'Upper East', 'Upper West',
  'Bono', 'Ahafo', 'Bono East', 'Oti', 'Savannah',
  'North East', 'Western North',
];

type Step = 0 | 1 | 2;

const STEPS = [
  { key: 'sender', label: 'Sender', icon: Building2 },
  { key: 'recipient', label: 'Recipient', icon: Home },
  { key: 'package', label: 'Package', icon: Package },
] as const;

// ─── ErrorMsg Component ──────────────────────────────────────────────────────

const ErrorMsg = ({ field, errors }: { field: keyof FormData; errors: Partial<Record<keyof FormData, string>> }) => {
  return errors[field] ? (
    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
      <AlertCircle className="w-3 h-3" />
      {errors[field]}
    </p>
  ) : null;
};

// ─── Field component ──────────────────────────────────────────────────────────

function Field({
  label,
  required,
  hint,
  children,
  col2 = false,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  col2?: boolean;
}) {
  return (
    <div className={col2 ? 'col-span-2' : ''}>
      <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepBar({ current }: { current: Step }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const Icon = step.icon;
        return (
          <div key={step.key} className="flex items-center">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${active
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                : done
                  ? 'text-emerald-600'
                  : 'text-gray-400'
              }`}>
              {done ? <CheckCircle className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
              {step.label}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-8 h-px mx-1 ${i < current ? 'bg-emerald-300' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function calcProgress(f: FormData): number {
  const required = [
    f.senderName, f.senderPhone, f.pickupAddress,
    f.recipientName, f.recipientPhone, f.deliveryAddress,
    f.packageType, f.estimatedWeight, f.packageDescription, f.deliveryUrgency,
  ];
  return Math.round((required.filter(Boolean).length / required.length) * 100);
}

// ─── Success screen ───────────────────────────────────────────────────────────

function SuccessScreen({ tracking, onNew }: { tracking: string; onNew: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm w-full max-w-md p-8 text-center">
        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-7 h-7 text-emerald-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Shipment submitted</h2>
        <p className="text-sm text-gray-400 mb-6">Your package has been registered and is pending pickup.</p>

        <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Tracking number</p>
          <p className="font-mono text-xl font-semibold text-gray-900">{tracking}</p>
        </div>

        <div className="flex gap-3">
          <Button onClick={() => navigate(`/track/${tracking}`)} className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
            <Package className="w-4 h-4 mr-2" />
            Track shipment
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
          </Button>
          <button onClick={onNew} className="flex-1 h-10 text-sm font-medium rounded-xl border border-gray-200 bg-white hover:bg-gray-50">
            New shipment
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, subtitle, icon: Icon, children }: {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 flex items-center justify-center shrink-0">
          <Icon className="w-4.5 h-4.5 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CreateShipment() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const progress = calcProgress(formData);

  const set = (name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    set(e.target.name as keyof FormData, e.target.value);

  const validateStep = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (step === 0) {
      if (!formData.senderName) newErrors.senderName = 'Required';
      if (!formData.senderPhone) newErrors.senderPhone = 'Required';
      if (!formData.pickupAddress) newErrors.pickupAddress = 'Required';
      if (!formData.senderEmail) newErrors.senderEmail = 'Required';
    } else if (step === 1) {
      if (!formData.recipientName) newErrors.recipientName = 'Required';
      if (!formData.recipientPhone) newErrors.recipientPhone = 'Required';
      if (!formData.deliveryAddress) newErrors.deliveryAddress = 'Required';
    } else {
      if (!formData.packageType) newErrors.packageType = 'Required';
      if (!formData.estimatedWeight) newErrors.estimatedWeight = 'Required';
      if (!formData.packageDescription) newErrors.packageDescription = 'Required';
      if (!formData.deliveryUrgency) newErrors.deliveryUrgency = 'Required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => { if (validateStep()) setStep(s => (s + 1) as Step); };
  const back = () => setStep(s => (s - 1) as Step);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    
    setIsLoading(true);
    const loadingToast = toast.loading('Creating your shipment...');
    
    // Map form data to backend expectations
    const shipmentData: CreateShipmentData = {
      customerName: formData.senderName,
      customerEmail: formData.senderEmail,
      pickupAddress: formData.pickupAddress,
      deliveryAddress: formData.deliveryAddress,
      customerPhone: formData.senderPhone || undefined,
      recipientPhone: formData.recipientPhone || undefined,
      description: formData.packageDescription || undefined,
      weight: formData.estimatedWeight ? parseFloat(formData.estimatedWeight) : undefined,
    };

    try {
      const response = await shipmentService.createShipment(shipmentData);
      toast.dismiss(loadingToast);
      
      if (response.success && response.data?.trackingNumber) {
        setTrackingNumber(response.data.trackingNumber);
        toast.success(`Shipment created! Tracking #: ${response.data.trackingNumber}`);
        setSuccess(true);
      } else {
        toast.error(response.message || 'Failed to create shipment');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error instanceof Error ? error.message : 'Failed to create shipment');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return <SuccessScreen tracking={trackingNumber} onNew={() => { 
      setSuccess(false); 
      setFormData(EMPTY_FORM); 
      setStep(0);
    }} />;
  }

  const inputClass = (field: keyof FormData) =>
    `h-10 rounded-xl text-sm border-gray-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 ${errors[field] ? 'border-red-300 focus:ring-red-400 focus:border-red-400' : ''}`;

  const selectClass = (field: keyof FormData) =>
    `h-10 rounded-xl text-sm border-gray-200 focus:ring-1 focus:ring-emerald-500 ${errors[field] ? 'border-red-300' : ''}`;

  return (
    <div className="min-h-screen bg-[#F7F7F5] font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-sm font-semibold text-gray-900">New shipment</h1>
              <p className="text-xs text-gray-400">Complete all three steps</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs text-gray-400 w-7 text-right">{progress}%</span>
            </div>
            <div className="w-px h-5 bg-gray-200 hidden sm:block" />
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Truck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New request</span>
            </div>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-6 pb-3">
          <StepBar current={step} />
        </div>
      </header>

      {/* Form */}
      <main className="max-w-3xl mx-auto px-6 py-10">
        <form onSubmit={handleSubmit} noValidate>
          {/* STEP 0: Sender */}
          {step === 0 && (
            <Section title="Sender information" subtitle="Who is sending this package?" icon={Building2}>
              <div className="grid grid-cols-2 gap-x-5 gap-y-5">
                <Field label="Full name" required>
                  <Input name="senderName" placeholder="e.g. Mary Owusu" value={formData.senderName} onChange={handleChange} className={inputClass('senderName')} />
                  <ErrorMsg field="senderName" errors={errors} />
                </Field>

                <Field label="Phone number" required>
                  <Input name="senderPhone" placeholder="+233 24 000 0000" value={formData.senderPhone} onChange={handleChange} className={inputClass('senderPhone')} />
                  <ErrorMsg field="senderPhone" errors={errors} />
                </Field>

                <Field label="Email address" required>
                  <Input name="senderEmail" type="email" placeholder="mary@example.com" value={formData.senderEmail} onChange={handleChange} className={inputClass('senderEmail')} required />
                </Field>

                <Field label="Region">
                  <Select value={formData.pickupRegion} onValueChange={v => set('pickupRegion', v)}>
                    <SelectTrigger className={selectClass('pickupRegion')}>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {GHANA_REGIONS.map(r => <SelectItem key={r} value={r.toLowerCase().replace(/ /g, '-')}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Pickup address" required col2>
                  <Input name="pickupAddress" placeholder="Street name, area, city" value={formData.pickupAddress} onChange={handleChange} className={inputClass('pickupAddress')} />
                  <ErrorMsg field="pickupAddress" errors={errors} />
                </Field>

                <Field label="Preferred pickup time">
                  <Select value={formData.preferredPickupTime} onValueChange={v => set('preferredPickupTime', v)}>
                    <SelectTrigger className={selectClass('preferredPickupTime')}>
                      <SelectValue placeholder="Select time window" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning — 8 AM to 12 PM</SelectItem>
                      <SelectItem value="afternoon">Afternoon — 12 PM to 4 PM</SelectItem>
                      <SelectItem value="evening">Evening — 4 PM to 6 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </Section>
          )}

          {/* STEP 1: Recipient */}
          {step === 1 && (
            <Section title="Recipient information" subtitle="Who will receive this package?" icon={Home}>
              <div className="grid grid-cols-2 gap-x-5 gap-y-5">
                <Field label="Full name" required>
                  <Input name="recipientName" placeholder="e.g. John Mensah" value={formData.recipientName} onChange={handleChange} className={inputClass('recipientName')} />
                  <ErrorMsg field="recipientName" errors={errors} />
                </Field>

                <Field label="Phone number" required>
                  <Input name="recipientPhone" placeholder="+233 20 000 0000" value={formData.recipientPhone} onChange={handleChange} className={inputClass('recipientPhone')} />
                  <ErrorMsg field="recipientPhone" errors={errors} />
                </Field>

                <Field label="Email address">
                  <Input name="recipientEmail" type="email" placeholder="john@example.com" value={formData.recipientEmail} onChange={handleChange} className={inputClass('recipientEmail')} />
                </Field>

                <Field label="Region" required>
                  <Select value={formData.deliveryRegion} onValueChange={v => set('deliveryRegion', v)}>
                    <SelectTrigger className={selectClass('deliveryRegion')}>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {GHANA_REGIONS.map(r => <SelectItem key={r} value={r.toLowerCase().replace(/ /g, '-')}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <ErrorMsg field="deliveryRegion" errors={errors} />
                </Field>

                <Field label="Delivery address" required col2>
                  <Input name="deliveryAddress" placeholder="Street name, area, city" value={formData.deliveryAddress} onChange={handleChange} className={inputClass('deliveryAddress')} />
                  <ErrorMsg field="deliveryAddress" errors={errors} />
                </Field>

                <Field label="Landmark" hint="Helps the rider locate the address faster">
                  <Input name="landmark" placeholder="Near church, school, filling station…" value={formData.landmark} onChange={handleChange} className={inputClass('landmark')} />
                </Field>
              </div>
            </Section>
          )}

          {/* STEP 2: Package */}
          {step === 2 && (
            <Section title="Package details" subtitle="Tell us what you're sending" icon={Package}>
              <div className="grid grid-cols-2 gap-x-5 gap-y-5">
                <Field label="Package type" required>
                  <Select value={formData.packageType} onValueChange={v => set('packageType', v)}>
                    <SelectTrigger className={selectClass('packageType')}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="documents">Documents</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="gifts">Gifts</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <ErrorMsg field="packageType" errors={errors} />
                </Field>

                <Field label="Estimated weight" required>
                  <Select value={formData.estimatedWeight} onValueChange={v => set('estimatedWeight', v)}>
                    <SelectTrigger className={selectClass('estimatedWeight')}>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-1kg">Under 1 kg</SelectItem>
                      <SelectItem value="1-5kg">1 – 5 kg</SelectItem>
                      <SelectItem value="5-10kg">5 – 10 kg</SelectItem>
                      <SelectItem value="10-20kg">10 – 20 kg</SelectItem>
                      <SelectItem value="over-20kg">Over 20 kg</SelectItem>
                    </SelectContent>
                  </Select>
                  <ErrorMsg field="estimatedWeight" errors={errors} />
                </Field>

                <Field label="Estimated value">
                  <Select value={formData.estimatedValue} onValueChange={v => set('estimatedValue', v)}>
                    <SelectTrigger className={selectClass('estimatedValue')}>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-500">Under GHS 500</SelectItem>
                      <SelectItem value="500-2000">GHS 500 – 2,000</SelectItem>
                      <SelectItem value="2000-5000">GHS 2,000 – 5,000</SelectItem>
                      <SelectItem value="over-5000">Over GHS 5,000</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Delivery urgency" required>
                  <Select value={formData.deliveryUrgency} onValueChange={v => set('deliveryUrgency', v)}>
                    <SelectTrigger className={selectClass('deliveryUrgency')}>
                      <SelectValue placeholder="Select speed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard — 2 to 3 days</SelectItem>
                      <SelectItem value="express">Express — next day</SelectItem>
                      <SelectItem value="same-day">Same day</SelectItem>
                    </SelectContent>
                  </Select>
                  <ErrorMsg field="deliveryUrgency" errors={errors} />
                </Field>

                <Field label="Package description" required col2>
                  <Textarea name="packageDescription" placeholder="Describe the contents..." rows={3} value={formData.packageDescription} onChange={handleChange} className={`rounded-xl text-sm border-gray-200 focus:ring-1 focus:ring-emerald-500 resize-none ${errors.packageDescription ? 'border-red-300' : ''}`} />
                  <ErrorMsg field="packageDescription" errors={errors} />
                </Field>

                <Field label="Special handling instructions" col2>
                  <Textarea name="specialInstructions" placeholder="e.g. Fragile, keep upright..." rows={2} value={formData.specialInstructions} onChange={handleChange} className="rounded-xl text-sm border-gray-200 focus:ring-1 focus:ring-emerald-500 resize-none" />
                </Field>

                <Field label="Additional notes" col2>
                  <Textarea name="additionalNotes" placeholder="Gate code, call before arrival, etc." rows={2} value={formData.additionalNotes} onChange={handleChange} className="rounded-xl text-sm border-gray-200 focus:ring-1 focus:ring-emerald-500 resize-none" />
                </Field>
              </div>
            </Section>
          )}

          {/* Navigation */}
          <div className={`flex mt-6 ${step > 0 ? 'justify-between' : 'justify-end'}`}>
            {step > 0 && (
              <button type="button" onClick={back} className="h-10 px-5 text-sm font-medium rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 inline-flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}

            {step < 2 ? (
              <button type="button" onClick={next} className="h-10 px-5 text-sm font-medium rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white inline-flex items-center gap-2 shadow-sm">
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="submit" disabled={isLoading} className="h-10 px-6 text-sm font-medium rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 text-white inline-flex items-center gap-2 shadow-sm min-w-36 justify-center">
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Submit shipment
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}