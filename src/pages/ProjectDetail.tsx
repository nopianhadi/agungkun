import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
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

const getYouTubeEmbedUrl = (url?: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
};

export const ProjectDetail = () => {
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

  const onBack = () => navigate(-1);

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
                Kembali
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

              return null;
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
