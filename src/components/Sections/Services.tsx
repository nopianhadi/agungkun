import React from 'react';
import { useSiteContent } from '../../hooks/useSiteContent';
import { FadeIn } from '../UI/FadeIn';
import { supabase } from '../../lib/supabase';

export const Services = () => {
  const { getContent } = useSiteContent();
  const [services, setServices] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from('site_services').select('*').order('order', { ascending: true });
      if (data && data.length > 0) {
        setServices(data);
      } else {
        // Fallback
        setServices([
          { num: "01", title: getContent('service_1_title', 'Editorial Photography'), description: getContent('service_1_desc', 'Storytelling visual yang kuat untuk majalah, kampanye fashion, dan konten branded.') },
          { num: "02", title: getContent('service_2_title', 'Intimate Portraiture'), description: getContent('service_2_desc', 'Menangkap esensi mentah dan emosi murni dalam suasana yang tenang dan personal.') },
          { num: "03", title: getContent('service_3_title', 'Brand Visuals'), description: getContent('service_3_desc', 'Estetika yang dikurasi untuk membantu brand Anda berkomunikasi dengan kejujuran dan gaya.') }
        ]);
      }
    };
    fetchServices();
  }, [getContent]);

  return (
    <section id="services" className="py-24 md:py-40 px-6 max-w-[1400px] mx-auto border-t border-gray-100">
      <div className="text-sm flex items-center gap-2 mb-24">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1F2021] block" />
        {getContent('services_badge', `Layanan Utama / (${services.length.toString().padStart(2, '0')})`)}
      </div>

      <div className="grid md:grid-cols-3 gap-12 md:gap-24">
        {services.map((service, idx) => (
          <FadeIn key={service.id || idx} delay={idx * 0.2}>
            <div className="space-y-8 group cursor-default">
              <div className="text-[10px] font-mono text-gray-400 tracking-widest">{service.num}</div>
              <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-[#1F2021] group-hover:translate-x-2 transition-transform duration-500">
                {service.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-light">
                {service.description}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};
