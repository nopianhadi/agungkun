import React from 'react';
import { motion } from 'framer-motion';
import { Hero } from '../components/Sections/Hero';
import { About } from '../components/Sections/About';
import { Services } from '../components/Sections/Services';
import { Gallery } from '../components/Sections/Gallery';
import { VideoSection } from '../components/Sections/VideoSection';
import { Testimonials } from '../components/Sections/Testimonials';
import { Showcase } from '../components/Sections/Showcase';

export const Home = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      <About />
      <Services />
      <Gallery />
      <VideoSection />
      <Testimonials />
      <Showcase />
    </motion.main>
  );
};
