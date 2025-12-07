import { UserPlus, Sliders, MessageCircle, Heart } from "lucide-react";
import { motion } from "framer-motion";

export function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: "Create Profile",
      description: "Set up your detailed profile with photos and preferences in minutes."
    },
    {
      icon: Sliders,
      title: "Set Preferences",
      description: "Fine-tune your match criteria with our intelligent preference system."
    },
    {
      icon: MessageCircle,
      title: "Connect & Chat",
      description: "Start meaningful conversations with verified matches you like."
    },
    {
      icon: Heart,
      title: "Wedding Bells",
      description: "Find your perfect match and begin your journey together."
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#8E001C]/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-0 w-72 h-72 bg-[#C5A059]/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-[1440px] mx-auto px-8 relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 600, color: '#1A1A1A' }}
        >
          How It Works
        </motion.h2>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-[#C5A059]/20 via-[#C5A059] to-[#C5A059]/20 hidden md:block"></div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
            {steps.map((step, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="flex flex-col items-center text-center relative"
              >
                {/* Icon Circle */}
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative z-10 w-40 h-40 rounded-full flex items-center justify-center mb-6 bg-white border-4 shadow-lg hover:shadow-xl transition-shadow"
                  style={{ borderColor: '#C5A059' }}
                >
                  <div 
                    className="w-32 h-32 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#8E001C15' }}
                  >
                    <step.icon 
                      className="w-12 h-12" 
                      style={{ color: '#8E001C' }}
                      strokeWidth={1.5}
                    />
                  </div>
                  
                  {/* Step Number */}
                  <div 
                    className="absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg"
                    style={{ 
                      fontFamily: "'Playfair Display', serif", 
                      fontWeight: 700,
                      fontSize: '18px',
                      backgroundColor: '#8E001C'
                    }}
                  >
                    {index + 1}
                  </div>
                </motion.div>

                {/* Content */}
                <h3 
                  className="mb-3 tracking-tight"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: 600, color: '#1A1A1A' }}
                >
                  {step.title}
                </h3>
                <p 
                  className="text-[#717182] max-w-xs leading-relaxed"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}