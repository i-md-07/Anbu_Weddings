import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Heart,
  Star,
  Share2,
  MessageCircle,
  MapPin,
  Briefcase,
  GraduationCap,
  Home,
  Users,
  ChevronLeft,
  Check,
  X,
  Shield
} from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { profiles } from "../data/mockData";
import { fetchCurrentUser } from "../services/api";

interface ProfileViewPageProps {
  profileId?: number | null;
  onNavigate?: (page: string) => void;
}

export function ProfileViewPage({ profileId, onNavigate }: ProfileViewPageProps) {
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // If profileId is present, we view ANOTHER user (mock for now if not implemented fully)
  // If profileId is NULL, we view CURRENT USER (fetch from API)
  const isCurrentUser = !profileId;

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      if (isCurrentUser) {
        // Fetch logged-in user
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const userData = await fetchCurrentUser(token);
            // Map backend data to UI format
            setProfileData({
              name: userData.username,
              age: new Date().getFullYear() - new Date(userData.dob).getFullYear(),
              city: userData.district,
              state: userData.state,
              image: userData.photo ? `http://localhost:5000/${userData.photo}` : "https://images.unsplash.com/photo-1649433658557-54cf58577c68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
              images: userData.photo ? [`http://localhost:5000/${userData.photo}`] : ["https://images.unsplash.com/photo-1649433658557-54cf58577c68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"],
              matchScore: 100, // Self match
              verified: true,
              about: "I am a registered member of VOWS.",
              interests: ["Reading", "Travel"], // Mock for now or fetch if in DB
              profession: userData.personAnnualIncome ? "Working Professional" : "N/A",
              company: "N/A",
              education: "Graduate", // Mock
              religion: userData.religion,
              caste: userData.caste,
              maritalStatus: "Never Married", // Mock
              family: {
                father: userData.fatherName,
                mother: userData.motherName,
                siblings: "N/A",
                familyType: "Nuclear",
                familyValues: "Traditional"
              },
              diet: "Vegetarian",
              drinking: "No",
              smoking: "No"
            });
          } catch (err) {
            console.error("Failed to fetch user", err);
          }
        }
      } else {
        // Mock profile 
        const found = profiles.find(p => p.id === profileId) || profiles[0];
        setProfileData(found);
      }
      setLoading(false);
    };
    loadProfile();
  }, [profileId]);

  if (loading || !profileData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const profile = profileData;

  const handleBack = () => {
    if (onNavigate) {
      if (isCurrentUser) {
        onNavigate('dashboard'); // Close back to dashboard if viewing my profile
      } else {
        onNavigate('browse'); // Back to browse if viewing others
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Header */}
      <div className="bg-white border-b border-[#C5A059]/20 sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="hover:bg-[#F9F9F9]"
              style={{ fontFamily: "'Inter', sans-serif" }}
              onClick={handleBack}
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              {isCurrentUser ? "Back to Dashboard" : "Back to Profiles"}
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="border-[#C5A059]/30 hover:border-[#C5A059]"
              >
                <Share2 className="w-5 h-5" />
              </Button>
              {!isCurrentUser && (
                <Button
                  variant="outline"
                  size="icon"
                  className={`border-[#C5A059]/30 hover:border-[#C5A059] ${isShortlisted ? 'bg-[#C5A059]/10' : ''}`}
                  onClick={() => setIsShortlisted(!isShortlisted)}
                >
                  <Star className={`w-5 h-5 ${isShortlisted ? 'fill-[#C5A059] text-[#C5A059]' : ''}`} />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative h-[600px] rounded-2xl overflow-hidden shadow-lg"
            >
              <ImageWithFallback
                src={profile.image}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 left-6">
                <div
                  className="px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2"
                  style={{
                    backgroundColor: 'rgba(197, 160, 89, 0.95)',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '14px',
                    color: '#1A1A1A'
                  }}
                >
                  <Star className="w-4 h-4 fill-[#1A1A1A]" />
                  {profile.matchScore}% Match
                </div>
              </div>
              {profile.verified && (
                <div className="absolute top-6 right-6">
                  <div
                    className="px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2"
                    style={{
                      backgroundColor: 'rgba(34, 197, 94, 0.95)',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#ffffff'
                    }}
                  >
                    <Shield className="w-4 h-4" />
                    Verified
                  </div>
                </div>
              )}
            </motion.div>

            {/* Gallery */}
            <div className="grid grid-cols-3 gap-4">
              {profile.images && profile.images.slice(1).map((img: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                  className="relative h-48 rounded-xl overflow-hidden cursor-pointer group"
                >
                  <ImageWithFallback
                    src={img}
                    alt={`${profile.name} ${index + 2}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </motion.div>
              ))}
            </div>

            {/* Detailed Information Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-md border border-[#C5A059]/20"
            >
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="family">Family</TabsTrigger>
                  <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="space-y-6">
                  <div>
                    <h3
                      className="mb-3"
                      style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 600, color: '#1A1A1A' }}
                    >
                      About Me
                    </h3>
                    <p
                      className="text-[#717182] leading-relaxed"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {profile.about}
                    </p>
                  </div>

                  <div>
                    <h3
                      className="mb-3"
                      style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 600, color: '#1A1A1A' }}
                    >
                      Interests & Hobbies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests && profile.interests.map((interest: string, index: number) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="px-4 py-2 border-[#C5A059]/30 text-[#1A1A1A]"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="family" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[#717182] mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Father
                      </p>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#1A1A1A' }}>
                        {profile.family?.father}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#717182] mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Mother
                      </p>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#1A1A1A' }}>
                        {profile.family?.mother}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#717182] mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Siblings
                      </p>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#1A1A1A' }}>
                        {profile.family?.siblings}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#717182] mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Family Type
                      </p>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#1A1A1A' }}>
                        {profile.family?.familyType}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#717182] mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Family Values
                      </p>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#1A1A1A' }}>
                        {profile.family?.familyValues}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="lifestyle" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[#717182] mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Diet
                      </p>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#1A1A1A' }}>
                        {profile.diet}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#717182] mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Smoking
                      </p>
                      <div className="flex items-center gap-2">
                        {profile.smoking === 'No' ? (
                          <X className="w-4 h-4 text-green-600" />
                        ) : (
                          <Check className="w-4 h-4 text-red-500" />
                        )}
                        <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#1A1A1A' }}>
                          {profile.smoking}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-[#717182] mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Drinking
                      </p>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#1A1A1A' }}>
                        {profile.drinking}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preferences" className="space-y-4">
                  <p
                    className="text-[#717182]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Looking for a partner who values both tradition and modernity, has a stable career, and shares similar life goals. Preference for someone from a similar cultural background who enjoys traveling and trying new experiences.
                  </p>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Right Column - Profile Info Card */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-[#C5A059]/20 sticky top-32"
            >
              {/* Name & Basic Info */}
              <div className="mb-6">
                <h1
                  className="mb-1"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 700, color: '#1A1A1A' }}
                >
                  {profile.name}
                </h1>
                <p
                  className="text-[#717182] mb-4"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px' }}
                >
                  {profile.age} years, {profile.height}
                </p>

                {profile.isPremium && (
                  <Badge
                    className="bg-[#C5A059] text-[#1A1A1A] hover:bg-[#B59049]"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
                  >
                    Premium Member
                  </Badge>
                )}
              </div>

              {/* Quick Info */}
              <div className="space-y-4 mb-8 pb-8 border-b border-[#C5A059]/20">
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-[#8E001C] mt-0.5" />
                  <div>
                    <p
                      className="text-sm text-[#717182] mb-0.5"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Profession
                    </p>
                    <p
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#1A1A1A' }}
                    >
                      {profile.profession}
                    </p>
                    <p
                      className="text-sm text-[#717182]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {profile.company}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-[#8E001C] mt-0.5" />
                  <div>
                    <p
                      className="text-sm text-[#717182] mb-0.5"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Education
                    </p>
                    <p
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#1A1A1A' }}
                    >
                      {profile.education}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#8E001C] mt-0.5" />
                  <div>
                    <p
                      className="text-sm text-[#717182] mb-0.5"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Location
                    </p>
                    <p
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#1A1A1A' }}
                    >
                      {profile.city}, {profile.state}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Home className="w-5 h-5 text-[#8E001C] mt-0.5" />
                  <div>
                    <p
                      className="text-sm text-[#717182] mb-0.5"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Religion & Caste
                    </p>
                    <p
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#1A1A1A' }}
                    >
                      {profile.religion}, {profile.caste}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-[#8E001C] mt-0.5" />
                  <div>
                    <p
                      className="text-sm text-[#717182] mb-0.5"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Marital Status
                    </p>
                    <p
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#1A1A1A' }}
                    >
                      {profile.maritalStatus}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {!isCurrentUser && (
                <div className="space-y-3">
                  <Button
                    className="w-full py-6 bg-gradient-to-r from-[#8E001C] to-[#A60020] hover:from-[#6E0015] hover:to-[#8E001C] transition-all shadow-lg"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Send Interest
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full py-6 border-[#C5A059]/30 hover:border-[#C5A059] hover:bg-[#F9F9F9]"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Start Chat
                  </Button>
                </div>
              )}

              {/* Stats */}
              <div className="mt-8 pt-8 border-t border-[#C5A059]/20">
                <p
                  className="text-sm text-[#717182] mb-4"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Profile Statistics
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-[#F9F9F9] rounded-xl">
                    <p
                      className="text-[#8E001C] mb-1"
                      style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: 700 }}
                    >
                      156
                    </p>
                    <p
                      className="text-xs text-[#717182]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Profile Views
                    </p>
                  </div>
                  <div className="text-center p-4 bg-[#F9F9F9] rounded-xl">
                    <p
                      className="text-[#8E001C] mb-1"
                      style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: 700 }}
                    >
                      42
                    </p>
                    <p
                      className="text-xs text-[#717182]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Interests Received
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}