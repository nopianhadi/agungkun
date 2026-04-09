import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Check, ArrowRight, Camera, Sparkles, Heart, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FadeIn } from '../components/UI/FadeIn';
import { useSiteContent } from '../hooks/useSiteContent';

interface Package {
  id: string;
  title: string;
  description: string;
  price: string;
  features: string[];
  order: number;
}

export const PackagesPage = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const { scrollY } = useScroll();
  const { getContent } = useSiteContent();

  // Parallax transforms
  const heroY = useTransform(scrollY, [0, 500], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    fetchPackages();
    window.scrollTo(0, 0);
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white"
    >
      {/* --- HERO SECTION --- */}
      <section className="relative h-[80vh] w-full overflow-hidden bg-[#1F2021]">
        <motion.div style={{ y: heroY }} className="absolute inset-0 w-full h-[120%]">
          <img
            src={getContent('pkgs_hero_image', 'https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=2000&auto=format&fit=crop')}
            alt="Hero Background"
            className="w-full h-full object-cover grayscale opacity-60"
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/20" />
        
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-white"
        >
          <FadeIn direction="up">
            <span className="text-[10px] uppercase tracking-[0.4em] mb-8 block font-medium opacity-60">
              {getContent('pkgs_hero_badge', 'Investasi Masa Depan')}
            </span>
            <h1 className="text-6xl md:text-[10vw] font-medium tracking-tighter leading-[0.8] mb-8">
              {getContent('pkgs_hero_title', 'Momen Abadi.')}
            </h1>
            <p className="text-sm md:text-xl font-light tracking-wide max-w-xl mx-auto opacity-80 leading-relaxed">
              {getContent('pkgs_hero_desc', 'Sebuah investasi untuk kenangan yang tidak akan pernah pudar oleh waktu.')}
            </p>
          </FadeIn>
        </motion.div>
      </section>

      {/* --- NARRATIVE SECTION --- */}
      <section className="py-24 md:py-40 px-6 max-w-[1400px] mx-auto overflow-hidden">
        <div className="grid md:grid-cols-2 gap-24 items-center">
          <FadeIn direction="right">
            <div className="aspect-[3/4] overflow-hidden rounded-sm grayscale hover:grayscale-0 transition-all duration-1000">
              <img 
                src={getContent('pkgs_phil_image', 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop')} 
                alt="Philosophy" 
                className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-1000"
              />
            </div>
          </FadeIn>
          <FadeIn direction="left">
            <div className="space-y-12">
              <div className="text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1F2021] block" />
                {getContent('pkgs_phil_header', 'Filosofi Kami / (01)')}
              </div>
              <h2 className="text-4xl md:text-6xl font-medium tracking-tighter leading-[1.1]">
                {getContent('pkgs_phil_title', 'Lebih dari sekadar sebuah foto.')}
              </h2>
              <p className="text-lg md:text-2xl text-gray-400 font-light leading-relaxed">
                {getContent('pkgs_phil_desc', 'Kami percaya bahwa fotografi adalah tentang menangkap perasaan, bukan hanya penampilan. Setiap paket yang kami tawarkan dirancang untuk memberikan pengalaman yang nyaman, otentik, dan tak terlupakan.')}
              </p>
              <div className="grid grid-cols-2 gap-8 pt-12 border-t border-gray-100">
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-bold mb-4">{getContent('pkgs_phil_vision_title', 'Visi')}</h4>
                  <p className="text-sm text-gray-500">{getContent('pkgs_phil_vision_desc', 'Kualitas abadi yang melampaui tren masa kini.')}</p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-bold mb-4">{getContent('pkgs_phil_mission_title', 'Misi')}</h4>
                  <p className="text-sm text-gray-500">{getContent('pkgs_phil_mission_desc', 'Menciptakan warisan visual untuk generasi mendatang.')}</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* --- VISUAL BREAK GRID --- */}
      <section className="bg-gray-50 py-24 px-6 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop"
            ].map((img, idx) => (
              <FadeIn key={idx} delay={idx * 0.1} direction="up">
                <div className="aspect-[3/4] overflow-hidden rounded-sm group grayscale hover:grayscale-0 transition-all duration-700">
                  <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* --- DYNAMIC PACKAGES SECTION --- */}
      <section id="pricing" className="py-24 md:py-40 px-6 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8">
          <FadeIn direction="right">
            <div className="text-sm flex items-center gap-2 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F2021] block" />
              Pilihan Investasi / (02)
            </div>
            <h2 className="text-5xl md:text-8xl font-medium tracking-tighter leading-[0.9]">
              Pilih Cerita <br /> Anda.
            </h2>
          </FadeIn>
          <FadeIn direction="left">
            <p className="text-lg text-gray-400 max-w-sm leading-relaxed">
              Banyak pilihan yang dapat disesuaikan dengan kebutuhan unik Anda. 
              Semua paket sudah termasuk proses editing profesional.
            </p>
          </FadeIn>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 grayscale">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-[#1F2021] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, idx) => (
              <div key={pkg.id}>
                <FadeIn direction="up" delay={idx * 0.1}>
                  <div className="bg-white border border-gray-100 p-8 md:p-12 rounded-sm h-full flex flex-col justify-between hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 group">
                    <div>
                      <div className="flex justify-between items-start mb-12">
                        <h3 className="text-2xl md:text-3xl font-medium tracking-tight group-hover:translate-x-2 transition-transform duration-500">{pkg.title}</h3>
                        <span className="text-[10px] font-mono text-gray-200">/ 0{idx + 1}</span>
                      </div>
                      <p className="text-sm text-gray-400 mb-10 leading-relaxed min-h-[60px]">
                        {pkg.description}
                      </p>
                      <div className="mb-12">
                        <span className="text-xs text-gray-400 uppercase tracking-widest mb-2 block font-bold">Mulai dari</span>
                        <span className="text-4xl font-medium tracking-tighter">{pkg.price}</span>
                      </div>
                      <div className="space-y-5 mb-12 pt-8 border-t border-gray-50">
                        {pkg.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-4 text-sm text-gray-500 font-light italic">
                            <Check size={14} className="text-gray-200 shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-4 mt-auto">
                      <Link 
                        to={`/booking?package=${pkg.id}`}
                        className="flex items-center justify-center w-full py-6 bg-[#1F2021] text-white rounded-full group/btn hover:scale-105 transition-all duration-500"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                          Pesan Sekarang
                        </span>
                        <ArrowRight size={14} className="ml-2" />
                      </Link>
                      
                      <a 
                        href={`https://wa.me/6287802023377?text=Halo, saya ingin konsultasi mengenai paket ${pkg.title}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full py-4 border border-gray-100 rounded-full hover:bg-gray-50 transition-all duration-500 text-gray-400"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                          Konsultasi WhatsApp
                        </span>
                      </a>
                    </div>
                  </div>
                </FadeIn>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- PROCESS SECTION --- */}
      <section className="py-24 md:py-40 bg-[#1F2021] text-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-sm flex items-center gap-2 mb-16 opacity-40">
            <span className="w-1.5 h-1.5 rounded-full bg-white block" />
            {getContent('pkgs_process_header', 'Alur Kerja / (03)')}
          </div>
          <div className="grid md:grid-cols-3 gap-24">
            <FadeIn direction="up">
              <Camera size={40} className="mb-8 opacity-20" />
              <h3 className="text-2xl font-medium mb-6">{getContent('pkgs_proc1_title', '01. Perencanaan')}</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                {getContent('pkgs_proc1_desc', 'Kita akan mendiskusikan visi, lokasi, dan detail teknis untuk memastikan setiap sudut sesuai dengan apa yang Anda impikan.')}
              </p>
            </FadeIn>
            <FadeIn direction="up" delay={0.1}>
              <Sparkles size={40} className="mb-8 opacity-20" />
              <h3 className="text-2xl font-medium mb-6">{getContent('pkgs_proc2_title', '02. Pemotretan')}</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                {getContent('pkgs_proc2_desc', 'Nikmati momen Anda. Kami akan menangkap setiap tawa, tatapan, dan emosi secara organik tanpa paksaan pose yang kaku.')}
              </p>
            </FadeIn>
            <FadeIn direction="up" delay={0.2}>
              <Heart size={40} className="mb-8 opacity-20" />
              <h3 className="text-2xl font-medium mb-6">{getContent('pkgs_proc3_title', '03. Hasil Akhir')}</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                {getContent('pkgs_proc3_desc', 'Foto-foto Anda akan diproses dengan kurasi warna yang abadi dan dikirimkan dalam galeri digital berkualitas tinggi.')}
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA SECTION --- */}
      <section className="py-40 px-6 overflow-hidden text-[#1F2021]">
        <div className="max-w-[1400px] mx-auto text-center">
          <FadeIn direction="up">
            <h2 className="text-6xl md:text-[12vw] font-medium tracking-tighter leading-[0.8] mb-16">
              Mulai <br /> Cerita Anda.
            </h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-12">
              <Link 
                to="/booking" 
                className="group flex items-center gap-8 bg-[#1F2021] text-white px-12 py-8 rounded-full hover:scale-105 transition-all duration-500"
              >
                <div className="flex flex-col items-start text-left">
                  <span className="text-[10px] uppercase tracking-widest opacity-60 mb-1">Pesan Sekarang</span>
                  <span className="text-xl font-medium">Isi Formulir Booking</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:rotate-45 transition-transform">
                  <ArrowRight size={24} />
                </div>
              </Link>
              <div className="flex flex-col items-start text-left opacity-40">
                <span className="text-[10px] uppercase tracking-widest mb-2 font-bold">Atau langsung</span>
                <a href="mailto:hello@moment.com" className="text-xl font-medium border-b border-black">hello@moment.com</a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </motion.main>
  );
};
