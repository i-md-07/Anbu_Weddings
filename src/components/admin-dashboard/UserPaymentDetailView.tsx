import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import {
    ArrowLeft,
    User,
    Phone,
    Mail,
    MapPin,
    Calendar,
    IndianRupee,
    Clock,
    ShieldCheck,
    Briefcase,
    History
} from "lucide-react";

interface UserPaymentDetailViewProps {
    userId: number;
    onBack: () => void;
}

export const UserPaymentDetailView: React.FC<UserPaymentDetailViewProps> = ({ userId, onBack }) => {
    const [userData, setUserData] = useState<any>(null);
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [userRes, paymentsRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/admin/users/${userId}`, config),
                axios.get(`http://localhost:5000/api/admin/users/${userId}/payments`, config)
            ]);

            setUserData(userRes.data.user);
            setPayments(paymentsRes.data.payments || []);
        } catch (error) {
            console.error("Failed to load user detail", error);
            toast.error("Failed to load detailed information.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [userId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8E001C]"></div>
            </div>
        );
    }

    if (!userData) return <div>User not found.</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={onBack} className="text-gray-500 hover:text-[#8E001C]">
                    <ArrowLeft className="w-5 h-5 mr-1" /> Back to List
                </Button>
                <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                    User Payment File
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Summary Card */}
                <Card className="p-6 border-[#C5A059]/20 shadow-md">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-[#8E001C]/10">
                            {userData.photo ? (
                                <img src={`http://localhost:5000/${userData.photo}`} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-12 h-12 text-gray-300" />
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{userData.username}</h3>
                            <p className="text-sm text-[#8E001C] font-medium flex items-center justify-center gap-2 mt-1">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase ${userData.Status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {userData.Status}
                                </span>
                                • ID: #{userData.Id}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="flex items-center gap-3 text-sm">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{userData.mobile}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 lowercase">{userData.email || 'No email provided'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                                DOB: {userData.dob ? new Date(userData.dob).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{userData.district}, {userData.state}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Briefcase className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{userData.PersonProfession || 'N/A'}</span>
                        </div>
                    </div>
                </Card>

                {/* Detailed Info & History */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Header Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <Card className="p-4 bg-gray-50 border-none">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Contributions</p>
                            <p className="text-xl font-bold text-gray-900 flex items-center gap-1">
                                <IndianRupee className="w-4 h-4 text-green-600" />
                                {payments.reduce((acc, p) => acc + p.Amount, 0).toFixed(2)}
                            </p>
                        </Card>
                        <Card className="p-4 bg-gray-50 border-none">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Membership Expiry</p>
                            <p className={`text-xl font-bold flex items-center gap-1 ${userData.ExpiryDate && new Date(userData.ExpiryDate) < new Date() ? 'text-red-600' : 'text-gray-900'
                                }`}>
                                <ShieldCheck className="w-4 h-4 opacity-70" />
                                {userData.ExpiryDate ? new Date(userData.ExpiryDate).toLocaleDateString() : 'N/A'}
                            </p>
                        </Card>
                        <Card className="p-4 bg-gray-50 border-none col-span-2 md:col-span-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Full Transaction Count</p>
                            <p className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <History className="w-4 h-4 text-[#8E001C] opacity-70" />
                                {payments.length}
                            </p>
                        </Card>
                    </div>

                    {/* Transaction Table */}
                    <Card className="border-[#C5A059]/20 shadow-sm overflow-hidden">
                        <div className="p-4 border-b bg-gray-50/50 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#8E001C]" />
                            <h4 className="font-bold text-gray-900">Payment History</h4>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-white hover:bg-white">
                                    <TableHead className="font-semibold text-gray-600">Payment Date</TableHead>
                                    <TableHead className="font-semibold text-gray-600">Amount</TableHead>
                                    <TableHead className="font-semibold text-gray-600">Expiry Date</TableHead>
                                    <TableHead className="font-semibold text-gray-600 text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-12 text-gray-400 italic">
                                            No transactions recorded for this user yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    payments.map((p) => (
                                        <TableRow key={p.Id} className="hover:bg-gray-50/30 transition-colors">
                                            <TableCell className="text-sm font-medium">
                                                {new Date(p.PaymentDate).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </TableCell>
                                            <TableCell className="font-bold text-gray-900">
                                                ₹{p.Amount.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-600">
                                                {p.ExpiryDate ? new Date(p.ExpiryDate).toLocaleDateString() : 'N/A'}
                                            </TableCell>
                                            <TableCell className="text-right text-xs">
                                                <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${p.Status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {p.Status}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </div>
            </div>
        </div>
    );
};
