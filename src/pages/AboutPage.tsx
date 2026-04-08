import React from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from '../components/UI/FadeIn';

export const AboutPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-40 px-6 max-w-[1400px] mx-auto"
    >
      <div className="text-sm mb-16 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1F2021] block" />
        Tentang / (01)
      </div>

      <div className="grid md:grid-cols-12 gap-12 md:gap-24 mb-32">
        <div className="md:col-span-8">
          <FadeIn>
            <h1 className="text-5xl md:text-8xl font-medium tracking-tighter mb-12 leading-[0.9]">
              Memahat cahaya, <br />
              menangkap nyawa.
            </h1>
            <p className="text-xl md:text-3xl leading-relaxed text-[#1F2021]/80 mb-12 max-w-3xl">
              Nama saya Agung Kun, seorang fotografer yang berbasis di Indonesia dengan hasrat mendalam untuk menangkap momen-momen yang paling jujur dan bermakna. Bagi saya, fotografi bukan hanya tentang menekan tombol rana, tetapi tentang melihat apa yang sering terlewatkan.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 md:gap-24 mb-32">
        <FadeIn direction="right">
          <div className="aspect-[4/5] overflow-hidden rounded-sm bg-gray-50">
            <img
              src="https://images.unsplash.com/photo-1554046920-90dcac824b23?q=80&w=1200&auto=format&fit=crop"
              alt="Profil"
              className="w-full h-full object-cover grayscale"
            />
          </div>
        </FadeIn>
        <div className="flex flex-col justify-center">
          <FadeIn direction="left" delay={0.2}>
            <h2 className="text-3xl font-medium mb-8 tracking-tight">Filosofi Saya</h2>
            <p className="text-lg text-gray-500 mb-8 leading-relaxed">
              Saya percaya bahwa keindahan sejati terletak pada ketidakteraturan dan spontanitas. Dalam setiap sesi foto, saya berusaha menciptakan lingkungan yang santai di mana subjek saya bisa menjadi diri mereka sendiri.
            </p>
            <p className="text-lg text-gray-500 mb-8 leading-relaxed">
              Dari pernikahan yang megah hingga potret pribadi yang tenang, pendekatan saya tetap sama: memperhatikan detail, menghargai cahaya alami, dan menceritakan kisah yang autentik.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-32">
        <div className="grid md:grid-cols-3 gap-12">
          <FadeIn delay={0.1}>
            <h3 className="text-xl font-medium mb-4 tracking-tight">Visi</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Menjadi jembatan antara momen yang berlalu dan kenangan yang abadi melalui lensa seni.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h3 className="text-xl font-medium mb-4 tracking-tight">Misi</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Memberikan pengalaman fotografi yang personal, bermakna, dan berkualitas tinggi bagi setiap klien.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <h3 className="text-xl font-medium mb-4 tracking-tight">Nilai</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Otentisitas, Keberanian, Kesederhanaan, dan Kualitas tanpa kompromi.
            </p>
          </FadeIn>
        </div>
      </div>
    </motion.div>
  );
};
