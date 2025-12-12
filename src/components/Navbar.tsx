import { Button } from "./ui/button";
import { User, LogOut, LayoutDashboard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import logo from "../assets/logo.jpg";

interface NavbarProps {
  onNavigate: (page: string) => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

import { useState, useEffect } from "react";
import { fetchCurrentUser } from "../services/api";

export function Navbar({ onNavigate, isLoggedIn = false, onLogout }: NavbarProps) {
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      const loadUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const data = await fetchCurrentUser(token);
            setUser({
              name: data.username,
              email: data.email,
              avatar: data.photo ? `http://localhost:5000/${data.photo}` : "https://images.unsplash.com/photo-1649433658557-54cf58577c68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
              initials: data.username ? data.username.substring(0, 2).toUpperCase() : "US"
            });
          } catch (error) {
            console.error("Failed to load user in navbar", error);
          }
        }
      };
      loadUser();
    }
  }, [isLoggedIn]);

  const displayUser = user || {
    name: "User",
    email: "user@example.com",
    avatar: "https://images.unsplash.com/photo-1649433658557-54cf58577c68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    initials: "US"
  };
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate("home")}
          className="flex-shrink-0 flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <img src={logo} alt="VOWS Logo" className="h-20 w-auto object-contain" />
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8" style={{ fontFamily: "'Inter', sans-serif" }}>
          <button
            onClick={() => onNavigate("browse")}
            className="text-[#1A1A1A] hover:text-[#8E001C] transition-colors relative group"
          >
            Browse Matches
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#8E001C] transition-all group-hover:w-full"></span>
          </button>
          <button
            onClick={() => onNavigate("pricing")}
            className="text-[#1A1A1A] hover:text-[#8E001C] transition-colors relative group"
          >
            Membership Plans
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#8E001C] transition-all group-hover:w-full"></span>
          </button>
          {isLoggedIn && (
            <button
              onClick={() => onNavigate("dashboard")}
              className="text-[#1A1A1A] hover:text-[#8E001C] transition-colors relative group"
            >
              Dashboard
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#8E001C] transition-all group-hover:w-full"></span>
            </button>
          )}
        </div>

        {/* CTA Buttons & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border border-[#C5A059]/30">
                      <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
                      <AvatarFallback>{displayUser.initials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{displayUser.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{displayUser.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onNavigate("dashboard")}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate("profile")}>
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <button
                  onClick={() => onNavigate("login")}
                  className="text-[#1A1A1A] hover:text-[#8E001C] transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                >
                  Login
                </button>
                <Button
                  onClick={() => onNavigate("signup")}
                  className="rounded-full px-6 py-2 bg-[#8E001C] hover:bg-[#6E0015] transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Register Free
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Button variant="ghost" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <LogOut className="h-6 w-6 rotate-45" /> : <div className="space-y-1.5 cursor-pointer">
                <span className="block w-6 h-0.5 bg-black"></span>
                <span className="block w-6 h-0.5 bg-black"></span>
                <span className="block w-6 h-0.5 bg-black"></span>
              </div>}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 p-4 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-4">
            <button onClick={() => { onNavigate("browse"); setIsMobileMenuOpen(false); }} className="text-left py-2 font-medium">Browse Matches</button>
            <button onClick={() => { onNavigate("pricing"); setIsMobileMenuOpen(false); }} className="text-left py-2 font-medium">Membership Plans</button>
            {isLoggedIn && <button onClick={() => { onNavigate("dashboard"); setIsMobileMenuOpen(false); }} className="text-left py-2 font-medium">Dashboard</button>}

            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3 py-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={displayUser.avatar} />
                      <AvatarFallback>{displayUser.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{displayUser.name}</span>
                      <span className="text-xs text-muted-foreground">{displayUser.email}</span>
                    </div>
                  </div>
                  <button onClick={() => { onLogout?.(); setIsMobileMenuOpen(false); }} className="text-left py-2 text-red-600 font-medium flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Log out
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { onNavigate("login"); setIsMobileMenuOpen(false); }} className="w-full py-2 border rounded-md font-medium text-center">Login</button>
                  <Button onClick={() => { onNavigate("signup"); setIsMobileMenuOpen(false); }} className="w-full bg-[#8E001C]">Register Free</Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}