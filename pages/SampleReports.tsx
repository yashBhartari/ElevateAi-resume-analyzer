
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SAMPLE_REPORTS } from '../constants/samples';
import { AnalysisView } from '../components/AnalysisView';
import { ArrowLeft, BookOpen, ChevronRight, Briefcase } from 'lucide-react';
import * as ReactRouter from 'react-router-dom';

const { Link } = ReactRouter as any;

export const SampleReports: React.FC = () => {
  const [selectedSample, setSelectedSample] = useState<string | null>(null);

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-12">
        <Link to="/" className="inline-flex items-center gap-2 text-black hover:text-primary-500 font-black mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <h1 className="text-4xl font-black mb-4 text-black dark:text-white">Sample AI Audits</h1>
        <p className="text-black dark:text-slate-400 max-w-2xl font-bold">
          See how ElevateAI breaks down different types of resumes. These samples demonstrate our deep-dive analysis, scoring, and corrective suggestions.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!selectedSample ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {Object.entries(SAMPLE_REPORTS).map(([key, data]) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSample(key)}
                className="group p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-left flex justify-between items-center transition-all hover:border-primary-500"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-all">
                    <Briefcase size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black mb-1 text-black dark:text-white">{data.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-primary-500 px-2 py-0.5 bg-primary-50 dark:bg-primary-900/30 rounded-full">
                        {data.analysis.atsScore}% Score
                      </span>
                      <span className="text-xs text-black dark:text-slate-400 font-bold">View detailed breakdown</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="text-black/20 dark:text-slate-300 group-hover:text-primary-500 transition-colors" />
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="report"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            <button 
              onClick={() => setSelectedSample(null)}
              className="absolute -top-12 right-0 flex items-center gap-2 text-sm text-black hover:text-primary-500 transition-colors font-black"
            >
              <ArrowLeft size={14} /> Back to Samples
            </button>
            <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800 rounded-3xl p-6 mb-8 flex items-center gap-4">
              <BookOpen className="text-primary-500 shrink-0" />
              <p className="text-sm text-black dark:text-primary-300 font-black">
                You are viewing a <strong>Sample Report</strong> for a {SAMPLE_REPORTS[selectedSample].title}. 
                The AI identified specific formatting and keyword issues.
              </p>
            </div>
            <AnalysisView analysis={SAMPLE_REPORTS[selectedSample].analysis} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
