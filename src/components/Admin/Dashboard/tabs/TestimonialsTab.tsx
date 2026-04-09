import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';
import { Testimonial } from '../types';

interface Props {
  testimonials: Testimonial[];
  onEdit: (testi: Testimonial) => void;
  onDelete: (id: string) => void;
}

export const TestimonialsTab: React.FC<Props> = ({ testimonials, onEdit, onDelete }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {testimonials.map((testi) => (
        <motion.div layout key={testi.id} className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 group">
          <div className="flex items-center gap-4 mb-6">
            <img src={testi.image_url} alt={testi.name} className="w-16 h-16 object-cover grayscale rounded-full" />
            <div className="flex-1">
              <h3 className="font-medium">{testi.name}</h3>
              <p className="text-xs text-gray-400">{testi.location}</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onEdit(testi)} 
                className="p-2 text-gray-400 hover:text-black transition-colors"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => onDelete(testi.id)} 
                className="p-2 text-red-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 italic leading-relaxed">"{testi.quote}"</p>
          <div className="mt-4 pt-4 border-t border-gray-50 text-[10px] text-gray-300 uppercase tracking-widest">Order: {testi.order}</div>
        </motion.div>
      ))}
    </div>
  );
};
