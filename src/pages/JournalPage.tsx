import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '../components/UI/FadeIn';

export const JournalPage = () => {
  const stories = [
    {
      date: "Desember 2025",
      title: "Cahaya di Antara Hutan Pinus",
      excerpt: "Mencari keheningan di tengah hiruk pikuk kota, saya menemukan cahaya yang menakjubkan di antara celah pohon pinus.",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop",
      category: "Cerita Visual"
    },
    {
      date: "Oktober 2025",
      title: "Geometri Jalanan Tokyo",
      excerpt: "Eksplorasi garis dan bayangan di salah satu persimpangan tersibuk di dunia. Bagaimana keteraturan muncul dari kekacauan.",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop",
      category: "Perjalanan"
    },
    {
      date: "Agustus 2025",
      title: "Dibalik Lensa: Sesi Potret di Tepi Pantai",
      excerpt: "Tantangan menggunakan cahaya alami saat matahari terbenam untuk menangkap emosi yang tulus.",
      image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop",
      category: "Teknik"
    }
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
        Jurnal / (04)
      </div>

      <div className="grid md:grid-cols-12 gap-12 md:gap-24 mb-32">
        <div className="md:col-span-8">
          <FadeIn>
            <h1 className="text-5xl md:text-8xl font-medium tracking-tighter mb-12 leading-[0.9]">
              Cerita di <br />
              Balik Lensa.
            </h1>
            <p className="text-xl md:text-3xl leading-relaxed text-[#1F2021]/80 mb-12 max-w-3xl">
              Catatan tentang perjalanan, pemikiran teknis, dan cerita dari orang-orang yang saya temui di sepanjang jalan.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="flex flex-col gap-24 md:gap-40">
        {stories.map((story, idx) => (
          <FadeIn key={story.title} direction="up" delay={idx * 0.1}>
            <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center group cursor-pointer">
              <div className={`overflow-hidden rounded-sm ${idx % 2 === 1 ? 'md:order-2' : ''}`}>
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full aspect-[16/9] object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-gray-400">
                  <span>{story.date}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-200" />
                  <span>{story.category}</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-medium tracking-tight group-hover:text-gray-500 transition-colors">
                  {story.title}
                </h2>
                <p className="text-lg text-gray-500 leading-relaxed max-w-md">
                  {story.excerpt}
                </p>
                <div className="flex items-center gap-3 text-sm font-medium border-b border-[#1F2021] w-fit pb-1 group-hover:gap-5 transition-all">
                  Baca Artikel <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </motion.div>
  );
};
