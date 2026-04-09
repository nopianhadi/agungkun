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

export const VideoSection = () => {
  const [videoProjects, setVideoProjects] = useState<Project[]>([]);
  const navigate = useNavigate();
  const { getContent } = useSiteContent();

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
          {getContent('video_section_title', 'Video Portfolio')} / (04)
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
            {getContent('video_section_subtitle', 'Pekerjaan Sinematik')}
          </p>
          <p className="text-xl font-medium tracking-tight">
            {getContent('video_section_quote', 'Kisah dalam Gerakan')}
          </p>
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
