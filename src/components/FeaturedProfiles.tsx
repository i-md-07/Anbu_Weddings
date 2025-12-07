"use client";

import { Star, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "framer-motion";

interface Profile {
  id: number;
  name: string;
  age: number;
  height: string;
  profession: string;
  city: string;
  image: string;
  isPremium: boolean;
  isNew: boolean;
}

export function FeaturedProfiles() {
  const [shortlisted, setShortlisted] = useState<number[]>([]);

  const profiles: Profile[] = [
    {
      id: 1,
      name: "Priya Sharma",
      age: 28,
      height: "5'6\"",
      profession: "Software Engineer",
      city: "Bangalore",
      image: "https://images.unsplash.com/photo-1710425804836-a1de39056b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBJbmRpYW4lMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDg2NjU5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      isPremium: true,
      isNew: false
    },
    {
      id: 2,
      name: "Arjun Patel",
      age: 32,
      height: "5'11\"",
      profession: "Investment Banker",
      city: "Mumbai",
      image: "https://images.unsplash.com/photo-1649433658557-54cf58577c68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBJbmRpYW4lMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjQ3NzAwMTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      isPremium: false,
      isNew: true
    },
    {
      id: 3,
      name: "Aisha Khan",
      age: 26,
      height: "5'5\"",
      profession: "Doctor",
      city: "Delhi",
      image: "https://images.unsplash.com/photo-1653671832574-029b950a5749?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjB3b21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc2NDg2NjU5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      isPremium: true,
      isNew: false
    },
    {
      id: 4,
      name: "Rohan Mehta",
      age: 30,
      height: "6'0\"",
      profession: "Entrepreneur",
      city: "Pune",
      image: "https://images.unsplash.com/photo-1649433658557-54cf58577c68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBtYW4lMjBwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NjQ4NjY1OTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      isPremium: false,
      isNew: true
    }
  ];

  const toggleShortlist = (id: number) => {
    setShortlisted(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-24 bg-[#F9F9F9] relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#8E001C]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-[1440px] mx-auto px-8 relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 600, color: '#1A1A1A' }}
        >
          Members Looking for Someone Like You.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {profiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-[0_24px_48px_rgba(0,0,0,0.12)] transition-all"
            >
              {/* Image Container */}
              <div className="relative h-80 overflow-hidden">
                <ImageWithFallback
                  src={profile.image}
                  alt={profile.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badge */}
                <div className="absolute top-4 right-4">
                  {profile.isPremium && (
                    <span 
                      className="px-3 py-1 rounded-full text-xs backdrop-blur-sm"
                      style={{ 
                        fontFamily: "'Inter', sans-serif", 
                        fontWeight: 600,
                        backgroundColor: 'rgba(197, 160, 89, 0.9)',
                        color: '#1A1A1A'
                      }}
                    >
                      Premium
                    </span>
                  )}
                  {profile.isNew && (
                    <span 
                      className="px-3 py-1 rounded-full text-xs backdrop-blur-sm"
                      style={{ 
                        fontFamily: "'Inter', sans-serif", 
                        fontWeight: 600,
                        backgroundColor: 'rgba(34, 197, 94, 0.9)',
                        color: '#ffffff'
                      }}
                    >
                      New
                    </span>
                  )}
                </div>

                {/* Shortlist Icon */}
                <button
                  onClick={() => toggleShortlist(profile.id)}
                  className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all"
                >
                  <Star
                    className={`w-5 h-5 ${shortlisted.includes(profile.id) ? 'fill-[#C5A059] text-[#C5A059]' : 'text-[#1A1A1A]'}`}
                    strokeWidth={2}
                  />
                </button>
              </div>

              {/* Info Area */}
              <div className="p-6">
                <h3 
                  className="mb-1 tracking-tight"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 600, color: '#1A1A1A' }}
                >
                  {profile.name}
                </h3>
                <div 
                  className="space-y-1 mb-4 text-[#717182]"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}
                >
                  <p>{profile.age} yrs, {profile.height}</p>
                  <p>{profile.profession}</p>
                  <p>{profile.city}</p>
                </div>

                <Button 
                  className="w-full bg-[#8E001C] hover:bg-[#6E0015] transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Send Interest
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}