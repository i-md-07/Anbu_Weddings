
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { motion } from "framer-motion";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CheckCircle2 } from "lucide-react";

interface HeroSectionProps {
  onNavigate?: (page: string) => void;
}

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1710425804836-a1de39056b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    name: "Anand - Reshma",
    tag: "#Cooking",
    color: "bg-pink-600"
  },
  {
    src: "https://images.unsplash.com/photo-1649433658557-54cf58577c68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    name: "Rakesh - Meenu",
    tag: "#Selfie",
    color: "bg-yellow-600"
  },
  {
    src: "https://images.unsplash.com/photo-1549416876-0f15c7e37e96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    name: "Anish - Geetha",
    tag: "#Dance",
    color: "bg-teal-600"
  },
  {
    src: "https://images.unsplash.com/photo-1551884831-bbf3ddd780ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    name: "Aparna - Sunil",
    tag: "#Fitness",
    color: "bg-purple-600"
  },
  {
    src: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    name: "Rajesh - Liya",
    tag: "#Long drive",
    color: "bg-indigo-600"
  },
  {
    src: "https://images.unsplash.com/photo-1623366302587-bca021d6616c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    name: "Vivek - Divya",
    tag: "#Acting",
    color: "bg-cyan-600"
  },
  {
    src: "https://images.unsplash.com/photo-1517867063772-2234b96709b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    name: "Suresh - Meena",
    tag: "#Reading",
    color: "bg-red-600"
  },
  {
    src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    name: "Harish - Anitha",
    tag: "#Art",
    color: "bg-blue-600"
  },
  {
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    name: "Vinay - Nisha",
    tag: "#Music",
    color: "bg-green-600"
  },
  {
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    name: "Pradeep - Rekha",
    tag: "#Travel",
    color: "bg-orange-600"
  },
];

export function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <div className="relative w-full min-h-screen bg-white pt-24 pb-12 overflow-hidden flex flex-col items-center">
      <div className="w-full max-w-[1440px] px-4 md:px-8 relative pt-12">

        {/* Right Side: Floating Registration Form - Absolute on Desktop */}
        <div className="w-full md:absolute md:top-0 md:right-8 md:w-[380px] lg:w-[420px] z-30 mb-8 md:mb-0">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="bg-[#22C55E] p-4 text-center">
              <h3 className="text-white font-bold text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
                Create a Matrimony Profile
              </h3>
            </div>

            {/* Form */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-center text-[#1A1A1A] mb-4">Find your perfect match</h4>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-[#717182] font-semibold uppercase tracking-wider">Profile created for</label>
                  <Select>
                    <SelectTrigger className="h-12 border-gray-300 focus:ring-[#22C55E] focus:border-[#22C55E]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self">Self</SelectItem>
                      <SelectItem value="son">Son</SelectItem>
                      <SelectItem value="daughter">Daughter</SelectItem>
                      <SelectItem value="brother">Brother</SelectItem>
                      <SelectItem value="sister">Sister</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-[#717182] font-semibold uppercase tracking-wider">Name</label>
                  <Input placeholder="Enter Name" className="h-12 border-gray-300 focus-visible:ring-[#22C55E]" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-[#717182] font-semibold uppercase tracking-wider">Mobile Number</label>
                  <div className="flex gap-2">
                    <div className="h-12 px-3 flex items-center border border-gray-300 rounded-md bg-gray-50 text-sm font-medium text-gray-600">
                      +91
                    </div>
                    <Input placeholder="Enter Number" className="h-12 border-gray-300 focus-visible:ring-[#22C55E] flex-1" />
                  </div>
                </div>

                <Button
                  className="w-full h-12 text-[16px] font-bold bg-[#E8590C] hover:bg-[#D04D08] text-white transition-all shadow-md mt-2"
                  onClick={() => onNavigate?.('signup')}
                >
                  REGISTER FREE →
                </Button>
              </div>

              <p className="text-[10px] text-center text-gray-400 leading-tight">
                By clicking register free, I agree to the <a href="#" className="underline">T&C</a> and <a href="#" className="underline">Privacy Policy</a>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Left Side: Headline + Image Gallery Grid */}
        <div className="md:pr-[400px] lg:pr-[440px] space-y-8">
          {/* Headlines */}
          <div className="text-left max-w-4xl">
            <h1
              className="text-3xl md:text-5xl font-black text-[#1A1A1A] mb-4 tracking-tight leading-tight"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              The biggest and most trusted<br />
              matrimony service for Indians!
            </h1>
            <p className="text-[#555] text-lg font-medium">
              Now find matches based on your hobbies & interests
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[500px] md:h-[600px] overflow-hidden relative mask-gradient-to-b">
            {galleryImages.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`relative rounded-xl overflow-hidden shadow-sm group hover:-translate-y-1 transition-transform duration-300 ${index % 3 === 0 ? 'row-span-2 h-64' : 'h-32'}`}
              >
                <ImageWithFallback src={img.src} alt={img.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-3 left-3 text-white text-left">
                  <p className="text-xs font-semibold">{img.name}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${img.color}`}>
                    {img.tag}
                  </span>
                </div>
              </motion.div>
            ))}
            {/* Overlay Gradient to fade out bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10"></div>
          </div>
        </div>
      </div>

      {/* Bottom Trust Indicators */}
      <div className="w-full max-w-[1440px] px-8 mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-100 pt-8">
        <div className="flex items-center justify-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-[#22C55E]" />
          <div className="text-left">
            <h4 className="font-bold text-[#1A1A1A]">100%</h4>
            <p className="text-xs text-[#717182]">Mobile-verified profiles</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-[#22C55E]" />
          <div className="text-left">
            <h4 className="font-bold text-[#1A1A1A]">4 Crores+</h4>
            <p className="text-xs text-[#717182]">Customers served</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-[#22C55E]" />
          <div className="text-left">
            <h4 className="font-bold text-[#1A1A1A]">23 Years</h4>
            <p className="text-xs text-[#717182]">of successful matchmaking</p>
          </div>
        </div>
      </div>

    </div>
  );
}
