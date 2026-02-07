import { useState, useEffect } from "react";
import { fetchCurrentUser, fetchDashboardStats, fetchRecommendations, fetchShortlists, fetchRecentActivity } from "../services/api";
import { motion } from "motion/react";
import {
  Heart,
  Star,
  MessageCircle,
  Eye,
  TrendingUp,
  Users,
  Calendar,
  Bell,
  Settings,
  LogOut,
  ChevronRight
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Loader2 } from "lucide-react";

interface DashboardPageProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export function DashboardPage({ onNavigate, onLogout }: DashboardPageProps) {
  // const [activeTab, setActiveTab] = useState("overview"); // Removed unused state
  const [userData, setUserData] = useState<any>(null);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [shortlisted, setShortlisted] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          setLoading(true);
          const results = await Promise.allSettled([
            fetchCurrentUser(token),
            fetchDashboardStats(token),
            fetchRecommendations(token),
            fetchShortlists(token),
            fetchRecentActivity(token)
          ]);

          const [userRes, statsRes, recsRes, shortsRes, activityRes] = results;

          if (userRes.status === 'fulfilled') {
            const user = userRes.value;
            const dobDate = user.dob ? new Date(user.dob) : null;
            const calculatedAge = dobDate && !isNaN(dobDate.getTime())
              ? new Date().getFullYear() - dobDate.getFullYear()
              : "N/A";

            setUserData({
              name: user.username || "User",
              age: calculatedAge,
              city: user.district || "Not specified",
              profileCompletion: 70, // Mock calculation for now
              avatar: user.photo ? `/uploads/${user.photo.split(/[/\\]/).pop()}` : "https://images.unsplash.com/photo-1649433658557-54cf58577c68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
            });
          }

          if (statsRes.status === 'fulfilled') setDashboardStats(statsRes.value);
          if (recsRes.status === 'fulfilled') setRecommendations(recsRes.value);
          if (shortsRes.status === 'fulfilled') setShortlisted(shortsRes.value);
          if (activityRes.status === 'fulfilled') setRecentActivity(activityRes.value);
        } catch (error) {
          console.error("Failed to load dashboard data", error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadDashboardData();
  }, []);

  const user = userData || {
    name: "User",
    age: "--",
    city: "India",
    profileCompletion: 0,
    avatar: ""
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (onLogout) {
      onLogout();
    } else if (onNavigate) {
      // Fallback if not passed
      onNavigate('home');
    }
  };

  const stats = [
    { label: "Profile Views", value: dashboardStats?.profileViews || "0", icon: Eye, color: "#8E001C" },
    { label: "Interests Sent", value: dashboardStats?.interestsSent || "0", icon: Heart, color: "#C5A059" },
    { label: "Interests Received", value: dashboardStats?.interestsReceived || "0", icon: Star, color: "#8E001C" },
    { label: "Messages", value: dashboardStats?.messages || "0", icon: MessageCircle, color: "#C5A059" }
  ];

  // Recommendations and shortlisted profiles are now sourced from state

  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#8E001C] animate-spin mx-auto mb-4" />
          <p className="text-[#717182]" style={{ fontFamily: "'Inter', sans-serif" }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8E001C] to-[#A60020] text-white">
        <div className="max-w-[1440px] mx-auto px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20 border-4 border-white/30">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>RV</AvatarFallback>
              </Avatar>
              <div>
                <h1
                  className="mb-1"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 700 }}
                >
                  Welcome back, {user.name}!
                </h1>
                <p
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}
                  className="text-white/90"
                >
                  {user.age} years • {user.city}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={() => handleNavigate('home')}
                title="Go to Home"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <Bell className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <Settings className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Profile Completion */}
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                Profile Completion
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
                {user.profileCompletion}%
              </p>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-[#C5A059] h-2 rounded-full transition-all duration-500"
                style={{ width: `${user.profileCompletion}%` }}
              ></div>
            </div>
            <p
              className="mt-2 text-sm text-white/80"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Complete your profile to get better matches
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-[1440px] mx-auto px-8 -mt-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="p-6 bg-white border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group h-full">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-[${stat.color}]/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500`}></div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p
                      className="text-sm font-medium text-[#717182] mb-2 uppercase tracking-wide"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {stat.label}
                    </p>
                    <p
                      style={{ fontFamily: "'Playfair Display', serif", fontSize: '42px', fontWeight: 700, color: stat.color, lineHeight: 1 }}
                    >
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform duration-300"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <stat.icon className="w-8 h-8" style={{ color: stat.color }} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Top Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-8 bg-white border-[#C5A059]/20 shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <h2
                    style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: 600, color: '#1A1A1A' }}
                  >
                    Top Recommendations
                  </h2>
                  <Button
                    variant="ghost"
                    className="text-[#8E001C] hover:bg-[#8E001C]/5"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
                    onClick={() => handleNavigate('browse')}
                  >
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {recommendations.slice(0, 5).length > 0 ? recommendations.slice(0, 5).map((profile, index) => (
                    <motion.div
                      key={profile.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#F9F9F9] transition-colors group cursor-pointer"
                    >
                      <div className="relative">
                        <ImageWithFallback
                          src={profile.image}
                          alt={profile.name}
                          className="w-20 h-20 rounded-xl object-cover"
                        />
                        <div
                          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#C5A059] flex items-center justify-center text-xs"
                          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, color: '#1A1A1A' }}
                        >
                          {profile.matchScore}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3
                          style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 600, color: '#1A1A1A' }}
                        >
                          {profile.name}
                        </h3>
                        <p
                          className="text-sm text-[#717182]"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {profile.age} yrs • {profile.profession} • {profile.city}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-[#8E001C] hover:bg-[#6E0015]"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#C5A059]/30 hover:border-[#C5A059]"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          View
                        </Button>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="text-center py-8 text-[#717182]">
                      <Users className="w-12 h-12 mx-auto mb-2 opacity-20" />
                      <p>No recommendations found yet.</p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Shortlisted Profiles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-8 bg-white border-[#C5A059]/20 shadow-md">
                <h2
                  className="mb-6"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: 600, color: '#1A1A1A' }}
                >
                  Your Shortlisted Profiles
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {shortlisted.length > 0 ? shortlisted.map((profile) => (
                    <div
                      key={profile.id}
                      className="group relative rounded-xl overflow-hidden cursor-pointer"
                    >
                      <ImageWithFallback
                        src={profile.image}
                        alt={profile.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3
                          style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', fontWeight: 600 }}
                        >
                          {profile.name}
                        </h3>
                        <p
                          className="text-sm text-white/90"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {profile.age} yrs • {profile.profession}
                        </p>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-2 text-center py-8 text-[#717182]">
                      <Star className="w-12 h-12 mx-auto mb-2 opacity-20" />
                      <p>No shortlisted profiles yet.</p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Activity & Tips */}
          <div className="space-y-8">
            {/* New Related Matches (Replacing Recent Activity - WAIT, user wants Activity feed here) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-6 bg-white border-[#C5A059]/20 shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <h2
                    style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 600, color: '#1A1A1A' }}
                  >
                    Recent Activity
                  </h2>
                </div>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? recentActivity.map((activity, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F9F9F9] cursor-pointer transition-colors group">
                      <div className="relative">
                        <img
                          src={activity.avatar ? `http://localhost:5000/${activity.avatar}` : `https://images.unsplash.com/photo-${i === 1 ? '1605648916319-cf082f7524a1' : i === 2 ? '1710425804836-a1de39056b40' : '1653671832574-029b950a5749'}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100`}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                          alt="Activity"
                        />
                        <div className={`absolute bottom-0 right-0 w-3 h-3 ${activity.type === 'view' ? 'bg-blue-500' : 'bg-pink-500'} rounded-full border-2 border-white`}></div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-[#1A1A1A] text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {activity.name}
                        </p>
                        <p className="text-xs text-[#717182]" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {activity.type === 'view' ? 'Viewed your profile' : 'Sent you an interest'}
                        </p>
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {new Date(activity.time).toLocaleDateString()}
                      </span>
                    </div>
                  )) : (
                    <div className="text-center py-4 text-gray-400 text-sm">
                      No recent activity.
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Profile Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-6 bg-gradient-to-br from-[#8E001C] to-[#A60020] text-white border-0 shadow-md">
                <TrendingUp className="w-10 h-10 mb-4 opacity-80" />
                <h3
                  className="mb-2"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 600 }}
                >
                  Boost Your Profile
                </h3>
                <p
                  className="text-sm text-white/90 mb-4"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Add more photos and complete your preferences to get 3x more matches!
                </p>
                <Button
                  className="w-full bg-[#C5A059] hover:bg-[#B59049] text-[#1A1A1A]"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
                >
                  Complete Profile
                </Button>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="p-6 bg-white border-[#C5A059]/20 shadow-md">
                <h2
                  className="mb-4"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 600, color: '#1A1A1A' }}
                >
                  Quick Actions
                </h2>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-[#C5A059]/30 hover:border-[#C5A059] hover:bg-[#F9F9F9]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    onClick={() => handleNavigate('browse')}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Browse Profiles
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-[#C5A059]/30 hover:border-[#C5A059] hover:bg-[#F9F9F9]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Messages
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-[#C5A059]/30 hover:border-[#C5A059] hover:bg-[#F9F9F9]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Meet
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}