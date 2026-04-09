import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Project } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onSubmit: (data: any) => Promise<void>;
  initialOrder: number;
}

export const ProjectModal: React.FC<Props> = ({ isOpen, onClose, project, onSubmit, initialOrder }) => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    mainImg: '',
    tag: '',
    description: '',
    videoUrl: '',
    detailImages: '',
    order: initialOrder
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        location: project.location,
        mainImg: project.mainImg,
        tag: project.tag,
        description: project.description || '',
        videoUrl: project.video_url || '',
        detailImages: project.detailImages.join(', '),
        order: project.order
      });
    } else {
      setFormData({
        title: '',
        location: '',
        mainImg: '',
        tag: '',
        description: '',
        videoUrl: '',
        detailImages: '',
        order: initialOrder
      });
    }
  }, [project, initialOrder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 overflow-y-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white w-full max-w-xl rounded-sm shadow-2xl p-8">
            <h2 className="text-xl font-medium mb-8">{project ? 'Edit Proyek' : 'Proyek Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400">Judul</label>
                  <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border-b border-gray-100 py-2 outline-none focus:border-black" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400">Lokasi</label>
                  <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full border-b border-gray-100 py-2 outline-none focus:border-black" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400">Tag / Kategori</label>
                  <input value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} className="w-full border-b border-gray-100 py-2 outline-none focus:border-black" placeholder="WEDDING, PORTRAIT, etc" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400">Urutan</label>
                  <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} className="w-full border-b border-gray-100 py-2 outline-none focus:border-black" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400">URL Gambar Utama</label>
                <input value={formData.mainImg} onChange={e => setFormData({...formData, mainImg: e.target.value})} className="w-full border-b border-gray-100 py-2 outline-none focus:border-black" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400">URL Video (Opsional)</label>
                <input value={formData.videoUrl} onChange={e => setFormData({...formData, videoUrl: e.target.value})} className="w-full border-b border-gray-100 py-2 outline-none focus:border-black" placeholder="YouTube URL" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400">URL Gambar Detail (Pisahkan dengan koma)</label>
                <textarea value={formData.detailImages} onChange={e => setFormData({...formData, detailImages: e.target.value})} className="w-full border border-gray-100 p-4 outline-none focus:border-black h-32" />
              </div>
              <button type="submit" className="w-full bg-black text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all">Simpan Proyek</button>
            </form>
            <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors"><X size={20} /></button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
