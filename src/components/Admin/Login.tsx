import React from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';

export const Login = () => {
  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/admin'
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <h1 className="text-4xl font-medium tracking-tighter mb-8 italic">moment / admin</h1>
        <p className="text-gray-500 mb-12">Silakan masuk dengan akun Google Anda untuk mengakses dasbor.</p>
        
        <button 
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-[#1F2021] text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-all active:scale-95"
        >
          <LogIn size={20} />
          Masuk dengan Google
        </button>
      </motion.div>
    </div>
  );
};

