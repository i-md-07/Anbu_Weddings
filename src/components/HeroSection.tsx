import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "framer-motion";

export function HeroSection() {
  const [ageRange, setAgeRange] = useState([25, 35]);

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1743750176861-d8e360c2e1ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBJbmRpYW4lMjBjb3VwbGUlMjBsYXVnaGluZyUyMGNhbmRpZHxlbnwxfHx8fDE3NjQ4NjY1NTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Modern Indian couple"
          className="w-full h-full object-cover scale-105 animate-[scale_20s_ease-in-out_infinite_alternate]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
        
        {/* Animated decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#8E001C]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] w-full mx-auto px-8 flex flex-col items-center text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-white mb-4 tracking-tight leading-tight max-w-4xl drop-shadow-2xl"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: '64px', fontWeight: 700 }}
        >
          Uniting Souls, Not Just Families.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-white/95 mb-16 max-w-2xl text-xl drop-shadow-lg"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          India's most trusted matchmaking algorithm for the modern generation.
        </motion.p>

        {/* Floating Search Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="w-full max-w-5xl bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-[0_32px_64px_rgba(0,0,0,0.15)] border border-white/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Looking For */}
            <div className="space-y-2">
              <label className="text-sm text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                Looking for
              </label>
              <Select defaultValue="bride">
                <SelectTrigger className="bg-[#F9F9F9] border-[#C5A059]/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bride">Bride</SelectItem>
                  <SelectItem value="groom">Groom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Age Range */}
            <div className="space-y-2">
              <label className="text-sm text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                Age Range
              </label>
              <div className="pt-2">
                <Slider
                  value={ageRange}
                  onValueChange={setAgeRange}
                  min={18}
                  max={60}
                  step={1}
                  className="[&_[role=slider]]:bg-[#8E001C] [&_[role=slider]]:border-[#8E001C]"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-[#717182]">{ageRange[0]}</span>
                  <span className="text-xs text-[#717182]">{ageRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Community */}
            <div className="space-y-2">
              <label className="text-sm text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                Community
              </label>
              <Select defaultValue="any">
                <SelectTrigger className="bg-[#F9F9F9] border-[#C5A059]/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Community</SelectItem>
                  <SelectItem value="hindu">Hindu</SelectItem>
                  <SelectItem value="muslim">Muslim</SelectItem>
                  <SelectItem value="sikh">Sikh</SelectItem>
                  <SelectItem value="christian">Christian</SelectItem>
                  <SelectItem value="jain">Jain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                Location
              </label>
              <Input 
                placeholder="City or State" 
                className="bg-[#F9F9F9] border-[#C5A059]/30 focus:border-[#8E001C]"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-6">
            <Button 
              className="w-full md:w-auto md:px-16 py-6 text-lg bg-gradient-to-r from-[#8E001C] to-[#A60020] hover:from-[#6E0015] hover:to-[#8E001C] transition-all shadow-lg"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
            >
              Begin Search
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}