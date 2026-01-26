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
import { Mail, Lock, User, Calendar, MapPin, Briefcase, FileText, Upload, Users, Banknote, ScrollText, Phone } from "lucide-react";
import axios from "axios";
import { fetchReligions, fetchCastes, fetchSubcastes } from "../services/api";
import { INDIAN_STATES } from "../data/places";
import { toast } from "sonner";

interface SignupPageAdminProps {
  onSuccess?: () => void;
}

export function SignupPageAdmin({ onSuccess }: SignupPageAdminProps) {
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
  const [files, setFiles] = useState<{ photo: File | null; jathagam: File | null }>({ photo: null, jathagam: null });
  const [loading, setLoading] = useState(false);

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
    } catch (error) {
      console.error("Failed to load religions", error);
    }
  };

  const handleStateChange = (value: string) => {
    const selectedState = INDIAN_STATES.find(s => s.name === value);
    setAvailableDistricts(selectedState ? selectedState.districts : []);
    setFormData({ ...formData, state: value, district: "" });
  };

  const handleReligionChange = async (value: string) => {
    setFormData({ ...formData, religion: value, caste: "", subCaste: "" });
    setCastes([]);
    setSubcastes([]);
    try {
      const data = await fetchCastes(Number(value));
      setCastes(data || []);
    } catch (error) {
      console.error("Failed to load castes", error);
    }
  };

  const handleCasteChange = async (value: string) => {
    setFormData({ ...formData, caste: value, subCaste: "" });
    setSubcastes([]);
    try {
      const data = await fetchSubcastes(Number(value));
      setSubcastes(data || []);
    } catch (error) {
      console.error("Failed to load subcastes", error);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "photo" | "jathagam"
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [fieldName]: e.target.files[0] });
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in basic details.");
      return;
    }
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        let value = formData[key as keyof typeof formData];

        // Resolve IDs to Names for specific fields
        if (key === "religion" && value) {
          const religion = religions.find(r => String(r.Id) === String(value));
          if (religion) value = religion.Name;
        } else if (key === "caste" && value) {
          const caste = castes.find(c => String(c.Id) === String(value));
          if (caste) value = caste.Name;
        } else if (key === "subCaste" && value) {
          const subcaste = subcastes.find(s => String(s.Id) === String(value));
          if (subcaste) value = subcaste.Name;
        }

        if (key === "name") {
          data.append("username", value as string);
        } else {
          data.append(key, String(value));
        }
      });
      if (files.photo) data.append("photo", files.photo);
      if (files.jathagam) data.append("jathagam", files.jathagam);
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/admin/users",
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User created successfully!");
      setFormData({
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
      setFiles({ photo: null, jathagam: null });
      onSuccess?.();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error?.message || "Failed to create user."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { fontFamily: "'Inter', sans-serif" };
  const labelStyle = { fontFamily: "'Inter', sans-serif", fontWeight: 500 };
  const inputClass = "pl-11 py-6 border-[#C5A059]/30 focus:border-[#8E001C]";

  return (
    <div className="w-full flex flex-col p-8 bg-white relative">
      <div className="max-w-3xl mx-auto w-full z-10">
        <h2 className="text-2xl font-bold mb-8 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>Create User</h2>
        <form className="space-y-8" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
          {/* Personal Details */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#8E001C] flex items-center gap-2 border-b pb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              <User className="w-5 h-5" /> Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <Input type="tel" placeholder="Mobile number" value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} className={inputClass} style={inputStyle} />
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
                <Select value={formData.gender} onValueChange={(value: string) => setFormData({ ...formData, gender: value })}>
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
          {/* Family Details */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#8E001C] flex items-center gap-2 border-b pb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              <Users className="w-5 h-5" /> Family & Income
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label>Father's Name</Label>
                <div className="relative">
                  <Input placeholder="Father's Name" value={formData.fatherName} onChange={e => setFormData({ ...formData, fatherName: e.target.value })} style={inputStyle} />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Father's Profession</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                  <Input placeholder="Father's Profession" value={formData.fatherProfession} onChange={e => setFormData({ ...formData, fatherProfession: e.target.value })} className={inputClass} style={inputStyle} />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Mother's Name</Label>
                <div className="relative">
                  <Input placeholder="Mother's Name" value={formData.motherName} onChange={e => setFormData({ ...formData, motherName: e.target.value })} style={inputStyle} />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Family Annual Income</Label>
                <div className="relative">
                  <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                  <Input placeholder="Family Annual Income" value={formData.familyAnnualIncome} onChange={e => setFormData({ ...formData, familyAnnualIncome: e.target.value })} className={inputClass} style={inputStyle} />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Your Profession</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                  <Input placeholder="Your Profession" value={formData.personProfession} onChange={e => setFormData({ ...formData, personProfession: e.target.value })} className={inputClass} style={inputStyle} />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Person Annual Income</Label>
                <div className="relative">
                  <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                  <Input placeholder="Person Annual Income" value={formData.personAnnualIncome} onChange={e => setFormData({ ...formData, personAnnualIncome: e.target.value })} className={inputClass} style={inputStyle} />
                </div>
              </div>
            </div>
          </div>
          {/* Location Details */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#8E001C] flex items-center gap-2 border-b pb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              <MapPin className="w-5 h-5" /> Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label style={labelStyle}>State</Label>
                <Select value={formData.state} onValueChange={handleStateChange}>
                  <SelectTrigger className="py-6 border-[#C5A059]/30 focus:border-[#8E001C]" style={inputStyle}>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map((s) => (
                      <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label style={labelStyle}>District</Label>
                <Select value={formData.district} onValueChange={(value: string) => setFormData({ ...formData, district: value })} disabled={!formData.state}>
                  <SelectTrigger className="py-6 border-[#C5A059]/30 focus:border-[#8E001C]" style={inputStyle}>
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDistricts.map((d) => (
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
          {/* Cultural Details */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#8E001C] flex items-center gap-2 border-b pb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              <ScrollText className="w-5 h-5" /> Cultural & Religious
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label style={labelStyle}>Religion</Label>
                <Select value={formData.religion} onValueChange={handleReligionChange}>
                  <SelectTrigger className="py-6 border-[#C5A059]/30 focus:border-[#8E001C]" style={inputStyle}>
                    <SelectValue placeholder="Select Religion" />
                  </SelectTrigger>
                  <SelectContent>
                    {religions.map((r) => (
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
                    {castes.map((c) => (
                      <SelectItem key={c.Id} value={String(c.Id)}>{c.Name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label style={labelStyle}>Sub Caste(Non-Muslim)</Label>
                <Select value={formData.subCaste} onValueChange={(value: string) => setFormData({ ...formData, subCaste: value })} disabled={!formData.caste}>
                  <SelectTrigger className="py-6 border-[#C5A059]/30 focus:border-[#8E001C]" style={inputStyle}>
                    <SelectValue placeholder="Select Sub Caste (Optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcastes.map((s) => (
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
          {/* Documents */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#8E001C] flex items-center gap-2 border-b pb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              <FileText className="w-5 h-5" /> Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label style={labelStyle}>Photo</Label>
                <div className="border border-dashed border-[#C5A059] p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-[#F9F9F9] transition-colors">
                  <Upload className="w-8 h-8 text-[#8E001C] mb-2" />
                  <input type="file" onChange={e => handleFileChange(e, 'photo')} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#8E001C] file:text-white hover:file:bg-[#6E0015]" />
                </div>
              </div>
              <div className="space-y-2">
                <Label style={labelStyle}>Jathagam</Label>
                <div className="border border-dashed border-[#C5A059] p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-[#F9F9F9] transition-colors">
                  <FileText className="w-8 h-8 text-[#8E001C] mb-2" />
                  <input type="file" onChange={e => handleFileChange(e, 'jathagam')} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#8E001C] file:text-white hover:file:bg-[#6E0015]" />
                </div>
              </div>
            </div>
          </div>
          {/* Terms */}
          <div className="flex items-start space-x-2 pt-4">
            <Checkbox id="terms" checked={formData.agreeTerms} onCheckedChange={(checked: boolean | string) => setFormData({ ...formData, agreeTerms: checked === true })} className="mt-1" />
            <label htmlFor="terms" className="text-sm cursor-pointer leading-relaxed" style={labelStyle}>
              I agree to the <a href="#" className="text-[#8E001C] font-semibold hover:underline">Terms & Conditions</a> and <a href="#" className="text-[#8E001C] font-semibold hover:underline">Privacy Policy</a>
            </label>
          </div>
          <Button type="submit" className="w-full py-6 text-lg bg-gradient-to-r from-[#8E001C] to-[#A60020] hover:from-[#6E0015] hover:to-[#8E001C] transition-all shadow-lg group" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }} disabled={loading}>
            {loading ? 'Creating...' : 'Create User'}
          </Button>
        </form>
      </div>
    </div>
  );
}