import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { loginUser } from "../services/api";
import { toast } from "sonner";

import img1 from "../assets/image1.jpeg";
import img2 from "../assets/resized_image2.jpeg";
import img3 from "../assets/resized_image3.jpeg";
import img4 from "../assets/resized_image4.jpeg";

interface HeroSectionProps {
  onNavigate?: (page: string) => void;
  isLoggedIn?: boolean;
  onLogin?: () => void;
}

export function HeroSection({ onNavigate, isLoggedIn, onLogin }: HeroSectionProps) {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [img1, img2, img3, img4];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="w-full h-full bg-gray-50 flex items-center justify-center">

      {/* LIMIT CONTAINER TO EXACT SCREEN HEIGHT */}
      <div className="w-full max-w-7xl h-full grid grid-cols-1 md:grid-cols-2 items-center">

        {/* LEFT — SQUARE SLIDESHOW */}
        <div className="w-full max-w-md mx-auto p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl border-4 border-white"
          >
            <AnimatePresence initial={false}>
              <motion.img
                key={currentIndex}
                src={images[currentIndex]}
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '-100%', opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Minimal Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </motion.div>
        </div>

        {/* RIGHT — LOGIN BOX */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center items-center h-full"
        >
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-sm">
            {isLoggedIn ? (
              <div className="text-center py-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Welcome Back!
                </h2>
                <p className="text-gray-500 mb-8">
                  You are already logged in. Continue your search for the perfect match.
                </p>
                <div className="space-y-4">
                  <Button
                    className="w-full h-12 rounded-full font-bold bg-[#8E001C] text-white hover:bg-[#6E0015]"
                    onClick={() => onNavigate?.('dashboard')}
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-full font-bold border-[#C5A059] text-[#8E001C] hover:bg-[#C5A059]/10"
                    onClick={() => onNavigate?.('browse')}
                  >
                    Browse Matches
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-center text-gray-900">
                  Welcome Back
                </h2>

                <div className="space-y-4">

                  {/* Phone Number */}
                  <div>
                    <label className="text-sm text-gray-600 ml-1">Phone Number</label>
                    <Input
                      placeholder="Enter phone number"
                      className="h-12 bg-gray-50 border-gray-200 mt-1"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-sm text-gray-600 ml-1">Password</label>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      className="h-12 bg-gray-50 border-gray-200 mt-1"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <Button disabled={loading} type="button" aria-label="Login" onClick={async () => {
                    if (isLoggedIn) {
                      onNavigate?.('dashboard');
                      return;
                    }
                    try {
                      setLoading(true);
                      // Mock login fallback
                      if (mobile === "9999999999" && password === "123456") {
                        localStorage.setItem('token', 'mock-test-token');
                        localStorage.setItem('user', JSON.stringify({ name: 'Test User', mobile: '9999999999' }));
                        if (onLogin) onLogin();
                        else if (onNavigate) onNavigate('dashboard');
                        setLoading(false);
                        return;
                      }

                      const response = await loginUser({ mobile, password });
                      localStorage.setItem('token', response.token);
                      if (response.user) localStorage.setItem('user', JSON.stringify(response.user));

                      if (response.user && response.user.userType === 1) {
                        // Navigate admin dashboard
                        if (onNavigate) onNavigate('admin');
                        else if (onLogin) onLogin();
                      } else {
                        if (onLogin) {
                          onLogin();
                        } else if (onNavigate) {
                          onNavigate('dashboard');
                        }
                      }
                    } catch (err) {
                      console.error(err);
                      toast.error('Login Failed: Invalid Credentials');
                    } finally {
                      setLoading(false);
                    }
                  }} className="w-full h-12 rounded-full font-bold bg-gradient-to-r from-[#8E001C] to-[#A60020] hover:from-[#6E0015] hover:to-[#8E001C] text-[#C5A059] shadow-lg hover:shadow-[#8E001C]/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-in-out">
                    {loading ? 'Logging in...' : 'LOGIN →'}
                  </Button>
                </div>

                <p className="text-center text-sm text-gray-500 mt-4">
                  New here?{" "}
                  <span
                    className="text-[#8E001C] font-semibold cursor-pointer hover:underline"
                    onClick={() => onNavigate?.("signup")}
                  >
                    Register Free
                  </span>
                </p>
              </>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
