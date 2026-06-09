import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Truck } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-emerald-700 to-teal-700 rounded-lg p-1.5">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                SwiftTrack
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Fast, reliable, and secure package delivery across the nation. Track your shipments in real-time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/how-it-works" className="text-gray-400 hover:text-emerald-500 text-sm transition-colors">
                  How it works
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-emerald-500 text-sm transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link to="/send-package" className="text-gray-400 hover:text-emerald-500 text-sm transition-colors">
                  Send a package
                </Link>
              </li>
              <li>
                <Link to="/get-started" className="text-gray-400 hover:text-emerald-500 text-sm transition-colors">
                  Get started
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+233 24 618 3286</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>kyeiernest86@gmail.com</span>
              </li>
              <li className="flex items-start space-x-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Accra, Ghana</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-3">Get the latest updates about our services</p>
            <div className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <button className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-800 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} SwiftTrack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;