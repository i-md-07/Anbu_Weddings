import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { motion } from "motion/react";
import {
  Mail, Lock, User, ArrowRight, Calendar,
  MapPin, Briefcase, FileText, Upload, Users, Banknote,
  ScrollText, Globe
} from "lucide-react";
import { useState } from "react";
import { registerUser } from "../services/api";
import logo from "../assets/logo.jpg";

interface SignupPageProps {
  onNavigate?: (page: string) => void;
}

export function SignupPage({ onNavigate }: SignupPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
    fatherName: "",
    motherName: "",
    familyAnnualIncome: "",
    personAnnualIncome: "",
    state: "",
    district: "",
    address: "",
    religion: "",
    caste: "",
    subCaste: "",
    gothram: "",
    agreeTerms: false
  });

  const [files, setFiles] = useState<{ photo: File | null, jathagam: File | null }>({
    photo: null,
    jathagam: null
  });

  const handleNavigate = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'photo' | 'jathagam') => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [fieldName]: e.target.files[0] });
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill in basic details.");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      const value = formData[key as keyof typeof formData];
      if (key === 'name') {
        data.append('username', value as string);
      } else {
        data.append(key, value as string);
      }
    });

    if (files.photo) data.append('photo', files.photo);
    if (files.jathagam) data.append('jathagam', files.jathagam);

    try {
      await registerUser(data);
      alert('Registration Successful! Please login.');
      if (onNavigate) onNavigate('login');
    } catch (error) {
      console.error(error);
      alert('Registration Failed. Please try again.');
    }
  };

  const inputStyle = { fontFamily: "'Inter', sans-serif" };
  const labelStyle = { fontFamily: "'Inter', sans-serif", fontWeight: 500 };
  const inputClass = "pl-11 py-6 border-[#C5A059]/30 focus:border-[#8E001C]";

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image (Fixed) */}
      <div className="hidden lg:block lg:w-1/3 relative fixed h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#8E001C] via-[#A60020] to-[#8E001C]">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80')] bg-cover bg-center opacity-20"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white text-center"
          >
            <h2 className="mb-6 tracking-tight" style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', fontWeight: 700 }}>
              Begin Your Journey to Forever
            </h2>
            <p className="text-lg text-white/90 max-w-md mx-auto mb-12" style={{ fontFamily: "'Inter', sans-serif" }}>
              Join us to find your perfect match with verified profiles and AI recommendations.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form (Scrollable) */}
      <div className="w-full lg:w-2/3 ml-auto flex flex-col p-8 bg-white relative">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#8E001C]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl mx-auto w-full z-10">
          {/* Logo */}
          <div className="mb-8 cursor-pointer text-center" onClick={(e) => handleNavigate(e, 'home')}>
            <div className="flex justify-center mb-4">
              <img src={logo} alt="VOWS Logo" className="h-28 w-28 object-contain" />
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", color: '#717182' }}>Create your account to start finding your perfect match.</p>
          </div>

          {/* Form */}
          <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>

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
                    <Input placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} style={inputStyle} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label style={labelStyle}>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                    <Input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} style={inputStyle} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label style={labelStyle}>Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                    <Input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className={inputClass} style={inputStyle} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label style={labelStyle}>Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                    <Input type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} className={inputClass} style={{ ...inputStyle, paddingLeft: '2.75rem' }} />
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
                <div className="space-y-2">
                  <Label style={labelStyle}>Father's Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                    <Input placeholder="Father's Name" value={formData.fatherName} onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })} className={inputClass} style={inputStyle} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label style={labelStyle}>Mother's Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                    <Input placeholder="Mother's Name" value={formData.motherName} onChange={(e) => setFormData({ ...formData, motherName: e.target.value })} className={inputClass} style={inputStyle} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label style={labelStyle}>Family Annual Income</Label>
                  <div className="relative">
                    <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                    <Input placeholder="ex: 10 Lakhs" value={formData.familyAnnualIncome} onChange={(e) => setFormData({ ...formData, familyAnnualIncome: e.target.value })} className={inputClass} style={inputStyle} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label style={labelStyle}>Personal Annual Income</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                    <Input placeholder="ex: 12 Lakhs" value={formData.personAnnualIncome} onChange={(e) => setFormData({ ...formData, personAnnualIncome: e.target.value })} className={inputClass} style={inputStyle} />
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
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                    <Input placeholder="State" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className={inputClass} style={inputStyle} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label style={labelStyle}>District</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                    <Input placeholder="District" value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })} className={inputClass} style={inputStyle} />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label style={labelStyle}>Full Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                    <Input placeholder="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className={inputClass} style={inputStyle} />
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
                  <div className="relative">
                    <ScrollText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                    <Input placeholder="Religion" value={formData.religion} onChange={(e) => setFormData({ ...formData, religion: e.target.value })} className={inputClass} style={inputStyle} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label style={labelStyle}>Caste</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                    <Input placeholder="Caste" value={formData.caste} onChange={(e) => setFormData({ ...formData, caste: e.target.value })} className={inputClass} style={inputStyle} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label style={labelStyle}>Sub Caste(Non-Muslim)</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                    <Input placeholder="Sub Caste" value={formData.subCaste} onChange={(e) => setFormData({ ...formData, subCaste: e.target.value })} className={inputClass} style={inputStyle} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label style={labelStyle}>Gothram(Non-Muslim)</Label>
                  <div className="relative">
                    <ScrollText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                    <Input placeholder="Gothram" value={formData.gothram} onChange={(e) => setFormData({ ...formData, gothram: e.target.value })} className={inputClass} style={inputStyle} />
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
                    <input type="file" onChange={(e) => handleFileChange(e, 'photo')} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#8E001C] file:text-white hover:file:bg-[#6E0015]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label style={labelStyle}>Jathagam</Label>
                  <div className="border border-dashed border-[#C5A059] p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-[#F9F9F9] transition-colors">
                    <FileText className="w-8 h-8 text-[#8E001C] mb-2" />
                    <input type="file" onChange={(e) => handleFileChange(e, 'jathagam')} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#8E001C] file:text-white hover:file:bg-[#6E0015]" />
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

            <Button className="w-full py-6 text-lg bg-gradient-to-r from-[#8E001C] to-[#A60020] hover:from-[#6E0015] hover:to-[#8E001C] transition-all shadow-lg group" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
              Create My Account <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="text-center text-[#717182]" style={inputStyle}>
              Already have an account? <a href="#" className="text-[#8E001C] font-semibold hover:underline" onClick={(e) => handleNavigate(e, 'login')}>Sign In</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}