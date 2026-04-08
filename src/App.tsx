import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';
import { useAuth } from './hooks/useAuth';
import { Login } from './components/Admin/Login';
import { Dashboard } from './components/Admin/Dashboard';
import { ErrorBoundary } from './components/ErrorBoundary';

// Layout & UI
import { Navbar } from './components/Layout/Navbar';
import { MenuOverlay } from './components/Layout/MenuOverlay';
import { Footer } from './components/Layout/Footer';
import { WhatsAppButton } from './components/UI/WhatsAppButton';

// Pages
import { Home } from './pages/Home';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { GalleryPage } from './pages/GalleryPage';
import { JournalPage } from './pages/JournalPage';
import { ContactPage } from './pages/ContactPage';
import { ProjectDetail } from './pages/ProjectDetail';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const isAdminRoute = location.pathname === '/admin';

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Handle scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (isAdminRoute) {
    if (authLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-gray-100 border-t-[#1F2021] rounded-full animate-spin" /></div>;
    if (!user) return <Login />;
    if (!isAdmin) return <div className="min-h-screen flex items-center justify-center text-center px-6"><div><h1 className="text-2xl font-medium mb-4">Akses Ditolak</h1><p className="text-gray-500">Anda tidak memiliki izin untuk mengakses dasbor admin.</p></div></div>;
    return (
      <ErrorBoundary>
        <Dashboard />
      </ErrorBoundary>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#1F2021] selection:bg-[#1F2021] selection:text-white">
      <Navbar onMenuOpen={() => setIsMenuOpen(true)} />
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <AnimatePresence mode="wait">
        <motion.div key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/tentang" element={<AboutPage />} />
            <Route path="/layanan" element={<ServicesPage />} />
            <Route path="/galeri" element={<GalleryPage />} />
            <Route path="/jurnal" element={<JournalPage />} />
            <Route path="/kontak" element={<ContactPage />} />
            <Route path="/project/:projectId" element={<ProjectDetail />} />
            <Route path="/admin" element={<div />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
