import React from 'react';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '../UI/FadeIn';
import { useSiteContent } from '../../hooks/useSiteContent';
import { supabase } from '../../lib/supabase';

export const Showcase = () => {
  const { getContent } = useSiteContent();
  const [showcaseItems, setShowcaseItems] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchShowcase = async () => {
      const { data } = await supabase.from('showcase').select('*').order('order', { ascending: true });
      if (data && data.length > 0) {
        setShowcaseItems(data);
      } else {
        // Fallback
        setShowcaseItems([
          { image_url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=600&auto=format&fit=crop", title: "Showcase 1" },
          { image_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop", title: "Showcase 2" },
          { image_url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=600&auto=format&fit=crop", title: "Showcase 3" },
          { image_url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop", title: "Showcase 4" }
        ]);
      }
    };
    fetchShowcase();
  }, []);

  return (
    <section id="showcase" className="py-24 md:py-40 px-6 max-w-[1400px] mx-auto overflow-hidden border-t border-gray-100">
      <div className="flex justify-between items-end mb-24">
        <div className="text-sm flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1F2021] block" />
          {getContent('showcase_badge', `Showcase / (${showcaseItems.length.toString().padStart(2, '0')})`)}
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">{getContent('showcase_header', 'Album Pexels paling banyak dilihat')}</p>
          <a href={getContent('showcase_link_url', '#')} className="inline-flex items-center gap-2 bg-[#1F2021] text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-gray-800 transition-all hover:scale-105">
            {getContent('showcase_link_text', 'Lihat album')} <ArrowRight size={16} />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {showcaseItems.map((item, idx) => (
          <FadeIn key={item.id || idx} delay={idx * 0.1} direction="up">
            <div className="aspect-[3/4] overflow-hidden rounded-sm group">
              <img
                src={item.image_url}
                alt={item.title || `Showcase ${idx + 1}`}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
              />
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};
