
import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Github, Twitter, Linkedin, Heart } from 'lucide-react';
import * as ReactRouter from 'react-router-dom';

const { Link } = ReactRouter as any;

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full mt-20 border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 p-1.5 rounded-lg text-white shadow-lg shadow-primary-500/20">
                <Cpu size={20} />
              </div>
              <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                ElevateAI
              </span>
            </div>
            <p className="text-sm font-bold text-black dark:text-slate-400 max-w-xs leading-relaxed">
              Empowering candidates with AI-driven insights to bypass ATS filters and land their dream jobs.
            </p>
          </div>

          {/* Developer Credit Section */}
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50"
            >
              <p className="text-sm font-black text-black dark:text-white uppercase tracking-widest mb-1">
                Engineering
              </p>
              <div className="flex items-center gap-2 justify-center">
                <span className="text-black/60 dark:text-slate-400 font-bold">Developed with</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Heart size={16} className="text-rose-500 fill-rose-500" />
                </motion.div>
                <span className="text-black/60 dark:text-slate-400 font-bold">by</span>
              </div>
              <p className="text-lg font-black bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent mt-1">
                Yash Bhartari
              </p>
            </motion.div>
          </div>

          {/* Social & Legal Section */}
          <div className="flex flex-col md:items-end space-y-6">
            <div className="flex items-center space-x-4">
              {[
                { icon: <Github size={20} />, label: 'Github' },
                { icon: <Twitter size={20} />, label: 'Twitter' },
                { icon: <Linkedin size={20} />, label: 'LinkedIn' }
              ].map((social, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ y: -3, color: '#0ea5e9' }}
                  className="p-2 text-black dark:text-slate-400 transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.button>
              ))}
            </div>
            <div className="flex flex-wrap md:justify-end gap-x-6 gap-y-2 text-xs font-black uppercase tracking-tighter text-black/40 dark:text-slate-500">
              <Link to="/" className="hover:text-primary-500 transition-colors">Privacy Policy</Link>
              <Link to="/" className="hover:text-primary-500 transition-colors">Terms of Service</Link>
              <Link to="/" className="hover:text-primary-500 transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 dark:text-slate-600">
            © {currentYear} ElevateAI. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary-500/60">
            <span>Systems Online</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </div>
    </footer>
  );
};
