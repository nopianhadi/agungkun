import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Package } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pkg: Package | null;
  onSubmit: (data: any) => Promise<void>;
  initialOrder: number;
}

export const PackageModal: React.FC<Props> = ({ isOpen, onClose, pkg, onSubmit, initialOrder }) => {
  const [packageData, setPackageData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    features: '',
    order: initialOrder
  });

  useEffect(() => {
    if (pkg) {
      setPackageData({
        title: pkg.title,
        description: pkg.description || '',
        price: pkg.price || '',
        category: pkg.category || 'General',
        features: pkg.features.join(', '),
        order: pkg.order
      });
    } else {
      setPackageData({
        title: '',
        description: '',
        price: '',
        category: 'General',
        features: '',
        order: initialOrder
      });
    }
  }, [pkg, initialOrder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(packageData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 overflow-y-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white w-full max-w-xl rounded-sm shadow-2xl p-8">
            <h2 className="text-xl font-medium mb-8">{pkg ? 'Edit Paket' : 'Paket Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400">Nama Paket</label>
                <input value={packageData.title} onChange={e => setPackageData({...packageData, title: e.target.value})} className="w-full border-b border-gray-100 py-2 outline-none focus:border-black" required />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400">Harga (e.g. 5.000.000)</label>
                  <input value={packageData.price} onChange={e => setPackageData({...packageData, price: e.target.value})} className="w-full border-b border-gray-100 py-2 outline-none focus:border-black" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400">Kategori (Wedding, Prewedding, dll)</label>
                  <input value={packageData.category} onChange={e => setPackageData({...packageData, category: e.target.value})} className="w-full border-b border-gray-100 py-2 outline-none focus:border-black" placeholder="Wedding" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400">Urutan</label>
                  <input type="number" value={packageData.order} onChange={e => setPackageData({...packageData, order: parseInt(e.target.value)})} className="w-full border-b border-gray-100 py-2 outline-none focus:border-black" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400">Deskripsi</label>
                <input value={packageData.description} onChange={e => setPackageData({...packageData, description: e.target.value})} className="w-full border-b border-gray-100 py-2 outline-none focus:border-black" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400">Fitur (Pisahkan dengan koma)</label>
                <textarea value={packageData.features} onChange={e => setPackageData({...packageData, features: e.target.value})} className="w-full border border-gray-100 p-4 outline-none focus:border-black h-32" required />
              </div>
              <button type="submit" className="w-full bg-black text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all">Simpan Paket</button>
            </form>
            <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors"><X size={20} /></button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
