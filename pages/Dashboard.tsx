
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Briefcase, Loader2, Sparkles, X, History, Trash2, AlertCircle, Info, MessageSquareCode, FileUp, Lightbulb } from 'lucide-react';
import { User, AnalysisState } from '../types';
import { analyzeResume } from '../services/geminiService';
import { AnalysisView } from '../components/AnalysisView';
import { LoadingAudit } from '../components/LoadingAudit';
import { SAMPLE_REPORTS } from '../constants/samples';
import * as pdfjs from 'pdfjs-dist';

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.10.38/build/pdf.worker.mjs`;

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [aiFocus, setAiFocus] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [jdError, setJdError] = useState(false);
  const [showSampleBanner, setShowSampleBanner] = useState(true);
  const [analysis, setAnalysis] = useState<AnalysisState>({
    isAnalyzing: false,
    result: null,
    error: null,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [history, setHistory] = useState<{ id: string, date: string, score: number, title: string }[]>(() => {
    const saved = localStorage.getItem(`history_${user.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const loadSample = (type: 'software_engineer' | 'marketing_manager') => {
    const sample = SAMPLE_REPORTS[type];
    setResumeText(sample.resumeText);
    setJobDescription(sample.jobDescription);
    setAiFocus("");
    setJdError(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setAnalysis(prev => ({ ...prev, error: 'Please upload a PDF file.' }));
      return;
    }

    setIsProcessingFile(true);
    setAnalysis(prev => ({ ...prev, error: null }));

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      
      if (fullText.trim().length === 0) {
        throw new Error("Could not extract any text from the PDF. It might be an image-only PDF.");
      }
      
      setResumeText(fullText);
    } catch (err: any) {
      console.error("PDF Parsing Error:", err);
      setAnalysis(prev => ({ ...prev, error: `Failed to read PDF: ${err.message}` }));
    } finally {
      setIsProcessingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const runAnalysis = async () => {
    setJdError(false);

    if (!resumeText.trim()) {
      setAnalysis(prev => ({ ...prev, error: 'Please enter or upload your resume first.' }));
      return;
    }

    if (!jobDescription.trim()) {
      setJdError(true);
      setTimeout(() => setJdError(false), 4000);
      return;
    }

    setAnalysis({ isAnalyzing: true, result: null, error: null });

    try {
      const result = await analyzeResume(resumeText, jobDescription, aiFocus);
      setAnalysis({ isAnalyzing: false, result, error: null });
      
      const newHistoryItem = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        score: result.atsScore,
        title: result.jobTitleMatch || 'Resume Analysis'
      };
      const updatedHistory = [newHistoryItem, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem(`history_${user.id}`, JSON.stringify(updatedHistory));

    } catch (err: any) {
      setAnalysis({ isAnalyzing: false, result: null, error: err.message || 'Analysis failed. Please try again.' });
    }
  };

  const clearAnalysis = () => {
    setAnalysis({ isAnalyzing: false, result: null, error: null });
    setJdError(false);
  };

  const removeFromHistory = (id: string) => {
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    localStorage.setItem(`history_${user.id}`, JSON.stringify(updated));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      <AnimatePresence>
        {analysis.isAnalyzing && <LoadingAudit key="loader" />}
      </AnimatePresence>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold flex items-center gap-3 text-black dark:text-white">
            Resume Analyzer <Sparkles className="text-amber-500 animate-pulse" size={24} />
          </h2>
          <p className="text-black dark:text-slate-400 font-bold">Optimize your profile for your dream role with AI-powered insights.</p>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => { 
               setResumeText(''); 
               setJobDescription(''); 
               setAiFocus(''); 
               clearAnalysis(); 
               setShowSampleBanner(true);
             }}
             className="px-4 py-2 text-sm font-bold bg-slate-100 dark:bg-slate-800 text-black dark:text-slate-300 rounded-lg hover:bg-slate-200 transition-colors"
           >
             Start Fresh
           </button>
        </div>
      </header>

      {analysis.result ? (
        <div className="relative">
          <button 
            onClick={clearAnalysis}
            className="absolute -top-12 right-0 flex items-center gap-2 text-sm text-black hover:text-primary-500 transition-colors font-black"
          >
            <X size={16} /> Back to Editor
          </button>
          <AnalysisView analysis={analysis.result} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            
            {/* Quick Try Samples */}
            {!resumeText && showSampleBanner && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative p-6 rounded-3xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 pr-12 sm:pr-14"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    <Lightbulb size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-black dark:text-amber-200">New here? Try a sample</p>
                    <p className="text-xs text-black dark:text-amber-400/80 font-bold">Load pre-filled data to see how the analysis works.</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => loadSample('software_engineer')} className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-xl text-xs font-black border border-amber-200 dark:border-amber-700 hover:bg-amber-100 transition-colors text-black dark:text-white shadow-sm">
                    Software Eng.
                  </button>
                  <button onClick={() => loadSample('marketing_manager')} className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-xl text-xs font-black border border-amber-200 dark:border-amber-700 hover:bg-amber-100 transition-colors text-black dark:text-white shadow-sm">
                    Marketing Mgr.
                  </button>
                </div>

                <button 
                  onClick={() => setShowSampleBanner(false)}
                  className="absolute top-4 right-4 p-1 text-amber-400 hover:text-amber-600 dark:hover:text-amber-200 transition-colors rounded-lg hover:bg-amber-100/50 dark:hover:bg-amber-900/50"
                  aria-label="Close banner"
                >
                  <X size={18} />
                </button>
              </motion.div>
            )}

            {/* Step 1: Upload / Input Resume */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3 text-primary-600">
                  <FileText size={24} />
                  <h3 className="text-xl font-bold">1. Resume Content</h3>
                </div>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessingFile}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-xl font-bold text-sm border border-primary-100 dark:border-primary-800 hover:bg-primary-100 transition-all group"
                >
                  {isProcessingFile ? <Loader2 size={16} className="animate-spin" /> : <FileUp size={16} className="group-hover:-translate-y-0.5 transition-transform" />}
                  {isProcessingFile ? 'Processing...' : 'Upload PDF'}
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="application/pdf" 
                    onChange={handleFileUpload} 
                    className="hidden" 
                  />
                </button>
              </div>
              
              <div className="relative">
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here, or use the 'Upload PDF' button above..."
                  className="w-full h-64 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary-500 dark:focus:border-primary-600 outline-none transition-all resize-none text-sm leading-relaxed text-black dark:text-white font-medium"
                />
                {!resumeText && !isProcessingFile && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                    <FileText size={80} className="text-black dark:text-white" />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Step 2: Target JD */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3 text-primary-600">
                  <Briefcase size={24} />
                  <h3 className="text-xl font-bold">2. Target Job Description</h3>
                </div>
                {jdError && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-rose-500 text-xs font-black uppercase tracking-wider"
                  >
                    Required for matching
                  </motion.div>
                )}
              </div>
              
              <div className="relative">
                <textarea
                  value={jobDescription}
                  onChange={(e) => {
                    setJobDescription(e.target.value);
                    if (e.target.value.trim()) setJdError(false);
                  }}
                  placeholder="Paste the requirements of the job you're applying for..."
                  className={`w-full h-32 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 outline-none transition-all resize-none text-sm text-black dark:text-white font-medium ${
                    jdError 
                      ? 'border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]' 
                      : 'border-transparent focus:border-primary-500'
                  }`}
                />
              </div>
            </motion.div>

            {/* Step 3: AI Suggestions Context */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center gap-3 mb-6 text-primary-600">
                <MessageSquareCode size={24} />
                <h3 className="text-xl font-bold">3. Specific AI Focus (Optional)</h3>
              </div>
              
              <p className="text-xs text-black dark:text-slate-400 mb-4 font-black uppercase tracking-widest">
                Ask the AI to look for something specific, like "Do I sound too junior?"
              </p>

              <div className="relative">
                <textarea
                  value={aiFocus}
                  onChange={(e) => setAiFocus(e.target.value)}
                  placeholder="e.g. Focus on my leadership experience and suggest how to make it sound more impactful..."
                  className="w-full h-24 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary-500 dark:focus:border-primary-600 outline-none transition-all resize-none text-sm leading-relaxed text-black dark:text-white font-medium"
                />
              </div>

              {analysis.error && (
                <div className="mt-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-600 dark:text-rose-400 text-sm flex items-center gap-3 font-bold">
                  <AlertCircle size={18} />
                  {analysis.error}
                </div>
              )}

              <div className="mt-8">
                <button
                  onClick={runAnalysis}
                  disabled={analysis.isAnalyzing || isProcessingFile || !resumeText.trim()}
                  className={`w-full py-5 rounded-[1.5rem] font-black shadow-2xl transition-all flex items-center justify-center gap-3 group relative overflow-hidden ${
                    analysis.isAnalyzing || isProcessingFile || !resumeText.trim()
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                      : 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-500/30'
                  }`}
                >
                  {analysis.isAnalyzing ? (
                    <>
                      <Loader2 className="animate-spin" /> 
                      <span className="animate-pulse">Gemini is auditing your career...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Advanced AI Audit</span>
                      <Sparkles size={20} className="group-hover:rotate-12 transition-transform text-amber-300" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar / History */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg h-full"
            >
              <div className="flex items-center gap-2 mb-6 text-black dark:text-slate-300">
                <History size={20} />
                <h3 className="font-black uppercase tracking-widest text-sm">Recent Audits</h3>
              </div>

              <div className="space-y-4">
                {history.length > 0 ? (
                  history.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-500 transition-colors group relative"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-black text-black dark:text-slate-400 uppercase tracking-tighter">{item.date}</span>
                        <button 
                          onClick={() => removeFromHistory(item.id)}
                          className="text-black dark:text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <h4 className="font-bold text-sm truncate pr-4 text-black dark:text-white">{item.title}</h4>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary-500" 
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-black text-primary-500">{item.score}%</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <History size={32} className="mx-auto text-slate-300 mb-2 opacity-30" />
                    <p className="text-xs text-black dark:text-slate-500 font-bold">Audit history will appear here.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};
