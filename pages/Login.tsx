
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as ReactRouter from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { auth } from '../services/firebase';
import * as FirebaseAuth from 'firebase/auth';

const { Link } = ReactRouter as any;
const { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } = FirebaseAuth as any;

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else {
        setError('An error occurred during login. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        // Silently handle popup closure
      } else {
        setError('Failed to sign in with Google. Please try again.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-2xl border border-slate-200 dark:border-slate-800"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black mb-2 text-black dark:text-white">Welcome Back</h2>
          <p className="text-black/60 dark:text-slate-400 font-bold">Continue your career journey.</p>
        </div>

        <div className="space-y-6">
          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading || isGoogleLoading}
            className="w-full py-4 px-4 bg-white dark:bg-slate-800 text-black dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-xl font-black transition-all flex items-center justify-center gap-3 shadow-sm hover:border-primary-500 dark:hover:border-primary-500 disabled:opacity-70 active:scale-[0.98]"
          >
            {isGoogleLoading ? (
              <Loader2 size={18} className="animate-spin text-primary-500" />
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <div className="relative flex items-center justify-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-4 text-[10px] font-black uppercase tracking-widest text-slate-400">or use email</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-sm font-bold flex items-center gap-3"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-black mb-2 text-black dark:text-slate-300 uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || isGoogleLoading}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary-500 outline-none transition-all text-black dark:text-white font-medium disabled:opacity-50"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-black mb-2 text-black dark:text-slate-300 uppercase tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || isGoogleLoading}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary-500 outline-none transition-all text-black dark:text-white font-medium disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>
              <div className="text-right mt-1">
                <button type="button" className="text-xs text-primary-600 font-black hover:underline uppercase tracking-tighter">Forgot password?</button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>Log In <LogIn size={18} /></>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-black/60 dark:text-slate-500 font-bold">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary-600 font-black hover:underline inline-flex items-center gap-1">
            Sign up now <ArrowRight size={14} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
