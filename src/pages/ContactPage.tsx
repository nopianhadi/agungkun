import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Send } from 'lucide-react';
import { FadeIn } from '../components/UI/FadeIn';

export const ContactPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-40 px-6 max-w-[1400px] mx-auto"
    >
      <div className="text-sm mb-16 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1F2021] block" />
        Kontak / (05)
      </div>

      <div className="grid md:grid-cols-12 gap-12 md:gap-24">
        <div className="md:col-span-5">
          <FadeIn direction="right">
            <h1 className="text-5xl md:text-8xl font-medium tracking-tighter mb-12 leading-[0.9]">
              Mari <br />
              Bekerja <br />
              Sama.
            </h1>
            <div className="flex flex-col gap-12 pt-12 border-t border-gray-100">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Email</p>
                <a href="mailto:aguangkun@gmail.com" className="text-2xl md:text-3xl font-medium hover:text-gray-400 transition-colors">
                  aguangkun@gmail.com
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">WhatsApp</p>
                <a href="https://wa.me/6287802023377" target="_blank" rel="noopener noreferrer" className="text-2xl md:text-3xl font-medium hover:text-green-600 transition-colors">
                  +62 878-0202-3377
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Lokasi</p>
                <p className="text-2xl md:text-3xl font-medium">Indonesia</p>
                <p className="text-sm text-gray-400 mt-2">Tersedia untuk penugasan di seluruh dunia</p>
              </div>
            </div>
          </FadeIn>
        </div>

        <div className="md:col-span-7">
          <FadeIn direction="left" delay={0.2}>
            <form className="flex flex-col gap-12">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 focus-within:border-[#1F2021] transition-colors">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400">Nama Lengkap</label>
                  <input 
                    type="text" 
                    placeholder="Masukkan nama Anda" 
                    className="bg-transparent text-xl font-medium outline-none placeholder:text-gray-200"
                  />
                </div>
                <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 focus-within:border-[#1F2021] transition-colors">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400">Alamat Email</label>
                  <input 
                    type="email" 
                    placeholder="Masukkan email Anda" 
                    className="bg-transparent text-xl font-medium outline-none placeholder:text-gray-200"
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 focus-within:border-[#1F2021] transition-colors">
                <label className="text-[10px] uppercase tracking-widest text-gray-400">Subjek</label>
                <input 
                  type="text" 
                  placeholder="Apa yang ingin Anda diskusikan?" 
                  className="bg-transparent text-xl font-medium outline-none placeholder:text-gray-200"
                />
              </div>

              <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 focus-within:border-[#1F2021] transition-colors">
                <label className="text-[10px] uppercase tracking-widest text-gray-400">Pesan</label>
                <textarea 
                  rows={4} 
                  placeholder="Tulis pesan Anda di sini..." 
                  className="bg-transparent text-xl font-medium outline-none placeholder:text-gray-200 resize-none"
                />
              </div>

              <button 
                type="submit"
                className="group flex items-center justify-center gap-4 bg-[#1F2021] text-white py-8 rounded-full text-sm font-medium hover:bg-gray-800 transition-all hover:scale-[1.02] active:scale-95"
              >
                Kirim Pesan
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                  <Send size={16} />
                </div>
              </button>
            </form>
          </FadeIn>
        </div>
      </div>
    </motion.div>
  );
};
