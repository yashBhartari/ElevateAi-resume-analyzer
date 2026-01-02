
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Search, Target, ShieldCheck, Cpu } from 'lucide-react';

const messages = [
  "Booting Flash Auditor...",
  "Scanning keywords...",
  "Checking ATS compatibility...",
  "Generating fixes...",
  "Finalizing report...",
];

export const LoadingAudit: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl"
    >
      <div className="max-w-md w-full px-8 text-center">
        {/* Fixed size container for the animation center */}
        <div className="relative w-32 h-32 mx-auto mb-16">
          
          {/* Central Brain Icon */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary-500 to-indigo-600 shadow-2xl shadow-primary-500/40 flex items-center justify-center relative z-10"
          >
            <Brain size={64} className="text-white" />
            <motion.div
              animate={{ scale: [1, 1.4], opacity: [0.3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 rounded-[2.5rem] border-4 border-primary-500"
            />
          </motion.div>

          {/* Precise Revolving Container */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '240px', // Total diameter of the rotation
              height: '240px',
              x: '-50%',
              y: '-50%',
            }}
            className="pointer-events-none z-0"
          >
            {/* Top Icon */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-amber-500">
              <Search size={20} />
            </div>
            {/* Bottom Icon */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-emerald-500">
              <ShieldCheck size={20} />
            </div>
            {/* Left Icon */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-primary-500">
              <Target size={20} />
            </div>
            {/* Right Icon */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-purple-500">
              <Cpu size={20} />
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <div className="h-8 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="text-xl font-bold text-slate-800 dark:text-white"
              >
                {messages[messageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden max-w-[200px] mx-auto">
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1/2 h-full bg-gradient-to-r from-transparent via-primary-500 to-transparent"
            />
          </div>

          <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
            <Sparkles size={14} className="text-amber-500 animate-pulse" />
            Gemini Flash Speed Mode
            <Sparkles size={14} className="text-amber-500 animate-pulse" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
