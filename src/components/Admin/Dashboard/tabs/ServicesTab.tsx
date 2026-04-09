import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';
import { SiteService } from '../types';

interface Props {
  services: SiteService[];
  onEdit: (service: SiteService) => void;
  onDelete: (id: string) => void;
}

export const ServicesTab: React.FC<Props> = ({ services, onEdit, onDelete }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((service) => (
        <motion.div layout key={service.id} className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 group">
          <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] font-mono text-gray-300">{service.num}</span>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onEdit(service)} 
                className="p-2 text-gray-400 hover:text-black transition-colors"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => onDelete(service.id)} 
                className="p-2 text-red-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <h3 className="text-xl font-medium tracking-tight mb-4">{service.title}</h3>
          <p className="text-xs text-gray-400 leading-relaxed mb-6">{service.description}</p>
          <div className="pt-4 border-t border-gray-50 text-[10px] text-gray-300 uppercase tracking-widest">Order: {service.order}</div>
        </motion.div>
      ))}
    </div>
  );
};
