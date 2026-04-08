import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Gagal masuk. Periksa kembali email dan kata sandi Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-medium tracking-tighter mb-4 italic">moment / admin</h1>
          <p className="text-gray-500">Silakan masuk untuk mengakses dasbor admin.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 text-red-600 p-4 rounded-sm flex items-center gap-3 text-sm"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-50 border border-transparent focus:border-[#1F2021] focus:bg-white px-12 py-4 rounded-sm outline-none transition-all"
                placeholder="nama@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Kata Sandi</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-50 border border-transparent focus:border-[#1F2021] focus:bg-white px-12 py-4 rounded-sm outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-[#1F2021] text-white py-5 rounded-sm font-medium hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                Masuk ke Dasbor
              </>
            )}
          </button>
        </form>

        <p className="mt-12 text-center text-xs text-gray-400 uppercase tracking-widest">
          Moment Photography Portfolio © 2026
        </p>
      </motion.div>
    </div>
  );
};


