import { useState } from "react";
import { motion } from "motion/react";
import { Star, Heart, MapPin, Briefcase, GraduationCap, Filter, SlidersHorizontal, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { profiles } from "../data/mockData";

interface BrowseProfilesPageProps {
  onProfileSelect?: (id: number) => void;
}

export function BrowseProfilesPage({ onProfileSelect }: BrowseProfilesPageProps) {
  const [shortlisted, setShortlisted] = useState<number[]>([]);
  const [ageRange, setAgeRange] = useState([25, 35]);
  const [heightRange, setHeightRange] = useState([150, 180]);
  const [filterOpen, setFilterOpen] = useState(false);

  const toggleShortlist = (id: number) => {
    setShortlisted(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleViewProfile = (id: number) => {
    if (onProfileSelect) {
      onProfileSelect(id);
    }
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Age Range */}
      <div className="space-y-3">
        <label className="text-sm" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#1A1A1A' }}>
          Age Range: {ageRange[0]} - {ageRange[1]} years
        </label>
        <Slider
          value={ageRange}
          onValueChange={setAgeRange}
          min={18}
          max={60}
          step={1}
          className="[&_[role=slider]]:bg-[#8E001C] [&_[role=slider]]:border-[#8E001C]"
        />
      </div>

      {/* Height Range */}
      <div className="space-y-3">
        <label className="text-sm" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#1A1A1A' }}>
          Height: {heightRange[0]} - {heightRange[1]} cm
        </label>
        <Slider
          value={heightRange}
          onValueChange={setHeightRange}
          min={140}
          max={200}
          step={1}
          className="[&_[role=slider]]:bg-[#8E001C] [&_[role=slider]]:border-[#8E001C]"
        />
      </div>

      {/* Religion */}
      <div className="space-y-2">
        <label className="text-sm" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#1A1A1A' }}>
          Religion
        </label>
        <Select defaultValue="any">
          <SelectTrigger className="border-[#C5A059]/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Religion</SelectItem>
            <SelectItem value="hindu">Hindu</SelectItem>
            <SelectItem value="muslim">Muslim</SelectItem>
            <SelectItem value="sikh">Sikh</SelectItem>
            <SelectItem value="christian">Christian</SelectItem>
            <SelectItem value="jain">Jain</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Education */}
      <div className="space-y-2">
        <label className="text-sm" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#1A1A1A' }}>
          Education
        </label>
        <Select defaultValue="any">
          <SelectTrigger className="border-[#C5A059]/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Education</SelectItem>
            <SelectItem value="postgrad">Post Graduate</SelectItem>
            <SelectItem value="grad">Graduate</SelectItem>
            <SelectItem value="diploma">Diploma</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="text-sm" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#1A1A1A' }}>
          Location
        </label>
        <Input
          placeholder="City or State"
          className="border-[#C5A059]/30 focus:border-[#8E001C]"
        />
      </div>

      {/* Apply Filters */}
      <Button
        className="w-full bg-gradient-to-r from-[#8E001C] to-[#A60020] hover:from-[#6E0015] hover:to-[#8E001C]"
        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
      >
        Apply Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Header */}
      <div className="bg-white border-b border-[#C5A059]/20 sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="mb-1"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 700, color: '#8E001C' }}
              >
                Browse Profiles
              </h1>
              <p style={{ fontFamily: "'Inter', sans-serif", color: '#717182' }}>
                {profiles.length} profiles match your preferences
              </p>
            </div>

            {/* Mobile Filter Button */}
            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button
                  variant="outline"
                  className="border-[#C5A059]/30"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <SlidersHorizontal className="w-5 h-5 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#8E001C' }}>
                    Filter Profiles
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterPanel />
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort */}
            <Select defaultValue="match">
              <SelectTrigger className="w-48 border-[#C5A059]/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="match">Best Match</SelectItem>
                <SelectItem value="recent">Recently Joined</SelectItem>
                <SelectItem value="age">Age</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-32 bg-white rounded-2xl p-6 border border-[#C5A059]/20 shadow-sm">
              <h2
                className="mb-6 flex items-center gap-2"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 600, color: '#1A1A1A' }}
              >
                <Filter className="w-5 h-5 text-[#8E001C]" />
                Filter Profiles
              </h2>
              <FilterPanel />
            </div>
          </aside>

          {/* Profiles Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {profiles.map((profile, index) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-[0_24px_48px_rgba(0,0,0,0.12)] transition-all hover:-translate-y-1"
                >
                  {/* Image Container */}
                  <div className="relative h-72 overflow-hidden">
                    <ImageWithFallback
                      src={profile.image}
                      alt={profile.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Match Score Badge */}
                    <div className="absolute top-4 left-4">
                      <div
                        className="px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1"
                        style={{
                          backgroundColor: 'rgba(197, 160, 89, 0.95)',
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 700,
                          fontSize: '12px',
                          color: '#1A1A1A'
                        }}
                      >
                        <Star className="w-3.5 h-3.5 fill-[#1A1A1A]" />
                        {profile.matchScore}% Match
                      </div>
                    </div>

                    {/* Premium/New Badge */}
                    <div className="absolute top-4 right-4">
                      {profile.isPremium && (
                        <span
                          className="px-3 py-1 rounded-full text-xs backdrop-blur-sm"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            backgroundColor: 'rgba(142, 0, 28, 0.9)',
                            color: '#ffffff'
                          }}
                        >
                          Premium
                        </span>
                      )}
                      {profile.isNew && (
                        <span
                          className="px-3 py-1 rounded-full text-xs backdrop-blur-sm"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            backgroundColor: 'rgba(34, 197, 94, 0.9)',
                            color: '#ffffff'
                          }}
                        >
                          New
                        </span>
                      )}
                    </div>

                    {/* Shortlist Icon */}
                    <button
                      onClick={() => toggleShortlist(profile.id)}
                      className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all hover:scale-110"
                    >
                      <Star
                        className={`w-5 h-5 ${shortlisted.includes(profile.id) ? 'fill-[#C5A059] text-[#C5A059]' : 'text-[#1A1A1A]'}`}
                        strokeWidth={2}
                      />
                    </button>
                  </div>

                  {/* Info Area */}
                  <div className="p-5">
                    <h3
                      className="mb-2 tracking-tight"
                      style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 600, color: '#1A1A1A' }}
                    >
                      {profile.name}
                    </h3>

                    <div
                      className="space-y-1.5 mb-4 text-[#717182]"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}
                    >
                      <p>{profile.age} yrs, {profile.height}</p>
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>{profile.profession}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>{profile.education}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{profile.city}, {profile.state}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-[#8E001C] hover:bg-[#6E0015] transition-colors"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}
                      >
                        <Heart className="w-4 h-4 mr-1.5" />
                        Send Interest
                      </Button>
                      <Button
                        variant="outline"
                        className="border-[#C5A059]/30 hover:border-[#C5A059] hover:bg-[#F9F9F9]"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}
                        onClick={() => handleViewProfile(profile.id)}
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-12 text-center">
              <Button
                variant="outline"
                className="px-12 py-6 border-[#C5A059]/30 hover:border-[#C5A059] hover:bg-white"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
              >
                Load More Profiles
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}