// pages/HowItWorks.tsx

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Four steps. <span className="text-blue-600">Zero guesswork.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We built the system around proof — not promises. Every delivery is confirmed by the person receiving it.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="text-4xl font-bold text-blue-600 mb-4">01</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Submit a request</h3>
            <p className="text-gray-600 leading-relaxed">
              Fill in pickup address, delivery address, package details, and urgency. Takes under 2 minutes.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="text-4xl font-bold text-blue-600 mb-4">02</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">We assign a driver</h3>
            <p className="text-gray-600 leading-relaxed">
              Our admin team reviews your request, creates the shipment, and assigns the nearest available driver.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="text-4xl font-bold text-blue-600 mb-4">03</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Track in real time</h3>
            <p className="text-gray-600 leading-relaxed">
              From pickup to doorstep, you see every status change live. No more "where is my package?" uncertainty.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="text-4xl font-bold text-blue-600 mb-4">04</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">QR confirmed delivery</h3>
            <p className="text-gray-600 leading-relaxed">
              Your recipient scans the QR code on the package. That scan is the official delivery confirmation — not a driver's tap.
            </p>
          </div>
        </div>

        {/* Track Package Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12 mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Track a package
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Where is my package?
          </p>
          
          <div className="max-w-2xl mx-auto">
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Enter tracking number (e.g., TRK-2026-001)"
                className="flex-1 px-6 py-4 text-lg rounded-xl border-2 border-white bg-white focus:outline-none focus:border-blue-300"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Track
              </button>
            </form>
            <p className="text-blue-100 text-sm mt-4">
              Example: TRK-2026-001
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to send?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Get your package moving today. Fill in the request form and our team will take it from there.
          </p>
          <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors">
            Send a package →
          </button>
        </div>
      </div>
    </div>
  );
}