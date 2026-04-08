import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const MenuOverlay = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Jurnal', path: '/jurnal' },
    { name: 'Tentang', path: '/tentang' },
    { name: 'Layanan', path: '/layanan' },
    { name: 'Galeri', path: '/galeri' },
    { name: 'Kontak', path: '/kontak' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] bg-white p-6 md:p-12 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <Link to="/" onClick={onClose} className="text-3xl font-bold italic tracking-tighter text-[#1F2021]">m</Link>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-8">
              <p className="text-xs uppercase tracking-widest text-gray-400">Navigasi</p>
              <ul className="flex flex-col gap-4">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={`text-5xl md:text-8xl font-medium tracking-tighter hover:text-gray-400 transition-colors ${
                        location.pathname === item.path ? 'text-[#1F2021]' : 'text-gray-200'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-12 md:pl-24">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-6">Media Sosial</p>
                <ul className="flex flex-col gap-3 text-lg">
                  <li><a href="https://instagram.com/agungkunn" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">Instagram</a></li>
                  <li><a href="#" className="hover:text-gray-400 transition-colors">Twitter / X</a></li>
                  <li><a href="#" className="hover:text-gray-400 transition-colors">Pexels</a></li>
                </ul>
              </div>

              <div className="flex items-start gap-6 pt-12 border-t border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1554046920-90dcac824b23?q=80&w=100&auto=format&fit=crop"
                  alt="Agung Kun"
                  className="w-12 h-12 rounded-sm object-cover grayscale"
                />
                <p className="text-sm text-gray-500 max-w-[200px]">
                  "Saya memotret foto-foto yang autentik dan ekspresif, yang menangkap esensi dari setiap momen."
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end pt-12 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">WhatsApp</p>
                <a href="https://wa.me/6287802023377" target="_blank" rel="noopener noreferrer" className="text-2xl font-medium hover:text-green-600 transition-colors flex items-center gap-3">
                  WhatsApp
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Email</p>
                <a href="mailto:aguangkun@gmail.com" className="text-2xl font-medium hover:text-gray-400 transition-colors">
                  aguangkun@gmail.com
                </a>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4 md:mt-0">
              Indonesia
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
