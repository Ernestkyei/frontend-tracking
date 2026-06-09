// pages/home.tsx
import React from 'react'; 
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Clock, 
  Shield, 
  Truck,
  MapPin,
  Bell,
  ChevronRight,
  Package,
  CheckCircle
} from 'lucide-react';

// CountUp component
const CountUp = ({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const currentCount = Math.floor(progress * end);
      setCount(currentCount);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration]);

  return (
    <div ref={elementRef}>
      {count}{suffix}
    </div>
  );
};

export default function Home() {
  const navigate = useNavigate(); 
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setError('');
    setIsLoading(true);
    
    navigate(`/track/${trackingNumber.trim()}`);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-emerald-100 p-4 rounded-full">
              <Truck className="w-16 h-16 text-emerald-700" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Track Your Shipment
            <span className="text-emerald-700"> In Real-Time</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Enter your tracking number below to get instant updates on your package location and delivery status
          </p>

          {/* Tracking Form */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleTrackSubmit} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number (e.g., TRK123456)"
                  className="w-full pl-12 pr-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
                  disabled={isLoading}
                />
                {error && (
                  <p className="text-red-500 text-sm mt-2 text-left">{error}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 bg-emerald-700 text-white text-lg font-semibold rounded-lg hover:bg-emerald-800 transition-colors disabled:bg-emerald-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? 'Tracking...' : 'Track Package'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Our Tracking Service?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Updates</h3>
              <p className="text-gray-600">Get live location tracking and status updates for your shipment</p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Timeline View</h3>
              <p className="text-gray-600">See complete journey history with timestamps and locations</p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">Your package information is protected and always up-to-date</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-800 to-teal-800">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <Bell className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Ship Frequently?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Create a free account to save your tracking numbers, get notifications, and manage all your shipments in one place
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/register')}
              className="px-8 py-3 bg-white text-emerald-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              Sign Up Free
              <ChevronRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-emerald-700 transition-colors"
            >
              Login to Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section with Count Up */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="transform hover:scale-105 transition-transform">
              <div className="text-5xl md:text-6xl font-bold text-emerald-700 mb-2">
                <CountUp end={15000} duration={2500} suffix="+" />
              </div>
              <div className="text-gray-600 flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Packages Delivered
              </div>
            </div>
            <div className="transform hover:scale-105 transition-transform">
              <div className="text-5xl md:text-6xl font-bold text-emerald-700 mb-2">
                <CountUp end={99.9} duration={2000} suffix="%" />
              </div>
              <div className="text-gray-600 flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                On-Time Delivery
              </div>
            </div>
            <div className="transform hover:scale-105 transition-transform">
              <div className="text-5xl md:text-6xl font-bold text-emerald-700 mb-2">
                <CountUp end={24} duration={1500} suffix="/7" />
              </div>
              <div className="text-gray-600 flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Customer Support
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}