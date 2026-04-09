import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../../hooks/useSiteContent';

export const Footer = () => {
  const { scrollYProgress } = useScroll();
  const { getContent } = useSiteContent();
  const y = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-[#0a0a0a] text-white pt-24 md:pt-40 pb-12 px-6 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-2 gap-16 mb-40">
          <div className="flex flex-col justify-between">
            <div>
              <div className="text-sm flex items-center gap-2 text-gray-500 mb-12">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500 block" />
                Hubungi saya / (06)
              </div>

              <h2 className="text-4xl md:text-7xl font-medium leading-[0.9] mb-12 tracking-tighter max-w-md text-gray-100">
                {getContent('contact_footer_title', 'Mari kita abadikan kisah Anda bersama.')}
              </h2>

              <a href={`https://wa.me/${getContent('contact_whatsapp', '6287802023377')}`} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-4 bg-green-500 text-white px-10 py-6 rounded-full text-sm font-medium hover:bg-green-600 transition-all hover:scale-105 mb-16">
                Hubungi via WhatsApp
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight size={16} />
                </div>
              </a>
            </div>

            <div className="pt-12 border-t border-white/10">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-6">Hubungi saya di</p>
              <div className="flex flex-col gap-4 mb-12">
                <a href={`https://wa.me/${getContent('contact_whatsapp', '6287802023377')}`} target="_blank" rel="noopener noreferrer" className="text-3xl md:text-6xl font-medium block hover:text-green-500 transition-colors tracking-tighter leading-none">
                  +{getContent('contact_whatsapp', '6287802023377')}
                </a>
                <a href={`mailto:${getContent('contact_email', 'aguangkun@gmail.com')}`} className="text-2xl md:text-4xl font-medium block hover:text-gray-400 transition-colors tracking-tighter leading-none">
                  {getContent('contact_email', 'aguangkun@gmail.com')}
                </a>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <p className="text-sm text-gray-500 leading-relaxed max-w-[240px]">
                  Berbasis di Indonesia. Tersedia untuk penugasan di seluruh dunia.
                </p>
                <div className="flex gap-8 text-xs uppercase tracking-widest font-medium">
                  <a href={`https://instagram.com/${getContent('contact_instagram', 'agungkunn')}`} target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-opacity">Instagram</a>
                  <a href="#" className="hover:text-gray-400 transition-opacity">Twitter / X</a>
                  <a href="#" className="hover:text-gray-400 transition-opacity">Pexels</a>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:block overflow-hidden relative h-[700px] rounded-sm">
            <motion.img
              style={{ y }}
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"
              alt="Footer visual"
              className="w-full h-[140%] object-cover grayscale opacity-40 absolute -top-[20%]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]/80" />
          </div>
        </div>

        <div className="relative pt-12 border-t border-white/5">
          <div className="text-center overflow-hidden">
            <h1 className="text-[24vw] leading-[0.7] font-medium tracking-tighter text-white/5 select-none pointer-events-none">
              {getContent('hero_title', 'moment')}
            </h1>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mt-12 gap-6">
            <div className="flex items-center gap-8 text-[10px] uppercase tracking-[0.3em] text-gray-600">
              <p>© 2026 {getContent('brand_name', 'Agung Kun')}</p>
              <p>Hak cipta dilindungi undang-undang</p>
              <Link to="/admin" className="hover:text-white transition-colors">Admin</Link>
            </div>

            <button
              onClick={scrollToTop}
              className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-gray-400 hover:text-white transition-colors"
            >
              Kembali ke atas
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                <span className="text-lg leading-none">↑</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
