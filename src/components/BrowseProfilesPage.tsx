import { useEffect, useState } from "react";
import { Heart, MapPin, Filter, SlidersHorizontal, Crown, Sparkles, Wifi, Camera, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { fetchBrowseProfiles, sendInterest } from "../services/api";
import { toast } from "sonner";

interface BrowseProfilesPageProps {
  onProfileSelect?: (id: number) => void;
}

// Reusable ProfileCard Component - Poster Style
function ProfileCard({
  profile,  
  onViewProfile,
  onConnect,
  index = 0
}: {
  profile: any;
  onViewProfile: (id: number) => void;
  onConnect: (id: number) => void;
  index?: number;
}) {
  return (
    <div
      onClick={() => onViewProfile(profile.id)}
      className="group relative cursor-pointer"
    >
      {/* Card with Fixed Height for Poster Style */}
      <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-gray-200 shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
        {/* Profile Image */}
        <img
          src={profile.image}
          alt={profile.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop';
          }}
        />

        {/* Gradient Overlay - Bottom 40% */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Match % Badge - Top Left - Glassmorphism */}
        <div className="absolute top-3 left-3">
          <div className="px-2.5 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 flex items-center gap-1.5 shadow-lg">
            <span className="text-xs font-bold text-white">{profile.matchScore}%</span>
            <span className="text-[10px] text-white/80">Match</span>
          </div>
        </div>

        {/* Premium/New Badge - Top Right - Glassmorphism */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {profile.isPremium && (
            <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-gradient-to-r from-amber-500/90 to-yellow-400/90 backdrop-blur-sm text-white shadow-md flex items-center gap-1">
              <Crown className="w-3 h-3" /> Premium
            </span>
          )}
          {profile.isNew && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/90 backdrop-blur-sm text-white shadow-md">
              New
            </span>
          )}
        </div>

        {/* Floating Heart/Connect Button - Bottom Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onConnect(profile.id);
          }}
          className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-[#8E001C] hover:bg-[#750017] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 z-10"
        >
          <Heart className="w-5 h-5" />
        </button>

        {/* Name, Age & Location Overlay - Bottom Left */}
        <div className="absolute bottom-0 left-0 right-16 p-4 text-white">
          <h3 className="text-xl font-bold font-serif tracking-tight truncate">
            {profile.name}, {profile.age}
          </h3>
          <p className="text-sm text-white/90 flex items-center gap-1.5 mt-1">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{profile.city}, {profile.state}</span>
          </p>
          <p className="text-xs text-white/70 mt-1 truncate">
            {profile.profession}
          </p>
        </div>
      </div>
    </div>
  );
}

export function BrowseProfilesPage({ onProfileSelect }: BrowseProfilesPageProps) {
  const [ageRange, setAgeRange] = useState([25, 35]);
  const [heightRange, setHeightRange] = useState([150, 180]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeQuickFilters, setActiveQuickFilters] = useState<string[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [religion, setReligion] = useState("any");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const loadProfiles = async (isNewSearch = false) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setLoading(true);
      const params = {
        ageMin: ageRange[0],
        ageMax: ageRange[1],
        religion: religion !== 'any' ? religion : undefined,
        search: search || undefined,
        page: isNewSearch ? 1 : page,
        pageSize: 20
      };

      const data = await fetchBrowseProfiles(params, token);
      if (isNewSearch) {
        setProfiles(data);
        setPage(1);
      } else {
        setProfiles(prev => [...prev, ...data]);
      }
    } catch (err) {
      console.error("Failed to fetch profiles", err);
      toast.error("Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles(true);
  }, [ageRange, religion, activeQuickFilters]); // Trigger on filter change

  const handleViewProfile = (id: number) => {
    if (onProfileSelect) {
      onProfileSelect(id);
    }
  };

  const handleConnect = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) return toast.error("Please login to connect");
    try {
      await sendInterest(id, token);
      toast.success("Interest sent successfully!");
    } catch (err) {
      toast.error("Failed to send interest");
    }
  };

  const toggleQuickFilter = (filter: string) => {
    setActiveQuickFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const resetFilters = () => {
    setAgeRange([25, 35]);
    setHeightRange([150, 180]);
    setActiveQuickFilters([]);
  };

  // Filter Panel Component
  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Age Range - Dual Handle */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-900">Age Range</label>
          <span className="text-sm text-[#8E001C] font-medium">{ageRange[0]} - {ageRange[1]} yrs</span>
        </div>
        <Slider
          value={ageRange}
          onValueChange={setAgeRange}
          min={18}
          max={60}
          step={1}
          className="[&_[role=slider]]:bg-[#8E001C] [&_[role=slider]]:border-[#8E001C] [&_[role=slider]]:shadow-md"
        />
      </div>

      {/* Height Range - Dual Handle */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-900">Height</label>
          <span className="text-sm text-[#8E001C] font-medium">{heightRange[0]} - {heightRange[1]} cm</span>
        </div>
        <Slider
          value={heightRange}
          onValueChange={setHeightRange}
          min={140}
          max={200}
          step={1}
          className="[&_[role=slider]]:bg-[#8E001C] [&_[role=slider]]:border-[#8E001C] [&_[role=slider]]:shadow-md"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-900">Religion</label>
        <Select value={religion} onValueChange={setReligion}>
          <SelectTrigger className="bg-white border-gray-200 rounded-lg h-11 focus:border-[#8E001C] focus:ring-[#8E001C]/10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="any" className="rounded-lg">Any Religion</SelectItem>
            <SelectItem value="Hindu" className="rounded-lg">Hindu</SelectItem>
            <SelectItem value="Muslim" className="rounded-lg">Muslim</SelectItem>
            <SelectItem value="Sikh" className="rounded-lg">Sikh</SelectItem>
            <SelectItem value="Christian" className="rounded-lg">Christian</SelectItem>
            <SelectItem value="Jain" className="rounded-lg">Jain</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Education - Modern Select */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-900">Education</label>
        <Select defaultValue="any">
          <SelectTrigger className="bg-white border-gray-200 rounded-lg h-11 focus:border-[#8E001C] focus:ring-[#8E001C]/10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="any" className="rounded-lg">Any Education</SelectItem>
            <SelectItem value="postgrad" className="rounded-lg">Post Graduate</SelectItem>
            <SelectItem value="grad" className="rounded-lg">Graduate</SelectItem>
            <SelectItem value="diploma" className="rounded-lg">Diploma</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-900">Search</label>
        <div className="flex gap-2">
          <Input
            placeholder="Name, city, profession"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white border-gray-200 rounded-lg h-11 focus:border-[#8E001C] focus:ring-[#8E001C]/10"
          />
          <Button onClick={() => loadProfiles(true)} className="h-11 bg-[#8E001C]">Go</Button>
        </div>
      </div>

      {/* Reset Filters */}
      <button
        onClick={resetFilters}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#8E001C] transition-colors pt-2"
      >
        <RotateCcw className="w-4 h-4" />
        Reset All Filters
      </button>
    </div>
  );

  // Quick Filter Chip Component
  const QuickFilterChip = ({ label, icon: Icon, value }: { label: string; icon: any; value: string }) => {
    const isActive = activeQuickFilters.includes(value);
    return (
      <button
        onClick={() => toggleQuickFilter(value)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${isActive
          ? 'bg-[#8E001C] text-white shadow-md'
          : 'bg-white text-gray-600 border border-gray-200 hover:border-[#8E001C]/50 hover:text-[#8E001C]'
          }`}
      >
        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean White Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          {/* Main Header Row */}
          <div className="flex items-center justify-between py-4">
            {/* Title */}
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 font-serif">
                Discover Matches
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                <span className="text-[#8E001C] font-semibold">{profiles.length}</span> profiles found
              </p>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="outline" size="sm" className="border-gray-200 h-9">
                    <SlidersHorizontal className="w-4 h-4 mr-1.5" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-6">
                  <SheetHeader>
                    <SheetTitle className="text-xl font-serif text-[#8E001C]">
                      Filter Profiles
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterPanel />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200">
                <span className="text-sm text-gray-500 hidden sm:block">Sort by</span>
                <Select defaultValue="match">
                  <SelectTrigger className="w-28 border-0 bg-transparent p-0 h-auto text-sm font-medium focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="match" className="rounded-lg">Relevance</SelectItem>
                    <SelectItem value="recent" className="rounded-lg">Newest</SelectItem>
                    <SelectItem value="age-asc" className="rounded-lg">Age ↑</SelectItem>
                    <SelectItem value="age-desc" className="rounded-lg">Age ↓</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Quick Filter Chips Row */}
          <div className="flex items-center gap-2 pb-4 overflow-x-auto scrollbar-hide">
            <QuickFilterChip label="Online Now" icon={Wifi} value="online" />
            <QuickFilterChip label="With Photo" icon={Camera} value="photo" />
            <QuickFilterChip label="Premium" icon={Crown} value="premium" />
            <QuickFilterChip label="New Joiners" icon={Sparkles} value="new" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-6">
        <div className="flex gap-8">
          {/* Sticky Filter Sidebar - Desktop Only */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900">
                <Filter className="w-5 h-5 text-[#8E001C]" />
                Filters
              </h2>
              <FilterPanel />
            </div>
          </aside>

          {/* Profile Cards Grid - Responsive 1-2-3-4 Columns */}
          <div className="flex-1 min-w-0">
            {loading && profiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-[#8E001C] animate-spin mb-4" />
                <p className="text-gray-500">Finding your matches...</p>
              </div>
            ) : profiles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
                {profiles.map((profile, index) => (
                  <ProfileCard
                    key={`${profile.id}-${index}`}
                    profile={profile}
                    onViewProfile={handleViewProfile}
                    onConnect={handleConnect}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">No profiles found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more results.</p>
                <Button variant="link" onClick={resetFilters} className="text-[#8E001C] mt-2">
                  Reset Filters
                </Button>
              </div>
            )}

            {/* Load More */}
            {profiles.length > 0 && (
              <div className="mt-10 text-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setPage(prev => prev + 1);
                    loadProfiles();
                  }}
                  disabled={loading}
                  className="px-8 py-5 border-gray-200 hover:border-[#8E001C] hover:text-[#8E001C] rounded-full font-medium"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Load More Profiles
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}