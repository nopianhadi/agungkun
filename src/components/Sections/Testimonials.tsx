import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { FadeIn } from '../UI/FadeIn';
import { useSiteContent } from '../../hooks/useSiteContent';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export const Testimonials = () => {
  const { getContent } = useSiteContent();
  const [testimonials, setTestimonials] = React.useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase.from('testimonials').select('*').order('order', { ascending: true });
      if (data) setTestimonials(data);
    };
    fetchTestimonials();
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const current = testimonials[currentIndex] || {
    quote: getContent('testi_quote', 'Saya biasanya benci difoto, tapi kali ini terasa sangat berbeda.'),
    name: getContent('testi_author_name', 'Anna Pechuro'),
    location: getContent('testi_author_loc', 'Prague'),
    image_url: getContent('testi_author_image', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop')
  };

  return (
    <section id="testimonials" className="bg-white text-[#1F2021] py-24 md:py-40 px-6 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-sm flex items-center gap-2 text-gray-400 mb-24">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 block" />
          {getContent('testi_badge', `Testimoni / (${testimonials.length.toString().padStart(2, '0')})`)}
        </div>

        <div className="grid md:grid-cols-12 gap-12 md:gap-24">
          <div className="md:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tighter mb-16 text-[#1F2021]">
                  "{current.quote}"
                </h2>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="md:col-span-4 flex flex-col justify-end">
            <FadeIn delay={0.2} className="flex flex-col gap-8">
              <div className="flex items-center gap-6">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    src={current.image_url}
                    alt={current.name}
                    className="w-24 h-24 object-cover grayscale rounded-sm"
                  />
                </AnimatePresence>
                <div>
                  <p className="text-2xl font-medium tracking-tight mb-1">{current.name}</p>
                  <p className="text-sm text-gray-400">
                    Sesi foto di <span className="text-[#1F2021]">{current.location}</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={prev} className="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center hover:bg-[#1F2021] hover:text-white transition-all duration-500">
                  <ArrowLeft size={24} />
                </button>
                <button onClick={next} className="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center hover:bg-[#1F2021] hover:text-white transition-all duration-500">
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
