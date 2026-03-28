import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/api';
import Navbar from './components/Navbar';
import { AnimatePresence } from 'framer-motion';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import Predict from './pages/Predict';
import Consultation from './pages/Consultation';
import FloatingChatbot from './components/FloatingChatbot';
import Chatbot from './pages/Chatbot';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const profile = await authService.getProfile();
        setUser(profile);
      } catch (error) {
        console.error("Auth check failed", error);
        authService.logout();
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-darker">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="mesh-glow"></div>
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar user={user} onLogout={() => { authService.logout(); setUser(null); }} />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={!user ? <Login onLogin={checkAuth} /> : <Navigate to={user.role === 'patient' ? '/patient-ui' : '/doctor-ui'} />} />
              <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

              {/* Protected Routes */}
              <Route path="/patient-ui" element={user?.role === 'patient' ? <PatientDashboard user={user} /> : <Navigate to="/login" />} />
              <Route path="/doctor-ui" element={user?.role === 'doctor' ? <DoctorDashboard user={user} /> : <Navigate to="/login" />} />
              <Route path="/predict" element={user?.role === 'patient' ? <Predict /> : <Navigate to="/login" />} />
              <Route path="/consultation/:id" element={user ? <Consultation user={user} /> : <Navigate to="/login" />} />
            </Routes>
          </AnimatePresence>
        </main>

        <FloatingChatbot />
        <Chatbot />

        {/* Footer */}
        <footer className="py-8 px-6 text-center text-slate-500 text-sm border-t border-white/5">
          <p>© 2026 MediAI Intelligence. All rights reserved.</p>
        </footer>
      </div>
    </Router >
  );
}

export default App;
