import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { FadeIn } from '../UI/FadeIn';
import { useSiteContent } from '../../hooks/useSiteContent';

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

export const Gallery = () => {
  const navigate = useNavigate();
  const { getContent } = useSiteContent();
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
          {getContent('gallery_badge', 'Galeri')} / (03)
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
            {getContent('gallery_header_small', 'Karya terpilih')}
          </p>
          <p className="text-xl font-medium tracking-tight">
            {getContent('gallery_header_big', 'Buku Harian Visual')}
          </p>
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
        <p className="text-gray-400 text-sm mb-8 uppercase tracking-widest">{getContent('gallery_footer_text', 'Ingin melihat lebih banyak?')}</p>
        <a href="/galeri" className="group inline-flex items-center gap-4 bg-[#1F2021] text-white px-12 py-6 rounded-full text-sm font-medium hover:bg-gray-800 transition-all hover:scale-105 active:scale-95">
          {getContent('gallery_footer_button', 'Lihat galeri lengkap')}
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
            <ArrowRight size={14} />
          </div>
        </a>
      </div>
    </section>
  );
};
