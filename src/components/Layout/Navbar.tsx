import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

export const Navbar = ({ onMenuOpen }: { onMenuOpen: () => void }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#1F2021] origin-left z-[60]"
        style={{ scaleX }}
      />
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-8 text-[#1F2021] mix-blend-difference">
        <Link to="/" className="text-3xl font-bold italic tracking-tighter text-white hover:opacity-70 transition-opacity">m</Link>
        <button
          onClick={onMenuOpen}
          className="flex items-center gap-2 text-sm uppercase tracking-widest text-white hover:opacity-70 transition-opacity"
        >
          menu <span className="text-xl font-light tracking-[-0.2em] ml-1">::</span>
        </button>
      </nav>
    </>
  );
};
