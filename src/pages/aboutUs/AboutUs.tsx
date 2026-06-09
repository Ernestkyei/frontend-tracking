// pages/About.tsx
import { 
  Heart, 
  Shield, 
  QrCode, 
  Eye, 
  CheckCircle,
  Clock,
} from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-emerald-800 to-teal-800 text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
              <Heart className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Our Story
          </h1>
          <p className="text-2xl md:text-3xl font-semibold max-w-3xl mx-auto">
            Built in Ghana, <span className="text-yellow-300">for Ghana.</span>
          </p>
        </div>
      </section>

      {/* Why We Built This */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why we built this
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Too many deliveries in Ghana were marked "delivered" when they weren't. 
                Recipients had no way to prove it. Senders had no recourse.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We built a system where delivery confirmation happens from the 
                recipient's side — not the driver's.
              </p>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100">
              <div className="flex items-start gap-4">
                <QrCode className="w-12 h-12 text-emerald-700 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    QR Code = Proof of Delivery
                  </h3>
                  <p className="text-gray-600">
                    When the recipient scans it, everyone knows: sender, driver, and our operations team. 
                    No disputes. No uncertainty.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What makes us different
            </h2>
            <div className="w-24 h-1 bg-emerald-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="flex gap-4 p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <QrCode className="w-6 h-6 text-emerald-700" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Unique QR Code Per Shipment
                </h3>
                <p className="text-gray-600">
                  Every shipment gets a unique QR code attached to the physical package. 
                  The recipient scans it at the door for instant confirmation.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4 p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-700" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Recipient Confirmed Delivery
                </h3>
                <p className="text-gray-600">
                  Their phone opens a confirmation page, they tap "I received this," 
                  and the system updates instantly for everyone.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4 p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Eye className="w-6 h-6 text-emerald-700" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Real-Time Admin Monitoring
                </h3>
                <p className="text-gray-600">
                  Our admin team monitors every delivery in real time. If a delivery 
                  fails or stalls, we know immediately.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex gap-4 p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-emerald-700" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Proactive Problem Solving
                </h3>
                <p className="text-gray-600">
                  We act immediately — not hours later when a customer calls to complain. 
                  Issues are resolved before you even know they happened.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Trust Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-800 to-teal-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-emerald-100">Recipient Verified</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">Real-Time</div>
              <div className="text-emerald-100">Tracking Updates</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">Zero Disputes</div>
              <div className="text-emerald-100">QR Confirmed Deliveries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
              <Shield className="w-10 h-10 text-emerald-700" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Mission
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            To bring transparency, accountability, and trust to Ghana's delivery industry. 
            Every package. Every delivery. Every time.
          </p>
        </div>
      </section>
    </div>
  );
}