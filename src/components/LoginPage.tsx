import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { motion } from "motion/react";
import { Mail, Lock, ArrowRight, Heart } from "lucide-react";
import { useState } from "react";
import { loginUser } from "../services/api";

interface LoginPageProps {
  onNavigate?: (page: string) => void;
  onLogin?: () => void;
}

export function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
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
      const response = await loginUser({ email, password });
      localStorage.setItem('token', response.token);

      if (onLogin) {
        onLogin();
      } else if (onNavigate) {
        onNavigate('dashboard');
      }
    } catch (error) {
      console.error(error);
      alert('Login Failed: Invalid Credentials');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative overflow-hidden">
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
          <div className="mb-8 cursor-pointer" onClick={(e) => handleNavigate(e, 'home')}>
            <h1
              className="flex items-center gap-2 mb-2"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', fontWeight: 700, color: '#8E001C' }}
            >
              <Heart className="w-8 h-8 fill-[#8E001C]" />
              VOWS
            </h1>
            <p style={{ fontFamily: "'Inter', sans-serif", color: '#717182' }}>
              Welcome back! Sign in to continue your journey.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
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
              className="w-full py-6 bg-gradient-to-r from-[#8E001C] to-[#A60020] hover:from-[#6E0015] hover:to-[#8E001C] transition-all shadow-lg group"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
            >
              Sign In
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#C5A059]/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span
                  className="px-4 bg-white"
                  style={{ fontFamily: "'Inter', sans-serif", color: '#717182' }}
                >
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                type="button"
                className="py-6 border-[#C5A059]/30 hover:border-[#C5A059] hover:bg-[#F9F9F9]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                type="button"
                className="py-6 border-[#C5A059]/30 hover:border-[#C5A059] hover:bg-[#F9F9F9]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
            </div>

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