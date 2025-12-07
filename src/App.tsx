import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
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

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [direction, setDirection] = useState(0);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // If we are essentially at "root", redirect to dashboard if logged in
      // Since SPA routing resets to "home" on reload, we force dashboard here
      setCurrentPage('dashboard');
    }
  }, []);

  const handleNavigate = (page: string) => {
    // Determine transition direction
    if (currentPage === "login" && page === "signup") {
      setDirection(-1); // Reverse: Slide in from left (Left to Right transition)
    } else if (currentPage === "signup" && page === "login") {
      setDirection(1); // Forward: Slide in from right
    } else if ((page === "login" || page === "signup") && currentPage !== "login" && currentPage !== "signup") {
      setDirection(1); // Entering auth: Slide in from right
    } else if ((currentPage === "login" || currentPage === "signup") && page !== "login" && page !== "signup") {
      setDirection(-1); // Leaving auth: Slide out to right (new page from left)
    } else {
      setDirection(0); // Default: Fade
    }

    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleProfileSelect = (id: number) => {
    setSelectedProfileId(id);
    handleNavigate('profile');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    handleNavigate('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    handleNavigate('home');
  };

  const variants = {
    initial: (direction: number) => {
      if (direction === 0) return { opacity: 0 };
      return {
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0
      };
    },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] // Custom cubic bezier for smooth effect
      }
    },
    exit: (direction: number) => {
      if (direction === 0) return { opacity: 0 };
      return {
        x: direction < 0 ? "100%" : "-100%",
        opacity: 0,
        transition: {
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1]
        }
      };
    }
  };

  // Simple page routing
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <>
            <Navbar onNavigate={handleNavigate} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <main>
              <HeroSection />
              <TrustSection />
              <FeaturedProfiles />
              <HowItWorks />
              <SuccessStory />
              <CTASection />
            </main>
            <Footer onNavigate={handleNavigate} />
          </>
        );
      case "login":
        return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />;
      case "signup":
        return <SignupPage onNavigate={handleNavigate} />;
      case "browse":
        return (
          <>
            <Navbar onNavigate={handleNavigate} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <BrowseProfilesPage onProfileSelect={handleProfileSelect} />
            <Footer onNavigate={handleNavigate} />
          </>
        );
      case "profile":
        return (
          <>
            <Navbar onNavigate={handleNavigate} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <ProfileViewPage profileId={selectedProfileId} onNavigate={handleNavigate} />
            <Footer onNavigate={handleNavigate} />
          </>
        );
      case "dashboard":
        return <DashboardPage onNavigate={handleNavigate} onLogout={handleLogout} />;
      case "pricing":
        return (
          <>
            <Navbar onNavigate={handleNavigate} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <PricingPage />
            <Footer onNavigate={handleNavigate} />
          </>
        );
      default:
        return (
          <>
            <Navbar onNavigate={handleNavigate} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <main>
              <HeroSection />
              <TrustSection />
              <FeaturedProfiles />
              <HowItWorks />
              <SuccessStory />
              <CTASection />
            </main>
            <Footer onNavigate={handleNavigate} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FAFAFA]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={currentPage}
          custom={direction}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full min-h-screen"
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}