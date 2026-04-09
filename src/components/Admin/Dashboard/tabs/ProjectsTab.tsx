import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';
import { Project } from '../types';

interface Props {
  projects: Project[];
  onOpenModal: (project?: Project) => void;
  onDelete: (id: string) => void;
}

export const ProjectsTab: React.FC<Props> = ({ projects, onOpenModal, onDelete }) => {
  return (
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
                onClick={() => onOpenModal(project)}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => onDelete(project.id)}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium text-lg leading-none mb-2">{project.title}</h3>
                <p className="text-xs text-gray-400 uppercase tracking-widest">{project.tag}</p>
              </div>
              <span className="text-[10px] font-mono text-gray-300">#{project.order}</span>
            </div>
            <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
