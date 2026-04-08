import React from 'react';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '../UI/FadeIn';

export const Services = () => {
  const services = [
    { num: "01", title: "Sesi Pribadi", desc: "Potret dengan komposisi indah yang sarat akan suasana, makna, dan keaslian." },
    { num: "02", title: "Kampanye", desc: "Visual yang berani untuk kampanye dan branding pribadi yang meninggalkan kesan mendalam." },
    { num: "03", title: "Pernikahan", desc: "Citra yang elegan, emosional, dan abadi yang menceritakan kisah lengkap hari Anda." },
    { num: "04", title: "Acara", desc: "Tangkapan alami yang berfokus pada cerita dari momen-momen spesial — jujur dan tak terlupakan." },
  ];

  return (
    <section id="services" className="bg-white text-[#1F2021] py-24 md:py-40 px-6 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-start mb-24">
          <div className="text-sm flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F2021] block" />
            Layanan / (02)
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs uppercase tracking-widest text-gray-400 border border-gray-200 rounded-full px-6 py-2">
            Foto diterbitkan di <span className="text-[#1F2021] font-bold">VOGUE</span>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-12 md:gap-24">
          <div className="md:col-span-5">
            <FadeIn>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-8">Momen yang saya tangkap</p>
              <h2 className="text-3xl md:text-5xl font-medium leading-tight mb-12 tracking-tighter">
                Saya menangkap momen-momen bermakna melalui berbagai layanan fotografi yang disesuaikan.
              </h2>
              <p className="text-lg text-gray-500 mb-12 max-w-md leading-relaxed">
                Citra yang elegan, emosional, dan abadi yang menceritakan kisah lengkap hari Anda.
              </p>
              <a href="/layanan" className="inline-flex items-center gap-2 text-sm font-medium border-b border-[#1F2021] pb-1 hover:opacity-60 transition-opacity">
                Jelajahi galeri saya <ArrowRight size={16} />
              </a>
            </FadeIn>
          </div>

          <div className="md:col-span-7">
            <div className="flex flex-col">
              {services.map((srv, idx) => (
                <FadeIn key={srv.num} delay={0.1 * idx} direction="up">
                  <div className="group flex flex-col md:flex-row md:items-center justify-between py-12 border-b border-gray-100 first:border-t">
                    <div className="flex items-center gap-8 mb-4 md:mb-0">
                      <span className="text-xs text-gray-400 font-mono">{srv.num}</span>
                      <h3 className="text-2xl md:text-3xl font-medium tracking-tight group-hover:translate-x-2 transition-transform duration-500">{srv.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500 max-w-xs leading-relaxed md:text-right">
                      {srv.desc}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
