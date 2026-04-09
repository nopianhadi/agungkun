import React from 'react';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '../UI/FadeIn';
import { useSiteContent } from '../../hooks/useSiteContent';

export const About = () => {
  const { getContent } = useSiteContent();
  return (
    <section id="about" className="py-24 md:py-40 px-6 max-w-[1400px] mx-auto">
      <div className="text-sm mb-16 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1F2021] block" />
        Tentang / (01)
      </div>

      <div className="grid md:grid-cols-12 gap-12 md:gap-24 items-start">
        <div className="md:col-span-7">
          <FadeIn>
            <h2 className="text-4xl md:text-6xl font-medium leading-[1.2] tracking-tighter text-[#1F2021] mb-12">
              {getContent('about_title', 'Portofolio ini adalah buku harian visual dari tempat, orang, dan momen yang saya kumpulkan melalui lensa.')}
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed text-[#1F2021]/80 mb-12 max-w-2xl">
              {getContent('about_description', '“Saya memotret foto-foto yang autentik dan ekspresif, yang menangkap esensi dari setiap momen.”')}
            </p>
            <a href="/tentang" className="inline-flex items-center gap-2 text-sm font-medium border-b border-[#1F2021] pb-1 hover:opacity-60 transition-opacity">
              Baca selengkapnya <ArrowRight size={16} />
            </a>
          </FadeIn>
        </div>

        <div className="md:col-span-5">
          <FadeIn delay={0.2}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm mb-8">
              <img
                src={getContent('about_image', "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop")}
                alt="Kyoto"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-xs uppercase tracking-widest mb-1">Dipotret di</p>
                <p className="text-2xl font-medium tracking-tight">{getContent('about_location', 'Kyoto')}</p>
              </div>
            </div>
            <a href="/galeri" className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-60 transition-opacity">
              Lihat galeri <ArrowRight size={16} />
            </a>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
