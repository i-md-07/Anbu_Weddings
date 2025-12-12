import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion } from "framer-motion";

import img1 from "../assets/image1.jpeg";
import img2 from "../assets/resized_image2.jpeg";
import img3 from "../assets/resized_image3.jpeg";
import img4 from "../assets/resized_image4.jpeg";

interface HeroSectionProps {
  onNavigate?: (page: string) => void;
  isLoggedIn?: boolean;
}

export function HeroSection({ onNavigate, isLoggedIn }: HeroSectionProps) {
  const images = [img1, img2, img3, img4];

  return (
    <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center pb-10">

      {/* LIMIT CONTAINER TO EXACT SCREEN HEIGHT */}
      <div className="w-full max-w-7xl h-full grid grid-cols-1 md:grid-cols-2 items-center">

        {/* LEFT — IMAGE FRAME GRID */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 gap-4 w-full max-w-lg mx-auto p-4"
        >
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              className="w-full h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-500"
            />
          ))}
        </motion.div>

        {/* RIGHT — LOGIN BOX */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center items-center h-full"
        >
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-sm">
            {isLoggedIn ? (
              <div className="text-center py-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Welcome Back!
                </h2>
                <p className="text-gray-500 mb-8">
                  You are already logged in. Continue your search for the perfect match.
                </p>
                <div className="space-y-4">
                  <Button
                    className="w-full h-12 rounded-full font-bold bg-[#8E001C] text-white hover:bg-[#6E0015]"
                    onClick={() => onNavigate?.('dashboard')}
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-full font-bold border-[#C5A059] text-[#8E001C] hover:bg-[#C5A059]/10"
                    onClick={() => onNavigate?.('browse')}
                  >
                    Browse Matches
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-center text-gray-900">
                  Welcome Back
                </h2>

                <p className="text-center text-gray-500 mt-1 mb-6">
                  Login to continue your Tamil match search
                </p>

                <div className="space-y-4">

                  {/* Phone Number */}
                  <div>
                    <label className="text-sm text-gray-600 ml-1">Phone Number</label>
                    <Input
                      placeholder="Enter phone number"
                      className="h-12 bg-gray-50 border-gray-200 mt-1"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-sm text-gray-600 ml-1">Password</label>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      className="h-12 bg-gray-50 border-gray-200 mt-1"
                    />
                  </div>

                  <Button className="w-full h-12 rounded-full font-bold bg-[#E8590C] text-white hover:bg-[#D04D08]">
                    LOGIN →
                  </Button>
                </div>

                <p className="text-center text-sm text-gray-500 mt-4">
                  New here?{" "}
                  <span
                    className="text-[#E8590C] font-semibold cursor-pointer"
                    onClick={() => onNavigate?.("signup")}
                  >
                    Register Free
                  </span>
                </p>
              </>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
