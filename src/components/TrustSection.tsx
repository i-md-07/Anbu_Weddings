import { Shield, Lock, Cpu } from "lucide-react";
import { motion } from "framer-motion";

export function TrustSection() {
  const features = [
    {
      icon: Shield,
      title: "100% ID Verified",
      description: "Aadhaar & LinkedIn integration for genuine profiles.",
      color: "#8E001C"
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Control who sees your photos and number.",
      color: "#C5A059"
    },
    {
      icon: Cpu,
      title: "Smart Match",
      description: "AI algorithms that understand your preferences, not just your caste.",
      color: "#8E001C"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white via-[#F9F9F9]/30 to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8E001C]/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-[1440px] mx-auto px-8 relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 600, color: '#1A1A1A' }}
        >
          Why 2 Million Indians Trust VOWS.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group bg-white rounded-2xl p-8 border border-[#C5A059]/20 hover:border-[#C5A059] transition-all shadow-md hover:shadow-[0_24px_48px_rgba(0,0,0,0.12)]"
            >
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: `${feature.color}15` }}
              >
                <feature.icon 
                  className="w-8 h-8" 
                  style={{ color: feature.color }} 
                  strokeWidth={1.5}
                />
              </motion.div>
              <h3 
                className="mb-3 tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: 600, color: '#1A1A1A' }}
              >
                {feature.title}
              </h3>
              <p 
                className="text-[#717182] leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}