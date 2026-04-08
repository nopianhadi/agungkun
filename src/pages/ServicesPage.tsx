import React from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from '../components/UI/FadeIn';

export const ServicesPage = () => {
  const experiences = [
    { title: "Sesi Pribadi", details: ["Durasi 2 jam", "50+ foto yang diedit", "Galeri online pribadi", "Konsultasi gaya"] },
    { title: "Kampanye Brand", details: ["Lisensi komersial", "Pengarahan kreatif", "Peralatan tingkat tinggi", "Pengeditan mendetail"] },
    { title: "Pernikahan", details: ["Liputan seharian", "Kotak kenangan fisik", "Slide show sinematik", "2 fotografer"] }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-40 px-6 max-w-[1400px] mx-auto"
    >
      <div className="text-sm mb-16 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1F2021] block" />
        Layanan / (02)
      </div>

      <div className="grid md:grid-cols-12 gap-12 md:gap-24 mb-32">
        <div className="md:col-span-8">
          <FadeIn>
            <h1 className="text-5xl md:text-8xl font-medium tracking-tighter mb-12 leading-[0.9]">
              Layanan yang <br />
              Disesuaikan.
            </h1>
            <p className="text-xl md:text-3xl leading-relaxed text-[#1F2021]/80 mb-12 max-w-3xl">
              Kami menawarkan berbagai paket fotografi yang dirancang untuk memenuhi kebutuhan unik Anda, mulai dari potret pribadi hingga kampanye komersial skala besar.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-40">
        {experiences.map((exp, idx) => (
          <FadeIn key={exp.title} delay={idx * 0.1} direction="up">
            <div className="p-8 md:p-12 border border-gray-100 rounded-sm hover:border-[#1F2021] transition-colors group">
              <h3 className="text-2xl font-medium mb-8 tracking-tight">{exp.title}</h3>
              <ul className="flex flex-col gap-4">
                {exp.details.map((detail, dIdx) => (
                  <li key={dIdx} className="text-sm text-gray-500 flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-gray-200" />
                    {detail}
                  </li>
                ))}
              </ul>
              <div className="mt-12 pt-8 border-t border-gray-50 group-hover:border-gray-200 transition-colors">
                <a href="/kontak" className="text-sm font-medium uppercase tracking-widest hover:opacity-50 transition-opacity">
                  Pesan Sekarang
                </a>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <div className="bg-[#1F2021] text-white p-12 md:p-24 rounded-sm">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <FadeIn direction="right">
            <h2 className="text-4xl md:text-6xl font-medium tracking-tighter leading-tight">
              Ada proyek khusus dalam pikiran?
            </h2>
          </FadeIn>
          <FadeIn direction="left" delay={0.2} className="flex justify-start md:justify-end">
            <a href="/kontak" className="inline-block bg-white text-[#1F2021] px-12 py-6 rounded-full text-sm font-medium hover:bg-gray-100 transition-all hover:scale-105 active:scale-95">
              Mari Berdiskusi
            </a>
          </FadeIn>
        </div>
      </div>
    </motion.div>
  );
};
