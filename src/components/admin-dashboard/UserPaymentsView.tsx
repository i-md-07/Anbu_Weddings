import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { Users, Calendar, User, IndianRupee, Search, Phone, ShieldCheck, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { PaginationControls } from "../ui/pagination-controls";
import { fetchPaginatedPayments } from "../../services/api";

interface UserPaymentsViewProps {
    onViewDetail: (userId: number) => void;
}

export const UserPaymentsView: React.FC<UserPaymentsViewProps> = ({ onViewDetail }) => {
    const [userStats, setUserStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCollections, setTotalCollections] = useState(0);
    const [paidUsersCount, setPaidUsersCount] = useState(0);
    const [activeUsersCount, setActiveUsersCount] = useState(0);

    const loadStats = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const params = {
                page: currentPage,
                pageSize: pageSize,
                search: searchQuery
            };
            const data = await fetchPaginatedPayments(params, token || "");
            setUserStats(data.payments || []);
            setTotalCount(data.totalCount || 0);
            setTotalPages(data.totalPages || 0);
            setTotalCollections(data.totalCollections || 0);
            setPaidUsersCount(data.paidUsersCount || 0);
            setActiveUsersCount(data.activeUsersCount || 0);
        } catch (error) {
            console.error("Failed to load user payments", error);
            toast.error("Failed to load payment records.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, [currentPage, pageSize]);

    // Reset page on search
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            loadStats();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);


    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                        <Users className="w-6 h-6 text-[#8E001C]" /> User-wise Payment Info
                    </h2>
                    <p className="text-sm text-gray-500">Summary of all users and their payment history</p>
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by name or mobile..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 border-[#C5A059]/30 focus:border-[#8E001C] focus:ring-[#8E001C]"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
                <Card className="p-4 bg-[#8E001C]/5 border-none">
                    <div className="text-xs font-semibold text-[#8E001C] uppercase tracking-wider mb-1">Total Collections</div>
                    <div className="text-2xl font-bold text-[#8E001C]">
                        ₹{totalCollections.toLocaleString()}
                    </div>
                </Card>
                <Card className="p-4 bg-green-50 border-none">
                    <div className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">Total Users</div>
                    <div className="text-2xl font-bold text-green-700">{totalCount}</div>
                </Card>
                <Card className="p-4 bg-blue-50 border-none">
                    <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">Active Members</div>
                    <div className="text-2xl font-bold text-blue-700">{activeUsersCount}</div>
                </Card>
                <Card className="p-4 bg-yellow-50 border-none">
                    <div className="text-xs font-semibold text-yellow-700 uppercase tracking-wider mb-1">Paid Users</div>
                    <div className="text-2xl font-bold text-yellow-700">{paidUsersCount}</div>
                </Card>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8E001C]"></div>
                </div>
            ) : (
                <Card className="overflow-hidden border-[#C5A059]/30 shadow-sm">
                    <Table>
                        <TableHeader className="bg-gray-50/80">
                            <TableRow>
                                <TableHead className="font-bold text-[#8E001C]">User Details</TableHead>
                                <TableHead className="font-bold text-[#8E001C]">Status</TableHead>
                                <TableHead className="font-bold text-[#8E001C]">Total Paid</TableHead>
                                <TableHead className="font-bold text-[#8E001C]">Latest Payment</TableHead>
                                <TableHead className="font-bold text-[#8E001C]">Expiry Date</TableHead>
                                <TableHead className="font-bold text-[#8E001C]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userStats.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-16 text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <Search className="w-8 h-8 opacity-20" />
                                            <p>No users found</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                userStats.map((u) => (
                                    <TableRow key={u.UserId} className="hover:bg-gray-50/50 transition-colors border-b last:border-0">
                                        <TableCell className="py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 flex items-center gap-2">
                                                    <User className="w-4 h-4 text-[#C5A059]" />
                                                    {u.UserName}
                                                </span>
                                                <span className="text-sm text-[#8E001C] flex items-center gap-2 mt-1 font-medium">
                                                    <Phone className="w-3.5 h-3.5" />
                                                    {u.UserMobile || "N/A"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.UserStatus === "Active"
                                                    ? "bg-green-100 text-green-800 border border-green-200"
                                                    : u.UserStatus === "Expired"
                                                        ? "bg-red-100 text-red-800 border border-red-200"
                                                        : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                                    }`}
                                            >
                                                {u.UserStatus || "Unknown"}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 font-bold text-gray-900">
                                                <IndianRupee className="w-3.5 h-3.5 text-gray-400" />
                                                {u.TotalPaid ? (u.TotalPaid).toFixed(2) : "0.00"}
                                            </div>
                                            <div className="text-[10px] text-gray-400 font-medium">
                                                {u.TransactionCount} Transactions
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {u.LatestPaymentDate ? new Date(u.LatestPaymentDate).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                }) : "Never"}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className={`flex items-center gap-2 text-sm font-medium ${u.ExpiryDate && new Date(u.ExpiryDate) < new Date() ? "text-red-500" : "text-gray-600"
                                                }`}>
                                                <ShieldCheck className="w-4 h-4 opacity-70" />
                                                {u.ExpiryDate ? new Date(u.ExpiryDate).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                }) : "N/A"}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-[#8E001C] text-[#8E001C] hover:bg-[#8E001C] hover:text-white transition-all flex items-center gap-2"
                                                onClick={() => onViewDetail(u.UserId)}
                                            >
                                                <Eye className="w-4 h-4" /> View History
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    <div className="px-4">
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            pageSize={pageSize}
                            onPageSizeChange={setPageSize}
                            totalCount={totalCount}
                        />
                    </div>
                </Card>
            )}
        </div>
    );
};
