import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FadeIn } from '../components/UI/FadeIn';

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

export const GalleryPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Semua');

  const tags = ['Semua', ...new Set(projects.map(p => p.tag))];

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order', { ascending: true });

      if (!error && data) {
        setProjects(data.map(p => ({
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
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = filter === 'Semua' 
    ? projects 
    : projects.filter(p => p.tag === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-[#1F2021] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-40"
    >
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-sm mb-16 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1F2021] block" />
          Galeri / (03)
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-24">
          <FadeIn>
            <h1 className="text-5xl md:text-8xl font-medium tracking-tighter leading-[0.9]">
              Karya <br />
              Terpilih.
            </h1>
          </FadeIn>
          
          <div className="flex flex-wrap gap-4">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`text-[10px] uppercase tracking-widest px-6 py-2 rounded-full border transition-all ${
                  filter === tag 
                    ? 'bg-[#1F2021] text-white border-[#1F2021]' 
                    : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj, idx) => (
              <motion.div
                layout
                key={proj.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
              >
                <div
                  className="group cursor-pointer"
                  onClick={() => navigate(`/project/${proj.id}`)}
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-sm mb-6 bg-gray-50">
                    <img
                      src={proj.mainImg}
                      alt={proj.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 backdrop-blur-sm text-[#1F2021] text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                        {proj.tag}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-2xl font-medium mb-1 tracking-tight leading-none">{proj.title}</h3>
                      <p className="text-xs text-gray-400">{proj.location}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-gray-50 flex items-center justify-center group-hover:bg-[#1F2021] group-hover:text-white transition-all">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
