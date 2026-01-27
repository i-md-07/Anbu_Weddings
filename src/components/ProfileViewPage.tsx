import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Heart,
  Star,
  Share2,
  MapPin,
  Briefcase,
  Moon,
  Crown,
  ChevronLeft,
  Shield
} from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { profiles } from "../data/mockData";
import { fetchCurrentUser, recordProfileView, sendInterest, toggleShortlist } from "../services/api";
import { toast } from "sonner";

interface ProfileViewPageProps {
  profileId?: number | null;
  onNavigate?: (page: string) => void;
}

export function ProfileViewPage({ profileId, onNavigate }: ProfileViewPageProps) {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isCurrentUser = !profileId;

  // Mock Data
  const mockExtendedProfile = {
    name: "Arjun Reddy",
    age: 28,
    height: "5'10\"",
    city: "Chennai",
    state: "Tamil Nadu",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=60",
    coverImage: "https://images.unsplash.com/photo-1542820229-081e0c12af0b?w=1600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60"
    ],
    matchScore: 95,
    verified: true,
    isPremium: true,
    about: "I am a software engineer passionate about technology and travel. I come from a traditional yet modern family. Looking for someone who shares similar values and loves to explore new places.",
    interests: ["Photography", "Hiking", "Classical Music", "Tech", "Reading"],
    profession: "Senior Software Engineer",
    company: "Tech Solutions Inc.",
    education: "M.Tech in Computer Science",
    institution: "IIT Madras",
    religion: "Hindu",
    caste: "Reddy",
    gothram: "Siva",
    star: "Rohini",
    rasi: "Rishaba",
    dosham: "No Dosham",
    maritalStatus: "Never Married",
    family: {
      father: "Business Owner",
      mother: "Homemaker",
      siblings: "1 Younger Sister",
      familyType: "Nuclear",
      familyValues: "Moderate",
      native: "Madurai"
    },
    diet: "Non-Vegetarian",
    drinking: "Socially",
    smoking: "No",
    income: "25 - 35 LPA",
    partnerPreferences: {
      age: "24 - 29",
      height: "5'2\" - 5'8\"",
      education: "Graduate or Above",
      location: "Chennai, Bangalore, Hyderabad",
      maritalStatus: "Never Married"
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (isCurrentUser) {
        if (token) {
          try {
            const userData = await fetchCurrentUser(token);
            setProfileData({
              name: userData.username,
              age: new Date().getFullYear() - new Date(userData.dob).getFullYear(),
              city: userData.district,
              state: userData.state,
              image: userData.photo ? `http://localhost:5000/${userData.photo}` : mockExtendedProfile.image,
              coverImage: "https://images.unsplash.com/photo-1605218427306-6354db69e563?w=1600&auto=format&fit=crop&q=80",
              images: userData.photo ? [`http://localhost:5000/${userData.photo}`] : mockExtendedProfile.images,
              matchScore: 100,
              verified: true,
              isPremium: true,
              about: "I am a registered member of VOWS.",
              interests: ["Reading", "Travel"],
              profession: userData.personAnnualIncome ? "Working Professional" : "N/A",
              company: "N/A",
              education: "Graduate",
              religion: userData.religion,
              caste: userData.caste,
              gothram: userData.gothram || "Not Specified",
              star: userData.star || "Not Specified",
              rasi: userData.rasi || "Not Specified",
              dosham: userData.dosham || "None",
              maritalStatus: "Never Married",
              family: {
                father: userData.fatherName,
                mother: userData.motherName,
                siblings: "N/A",
                familyType: "Nuclear",
                familyValues: "Traditional",
                native: userData.district
              },
              diet: "Vegetarian",
              drinking: "No",
              smoking: "No",
              partnerPreferences: mockExtendedProfile.partnerPreferences
            });
          } catch (err) {
            console.error("Failed to fetch user, utilizing mock", err);
            setProfileData(mockExtendedProfile);
          }
        } else {
          setProfileData(mockExtendedProfile);
        }
      } else {
        const found = profiles.find(p => p.id === profileId);
        if (found) {
          setProfileData({ ...mockExtendedProfile, ...found, matchScore: found.matchScore || 85 });
        } else {
          setProfileData(mockExtendedProfile);
        }

        // Record a profile view if viewing another user's profile
        if (token && profileId) {
          try {
            await recordProfileView(profileId, token);
          } catch (err) {
            console.error("Failed to record view", err);
          }
        }
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
        onNavigate('dashboard');
      } else {
        onNavigate('browse');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">

      {/* 1. Hero Cover Section */}
      {/* FIX: h-48 on mobile (192px), h-[300px] on desktop */}
      <div className="relative h-48 md:h-[300px] w-full overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30 z-10"></div>
        <img
          src={profile.coverImage}
          alt="Cover"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Back Button */}
        <div className="absolute top-6 left-4 z-20 md:left-8">
          <Button
            className="bg-black/30 hover:bg-black/50 backdrop-blur-md text-white border border-white/20 rounded-full transition-all px-6 h-10"
            onClick={handleBack}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {isCurrentUser ? "Dashboard" : "Back"}
          </Button>
        </div>

        {/* Match Score Badge */}
        <div className="absolute top-6 right-4 z-20 hidden md:block">
          <div className="bg-white/95 backdrop-blur-md pl-4 pr-5 py-2.5 rounded-xl shadow-xl border border-white/50 flex items-center gap-3">
            <div className="relative">
              <svg className="w-10 h-10 -rotate-90">
                <circle cx="20" cy="20" r="16" stroke="#f3f4f6" strokeWidth="3" fill="none" />
                <circle cx="20" cy="20" r="16" stroke="#C5A059" strokeWidth="3" fill="none" strokeDasharray="100" strokeDashoffset={100 - (100 * (profile.matchScore || 0)) / 100} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Star className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Match Score</span>
              <span className="text-gray-900 font-bold font-serif text-xl leading-none">{profile.matchScore}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">

        {/* 2. Profile Header - Overlapping Section */}
        {/* FIX: Added proper flex-wrap and alignment */}
        <div className="relative -mt-24 mb-10 flex flex-col md:flex-row items-end gap-6 md:gap-8 z-20 px-2">

          {/* Profile Image */}
          {/* FIX: Removed inline styles, added strictly 'shrink-0 w-40 h-40' to prevent giant image bug */}
          <div className="relative shrink-0 mx-auto md:mx-0">
            <div className={`w-40 h-40 md:w-48 md:h-48 rounded-full border-[6px] shadow-2xl overflow-hidden bg-white ${profile.isPremium ? 'border-white ring-4 ring-[#C5A059]' : 'border-white'}`}>
              <ImageWithFallback
                src={profile.image}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            {profile.isPremium && (
              <div className="absolute bottom-4 right-2 bg-[#C5A059] text-white p-2.5 rounded-full shadow-lg border-4 border-white">
                <Crown className="w-5 h-5" />
              </div>
            )}
          </div>

          {/* Name & Details */}
          <div className="flex-1 pb-2 text-center md:text-left min-w-0 w-full">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2 justify-center md:justify-start">
              {/* FIX: Replaced inline font size with Tailwind text classes */}
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 font-serif tracking-tight">
                {profile.name}
              </h1>
              {profile.verified && (
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1 gap-1.5 rounded-full mx-auto md:mx-0 w-fit">
                  <Shield className="w-3.5 h-3.5 fill-emerald-700" /> Verified
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-gray-600 mt-3 text-base">
              <span className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-400" /> {profile.profession}
              </span>
              <span className="hidden md:block text-gray-300">•</span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" /> {profile.city}, {profile.state}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-500 mt-3 text-lg">
              <span className="flex items-center gap-2 font-medium text-gray-900">
                <Moon className="w-5 h-5 text-indigo-900" /> {profile.religion}, {profile.caste}
              </span>
              <span className="w-px h-5 bg-gray-300 hidden md:block"></span>
              <span className="text-gray-600">{profile.age} Yrs, {profile.height}</span>
            </div>
          </div>

          {/* Action Buttons (Only for Other Profiles) */}
          {!isCurrentUser && (
            <div className="flex gap-3 pb-2 w-full md:w-auto justify-center md:justify-end">
              <Button
                className="h-12 px-8 bg-[#8E001C] hover:bg-[#750017] text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                onClick={async () => {
                  const token = localStorage.getItem('token');
                  if (!token) return toast.error("Please login to connect");
                  try {
                    await sendInterest(profileId!, token);
                    toast.success(`Interest sent to ${profile.name}!`);
                  } catch (err) {
                    toast.error("Failed to send interest");
                  }
                }}
              >
                <Heart className="w-4 h-4 mr-2" /> Connect
              </Button>
              <Button
                variant="outline"
                className={`h-12 w-12 rounded-full border-gray-200 p-0 hover:border-[#8E001C] hover:text-[#8E001C] transition-colors`}
                onClick={async () => {
                  const token = localStorage.getItem('token');
                  if (!token) return toast.error("Please login to shortlist");
                  try {
                    const res = await toggleShortlist(profileId!, token);
                    toast.success(res.message);
                  } catch (err) {
                    toast.error("Failed to update shortlist");
                  }
                }}
              >
                <Star className="w-5 h-5" />
              </Button>
              <Button variant="outline" className="h-12 w-12 rounded-full border-gray-200 p-0 hover:border-gray-900 transition-colors">
                <Share2 className="w-5 h-5 text-gray-600" />
              </Button>
            </div>
          )}
        </div>

        {/* 3. Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: 33% width */}
          <div className="lg:col-span-4 space-y-6">

            {/* About Me Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-serif">About Me</h3>
              <p className="text-gray-600 leading-relaxed text-[15px]">
                {profile.about}
              </p>

              {/* Interests - Premium Rose Chips */}
              <div className="mt-6">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Interests & Hobbies</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.interests?.map((tag: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 text-sm font-medium border border-rose-100 hover:bg-rose-100 transition-colors cursor-default">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Horoscope Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 font-serif flex items-center gap-2">
                <Moon className="w-5 h-5 text-indigo-600" /> Horoscope Details
              </h3>
              <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                <InfoItem label="Rasi" value={profile.rasi} />
                <InfoItem label="Star" value={profile.star} />
                <InfoItem label="Gothram" value={profile.gothram} />
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Dosham</p>
                  <Badge variant={profile.dosham === "No Dosham" ? "outline" : "destructive"} className="font-normal">
                    {profile.dosham}
                  </Badge>
                </div>
              </div>
            </motion.div>

            {/* Photos Gallery - Premium Grid */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 font-serif">Photos</h3>
                <span className="text-xs font-semibold text-[#8E001C] cursor-pointer hover:underline">View All →</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {profile.images?.map((img: string, i: number) => (
                  <div key={i} className="aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 cursor-pointer group">
                    <ImageWithFallback
                      src={img}
                      alt={`Gallery ${i}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: 66% width */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[600px]"
            >
              <Tabs defaultValue="personal" className="w-full">
                <div className="border-b border-gray-100 px-6 sticky top-0 bg-white z-10 pt-4">
                  <TabsList className="flex w-full justify-start gap-6 bg-transparent h-auto p-0">
                    <TabItem value="personal" label="Personal" />
                    <TabItem value="family" label="Family" />
                    <TabItem value="education" label="Career" />
                    <TabItem value="preferences" label="Preferences" />
                  </TabsList>
                </div>

                <div className="p-8">
                  {/* Personal */}
                  <TabsContent value="personal" className="mt-0 space-y-8">
                    <SectionGrid title="Basic Information">
                      <InfoItem label="Date of Birth" value="24 Aug 1995 (28 Yrs)" />
                      <InfoItem label="Marital Status" value={profile.maritalStatus} />
                      <InfoItem label="Height" value={profile.height} />
                      <InfoItem label="Mother Tongue" value="Tamil" />
                    </SectionGrid>
                    <SectionGrid title="Lifestyle">
                      <InfoItem label="Diet" value={profile.diet} />
                      <InfoItem label="Drinking" value={profile.drinking} />
                      <InfoItem label="Smoking" value={profile.smoking} />
                    </SectionGrid>
                  </TabsContent>

                  {/* Family */}
                  <TabsContent value="family" className="mt-0">
                    <SectionGrid title="Family Background">
                      <InfoItem label="Father" value={profile.family.father} />
                      <InfoItem label="Mother" value={profile.family.mother} />
                      <InfoItem label="Siblings" value={profile.family.siblings} />
                      <InfoItem label="Family Type" value={profile.family.familyType} />
                      <InfoItem label="Native Place" value={profile.family.native} />
                    </SectionGrid>
                  </TabsContent>

                  {/* Education */}
                  <TabsContent value="education" className="mt-0 space-y-8">
                    <SectionGrid title="Education">
                      <InfoItem label="Degree" value={profile.education} />
                      <InfoItem label="Institution" value={profile.institution} />
                    </SectionGrid>
                    <SectionGrid title="Career">
                      <InfoItem label="Profession" value={profile.profession} />
                      <InfoItem label="Company" value={profile.company} />
                      <InfoItem label="Income" value={profile.income} />
                    </SectionGrid>
                  </TabsContent>

                  {/* Preferences */}
                  <TabsContent value="preferences" className="mt-0">
                    <div className="bg-amber-50/50 rounded-xl p-8 border border-amber-100/50">
                      <h3 className="text-[#8E001C] font-serif font-bold text-lg mb-6">Partner Expectations</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                        <InfoItem label="Age" value={profile.partnerPreferences.age} />
                        <InfoItem label="Height" value={profile.partnerPreferences.height} />
                        <InfoItem label="Marital Status" value={profile.partnerPreferences.maritalStatus} />
                        <InfoItem label="Education" value={profile.partnerPreferences.education} />
                        <InfoItem label="Location" value={profile.partnerPreferences.location} />
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

function SectionGrid({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-gray-900 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
        <span className="w-1 h-4 bg-[#C5A059] rounded-full"></span>
        {title}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
        {children}
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string, value?: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase mb-1">{label}</p>
      <p className="text-gray-900 font-medium text-[15px]">{value || "Not Specified"}</p>
    </div>
  );
}

function TabItem({ value, label }: { value: string, label: string }) {
  return (
    <TabsTrigger
      value={value}
      className="data-[state=active]:text-[#8E001C] data-[state=active]:border-b-2 data-[state=active]:border-[#8E001C] data-[state=active]:shadow-none rounded-none bg-transparent px-2 py-4 font-medium text-gray-500 transition-all hover:text-gray-800"
    >
      {label}
    </TabsTrigger>
  );
}