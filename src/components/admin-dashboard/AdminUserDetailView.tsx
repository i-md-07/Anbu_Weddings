import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "../ui/select";
import {
    Mail,
    User,
    Calendar,
    MapPin,
    Briefcase,
    Users,
    Banknote,
    ScrollText,
    Phone,
    ArrowLeft,
    Edit2,
    Save,
    CheckCircle,
    Clock
} from "lucide-react";
import {
    fetchAdminUserById,
    updateAdminUser,
    approveUser,
    fetchReligions
} from "../../services/api";
import { toast } from "sonner";
import { INDIAN_STATES } from "../../data/places";

export function AdminUserDetailView() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState<any>(null);

    const [formData, setFormData] = useState({
        username: "",
        mobile: "",
        email: "",
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
        isApproved: false,
        status: ""
    });

    const [religions, setReligions] = useState<any[]>([]);
    const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);

    const token = localStorage.getItem("token") || "";

    useEffect(() => {
        loadReligions();
        if (id) {
            loadUserData(parseInt(id));
        }
    }, [id]);

    const loadUserData = async (userId: number) => {
        setLoading(true);
        try {
            const data = await fetchAdminUserById(userId, token);
            const userData = data.user;
            setUser(userData);

            const formattedData = {
                username: userData.username || "",
                mobile: userData.mobile || "",
                email: userData.email || "",
                dob: userData.dob ? new Date(userData.dob).toISOString().split('T')[0] : "",
                gender: userData.gender || "",
                fatherName: userData.fatherName || "",
                fatherProfession: userData.FatherProfession || "",
                motherName: userData.motherName || "",
                familyAnnualIncome: userData.familyAnnualIncome || "",
                personAnnualIncome: userData.personAnnualIncome || "",
                personProfession: userData.PersonProfession || "",
                state: userData.state || "",
                district: userData.district || "",
                address: userData.address || "",
                religion: userData.religion || "",
                caste: userData.caste || "",
                subCaste: userData.subCaste || "",
                gothram: userData.gothram || "",
                isApproved: !!userData.IsApproved,
                status: userData.Status || "Pending"
            };

            setFormData(formattedData);

            if (userData.state) {
                const selectedState = INDIAN_STATES.find(s => s.name === userData.state);
                setAvailableDistricts(selectedState ? selectedState.districts : []);
            }

        } catch (error) {
            console.error("Failed to load user data", error);
            toast.error("Failed to load user data");
        } finally {
            setLoading(false);
        }
    };

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

    const handleUpdate = async () => {
        if (!id) return;
        try {
            await updateAdminUser(parseInt(id), formData, token);
            toast.success("User updated successfully");
            setIsEditing(false);
            loadUserData(parseInt(id));
        } catch (error) {
            console.error("Failed to update user", error);
            toast.error("Failed to update user");
        }
    };

    const handleApprove = async () => {
        if (!id) return;
        try {
            await approveUser(parseInt(id), token);
            toast.success("User approved successfully");
            loadUserData(parseInt(id));
        } catch (error) {
            console.error("Failed to approve user", error);
            toast.error("Failed to approve user");
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

    const inputClass = "pl-11 py-6 border-[#C5A059]/30 focus:border-[#8E001C]";
    const labelStyle = { fontFamily: "'Inter', sans-serif", fontWeight: 500 };
    const inputStyle = { fontFamily: "'Inter', sans-serif" };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => window.close()} className="text-gray-500">
                            <ArrowLeft className="w-5 h-5 mr-2" /> Close
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                                User Details: {formData.username}
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${formData.status === 'Active' ? 'bg-green-100 text-green-700' :
                                    formData.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {formData.status}
                                </span>
                                <span className="text-gray-400 text-sm">•</span>
                                <span className="text-gray-500 text-sm">{formData.email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {isEditing ? (
                            <>
                                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button onClick={handleUpdate} className="bg-[#8E001C] hover:bg-[#6E0015] text-white">
                                    <Save className="w-4 h-4 mr-2" /> Save Changes
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsEditing(true)} variant="outline" className="border-[#8E001C] text-[#8E001C] hover:bg-[#8E001C]/5">
                                <Edit2 className="w-4 h-4 mr-2" /> Edit Details
                            </Button>
                        )}
                    </div>
                </div>

                {/* Form Sections */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 space-y-12">

                        {/* Personal Details */}
                        <section className="space-y-6">
                            <h3 className="text-lg font-bold text-[#8E001C] flex items-center gap-2 border-b pb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                                <User className="w-5 h-5" /> Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label style={labelStyle}>Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                                        <Input disabled={!isEditing} value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className={inputClass} style={inputStyle} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label style={labelStyle}>Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                                        <Input disabled={!isEditing} type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} style={inputStyle} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label style={labelStyle}>Mobile</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                                        <Input disabled={!isEditing} value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} className={inputClass} style={inputStyle} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label style={labelStyle}>Date of Birth</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                                        <Input disabled={!isEditing} type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} className={inputClass} style={{ ...inputStyle, paddingLeft: '2.75rem' }} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label style={labelStyle}>Gender</Label>
                                    <Select disabled={!isEditing} value={formData.gender} onValueChange={(value: string) => setFormData({ ...formData, gender: value })}>
                                        <SelectTrigger className="py-6 border-[#C5A059]/30 focus:border-[#8E001C]">
                                            <SelectValue placeholder="Select Gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </section>

                        {/* Family & Income */}
                        <section className="space-y-6">
                            <h3 className="text-lg font-bold text-[#8E001C] flex items-center gap-2 border-b pb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                                <Users className="w-5 h-5" /> Family & Financials
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label style={labelStyle}>Father's Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                                        <Input disabled={!isEditing} value={formData.fatherName} onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })} className={inputClass} style={inputStyle} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label style={labelStyle}>Father's Profession</Label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                                        <Input disabled={!isEditing} value={formData.fatherProfession} onChange={(e) => setFormData({ ...formData, fatherProfession: e.target.value })} className={inputClass} style={inputStyle} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label style={labelStyle}>Mother's Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                                        <Input disabled={!isEditing} value={formData.motherName} onChange={(e) => setFormData({ ...formData, motherName: e.target.value })} className={inputClass} style={inputStyle} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label style={labelStyle}>Family Annual Income</Label>
                                    <div className="relative">
                                        <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                                        <Input disabled={!isEditing} value={formData.familyAnnualIncome} onChange={(e) => setFormData({ ...formData, familyAnnualIncome: e.target.value })} className={inputClass} style={inputStyle} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label style={labelStyle}>Person Profession</Label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                                        <Input disabled={!isEditing} value={formData.personProfession} onChange={(e) => setFormData({ ...formData, personProfession: e.target.value })} className={inputClass} style={inputStyle} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label style={labelStyle}>Person Annual Income</Label>
                                    <div className="relative">
                                        <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                                        <Input disabled={!isEditing} value={formData.personAnnualIncome} onChange={(e) => setFormData({ ...formData, personAnnualIncome: e.target.value })} className={inputClass} style={inputStyle} />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Location */}
                        <section className="space-y-6">
                            <h3 className="text-lg font-bold text-[#8E001C] flex items-center gap-2 border-b pb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                                <MapPin className="w-5 h-5" /> Location Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label style={labelStyle}>State</Label>
                                    <Select disabled={!isEditing} value={formData.state} onValueChange={handleStateChange}>
                                        <SelectTrigger className="py-6 border-[#C5A059]/30 focus:border-[#8E001C]">
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
                                    <Select disabled={!isEditing || !formData.state} value={formData.district} onValueChange={(v: string) => setFormData({ ...formData, district: v })}>
                                        <SelectTrigger className="py-6 border-[#C5A059]/30 focus:border-[#8E001C]">
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
                                    <Label style={labelStyle}>Address</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                                        <Input disabled={!isEditing} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className={inputClass} style={inputStyle} />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Cultural */}
                        <section className="space-y-6">
                            <h3 className="text-lg font-bold text-[#8E001C] flex items-center gap-2 border-b pb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                                <ScrollText className="w-5 h-5" /> Religious & Cultural
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label style={labelStyle}>Religion</Label>
                                    {isEditing ? (
                                        <Select value={formData.religion} onValueChange={(val: string) => setFormData({ ...formData, religion: val })}>
                                            <SelectTrigger className="py-6 border-[#C5A059]/30 focus:border-[#8E001C]">
                                                <SelectValue placeholder="Select Religion" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {religions.map((r) => (
                                                    <SelectItem key={r.Id} value={r.Name}>{r.Name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <div className="relative">
                                            <ScrollText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                                            <Input disabled value={formData.religion} className={inputClass} style={inputStyle} />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label style={labelStyle}>Caste</Label>
                                    <Input disabled={!isEditing} value={formData.caste} onChange={(e) => setFormData({ ...formData, caste: e.target.value })} className={inputClass} style={inputStyle} />
                                </div>
                                <div className="space-y-2">
                                    <Label style={labelStyle}>Sub Caste</Label>
                                    <Input disabled={!isEditing} value={formData.subCaste} onChange={(e) => setFormData({ ...formData, subCaste: e.target.value })} className={inputClass} style={inputStyle} />
                                </div>
                                <div className="space-y-2">
                                    <Label style={labelStyle}>Gothram</Label>
                                    <div className="relative">
                                        <ScrollText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                                        <Input disabled={!isEditing} value={formData.gothram} onChange={(e) => setFormData({ ...formData, gothram: e.target.value })} className={inputClass} style={inputStyle} />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Account Status & Actions */}
                        <section className="space-y-6 pt-6 border-t">
                            <h3 className="text-lg font-bold text-[#8E001C] flex items-center gap-2 border-b pb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                                <CheckCircle className="w-5 h-5" /> Account Status & Actions
                            </h3>
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500 font-medium">Current Status</p>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${formData.status === 'Active' ? 'bg-green-100 text-green-700' :
                                                formData.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {formData.status}
                                            </span>
                                            {formData.isApproved ? (
                                                <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                                    <CheckCircle className="w-4 h-4" /> Verified & Approved
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-yellow-600 text-sm font-medium">
                                                    <Clock className="w-4 h-4" /> Awaiting Approval
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {!formData.isApproved && (
                                        <div className="flex flex-col gap-2  min-w-[200px]">
                                            <Button
                                                onClick={handleApprove}
                                                variant="success"
                                                className="w-full ApproveUser py-6 text-lg font-bold transition-all hover:-translate-y-0.5"
                                                style={{
                                                    backgroundColor: "#408e00",
                                                    color: "white",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    transition: "all 0.3s ease-in-out",
                                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                                }}
                                            >
                                                <CheckCircle className="w-5 h-5 mr-2" /> Approve User Now
                                            </Button>
                                            <p className="text-[10px] text-center text-gray-400">
                                                By clicking approve, the user will be able to browse and connect with others.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                    </div>
                </div>

                {/* Timestamp Footer */}
                <div className="mt-6 flex justify-between items-center text-gray-400 text-xs px-4">
                    <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Updated: {user?.UpdatedAt ? new Date(user.UpdatedAt).toLocaleString() : 'N/A'}
                    </div>
                    <div>User ID: {id}</div>
                </div>
            </div>
        </div>
    );
}
