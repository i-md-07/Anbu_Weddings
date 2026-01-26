import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { motion } from "motion/react";
import { Phone, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { loginUser } from "../services/api";
import { toast } from "sonner";
import logo from "../assets/logo.jpg";

interface LoginPageProps {
  onNavigate?: (page: string) => void;
  onLogin?: () => void;
}

export function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleNavigate = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // MOCK LOGIN FOR TESTING
      if (mobile === "9999999999" && password === "123456") {
        localStorage.setItem('token', 'mock-test-token');
        localStorage.setItem('user', JSON.stringify({ name: 'Test User', mobile: '9999999999' }));
        if (onLogin) onLogin();
        else if (onNavigate) onNavigate('dashboard');
        return;
      }

      const response = await loginUser({ mobile, password });
      localStorage.setItem('token', response.token);
      // Persist user info (includes userType/isAdmin)
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
    } catch (error) {
      console.error(error);
      toast.error('Login Failed: Invalid Credentials');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-start lg:items-center justify-center p-8 bg-white relative overflow-auto max-h-screen">
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-[#8E001C]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl"></div>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo */}
          <div className="mb-8 cursor-pointer text-center" onClick={(e) => handleNavigate(e, 'home')}>
            <div className="flex justify-center mb-4">
              <img src={logo} alt="VOWS Logo" className="h-32 w-32 object-contain" />
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", color: '#717182' }}>
              Welcome back! Sign in to continue your journey.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6 pb-8" onSubmit={handleLogin}>
            {/* Mobile Number */}
            <div className="space-y-2">
              <Label htmlFor="mobile" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                Mobile Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="pl-11 py-6 border-[#C5A059]/30 focus:border-[#8E001C]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 py-6 border-[#C5A059]/30 focus:border-[#8E001C]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked: boolean | string) => setRememberMe(checked === true)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif", color: '#1A1A1A' }}
                >
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-sm hover:underline"
                style={{ fontFamily: "'Inter', sans-serif", color: '#8E001C' }}
              >
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full py-6 bg-gradient-to-r from-[#8E001C] to-[#A60020] hover:from-[#6E0015] hover:to-[#8E001C] text-[#C5A059] font-bold text-lg shadow-lg hover:shadow-[#8E001C]/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-in-out group"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Sign In
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            {/* Sign Up Link */}
            <p className="text-center" style={{ fontFamily: "'Inter', sans-serif", color: '#717182' }}>
              Don't have an account?{' '}
              <a
                href="#"
                className="hover:underline"
                style={{ color: '#8E001C', fontWeight: 600 }}
                onClick={(e) => handleNavigate(e, 'signup')}
              >
                Sign Up
              </a>
            </p>
          </form>
        </motion.div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#8E001C] via-[#A60020] to-[#8E001C]">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605648916319-cf082f7524a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80')] bg-cover bg-center opacity-20"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white text-center"
          >
            <h2
              className="mb-6 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 700 }}
            >
              Find Your Perfect Match
            </h2>
            <p
              className="text-xl text-white/90 max-w-md mx-auto"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Join 2 million Indians who found love through our AI-powered matching platform.
            </p>
            <div className="mt-12 flex justify-center gap-8">
              <div className="text-center">
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', fontWeight: 700 }}>
                  2M+
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }} className="text-white/80">
                  Members
                </p>
              </div>
              <div className="text-center">
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', fontWeight: 700 }}>
                  50K+
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }} className="text-white/80">
                  Success Stories
                </p>
              </div>
              <div className="text-center">
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', fontWeight: 700 }}>
                  98%
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }} className="text-white/80">
                  Match Rate
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}