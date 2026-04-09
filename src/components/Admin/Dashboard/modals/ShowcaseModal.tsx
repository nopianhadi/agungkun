import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ShowcaseItem } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: ShowcaseItem | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export const ShowcaseModal: React.FC<Props> = ({ isOpen, onClose, item, onSubmit }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 overflow-y-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white w-full max-w-xl rounded-sm shadow-2xl p-8">
            <h2 className="text-xl font-medium mb-8">{item ? 'Edit Showcase' : 'Showcase Baru'}</h2>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400">Judul / Label</label>
                <input name="title" defaultValue={item?.title} className="w-full border-b border-gray-100 py-2 outline-none focus:border-black" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400">URL Gambar</label>
                <input name="image_url" defaultValue={item?.image_url} required className="w-full border-b border-gray-100 py-2 outline-none focus:border-black" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400">Urutan</label>
                <input name="order" type="number" defaultValue={item?.order || 0} className="w-full border-b border-gray-100 py-2 outline-none focus:border-black" />
              </div>
              <button type="submit" className="w-full bg-black text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all">Simpan Showcase</button>
            </form>
            <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors"><X size={20} /></button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
