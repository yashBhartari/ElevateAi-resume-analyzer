
import React, { useState, useEffect } from 'react';
import * as ReactRouter from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Background3D } from './components/Background3D';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { SampleReports } from './pages/SampleReports';
import { Theme, User } from './types';
import { AnimatePresence } from 'framer-motion';
import { auth } from './services/firebase';
import * as FirebaseAuth from 'firebase/auth';

// Use namespace destructuring to bypass "no exported member" errors
const { HashRouter, Routes, Route, Navigate } = ReactRouter as any;
const { onAuthStateChanged, signOut } = FirebaseAuth as any;

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'dark';
  });

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: any) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          isLoggedIn: true,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary-500 font-black uppercase tracking-widest text-xs">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col transition-colors duration-300">
        <Background3D />
        <Navbar 
          theme={theme} 
          setTheme={setTheme} 
          user={user} 
          onLogout={handleLogout} 
        />
        
        <main className="flex-grow relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home isLoggedIn={!!user?.isLoggedIn} />} />
              <Route path="/samples" element={<SampleReports />} />
              <Route 
                path="/login" 
                element={user?.isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} 
              />
              <Route 
                path="/signup" 
                element={user?.isLoggedIn ? <Navigate to="/dashboard" /> : <Signup />} 
              />
              <Route 
                path="/dashboard" 
                element={user?.isLoggedIn ? <Dashboard user={user} /> : <Navigate to="/login" />} 
              />
            </Routes>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
