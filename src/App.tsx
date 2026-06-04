import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/homePage/Home';
import HowItWorks from './pages/howItWorks/HowItWorks';
import AboutUs from './pages/aboutUs/AboutUs';
import SendPackage from './pages/sendPackage/sendPackage';

import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/send-package" element={<SendPackage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;