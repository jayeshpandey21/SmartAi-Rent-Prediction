import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero from './components/Hero';
import ProblemStatement from './components/ProblemStatement';
import Solution from './components/Solution';
import HowAIWorks from './components/HowAIWorks';
import TechStack from './components/TechStack';
import UseCases from './components/UseCases';
import FutureScope from './components/FutureScope';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import AIMethodology from './components/AIMethodology';
import Login from './pages/Login';
import Register from './pages/Register';
import UserPrediction from './pages/UserPrediction';
import UserAnalytics from './pages/UserAnalytics';
import UserInsights from './pages/UserInsights';
import UserHistory from './pages/UserHistory';
import UserTrends from './pages/UserTrends';
import UserAbout from './pages/UserAbout';
import UserContact from './pages/UserContact';
import UserProfile from './pages/UserProfile';
import UserLayout from './components/UserLayout';
import { useAuth } from './context/AuthContext';

// Lazy load 3D components
const Hero3D = lazy(() => import('./components/Hero3D'));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Landing Page Component
const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white selection:bg-primary-500/30 selection:text-white scroll-smooth">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
        <div className="container-custom">
          <div className="glass rounded-2xl px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
              </div>
              <span className="text-xl font-bold text-white">SmartRent AI</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              {['Features', 'How It Works', 'Tech Stack', 'Use Cases', 'Future Scope'].map((item, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(item.toLowerCase().replace(/\s+/g, '-'))}
                  className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
                >
                  {item}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              {/* Get Started Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={isAuthenticated() ? "/user/prediction" : "/register"}
                  className="px-6 py-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full text-sm font-semibold text-white hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main>
        <Hero />
        <div id="features">
          <ProblemStatement />
        </div>
        <Solution />
        <div id="how-it-works">
          <HowAIWorks />
        </div>
        <AIMethodology />
        <div id="tech-stack">
          <TechStack />
        </div>
        <div id="use-cases">
          <UseCases />
        </div>
        <div id="future-scope">
          <FutureScope />
        </div>
        <Testimonials />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* User Protected Routes with Layout */}
      <Route
        path="/user"
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/user/prediction" replace />} />
        <Route path="prediction" element={<UserPrediction />} />
        <Route path="analytics" element={<UserAnalytics />} />
        <Route path="insights" element={<UserInsights />} />
        <Route path="history" element={<UserHistory />} />
        <Route path="trends" element={<UserTrends />} />
        <Route path="about" element={<UserAbout />} />
        <Route path="contact" element={<UserContact />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>
      
      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
