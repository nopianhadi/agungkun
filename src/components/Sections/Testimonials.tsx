import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { FadeIn } from '../UI/FadeIn';

export const Testimonials = () => {
  return (
    <section id="testimonials" className="bg-white text-[#1F2021] py-24 md:py-40 px-6 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-sm flex items-center gap-2 text-gray-400 mb-24">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 block" />
          Testimoni / (04)
        </div>

        <div className="grid md:grid-cols-12 gap-12 md:gap-24">
          <div className="md:col-span-8">
            <FadeIn>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tighter mb-16 text-[#1F2021]">
                "Saya biasanya benci difoto, tapi kali ini terasa sangat berbeda. Sangat santai, tidak ada yang dipaksakan. Hasil fotonya benar-benar terlihat seperti saya, bukan versi saya yang berusaha terlalu keras."
              </h2>
            </FadeIn>
          </div>

          <div className="md:col-span-4 flex flex-col justify-end">
            <FadeIn delay={0.2} className="flex flex-col gap-8">
              <div className="flex items-center gap-6">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                  alt="Anna Pechuro"
                  className="w-24 h-24 object-cover grayscale rounded-sm"
                />
                <div>
                  <p className="text-2xl font-medium tracking-tight mb-1">Anna Pechuro</p>
                  <p className="text-sm text-gray-400">Sesi foto di <span className="text-[#1F2021]">Prague</span></p>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center hover:bg-[#1F2021] hover:text-white transition-all duration-500">
                  <ArrowLeft size={24} />
                </button>
                <button className="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center hover:bg-[#1F2021] hover:text-white transition-all duration-500">
                  <ArrowRight size={24} />
                </button>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};
