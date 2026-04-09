import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';
import { ShowcaseItem } from '../types';

interface Props {
  items: ShowcaseItem[];
  onEdit: (item: ShowcaseItem) => void;
  onDelete: (id: string) => void;
}

export const ShowcaseTab: React.FC<Props> = ({ items, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <motion.div layout key={item.id} className="aspect-[3/4] bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden relative group">
          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => onEdit(item)} 
                className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
              >
                <Edit2 size={14} />
              </button>
              <button 
                onClick={() => onDelete(item.id)} 
                className="p-2 bg-white text-red-500 rounded-full hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="text-white">
              <p className="text-[10px] uppercase tracking-widest font-bold truncate">{item.title}</p>
              <p className="text-[8px] opacity-70">Order: {item.order}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
