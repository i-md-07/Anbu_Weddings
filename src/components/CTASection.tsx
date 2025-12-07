import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="py-32 bg-gradient-to-br from-[#8E001C] via-[#A60020] to-[#8E001C] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <Sparkles className="w-16 h-16 text-[#C5A059]" strokeWidth={1.5} />
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white mb-6 tracking-tight max-w-3xl mx-auto"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: '56px', fontWeight: 700, lineHeight: '1.2' }}
        >
          Your Soulmate is One Click Away.
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-white/90 mb-12 text-xl max-w-2xl mx-auto"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Join millions of Indians who found their perfect match on VOWS. Start your journey to happily ever after today.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button 
            className="px-12 py-6 text-lg rounded-full bg-[#C5A059] hover:bg-[#B59049] text-[#1A1A1A] shadow-2xl hover:shadow-[#C5A059]/50 transition-all hover:scale-105"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
          >
            Join Now for Free
          </Button>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-white/70 mt-6"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}
        >
          No credit card required • Free forever • Cancel anytime
        </motion.p>
      </div>
    </section>
  );
}