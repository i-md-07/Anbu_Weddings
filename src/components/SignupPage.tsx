import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import {
  User,
  ArrowRight,
  MapPin,
  FileText,
  Users,
  ScrollText,
  Mail,
  Lock,
  Calendar,
  Briefcase,
  Upload,
  Banknote,
  Phone
} from "lucide-react";
import {
  registerUser,
  fetchReligions,
  fetchCastes,
  fetchSubcastes
} from "../services/api";
import { toast } from "sonner";
import logo from "../assets/logo.png";
import { INDIAN_STATES } from "../data/places";

interface SignupPageProps {
  onNavigate?: (page: string) => void;
}

export function SignupPage({ onNavigate }: SignupPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
    fatherName: "",
    fatherProfession: "",
    motherName: "",
    familyAnnualIncome: "",
    personAnnualIncome: "",
    personProfession: "",
    state: "",
    district: "",
    address: "",
    religion: "",
    caste: "",
    subCaste: "",
    gothram: "",
    agreeTerms: false
  });

  const [files, setFiles] = useState<{
    photo: File | null;
    jathagam: File | null;
  }>({
    photo: null,
    jathagam: null
  });

  const [religions, setReligions] = useState<any[]>([]);
  const [castes, setCastes] = useState<any[]>([]);
  const [subcastes, setSubcastes] = useState<any[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);

  useEffect(() => {
    loadReligions();
  }, []);

  const loadReligions = async () => {
    try {
      const data = await fetchReligions();
      setReligions(data || []);
    } catch {
      toast.error("Failed to load religions");
    }
  };

  const handleStateChange = (value: string) => {
    const selectedState = INDIAN_STATES.find(s => s.name === value);
    setAvailableDistricts(selectedState?.districts || []);
    setFormData({ ...formData, state: value, district: "" });
  };

  const handleReligionChange = async (value: string) => {
    setFormData({ ...formData, religion: value, caste: "", subCaste: "" });
    setCastes([]);
    setSubcastes([]);
    try {
      const data = await fetchCastes(Number(value));
      setCastes(data || []);
    } catch {
      toast.error("Failed to load castes");
    }
  };

  const handleCasteChange = async (value: string) => {
    setFormData({ ...formData, caste: value, subCaste: "" });
    setSubcastes([]);
    try {
      const data = await fetchSubcastes(Number(value));
      setSubcastes(data || []);
    } catch {
      toast.error("Failed to load sub castes");
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "photo" | "jathagam"
  ) => {
    if (e.target.files?.[0]) {
      setFiles({ ...files, [field]: e.target.files[0] });
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill required fields");
      return;
    }

    if (!formData.agreeTerms) {
      toast.error("Please accept Terms & Conditions");
      return;
    }

    if (formData.mobile && !/^[6-9]\d{9}$/.test(formData.mobile)) {
      toast.error("Enter valid 10-digit Indian mobile number");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "name") {
        data.append("username", String(value));
      } else if (key === "agreeTerms") {
        data.append(key, value ? "1" : "0");
      } else {
        data.append(key, String(value));
      }
    });

    if (files.photo) data.append("photo", files.photo);
    if (files.jathagam) data.append("jathagam", files.jathagam);

    try {
      await registerUser(data);
      toast.success("Registration successful!");
      onNavigate?.("login");
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || "Registration failed";
      toast.error(msg);
    }
  };

  const inputStyle = { fontFamily: "'Inter', sans-serif" };
  const labelStyle = { fontFamily: "'Inter', sans-serif", fontWeight: 500 };
  const inputClass = "pl-11 py-6 border-[#C5A059]/30 focus:border-[#8E001C]";

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-8">
        <div
          className="text-center mb-12 cursor-pointer"
          onClick={() => onNavigate?.("home")}
        >
          <img src={logo} className="h-20 mx-auto mb-4" alt="VOWS Logo" />
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Begin Your Journey to Forever
          </h2>
          <p className="text-gray-500">
            Create your account to find your perfect match
          </p>
        </div>

        <form
          className="space-y-20"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* PERSONAL DETAILS */}
          <div className="space-y-8">
            <h3 className="text-xl font-bold text-[#8E001C] flex items-center gap-2 border-b pb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              <User className="w-5 h-5" /> Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label style={labelStyle}>Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                  <Input placeholder="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={inputClass} style={inputStyle} />
                </div>
              </div>
              <div className="space-y-2">
                <Label style={labelStyle}>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                  <Input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className={inputClass} style={inputStyle} />
                </div>
              </div>
              <div className="space-y-2">
                <Label style={labelStyle}>Mobile</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                  <Input placeholder="Mobile number" value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} className={inputClass} style={inputStyle} />
                </div>
              </div>
              <div className="space-y-2">
                <Label style={labelStyle}>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                  <Input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className={inputClass} style={inputStyle} />
                </div>
              </div>
              <div className="space-y-2">
                <Label style={labelStyle}>Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                  <Input type="date" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} className={inputClass} style={{ ...inputStyle, paddingLeft: '2.75rem' }} />
                </div>
              </div>
              <div className="space-y-2">
                <Label style={labelStyle}>Gender</Label>
                <Select value={formData.gender} onValueChange={(v: any) => setFormData({ ...formData, gender: v })}>
                  <SelectTrigger className="py-6 border-[#C5A059]/30 focus:border-[#8E001C]" style={inputStyle}>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* FAMILY */}
          <div className="space-y-8">
            <h3 className="text-xl font-bold text-[#8E001C] flex items-center gap-2 border-b pb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              <Users className="w-5 h-5" /> Family & Income
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <Label style={labelStyle}>Father's Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                  <Input placeholder="Father's Name" value={formData.fatherName} onChange={e => setFormData({ ...formData, fatherName: e.target.value })} className={inputClass} style={inputStyle} />
                </div>
              </div>
              <div className="space-y-1">
                <Label style={labelStyle}>Father's Profession</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                  <Input placeholder="Father's Profession" value={formData.fatherProfession} onChange={e => setFormData({ ...formData, fatherProfession: e.target.value })} className={inputClass} style={inputStyle} />
                </div>
              </div>
              <div className="space-y-1">
                <Label style={labelStyle}>Mother's Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                  <Input placeholder="Mother's Name" value={formData.motherName} onChange={e => setFormData({ ...formData, motherName: e.target.value })} className={inputClass} style={inputStyle} />
                </div>
              </div>
              <div className="space-y-1">
                <Label style={labelStyle}>Family Annual Income</Label>
                <div className="relative">
                  <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                  <Input placeholder="Family Annual Income" value={formData.familyAnnualIncome} onChange={e => setFormData({ ...formData, familyAnnualIncome: e.target.value })} className={inputClass} style={inputStyle} />
                </div>
              </div>
              <div className="space-y-1">
                <Label style={labelStyle}>Your Profession</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                  <Input placeholder="Your Profession" value={formData.personProfession} onChange={e => setFormData({ ...formData, personProfession: e.target.value })} className={inputClass} style={inputStyle} />
                </div>
              </div>
              <div className="space-y-1">
                <Label style={labelStyle}>Personal Annual Income</Label>
                <div className="relative">
                  <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                  <Input placeholder="Personal Annual Income" value={formData.personAnnualIncome} onChange={e => setFormData({ ...formData, personAnnualIncome: e.target.value })} className={inputClass} style={inputStyle} />
                </div>
              </div>
            </div>
          </div>

          {/* LOCATION */}
          <div className="space-y-8">
            <h3 className="text-xl font-bold text-[#8E001C] flex items-center gap-2 border-b pb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              <MapPin className="w-5 h-5" /> Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label style={labelStyle}>State</Label>
                <Select value={formData.state} onValueChange={handleStateChange}>
                  <SelectTrigger className="py-6 border-[#C5A059]/30 focus:border-[#8E001C]" style={inputStyle}>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map(s => (
                      <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label style={labelStyle}>District</Label>
                <Select value={formData.district} onValueChange={(v: any) => setFormData({ ...formData, district: v })} disabled={!formData.state}>
                  <SelectTrigger className="py-6 border-[#C5A059]/30 focus:border-[#8E001C]" style={inputStyle}>
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDistricts.map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label style={labelStyle}>Full Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                  <Input placeholder="Address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className={inputClass} style={inputStyle} />
                </div>
              </div>
            </div>
          </div>

          {/* RELIGION */}
          <div className="space-y-8">
            <h3 className="text-xl font-bold text-[#8E001C] flex items-center gap-2 border-b pb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              <ScrollText className="w-5 h-5" /> Cultural & Religious
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label style={labelStyle}>Religion</Label>
                <Select value={formData.religion} onValueChange={handleReligionChange}>
                  <SelectTrigger className="py-6 border-[#C5A059]/30 focus:border-[#8E001C]" style={inputStyle}>
                    <SelectValue placeholder="Select Religion" />
                  </SelectTrigger>
                  <SelectContent>
                    {religions.map(r => (
                      <SelectItem key={r.Id} value={String(r.Id)}>{r.Name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label style={labelStyle}>Caste</Label>
                <Select value={formData.caste} onValueChange={handleCasteChange} disabled={!formData.religion}>
                  <SelectTrigger className="py-6 border-[#C5A059]/30 focus:border-[#8E001C]" style={inputStyle}>
                    <SelectValue placeholder="Select Caste" />
                  </SelectTrigger>
                  <SelectContent>
                    {castes.map(c => (
                      <SelectItem key={c.Id} value={String(c.Id)}>{c.Name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label style={labelStyle}>Sub Caste(Non-Muslim)</Label>
                <Select value={formData.subCaste} onValueChange={(v: any) => setFormData({ ...formData, subCaste: v })} disabled={!formData.caste}>
                  <SelectTrigger className="py-6 border-[#C5A059]/30 focus:border-[#8E001C]" style={inputStyle}>
                    <SelectValue placeholder="Select Sub Caste (Optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcastes.map(s => (
                      <SelectItem key={s.Id} value={String(s.Id)}>{s.Name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label style={labelStyle}>Gothram(Non-Muslim)</Label>
                <div className="relative">
                  <ScrollText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                  <Input placeholder="Gothram" value={formData.gothram} onChange={e => setFormData({ ...formData, gothram: e.target.value })} className={inputClass} style={inputStyle} />
                </div>
              </div>
            </div>
          </div>

          {/* DOCUMENTS */}
          <div className="space-y-8">
            <h3 className="text-xl font-bold text-[#8E001C] flex items-center gap-2 border-b pb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              <FileText className="w-5 h-5" /> Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Label style={labelStyle}>Photo</Label>
                <label className="border-2 border-dashed border-[#C5A059]/40 p-12 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#F9F9F9] transition-all relative group min-h-[180px]">
                  <Upload className="w-12 h-12 text-[#8E001C] mb-3 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold text-gray-600 mb-1">Upload Photo</span>
                  <input type="file" onChange={e => handleFileChange(e, "photo")} className="hidden" />
                  {files.photo ? (
                    <p className="text-xs text-green-600 mt-2 font-medium bg-green-50 px-2 py-1 rounded-full">{files.photo.name}</p>
                  ) : (
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">Accepted: JPG, PNG</p>
                  )}
                </label>
              </div>
              <div className="space-y-4">
                <Label style={labelStyle}>Jathagam</Label>
                <label className="border-2 border-dashed border-[#C5A059]/40 p-12 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#F9F9F9] transition-all relative group min-h-[180px]">
                  <FileText className="w-12 h-12 text-[#8E001C] mb-3 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold text-gray-600 mb-1">Upload Jathagam</span>
                  <input type="file" onChange={e => handleFileChange(e, "jathagam")} className="hidden" />
                  {files.jathagam ? (
                    <p className="text-xs text-green-600 mt-2 font-medium bg-green-50 px-2 py-1 rounded-full">{files.jathagam.name}</p>
                  ) : (
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">Accepted: JPG, PDF</p>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* TERMS */}
          <div className="flex items-start gap-3 pt-6">
            <Checkbox
              id="terms"
              checked={formData.agreeTerms}
              onCheckedChange={(v: any) =>
                setFormData({ ...formData, agreeTerms: v === true })
              }
              className="mt-1"
            />
            <Label htmlFor="terms" className="text-sm cursor-pointer leading-relaxed text-gray-600">
              I agree to the <a href="#" className="text-[#8E001C] font-bold hover:underline transition-colors">Terms & Conditions</a> and <a href="#" className="text-[#8E001C] font-bold hover:underline transition-colors">Privacy Policy</a>
            </Label>
          </div>

          <div className="pt-6">
            <Button type="submit" className="w-full py-8 text-xl bg-gradient-to-r from-[#8E001C] to-[#A60020] hover:from-[#6E0015] hover:to-[#8E001C] transition-all duration-300 shadow-xl group rounded-xl" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
              Create My Account <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
