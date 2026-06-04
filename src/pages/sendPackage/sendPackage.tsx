// pages/SendPackage.tsx
import React from 'react'; 
import { useState } from 'react';
import { 
  MapPin, 
  QrCode, 
  Smartphone, 
  Zap,
  User,
  Send,
  Package,

} from 'lucide-react';

export default function SendPackage() {
  const [formData, setFormData] = useState({
    // Sender
    senderName: '',
    senderPhone: '',
    senderEmail: '',
    pickupAddress: '',
    pickupRegion: '',
    preferredPickupTime: '',
    
    // Recipient
    recipientName: '',
    recipientPhone: '',
    deliveryAddress: '',
    deliveryRegion: '',
    landmark: '',
    
    // Package
    packageType: '',
    estimatedWeight: '',
    estimatedValue: '',
    packageDescription: '',
    specialInstructions: '',
    deliveryUrgency: '',
    additionalNotes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // API call will go here
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Send a package</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Fill in the details below. Our team reviews every request and assigns a driver within the hour.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 px-4 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Real-time tracking</h3>
                <p className="text-sm text-gray-600">Both you and the recipient get a live tracking link</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <QrCode className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">QR delivery confirmation</h3>
                <p className="text-sm text-gray-600">Recipient scans to confirm delivery</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Smartphone className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">SMS notifications</h3>
                <p className="text-sm text-gray-600">Updates at every status change</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Fast review</h3>
                <p className="text-sm text-gray-600">Same-day pickup before noon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Shipment request</h2>
              <p className="text-sm text-gray-500">Fields marked * are required</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Sender Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Sender information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="senderName"
                      value={formData.senderName}
                      onChange={handleChange}
                      placeholder="e.g. Mary Owusu"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="senderPhone"
                      value={formData.senderPhone}
                      onChange={handleChange}
                      placeholder="+233 24 000 0000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email address
                    </label>
                    <input
                      type="email"
                      name="senderEmail"
                      value={formData.senderEmail}
                      onChange={handleChange}
                      placeholder="mary@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pickup address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pickupAddress"
                      value={formData.pickupAddress}
                      onChange={handleChange}
                      placeholder="Street, area, city — be as specific as possible"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Region
                    </label>
                    <select
                      name="pickupRegion"
                      value={formData.pickupRegion}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select region</option>
                      <option value="greater-accra">Greater Accra</option>
                      <option value="ashanti">Ashanti</option>
                      <option value="central">Central</option>
                      <option value="western">Western</option>
                      <option value="eastern">Eastern</option>
                      <option value="volta">Volta</option>
                      <option value="northern">Northern</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred pickup time
                    </label>
                    <select
                      name="preferredPickupTime"
                      value={formData.preferredPickupTime}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select time</option>
                      <option value="morning">Morning (8 AM – 12 PM)</option>
                      <option value="afternoon">Afternoon (12 PM – 4 PM)</option>
                      <option value="evening">Evening (4 PM – 6 PM)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Recipient Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Recipient information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recipient name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="recipientName"
                      value={formData.recipientName}
                      onChange={handleChange}
                      placeholder="e.g. John Mensah"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recipient phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="recipientPhone"
                      value={formData.recipientPhone}
                      onChange={handleChange}
                      placeholder="+233 20 000 0000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleChange}
                      placeholder="Street, area, city — exact address or nearest landmark"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery region <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="deliveryRegion"
                      value={formData.deliveryRegion}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select region</option>
                      <option value="greater-accra">Greater Accra</option>
                      <option value="ashanti">Ashanti</option>
                      <option value="central">Central</option>
                      <option value="western">Western</option>
                      <option value="eastern">Eastern</option>
                      <option value="volta">Volta</option>
                      <option value="northern">Northern</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Landmark (optional)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleChange}
                      placeholder="Near church, school, etc."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Package Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Package details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Package type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="packageType"
                      value={formData.packageType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select type</option>
                      <option value="documents">📄 Documents - Letters, files</option>
                      <option value="electronics">💻 Electronics - Phones, laptops</option>
                      <option value="clothing">👕 Clothing - Fabrics, fashion</option>
                      <option value="food">🥘 Food - Perishables</option>
                      <option value="gifts">🎁 Gifts - Parcels, boxes</option>
                      <option value="other">📦 Other - Anything else</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated weight <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="estimatedWeight"
                      value={formData.estimatedWeight}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select weight</option>
                      <option value="under-1kg">Under 1 kg</option>
                      <option value="1-5kg">1 – 5 kg</option>
                      <option value="5-10kg">5 – 10 kg</option>
                      <option value="10-20kg">10 – 20 kg</option>
                      <option value="over-20kg">Over 20 kg</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated value
                    </label>
                    <select
                      name="estimatedValue"
                      value={formData.estimatedValue}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select value</option>
                      <option value="under-500">Under GHS 500</option>
                      <option value="500-2000">GHS 500 – 2,000</option>
                      <option value="2000-5000">GHS 2,000 – 5,000</option>
                      <option value="over-5000">Over GHS 5,000</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery urgency <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="deliveryUrgency"
                      value={formData.deliveryUrgency}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select urgency</option>
                      <option value="standard">Standard (2–3 days)</option>
                      <option value="express">Express (next day)</option>
                      <option value="same-day">Same day</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Package description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="packageDescription"
                      value={formData.packageDescription}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Describe what's inside. Be specific — e.g. 'MacBook Pro laptop in original box, handle with care'"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special handling instructions
                    </label>
                    <textarea
                      name="specialInstructions"
                      value={formData.specialInstructions}
                      onChange={handleChange}
                      rows={2}
                      placeholder="e.g. Fragile — do not stack. Keep upright. Refrigerate on arrival."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional notes for our team
                    </label>
                    <textarea
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Anything else we should know — access codes, gate numbers, call before arrival, etc."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Terms and Submit */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-6">
                  <input type="checkbox" id="terms" className="mt-1" required />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    By submitting this form you agree to our Terms of Service and Privacy Policy. 
                    Our team will review your request and assign a driver within the hour during business hours. 
                    You will receive an SMS confirmation with your tracking number.
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  Submit shipment request
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}