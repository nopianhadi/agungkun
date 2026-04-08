import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, LogOut, X, Save } from 'lucide-react';
import { seedDatabase } from '../../lib/seed';

interface Project {
  id: string;
  title: string;
  location: string;
  mainImg: string;
  tag: string;
  description: string;
  video_url?: string;
  detailImages: string[];
  order: number;
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

const handleSupabaseError = (error: any, operationType: OperationType, path: string | null) => {
  console.error(`Supabase Error (${operationType}) on ${path}:`, error.message || error);
  throw error;
};

export const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    mainImg: '',
    tag: '',
    description: '',
    videoUrl: '',
    detailImages: '',
    order: 0
  });

  useEffect(() => {
    seedDatabase().then(() => fetchProjects());
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      
      const mappedProjects = (data || []).map(p => ({
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
    } catch (error) {
      handleSupabaseError(error, OperationType.GET, 'projects');
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel('projects_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchProjects();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
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
      setEditingProject(null);
      setFormData({
        title: '',
        location: '',
        mainImg: '',
        tag: '',
        description: '',
        videoUrl: '',
        detailImages: '',
        order: projects.length
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      location: formData.location,
      main_img: formData.mainImg,
      tag: formData.tag,
      description: formData.description,
      video_url: formData.videoUrl,
      detail_images: formData.detailImages.split(',').map(s => s.trim()).filter(s => s !== ''),
      order: formData.order,
      updated_at: new Date().toISOString()
    };

    try {
      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', editingProject.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([{ ...payload, created_at: new Date().toISOString() }]);
        if (error) throw error;
      }
      setIsModalOpen(false);
    } catch (error) {
      handleSupabaseError(error, OperationType.WRITE, 'projects');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus proyek ini?')) {
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } catch (error) {
        handleSupabaseError(error, OperationType.DELETE, `projects/${id}`);
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-medium tracking-tighter mb-2">Dasbor</h1>
            <p className="text-gray-500">Kelola proyek fotografi Anda</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 bg-[#1F2021] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-all"
            >
              <Plus size={18} /> Tambah Proyek
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 border border-gray-200 px-6 py-3 rounded-full text-sm font-medium hover:bg-white transition-all"
            >
              <LogOut size={18} /> Keluar
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <motion.div 
              layout
              key={project.id}
              className="bg-white rounded-sm overflow-hidden shadow-sm border border-gray-100 group"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src={project.mainImg} 
                  alt={project.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleOpenModal(project)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(project.id)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-medium tracking-tight">{project.title}</h3>
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-1 rounded">
                    {project.tag}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Dipotret di {project.location}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden"
              >
                <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-2xl font-medium tracking-tighter">
                    {editingProject ? 'Edit Proyek' : 'Proyek Baru'}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black">
                    <X size={24} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-400">Judul</label>
                      <input 
                        required
                        type="text" 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full border-b border-gray-200 py-2 focus:border-black outline-none transition-colors"
                        placeholder="Judul proyek"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-400">Lokasi</label>
                      <input 
                        required
                        type="text" 
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full border-b border-gray-200 py-2 focus:border-black outline-none transition-colors"
                        placeholder="Kota, Negara"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-400">Tag</label>
                      <input 
                        required
                        type="text" 
                        value={formData.tag}
                        onChange={(e) => setFormData({...formData, tag: e.target.value})}
                        className="w-full border-b border-gray-200 py-2 focus:border-black outline-none transition-colors"
                        placeholder="misal: Editorial, Potret"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-400">Urutan</label>
                      <input 
                        required
                        type="number" 
                        value={formData.order}
                        onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                        className="w-full border-b border-gray-200 py-2 focus:border-black outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400">Deskripsi</label>
                    <textarea 
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full border border-gray-200 p-4 rounded-sm focus:border-black outline-none transition-colors resize-none"
                      placeholder="Deskripsi proyek..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400">URL Video (YouTube - Opsional)</label>
                    <input 
                      type="text" 
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                      className="w-full border-b border-gray-200 py-2 focus:border-black outline-none transition-colors"
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    <p className="text-[10px] text-gray-400 italic">Biarkan kosong jika ini adalah proyek foto saja.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400">URL Gambar Utama</label>
                    <div className="flex gap-4">
                      <input 
                        required
                        type="text" 
                        value={formData.mainImg}
                        onChange={(e) => setFormData({...formData, mainImg: e.target.value})}
                        className="flex-1 border-b border-gray-200 py-2 focus:border-black outline-none transition-colors"
                        placeholder="https://images.unsplash.com/..."
                      />
                      {formData.mainImg && (
                        <div className="w-12 h-12 rounded-sm overflow-hidden bg-gray-100">
                          <img src={formData.mainImg} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400">URL Gambar Detail (pisahkan dengan koma)</label>
                    <textarea 
                      required
                      rows={4}
                      value={formData.detailImages}
                      onChange={(e) => setFormData({...formData, detailImages: e.target.value})}
                      className="w-full border border-gray-200 p-4 rounded-sm focus:border-black outline-none transition-colors resize-none"
                      placeholder="url1, url2, url3..."
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#1F2021] text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-all"
                  >
                    <Save size={18} /> Simpan Proyek
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

