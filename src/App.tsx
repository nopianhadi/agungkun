import React, { useEffect, useState } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Menu, X } from 'lucide-react';
import { Routes, Route, useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import Lenis from 'lenis';
import { supabase } from './lib/supabase';
import { useAuth } from './hooks/useAuth';
import { Login } from './components/Admin/Login';
import { Dashboard } from './components/Admin/Dashboard';
import { seedDatabase } from './lib/seed';
import { ErrorBoundary } from './components/ErrorBoundary';

interface Project {
  id: string;
  title: string;
  location: string;
  mainImg: string;
  tag: string;
  description?: string;
  video_url?: string;
  detailImages: string[];
  order: number;
}
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  key?: React.Key;
}

const FadeIn = ({ children, delay = 0, direction = 'up', className = '' }: FadeInProps) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const yOffset = direction === 'up' ? 40 : direction === 'down' ? -40 : 0;
  const xOffset = direction === 'left' ? 40 : direction === 'right' ? -40 : 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yOffset, x: xOffset }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: yOffset, x: xOffset }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const getYouTubeEmbedUrl = (url?: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
};

const Navbar = ({ onMenuOpen }: { onMenuOpen: () => void }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#1F2021] origin-left z-[60]"
        style={{ scaleX }}
      />
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-8 text-[#1F2021] mix-blend-difference">
        <Link to="/" className="text-3xl font-bold italic tracking-tighter text-white hover:opacity-70 transition-opacity">m</Link>
        <button
          onClick={onMenuOpen}
          className="flex items-center gap-2 text-sm uppercase tracking-widest text-white hover:opacity-70 transition-opacity"
        >
          menu <span className="text-xl font-light tracking-[-0.2em] ml-1">::</span>
        </button>
      </nav>
    </>
  );
};

const MenuOverlay = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const location = useLocation();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] bg-white p-6 md:p-12 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div className="text-3xl font-bold italic tracking-tighter text-[#1F2021]">m</div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-8">
              <p className="text-xs uppercase tracking-widest text-gray-400">Navigasi</p>
              <ul className="flex flex-col gap-4">
                {[
                  { name: 'Jurnal', id: 'hero' },
                  { name: 'Tentang', id: 'about' },
                  { name: 'Layanan', id: 'services' },
                  { name: 'Galeri', id: 'gallery' },
                  { name: 'Kontak', id: 'contact' }
                ].map((item) => (
                  <li key={item.name}>
                    <a
                      href={location.pathname === '/' ? `#${item.id}` : `/#${item.id}`}
                      onClick={(e) => {
                        if (location.pathname === '/') {
                          e.preventDefault();
                          const el = document.getElementById(item.id);
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth' });
                            onClose();
                          }
                        } else {
                          // Allow normal navigation to the home page with hash
                          onClose();
                        }
                      }}
                      className="text-5xl md:text-8xl font-medium tracking-tighter hover:text-gray-400 transition-colors"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-12 md:pl-24">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-6">Media Sosial</p>
                <ul className="flex flex-col gap-3 text-lg">
                  <li><a href="https://instagram.com/agungkunn" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">Instagram</a></li>
                  <li><a href="#" className="hover:text-gray-400 transition-colors">Twitter / X</a></li>
                  <li><a href="#" className="hover:text-gray-400 transition-colors">Pexels</a></li>
                </ul>
              </div>

              <div className="flex items-start gap-6 pt-12 border-t border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1554046920-90dcac824b23?q=80&w=100&auto=format&fit=crop"
                  alt="Henry"
                  className="w-12 h-12 rounded-sm object-cover grayscale"
                />
                <p className="text-sm text-gray-500 max-w-[200px]">
                  "Saya memotret foto-foto yang autentik dan ekspresif, yang menangkap esensi dari setiap momen."
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end pt-12 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">WhatsApp</p>
                <a href="https://wa.me/6287802023377" target="_blank" rel="noopener noreferrer" className="text-2xl font-medium hover:text-green-600 transition-colors flex items-center gap-3">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  WhatsApp
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Email</p>
                <a href="mailto:aguangkun@gmail.com" className="text-2xl font-medium hover:text-gray-400 transition-colors">
                  aguangkun@gmail.com
                </a>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4 md:mt-0">
              Indonesia
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacity = useTransform(scrollY, [0, 800], [1, 0]);

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden bg-white">
      <motion.img
        style={{ y }}
        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2000&auto=format&fit=crop"
        alt="Hero"
        className="absolute inset-0 w-full h-[120%] object-cover grayscale opacity-90 origin-top"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />

      <motion.div
        style={{ opacity }}
        className="absolute bottom-0 left-0 w-full p-6 md:p-12 flex flex-col md:flex-row justify-between items-end text-[#1F2021]"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="text-7xl md:text-[12vw] leading-[0.8] font-medium tracking-tighter mb-4">moment</h1>
          <p className="text-lg md:text-2xl font-medium tracking-tight">Oleh Agung Kun</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex flex-col items-end gap-4"
        >
          <div className="hidden md:flex gap-16 text-[10px] uppercase tracking-[0.2em] opacity-50 mb-8">
            <div>
              <p className="mb-1">6720 × 4480</p>
              <p>Dual Pixel Raw</p>
            </div>
            <div>
              <p className="mb-1">36 x 24 mm</p>
              <p>Canon EOS</p>
            </div>
          </div>
          <div className="flex items-center gap-4 animate-bounce">
            <span className="text-[10px] uppercase tracking-widest opacity-50">Gulir untuk eksplorasi</span>
            <div className="w-px h-12 bg-[#1F2021]/20" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

const About = () => {
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
              Portofolio ini adalah buku harian visual dari tempat, orang, dan momen yang saya kumpulkan melalui lensa.
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed text-[#1F2021]/80 mb-12 max-w-2xl">
              “Saya memotret foto-foto yang autentik dan ekspresif, yang menangkap esensi dari setiap momen.”
            </p>
            <a href="#" className="inline-flex items-center gap-2 text-sm font-medium border-b border-[#1F2021] pb-1 hover:opacity-60 transition-opacity">
              Baca selengkapnya <ArrowRight size={16} />
            </a>
          </FadeIn>
        </div>

        <div className="md:col-span-5">
          <FadeIn delay={0.2}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm mb-8">
              <img
                src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop"
                alt="Kyoto"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-xs uppercase tracking-widest mb-1">Dipotret di</p>
                <p className="text-2xl font-medium tracking-tight">Kyoto</p>
              </div>
            </div>
            <a href="#" className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-60 transition-opacity">
              Lihat galeri <ArrowRight size={16} />
            </a>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
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
              <a href="#" className="inline-flex items-center gap-2 text-sm font-medium border-b border-[#1F2021] pb-1 hover:opacity-60 transition-opacity">
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

const Gallery = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order', { ascending: true });

      if (!error && data) {
        const mappedProjects = data.map(p => ({
          id: p.id,
          title: p.title,
          location: p.location,
          mainImg: p.main_img,
          tag: p.tag,
          description: p.description || '',
          video_url: p.video_url || '',
          detailImages: p.detail_images || [],
          order: p.order
        }));
        setProjects(mappedProjects);
        setLoading(false);
      }
    };

    fetchProjects();

    const channel = supabase
      .channel('public:projects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchProjects();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <section id="gallery" className="py-24 md:py-40 px-6 max-w-[1400px] mx-auto flex justify-center">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-[#1F2021] rounded-full animate-spin" />
      </section>
    );
  }

  return (
    <section id="gallery" className="py-24 md:py-40 px-6 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-start mb-24">
        <div className="text-sm flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1F2021] block" />
          Galeri / (03)
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Karya terpilih</p>
          <p className="text-xl font-medium tracking-tight">Buku Harian Visual</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 md:gap-x-24 md:gap-y-32">
        {projects.map((proj, idx) => (
          <FadeIn key={proj.id} delay={idx * 0.1} className={idx % 3 === 0 ? 'md:col-span-2' : ''}>
            <div
              className="group cursor-pointer"
              onClick={() => navigate(`/project/${proj.id}`)}
            >
              <div className={`relative overflow-hidden rounded-sm mb-8 bg-gray-50 ${idx % 3 === 0 ? 'aspect-[21/9]' : 'aspect-[4/5]'}`}>
                <img
                  src={proj.mainImg}
                  alt={proj.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                />
                <div className="absolute top-6 right-6 flex gap-2">
                  {proj.video_url && (
                    <span className="bg-[#1F2021]/90 backdrop-blur-sm text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      Video
                    </span>
                  )}
                  <span className="bg-white/90 backdrop-blur-sm text-[#1F2021] text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                    {proj.tag}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-3xl md:text-5xl font-medium mb-2 tracking-tighter leading-none">{proj.title}</h3>
                  <p className="text-sm text-gray-400">Dipotret di {proj.location}</p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xs text-gray-300 font-mono">/ 0{idx + 1}</span>
                  <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-[#1F2021] group-hover:text-white transition-all duration-500">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <div className="mt-40 flex flex-col items-center">
        <div className="w-px h-24 bg-gray-100 mb-12" />
        <p className="text-gray-400 text-sm mb-8 uppercase tracking-widest">Ingin melihat lebih banyak?</p>
        <a href="#" className="group inline-flex items-center gap-4 bg-[#1F2021] text-white px-12 py-6 rounded-full text-sm font-medium hover:bg-gray-800 transition-all hover:scale-105 active:scale-95">
          Lihat galeri lengkap
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
            <ArrowRight size={14} />
          </div>
        </a>
      </div>
    </section>
  );
};

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (!error && data) {
        setProject({
          id: data.id,
          title: data.title,
          location: data.location,
          mainImg: data.main_img,
          tag: data.tag,
          description: data.description || '',
          video_url: data.video_url || '',
          detailImages: data.detail_images || [],
          order: data.order
        });
      }
      setLoading(false);
    };

    fetchProject();
  }, [projectId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-[#1F2021] rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-medium mb-4">Proyek tidak ditemukan</h1>
        <button
          onClick={() => navigate('/')}
          className="text-sm font-medium border-b border-[#1F2021] pb-1"
        >
          Kembali ke Galeri
        </button>
      </div>
    );
  }

  const onBack = () => navigate('/');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white pt-32 pb-40"
    >
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-12 md:gap-24 mb-24">
          <div className="md:col-span-4 md:sticky md:top-32 h-fit">
            <FadeIn direction="right">
              <h1 className="text-5xl md:text-8xl font-medium tracking-tighter mb-6 leading-[0.9]">{project.title}</h1>
              <p className="text-xl text-gray-500 mb-8">Dipotret di {project.location}</p>

              {project.description && (
                <p className="text-lg text-gray-400 mb-12 leading-relaxed max-w-sm">
                  {project.description}
                </p>
              )}

              <div className="flex items-center gap-6 mb-12">
                <span className="text-xs text-gray-400 font-mono">/ 0{project.order + 1}</span>
                <div className="w-32 h-px bg-gray-100" />
              </div>

              <button
                onClick={onBack}
                className="group flex items-center gap-3 text-sm font-medium hover:opacity-60 transition-opacity"
              >
                <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-[#1F2021] group-hover:text-white transition-all">
                  <ArrowLeft size={16} />
                </div>
                Kembali ke galeri
              </button>
            </FadeIn>
          </div>

          <div className="md:col-span-8 space-y-12 md:space-y-24">
            {project.video_url && getYouTubeEmbedUrl(project.video_url) && (
              <FadeIn direction="up">
                <div className="aspect-video w-full overflow-hidden rounded-sm bg-black mb-12 shadow-2xl">
                  <iframe
                    width="100%"
                    height="100%"
                    src={getYouTubeEmbedUrl(project.video_url)!}
                    title={project.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </FadeIn>
            )}

            {project.detailImages.map((img, idx) => {
              // Create a dynamic layout pattern
              const isLarge = idx % 3 === 2;
              const isFirstInRow = idx % 3 === 0;

              if (isLarge) {
                return (
                  <FadeIn key={idx} direction="up">
                    <div className="aspect-[4/5] overflow-hidden rounded-sm bg-gray-50">
                      <img src={img} alt={`Detail ${idx + 1}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                    </div>
                  </FadeIn>
                );
              }

              if (isFirstInRow) {
                const nextImg = project.detailImages[idx + 1];
                return (
                  <div key={idx} className="grid md:grid-cols-2 gap-6 md:gap-12">
                    <FadeIn direction="up">
                      <div className="aspect-[3/4] overflow-hidden rounded-sm bg-gray-50">
                        <img src={img} alt={`Detail ${idx + 1}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                      </div>
                    </FadeIn>
                    {nextImg && (
                      <FadeIn direction="up" delay={0.1}>
                        <div className="aspect-[3/4] overflow-hidden rounded-sm bg-gray-50">
                          <img src={nextImg} alt={`Detail ${idx + 2}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                        </div>
                      </FadeIn>
                    )}
                  </div>
                );
              }

              return null; // Handled by isFirstInRow
            })}
          </div>
        </div>

        <div className="mt-40 flex justify-center items-center border-t border-gray-100 pt-12">
          <button
            onClick={onBack}
            className="group flex flex-col items-center gap-4 text-sm font-medium hover:opacity-60 transition-opacity"
          >
            <div className="w-16 h-16 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-[#1F2021] group-hover:text-white transition-all">
              <ArrowLeft size={24} />
            </div>
            Kembali ke galeri utama
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const VideoSection = () => {
  const [videoProjects, setVideoProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .neq('video_url', '')
        .order('order', { ascending: true });

      if (!error && data) {
        setVideoProjects(data.map(p => ({
          id: p.id,
          title: p.title,
          location: p.location,
          mainImg: p.main_img,
          tag: p.tag,
          description: p.description || '',
          video_url: p.video_url || '',
          detailImages: p.detail_images || [],
          order: p.order
        })));
      }
    };
    fetchVideos();
  }, []);

  if (videoProjects.length === 0) return null;

  return (
    <section id="video-portfolio" className="py-24 md:py-40 px-6 max-w-[1400px] mx-auto border-t border-gray-100">
      <div className="flex justify-between items-start mb-24">
        <div className="text-sm flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 block animate-pulse" />
          Video Portfolio / (04)
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Pekerjaan Sinematik</p>
          <p className="text-xl font-medium tracking-tight">Kisah dalam Gerakan</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 md:gap-24">
        {videoProjects.slice(0, 2).map((proj, idx) => (
          <FadeIn key={proj.id} delay={idx * 0.2} direction="up">
            <div
              className="group cursor-pointer"
              onClick={() => navigate(`/project/${proj.id}`)}
            >
              <div className="relative aspect-video overflow-hidden rounded-sm mb-8 bg-gray-50">
                <img
                  src={proj.mainImg}
                  alt={proj.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                  </div>
                </div>
                <div className="absolute top-6 right-6">
                  <span className="bg-[#1F2021]/90 backdrop-blur-sm text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                    {proj.tag}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-2xl md:text-3xl font-medium mb-1 tracking-tighter">{proj.title}</h3>
                  <p className="text-sm text-gray-400">{proj.location}</p>
                </div>
                <ArrowRight size={20} className="text-gray-300 group-hover:text-[#1F2021] group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};

const Testimonials = () => {
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

const Showcase = () => {
  const images = [
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop"
  ];

  return (
    <section id="showcase" className="py-24 md:py-40 px-6 max-w-[1400px] mx-auto overflow-hidden border-t border-gray-100">
      <div className="flex justify-between items-end mb-24">
        <div className="text-sm flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1F2021] block" />
          Showcase / (05)
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Album Pexels paling banyak dilihat</p>
          <a href="#" className="inline-flex items-center gap-2 bg-[#1F2021] text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-gray-800 transition-all hover:scale-105">
            Lihat album <ArrowRight size={16} />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <FadeIn key={idx} delay={idx * 0.1} direction="up">
            <div className="aspect-[3/4] overflow-hidden rounded-sm group">
              <img
                src={img}
                alt={`Showcase ${idx + 1}`}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
              />
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};

const Footer = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-[#0a0a0a] text-white pt-24 md:pt-40 pb-12 px-6 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-2 gap-16 mb-40">
          <div className="flex flex-col justify-between">
            <div>
              <div className="text-sm flex items-center gap-2 text-gray-500 mb-12">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500 block" />
                Hubungi saya / (06)
              </div>

              <h2 className="text-4xl md:text-7xl font-medium leading-[0.9] mb-12 tracking-tighter max-w-md text-gray-100">
                Mari kita abadikan kisah Anda bersama.
              </h2>

              <a href="https://wa.me/6287802023377" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-4 bg-green-500 text-white px-10 py-6 rounded-full text-sm font-medium hover:bg-green-600 transition-all hover:scale-105 mb-16">
                Hubungi via WhatsApp
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight size={16} />
                </div>
              </a>
            </div>

            <div className="pt-12 border-t border-white/10">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-6">Hubungi saya di</p>
              <div className="flex flex-col gap-4 mb-12">
                <a href="https://wa.me/6287802023377" target="_blank" rel="noopener noreferrer" className="text-3xl md:text-6xl font-medium block hover:text-green-500 transition-colors tracking-tighter leading-none">
                  +62 878-0202-3377
                </a>
                <a href="mailto:aguangkun@gmail.com" className="text-2xl md:text-4xl font-medium block hover:text-gray-400 transition-colors tracking-tighter leading-none">
                  aguangkun@gmail.com
                </a>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <p className="text-sm text-gray-500 leading-relaxed max-w-[240px]">
                  Berbasis di Indonesia. Tersedia untuk penugasan di seluruh dunia.
                </p>
                <div className="flex gap-8 text-xs uppercase tracking-widest font-medium">
                  <a href="https://instagram.com/agungkunn" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-opacity">Instagram</a>
                  <a href="#" className="hover:text-gray-400 transition-opacity">Twitter / X</a>
                  <a href="#" className="hover:text-gray-400 transition-opacity">Pexels</a>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:block overflow-hidden relative h-[700px] rounded-sm">
            <motion.img
              style={{ y }}
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"
              alt="Footer visual"
              className="w-full h-[140%] object-cover grayscale opacity-40 absolute -top-[20%]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]/80" />
          </div>
        </div>

        <div className="relative pt-12 border-t border-white/5">
          <div className="text-center overflow-hidden">
            <h1 className="text-[24vw] leading-[0.7] font-medium tracking-tighter text-white/5 select-none pointer-events-none">
              moment
            </h1>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mt-12 gap-6">
            <div className="flex items-center gap-8 text-[10px] uppercase tracking-[0.3em] text-gray-600">
              <p>© 2026 Agung Kun</p>
              <p>Hak cipta dilindungi undang-undang</p>
              <a href="/admin" className="hover:text-white transition-colors">Admin</a>
            </div>

            <button
              onClick={scrollToTop}
              className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-gray-400 hover:text-white transition-colors"
            >
              Kembali ke atas
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                <span className="text-lg leading-none">↑</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

const WhatsAppButton = () => {
  return (
    <motion.a
      href="https://wa.me/6287802023377"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.1, y: -5 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-shadow hover:shadow-green-500/20 group"
    >
      <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-3 transition-all duration-500 text-sm font-medium whitespace-nowrap">
        Hubungi kami
      </span>
    </motion.a>
  );
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const isAdminRoute = location.pathname === '/admin';

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const Home = () => (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      <About />
      <Services />
      <Gallery />
      <VideoSection />
      <Testimonials />
      <Showcase />
    </motion.main>
  );

  if (isAdminRoute) {
    if (authLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-gray-100 border-t-[#1F2021] rounded-full animate-spin" /></div>;
    if (!user) return <Login />;
    if (!isAdmin) return <div className="min-h-screen flex items-center justify-center text-center px-6"><div><h1 className="text-2xl font-medium mb-4">Akses Ditolak</h1><p className="text-gray-500">Anda tidak memiliki izin untuk mengakses dasbor admin.</p></div></div>;
    return (
      <ErrorBoundary>
        <Dashboard />
      </ErrorBoundary>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#1F2021] selection:bg-[#1F2021] selection:text-white">
      <Navbar onMenuOpen={() => setIsMenuOpen(true)} />
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <AnimatePresence mode="wait">
        <motion.div key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/project/:projectId" element={<ProjectDetail />} />
            <Route path="/admin" element={<div />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
