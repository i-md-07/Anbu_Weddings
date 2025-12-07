import { Quote } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "framer-motion";

export function SuccessStory() {
  return (
    <section className="py-24 bg-[#F9F9F9] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8E001C]/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-[1440px] mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.12)] h-[600px]"
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1665960211002-0ecf92bed0ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjB3ZWRkaW5nJTIwY291cGxlJTIwcm9tYW50aWN8ZW58MXx8fHwxNzY0ODY2NjQyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Wedding couple"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            
            {/* Floating Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg"
            >
              <p 
                className="text-[#8E001C] mb-1"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: '14px' }}
              >
                SUCCESS STORY
              </p>
              <p 
                className="text-[#1A1A1A]"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
              >
                Ananya & Vikram
              </p>
            </motion.div>
          </motion.div>

          {/* Right Side - Quote */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-8">
              <Quote 
                className="w-16 h-16 text-[#C5A059]" 
                strokeWidth={1}
              />
            </div>

            <h2 
              className="mb-6 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 600, color: '#1A1A1A', lineHeight: '1.2' }}
            >
              A Match Made by Technology, Blessed by Tradition.
            </h2>

            <blockquote 
              className="text-[#1A1A1A] mb-6 text-xl leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              "We met on VOWS in March, engaged in June. The compatibility score was spot on. What impressed us most was how the platform understood our modern values while respecting our cultural roots. VOWS didn't just match our profiles—it matched our souls."
            </blockquote>

            <div className="flex items-center gap-4 mb-8">
              <div 
                className="h-px bg-gradient-to-r from-[#C5A059] to-transparent flex-grow"
              ></div>
            </div>

            <div>
              <p 
                className="text-[#1A1A1A] mb-1"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: '20px' }}
              >
                Ananya & Vikram
              </p>
              <p 
                className="text-[#717182]"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}
              >
                Married December 2024 • Mumbai
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-[#C5A059]/20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <p 
                  className="text-[#8E001C] mb-1"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', fontWeight: 700 }}
                >
                  98%
                </p>
                <p 
                  className="text-[#717182]"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}
                >
                  Match Score
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <p 
                  className="text-[#8E001C] mb-1"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', fontWeight: 700 }}
                >
                  3
                </p>
                <p 
                  className="text-[#717182]"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}
                >
                  Months to Engage
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <p 
                  className="text-[#8E001C] mb-1"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', fontWeight: 700 }}
                >
                  100%
                </p>
                <p 
                  className="text-[#717182]"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}
                >
                  Happy Together
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}