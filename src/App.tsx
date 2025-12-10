import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { TrustSection } from "./components/TrustSection";
import { FeaturedProfiles } from "./components/FeaturedProfiles";
import { HowItWorks } from "./components/HowItWorks";
import { SuccessStory } from "./components/SuccessStory";
import { CTASection } from "./components/CTASection";
import { Footer } from "./components/Footer";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { BrowseProfilesPage } from "./components/BrowseProfilesPage";
import { ProfileViewPage } from "./components/ProfileViewPage";
import { DashboardPage } from "./components/DashboardPage";
import { PricingPage } from "./components/PricingPage";

// Wrapper to extract profileId from URL params
const ProfileRouteWrapper = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { id } = useParams();
  const profileId = id ? parseInt(id) : null;
  return <ProfileViewPage profileId={profileId} onNavigate={onNavigate} />;
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      if (location.pathname === '/') {
        navigate('/dashboard');
      }
    }
  }, []);

  const handleNavigate = (page: string) => {
    // Map legacy string navigation to routes
    switch (page) {
      case 'home': navigate('/'); break;
      case 'login': navigate('/login'); break;
      case 'signup': navigate('/signup'); break;
      case 'browse': navigate('/browse'); break;
      case 'dashboard': navigate('/dashboard'); break;
      case 'pricing': navigate('/pricing'); break;
      case 'profile': navigate('/profile'); break; // Fallback, usually profile select navigates to specific ID
      default: navigate('/');
    }
    window.scrollTo(0, 0);
  };

  const handleProfileSelect = (id: number) => {
    navigate(`/profile/${id}`);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  const variants = {
    initial: { opacity: 0, x: 20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut" as const
      }
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.5,
        ease: "easeInOut" as const
      }
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FAFAFA]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <motion.div variants={variants} initial="initial" animate="animate" exit="exit" className="w-full min-h-screen">
              <Navbar onNavigate={handleNavigate} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
              <main>
                <HeroSection onNavigate={handleNavigate} />
                <TrustSection />
                <FeaturedProfiles />
                <HowItWorks />
                <SuccessStory />
                <CTASection />
              </main>
              <Footer onNavigate={handleNavigate} />
            </motion.div>
          } />

          <Route path="/login" element={
            <motion.div variants={variants} initial="initial" animate="animate" exit="exit" className="w-full min-h-screen">
              <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />
            </motion.div>
          } />

          <Route path="/signup" element={
            <motion.div variants={variants} initial="initial" animate="animate" exit="exit" className="w-full min-h-screen">
              <SignupPage onNavigate={handleNavigate} />
            </motion.div>
          } />

          <Route path="/browse" element={
            <motion.div variants={variants} initial="initial" animate="animate" exit="exit" className="w-full min-h-screen">
              <Navbar onNavigate={handleNavigate} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
              <BrowseProfilesPage onProfileSelect={handleProfileSelect} />
              <Footer onNavigate={handleNavigate} />
            </motion.div>
          } />

          <Route path="/profile/:id?" element={
            <motion.div variants={variants} initial="initial" animate="animate" exit="exit" className="w-full min-h-screen">
              <Navbar onNavigate={handleNavigate} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
              <ProfileRouteWrapper onNavigate={handleNavigate} />
              <Footer onNavigate={handleNavigate} />
            </motion.div>
          } />

          <Route path="/dashboard" element={
            <motion.div variants={variants} initial="initial" animate="animate" exit="exit" className="w-full min-h-screen">
              {/* Dashboard often has its own layout, but assuming full page for now based on previous code */}
              <DashboardPage onNavigate={handleNavigate} onLogout={handleLogout} />
            </motion.div>
          } />

          <Route path="/pricing" element={
            <motion.div variants={variants} initial="initial" animate="animate" exit="exit" className="w-full min-h-screen">
              <Navbar onNavigate={handleNavigate} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
              <PricingPage />
              <Footer onNavigate={handleNavigate} />
            </motion.div>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}