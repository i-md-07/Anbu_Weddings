import { motion } from "motion/react";
import { Check, Star, Crown, Zap, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Perfect for getting started",
      icon: Heart,
      color: "#717182",
      popular: false,
      features: [
        "Create your profile",
        "Browse profiles",
        "Send up to 5 interests/month",
        "Basic match suggestions",
        "Limited profile visibility",
        "Standard support"
      ]
    },
    {
      name: "Gold",
      price: "₹2,999",
      period: "3 months",
      description: "Most popular choice",
      icon: Star,
      color: "#C5A059",
      popular: true,
      features: [
        "Everything in Free",
        "Unlimited interests",
        "Advanced AI matching",
        "Featured profile placement",
        "View who viewed your profile",
        "Priority customer support",
        "Chat with matches",
        "Video call with matches",
        "Profile verification badge"
      ]
    },
    {
      name: "Platinum",
      price: "₹5,999",
      period: "6 months",
      description: "Premium experience",
      icon: Crown,
      color: "#8E001C",
      popular: false,
      features: [
        "Everything in Gold",
        "Top search rankings",
        "Dedicated relationship manager",
        "Background verification",
        "Exclusive matchmaking events",
        "Premium badge on profile",
        "Advanced privacy controls",
        "Compatibility reports",
        "Meeting coordination",
        "Family introduction support"
      ]
    }
  ];

  const faqs = [
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
    },
    {
      question: "Is my payment information secure?",
      answer: "Absolutely. We use industry-standard encryption to protect your payment information and never store your credit card details."
    },
    {
      question: "What happens if I cancel my subscription?",
      answer: "You can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 7-day money-back guarantee on all premium plans. If you're not satisfied, contact our support team for a full refund."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#8E001C] via-[#A60020] to-[#8E001C] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-[1440px] mx-auto px-8 py-20 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge
              className="mb-4 bg-[#C5A059] text-[#1A1A1A] hover:bg-[#B59049]"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
            >
              Pricing Plans
            </Badge>
            <h1
              className="mb-6 tracking-tight max-w-3xl mx-auto"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: '56px', fontWeight: 700 }}
            >
              Find Your Perfect Plan
            </h1>
            <p
              className="text-xl text-white/90 max-w-2xl mx-auto"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Choose the plan that works best for you and start your journey to finding your soulmate today.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-[1440px] mx-auto px-8 -mt-16 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl p-8 shadow-lg border-2 ${
                plan.popular ? 'border-[#C5A059] scale-105' : 'border-[#C5A059]/20'
              } hover:shadow-2xl transition-all`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge
                    className="bg-[#C5A059] text-[#1A1A1A] px-4 py-1.5"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}
                  >
                    MOST POPULAR
                  </Badge>
                </div>
              )}

              {/* Icon */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: `${plan.color}15` }}
              >
                <plan.icon className="w-8 h-8" style={{ color: plan.color }} strokeWidth={1.5} />
              </div>

              {/* Plan Name */}
              <h3
                className="mb-2"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 700, color: '#1A1A1A' }}
              >
                {plan.name}
              </h3>

              {/* Description */}
              <p
                className="text-[#717182] mb-6"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}
              >
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span
                    style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 700, color: plan.color }}
                  >
                    {plan.price}
                  </span>
                  <span
                    className="text-[#717182]"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}
                  >
                    /{plan.period}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: `${plan.color}15` }}
                    >
                      <Check className="w-3 h-3" style={{ color: plan.color }} strokeWidth={3} />
                    </div>
                    <span
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#1A1A1A' }}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button
                className={`w-full py-6 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-[#8E001C] to-[#A60020] hover:from-[#6E0015] hover:to-[#8E001C] text-white'
                    : 'bg-white border-2 hover:bg-[#F9F9F9]'
                }`}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  borderColor: plan.color,
                  color: plan.popular ? 'white' : plan.color
                }}
              >
                {plan.price === "₹0" ? "Get Started" : "Choose Plan"}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-white px-8 py-4 rounded-full shadow-md border border-[#C5A059]/20">
            <Zap className="w-5 h-5 text-[#C5A059]" />
            <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#1A1A1A' }}>
              7-Day Money-Back Guarantee on all premium plans
            </p>
          </div>
        </motion.div>
      </div>

      {/* Features Comparison */}
      <div className="bg-white py-20">
        <div className="max-w-[1440px] mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2
              className="mb-4"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 700, color: '#1A1A1A' }}
            >
              Why Choose Premium?
            </h2>
            <p
              className="text-[#717182] max-w-2xl mx-auto"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px' }}
            >
              Get 10x better results with our premium plans and find your match faster.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Higher Visibility",
                description: "Your profile appears at the top of search results, getting 5x more views.",
                icon: Star
              },
              {
                title: "Better Matches",
                description: "Advanced AI algorithms provide highly compatible match suggestions.",
                icon: Heart
              },
              {
                title: "Faster Results",
                description: "Premium members find their match 3x faster than free members.",
                icon: Zap
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl bg-[#F9F9F9] hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-[#C5A059]/20"
              >
                <div className="w-16 h-16 rounded-full bg-[#8E001C]/10 flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-[#8E001C]" />
                </div>
                <h3
                  className="mb-3"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: 600, color: '#1A1A1A' }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-[#717182]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-[#F9F9F9] py-20">
        <div className="max-w-[1440px] mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2
              className="mb-4"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 700, color: '#1A1A1A' }}
            >
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-[#C5A059]/20"
              >
                <h3
                  className="mb-2"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 600, color: '#1A1A1A' }}
                >
                  {faq.question}
                </h3>
                <p
                  className="text-[#717182]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-[#8E001C] via-[#A60020] to-[#8E001C] text-white py-20">
        <div className="max-w-[1440px] mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="mb-6"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 700 }}
            >
              Ready to Find Your Perfect Match?
            </h2>
            <p
              className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Join thousands of happy couples who found their soulmate on VOWS.
            </p>
            <Button
              className="px-12 py-6 text-lg rounded-full bg-[#C5A059] hover:bg-[#B59049] text-[#1A1A1A] shadow-2xl hover:shadow-[#C5A059]/50 transition-all hover:scale-105"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
            >
              Get Started Today
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
