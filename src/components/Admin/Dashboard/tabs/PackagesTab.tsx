import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';
import { Package } from '../types';

interface Props {
  packages: Package[];
  onOpenModal: (pkg?: Package) => void;
  onDelete: (id: string) => void;
}

export const PackagesTab: React.FC<Props> = ({ packages, onOpenModal, onDelete }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {packages.map((pkg) => (
        <motion.div 
          layout
          key={pkg.id}
          className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 group"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-gray-300">#{pkg.order}</span>
              {pkg.category && (
                <span className="text-[8px] uppercase tracking-widest font-bold bg-gray-50 text-gray-400 px-2 py-0.5 rounded-full border border-gray-100 italic">
                  {pkg.category}
                </span>
              )}
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onOpenModal(pkg)}
                className="p-2 text-gray-400 hover:text-black transition-colors"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => onDelete(pkg.id)}
                className="p-2 text-red-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <h3 className="text-2xl font-medium tracking-tight mb-2">{pkg.title}</h3>
          <p className="text-gray-400 text-sm mb-6">{pkg.description}</p>
          <div className="text-xl font-mono mb-8">Rp {pkg.price}</div>
          <ul className="space-y-3 mb-8">
            {pkg.features.map((feature, i) => (
              <li key={i} className="text-xs text-gray-500 flex items-center gap-2">
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                {feature}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
};
