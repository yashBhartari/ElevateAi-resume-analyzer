
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as ReactRouter from 'react-router-dom';
import { Mail, Lock, User as UserIcon, UserPlus, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { auth } from '../services/firebase';
import * as FirebaseAuth from 'firebase/auth';

const { Link } = ReactRouter as any;
const { createUserWithEmailAndPassword, updateProfile } = FirebaseAuth as any;

export const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: name
      });
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-2xl border border-slate-200 dark:border-slate-800"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black mb-2 text-black dark:text-white">Create Account</h2>
          <p className="text-black/60 dark:text-slate-400 font-bold">Join thousands of successful candidates.</p>
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
            <label className="block text-sm font-black mb-2 text-black dark:text-slate-300 uppercase tracking-widest">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary-500 outline-none transition-all text-black dark:text-white font-medium disabled:opacity-50"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-black mb-2 text-black dark:text-slate-300 uppercase tracking-widest">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
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
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary-500 outline-none transition-all text-black dark:text-white font-medium disabled:opacity-50"
                placeholder="Min. 6 characters"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 active:scale-[0.98] disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>Get Started <UserPlus size={18} /></>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-black/60 dark:text-slate-500 font-bold">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-black hover:underline inline-flex items-center gap-1">
            Log in <ArrowRight size={14} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
