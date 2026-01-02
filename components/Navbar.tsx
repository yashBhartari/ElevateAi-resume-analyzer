
import React, { useState } from 'react';
import * as ReactRouter from 'react-router-dom';
import { Sun, Moon, Cpu, LogOut, User as UserIcon, Menu, X, LayoutDashboard } from 'lucide-react';
import { Theme, User } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

// Use namespace destructuring to bypass "no exported member" errors
const { Link } = ReactRouter as any;

interface NavbarProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  user: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, setTheme, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDark = theme === 'dark';

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Use any type for variants to bypass potentially missing Variants export
  const menuVariants: any = {
    closed: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    open: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group shrink-0">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="bg-primary-600 p-2 rounded-xl text-white shadow-lg shadow-primary-500/20"
            >
              <Cpu size={24} />
            </motion.div>
            <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
              ElevateAI
            </span>
          </Link>

          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Theme Switcher (Always visible) */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black dark:text-slate-400 hidden lg:block">
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </span>
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className={`relative w-14 sm:w-16 h-7 sm:h-8 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/40 ${
                  isDark ? 'bg-slate-800 border border-slate-700' : 'bg-slate-100 border border-slate-200'
                }`}
                aria-label="Toggle Theme"
              >
                <div className="flex justify-between items-center w-full h-full px-1">
                  <Sun size={10} className={`${isDark ? 'text-slate-600' : 'text-amber-500'} transition-colors`} />
                  <Moon size={10} className={`${isDark ? 'text-indigo-400' : 'text-slate-300'} transition-colors`} />
                </div>
                
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`absolute top-1 bottom-1 w-5 sm:w-6 h-5 sm:h-6 rounded-full shadow-md flex items-center justify-center ${
                    isDark ? 'right-1 bg-indigo-500' : 'left-1 bg-white'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {isDark ? (
                      <motion.div
                        key="dark-icon"
                        initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                      >
                        <Moon size={10} className="text-white fill-white" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="light-icon"
                        initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                      >
                        <Sun size={10} className="text-amber-500 fill-amber-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </button>
            </div>

            {/* Desktop Navigation (Hidden on small screens) */}
            <div className="hidden sm:flex items-center space-x-6">
              {user?.isLoggedIn ? (
                <div className="flex items-center space-x-6">
                  <Link 
                    to="/dashboard" 
                    className="text-sm font-black text-black dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <div className="flex items-center space-x-3 pl-6 border-l border-slate-200 dark:border-slate-800">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-black text-black dark:text-white leading-none mb-0.5">{user.name}</span>
                      <span className="text-[10px] text-black/50 dark:text-slate-400 font-bold uppercase tracking-widest leading-none">Pro Plan</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm">
                      <UserIcon size={20} className="text-primary-500" />
                    </div>
                    <button
                      onClick={onLogout}
                      className="p-2 text-black dark:text-slate-400 hover:text-rose-500 transition-all hover:scale-110 active:scale-90"
                      title="Logout"
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-black text-black dark:text-slate-400 hover:text-primary-600 transition-colors"
                  >
                    Log in
                  </Link>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/signup"
                      className="px-6 py-2.5 text-sm font-black text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-xl shadow-primary-500/20"
                    >
                      Get Started
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={toggleMenu}
              className="sm:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-black dark:text-slate-400 border border-slate-200 dark:border-slate-700"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="sm:hidden overflow-hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              <div className="py-6 space-y-4">
                {user?.isLoggedIn ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 px-2 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                        <UserIcon size={24} className="text-primary-500" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-black dark:text-white leading-none mb-1">{user.name}</p>
                        <p className="text-[10px] text-primary-500 font-bold uppercase tracking-widest">Pro Plan Member</p>
                      </div>
                    </div>
                    
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-black dark:text-white font-bold transition-colors"
                    >
                      <LayoutDashboard size={18} className="text-primary-500" />
                      Dashboard
                    </Link>

                    <button
                      onClick={() => {
                        onLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 font-bold transition-colors"
                    >
                      <LogOut size={18} />
                      Log Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3 px-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full py-4 text-center text-sm font-black text-black dark:text-white border-2 border-slate-200 dark:border-slate-800 rounded-xl"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full py-4 text-center text-sm font-black text-white bg-primary-600 rounded-xl shadow-lg shadow-primary-500/20"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
