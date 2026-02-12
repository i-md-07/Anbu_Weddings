import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Heart,
  MapPin,
  RotateCcw,
  Crown,
  Sparkles,
  Loader2,
  Filter,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { MultiSelectFilter } from "./ui/multi-select-filter";
import axios from "axios";
import { Slider } from "./ui/slider";
import { fetchBrowseProfiles, sendInterest } from "@/services/api";
import { toast } from "sonner";

interface BrowseProfilesPageProps {
  onProfileSelect?: (id: number) => void;
}

// Reusable ProfileCard Component - Poster Style
function ProfileCard({
  profile,
  onViewProfile,
  onConnect,
}: {
  profile: any;
  onViewProfile: (id: number) => void;
  onConnect: (id: number) => void;
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

export default function BrowseProfilesPage({ onProfileSelect }: BrowseProfilesPageProps) {
  const [ageRange, setAgeRange] = useState([25, 35]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  // Advanced Filters State
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedReligions, setSelectedReligions] = useState<string[]>([]);
  const [selectedCastes, setSelectedCastes] = useState<string[]>([]);
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>([]);
  const [selectedFatherProfessions, setSelectedFatherProfessions] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  // Unique Values for Filters
  const [uniqueStates, setUniqueStates] = useState<string[]>([]);
  const [uniqueReligions, setUniqueReligions] = useState<string[]>([]);
  const [uniqueCastes, setUniqueCastes] = useState<string[]>([]);
  const [uniqueProfessions, setUniqueProfessions] = useState<string[]>([]);
  const [uniqueFatherProfessions, setUniqueFatherProfessions] = useState<string[]>([]);

  useEffect(() => {
    const loadUniqueValues = async () => {
      try {
        const res = await axios.get("/api/admin/users/unique-values");
        setUniqueStates(res.data.states || []);
        setUniqueReligions(res.data.religions || []);
        setUniqueCastes(res.data.castes || []);
        setUniqueProfessions(res.data.personProfessions || []);
        setUniqueFatherProfessions(res.data.fatherProfessions || []);
      } catch (err) {
        console.error("Failed to load unique values", err);
      }
    };
    loadUniqueValues();
  }, []);

  const lastProfileElementRef = useCallback((node: any) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const loadProfiles = async (isNewSearch = false) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setLoading(true);
      const currentPage = isNewSearch ? 1 : page;
      const params = {
        ageMin: ageRange[0],
        ageMax: ageRange[1],
        states: selectedStates.join(','),
        religions: selectedReligions.join(','),
        castes: selectedCastes.join(','),
        professions: selectedProfessions.join(','),
        fatherProfessions: selectedFatherProfessions.join(','),
        statuses: selectedStatuses.join(','),
        search: search || undefined,
        page: currentPage,
        pageSize: 10,
      };

      const data = await fetchBrowseProfiles(params, token);

      if (isNewSearch) {
        setProfiles(data);
        setPage(1);
      } else {
        setProfiles(prev => [...prev, ...data]);
      }

      setHasMore(data.length === 10);
    } catch (err: any) {
      console.error("Failed to fetch profiles", err);
      const msg = err.response?.data?.details || err.response?.data?.message || "Failed to load profiles";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (page > 1) {
      loadProfiles(false);
    }
  }, [page]);

  useEffect(() => {
    loadProfiles(true);
  }, [ageRange, selectedStates, selectedReligions, selectedCastes, selectedProfessions, selectedFatherProfessions, selectedStatuses]); // Trigger on filter change

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


  const resetFilters = () => {
    setAgeRange([25, 35]);
    setSelectedStates([]);
    setSelectedReligions([]);
    setSelectedCastes([]);
    setSelectedProfessions([]);
    setSelectedFatherProfessions([]);
    setSelectedStatuses([]);
    setSearch("");
  };

  // Filter Panel Component
  const FilterPanel = () => (
    <div className="space-y-6">
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

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-900">Location</label>
          <MultiSelectFilter
            title="States"
            options={uniqueStates}
            selectedValues={selectedStates}
            onChange={setSelectedStates}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-900">Background</label>
          <div className="flex flex-col gap-2">
            <MultiSelectFilter
              title="Religions"
              options={uniqueReligions}
              selectedValues={selectedReligions}
              onChange={setSelectedReligions}
            />
            <MultiSelectFilter
              title="Castes"
              options={uniqueCastes}
              selectedValues={selectedCastes}
              onChange={setSelectedCastes}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-900">Profession</label>
          <div className="flex flex-col gap-2">
            <MultiSelectFilter
              title="Self Profession"
              options={uniqueProfessions}
              selectedValues={selectedProfessions}
              onChange={setSelectedProfessions}
            />
            <MultiSelectFilter
              title="Family Profession"
              options={uniqueFatherProfessions}
              selectedValues={selectedFatherProfessions}
              onChange={setSelectedFatherProfessions}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-900">Status</label>
          <MultiSelectFilter
            title="Profile Status"
            options={["Active", "Expired"]}
            selectedValues={selectedStatuses}
            onChange={setSelectedStatuses}
          />
        </div>
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

      <button
        onClick={resetFilters}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#8E001C] transition-colors pt-2"
      >
        <RotateCcw className="w-4 h-4" />
        Reset All Filters
      </button>
    </div>
  );


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean White Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 font-serif">
              Browse Profiles
            </h1>
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
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
                  {profiles.map((profile, index) => {
                    if (profiles.length === index + 1) {
                      return (
                        <div ref={lastProfileElementRef} key={`${profile.id}-${index}`}>
                          <ProfileCard
                            profile={profile}
                            onViewProfile={handleViewProfile}
                            onConnect={handleConnect}
                          />
                        </div>
                      );
                    } else {
                      return (
                        <ProfileCard
                          key={`${profile.id}-${index}`}
                          profile={profile}
                          onViewProfile={handleViewProfile}
                          onConnect={handleConnect}
                        />
                      );
                    }
                  })}
                </div>

                {loading && profiles.length > 0 && (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 text-[#8E001C] animate-spin" />
                  </div>
                )}
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
          </div>
        </div>
      </div>
    </div>
  );
}
