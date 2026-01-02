
import React from 'react';
import { motion } from 'framer-motion';
import * as ReactRouter from 'react-router-dom';
import { FileSearch, Zap, Shield, BarChart3, ArrowRight, Sparkles } from 'lucide-react';

const { Link } = ReactRouter as any;

export const Home: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
  const features = [
    {
      title: 'ATS-Friendly Audit',
      description: 'See exactly how Applicant Tracking Systems read your resume.',
      icon: <FileSearch className="text-blue-500" />,
    },
    {
      title: 'AI Smart Suggestions',
      description: 'Get tailored advice on word choice, formatting, and impact.',
      icon: <Sparkles className="text-purple-500" />,
    },
    {
      title: 'Keyword Optimization',
      description: 'Match industry keywords for your specific target job description.',
      icon: <Zap className="text-amber-500" />,
    },
    {
      title: 'Detailed Analytics',
      description: 'Visual breakdowns of your strengths and key areas for improvement.',
      icon: <BarChart3 className="text-emerald-500" />,
    }
  ];

  return (
    <div className="flex flex-col items-center py-12">
      {/* Hero Section */}
      <div className="text-center max-w-4xl px-4 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-bold bg-primary-100 text-primary-900 dark:bg-primary-900/30 dark:text-primary-400 mb-6 border border-primary-200 dark:border-primary-800">
            <Zap size={14} className="mr-2" /> Powered by Gemini 3 Pro
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-black dark:text-white">
            Land your dream job with{' '}
            <span className="bg-gradient-to-r from-primary-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              AI precision
            </span>
          </h1>
          <p className="text-lg md:text-xl text-black dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            ElevateAI analyzes your resume against 100+ ATS standards and real-world job requirements in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to={isLoggedIn ? "/dashboard" : "/signup"}
              className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary-500/20 hover:bg-primary-700 transition-all flex items-center justify-center group"
            >
              Analyze Your Resume Now
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/samples"
              className="px-8 py-4 bg-white dark:bg-slate-800 text-black dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-center"
            >
              View Sample Reports
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24 w-full">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx, duration: 0.5 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 shadow-xl group"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-black dark:text-white">{feature.title}</h3>
            <p className="text-black dark:text-slate-400 leading-relaxed font-medium">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Social Proof / Security */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex flex-col items-center gap-8 py-12 w-full border-t border-slate-200 dark:border-slate-800"
      >
        <div className="flex items-center gap-4 text-black dark:text-slate-500 font-bold text-center">
          <Shield className="text-emerald-500 shrink-0" />
          <span>Your data is encrypted and never shared with employers without your consent.</span>
        </div>
        <div className="flex flex-wrap justify-center gap-12 opacity-80 grayscale hover:grayscale-0 transition-all text-black dark:text-white">
          <span className="text-2xl font-black">TECHCORP</span>
          <span className="text-2xl font-black">INNOVATE</span>
          <span className="text-2xl font-black">FUTUREHUB</span>
          <span className="text-2xl font-black">CLOUDSYS</span>
        </div>
      </motion.div>
    </div>
  );
};
