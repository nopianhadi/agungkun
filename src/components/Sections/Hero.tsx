import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacity = useTransform(scrollY, [0, 800], [1, 0]);

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden bg-white">
      <motion.img
        style={{ y }}
        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2000&auto=format&fit=crop"
        alt="Hero"
        className="absolute inset-0 w-full h-[120%] object-cover grayscale opacity-90 origin-top"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />

      <motion.div
        style={{ opacity }}
        className="absolute bottom-0 left-0 w-full p-6 md:p-12 flex flex-col md:flex-row justify-between items-end text-[#1F2021]"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="text-7xl md:text-[12vw] leading-[0.8] font-medium tracking-tighter mb-4">moment</h1>
          <p className="text-lg md:text-2xl font-medium tracking-tight">Oleh Agung Kun</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex flex-col items-end gap-4"
        >
          <div className="hidden md:flex gap-16 text-[10px] uppercase tracking-[0.2em] opacity-50 mb-8">
            <div>
              <p className="mb-1">6720 × 4480</p>
              <p>Dual Pixel Raw</p>
            </div>
            <div>
              <p className="mb-1">36 x 24 mm</p>
              <p>Canon EOS</p>
            </div>
          </div>
          <div className="flex items-center gap-4 animate-bounce">
            <span className="text-[10px] uppercase tracking-widest opacity-50">Gulir untuk eksplorasi</span>
            <div className="w-px h-12 bg-[#1F2021]/20" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
