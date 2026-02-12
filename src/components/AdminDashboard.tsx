import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Search } from "lucide-react";

import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { MultiSelectFilter } from "./ui/multi-select-filter";

import { AdminSidebar } from "./admin-dashboard/AdminSidebar";
import { ViewType } from "./admin-dashboard/menu-config";

import { ReligionMaster } from "./admin-dashboard/ReligionMaster";
import { CasteMaster } from "./admin-dashboard/CasteMaster";
import { SubcasteMaster } from "./admin-dashboard/SubcasteMaster";
import { SignupPageAdmin } from "./SignupPageAdmin";

import { PartnerListView } from "./admin-dashboard/PartnerListView";
import { PartnerCreateView } from "./admin-dashboard/PartnerCreateView";
import { PartnerPaymentsView } from "./admin-dashboard/PartnerPaymentsView";
import { UserPaymentsView } from "./admin-dashboard/UserPaymentsView";
import { UserPaymentDetailView } from "./admin-dashboard/UserPaymentDetailView";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { PaginationControls } from "./ui/pagination-controls";
import { fetchPaginatedUsers } from "../services/api";

export function AdminDashboard() {
  const [view, setView] = useState<ViewType>("overview");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const [religions, setReligions] = useState<any[]>([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);

  // Filters State
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedReligions, setSelectedReligions] = useState<string[]>([]);
  const [selectedCastes, setSelectedCastes] = useState<string[]>([]);
  const [selectedPersonProfessions, setSelectedPersonProfessions] = useState<string[]>([]);
  const [selectedFatherProfessions, setSelectedFatherProfessions] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [uniqueStatesFromUsers, setUniqueStatesFromUsers] = useState<string[]>([]);
  const [uniqueReligionsFromUsers, setUniqueReligionsFromUsers] = useState<string[]>([]);
  const [uniqueCastesFromUsers, setUniqueCastesFromUsers] = useState<string[]>([]);
  const [uniquePersonProfessions, setUniquePersonProfessions] = useState<string[]>([]);
  const [uniqueFatherProfessions, setUniqueFatherProfessions] = useState<string[]>([]);
  const uniqueStatuses = ["Pending", "Active", "Expired"];

  const token = localStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  /* ---------------- LOADERS ---------------- */

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        pageSize: pageSize,
        search: searchQuery,
        states: selectedStates.join(","),
        religions: selectedReligions.join(","),
        castes: selectedCastes.join(","),
        professions: selectedPersonProfessions.join(","),
        fatherProfessions: selectedFatherProfessions.join(","),
        statuses: selectedStatuses.join(","),
        pending: view === "pending" ? "1" : undefined
      };

      const data = await fetchPaginatedUsers(params, token || "");
      setUsers(data.users || []);
      setTotalCount(data.totalCount || 0);
      setTotalPages(data.totalPages || 0);
      setPendingCount(data.pendingCount || 0);
      setAdminCount(data.adminCount || 0);
    } catch (error) {
      console.error("Failed to load users", error);
      toast.error("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const loadReligions = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/admin/masters/religions",
      authHeaders
    );
    setReligions(res.data.religions || []);
  };

  useEffect(() => {
    loadReligions();
    loadUniqueValues();
    loadUsers();
  }, []);

  const loadUniqueValues = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users/unique-values", authHeaders);
      setUniqueStatesFromUsers(res.data.states || []);
      setUniqueReligionsFromUsers(res.data.religions || []);
      setUniqueCastesFromUsers(res.data.castes || []);
      setUniquePersonProfessions(res.data.personProfessions || []);
      setUniqueFatherProfessions(res.data.fatherProfessions || []);
    } catch (err) {
      console.error("Failed to load unique values", err);
    }
  };

  // Trigger loadUsers whenever we switch to the 'users' or 'pending' view, or filters change
  useEffect(() => {
    if (view === "users" || view === "pending" || view === "overview") {
      loadUsers();
    }
  }, [view, currentPage, pageSize, selectedStates, selectedReligions, selectedCastes, selectedPersonProfessions, selectedFatherProfessions, selectedStatuses]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStates, selectedReligions, selectedCastes, selectedPersonProfessions, selectedStatuses]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (view === "users" || view === "pending") {
        loadUsers();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  /* ---------------- RENDER ---------------- */

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex gap-6">
      {/* SIDEBAR */}
      <aside className="w-72 text-white rounded p-4 space-y-4 sidebar">
        <AdminSidebar
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
          setView={setView}
          currentView={view}
        />
      </aside>


      {/* MAIN */}
      <main className="flex-1 bg-white rounded p-6">
        {view === "overview" && (
          <>
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setView("users")}>
                <div className="text-sm font-medium text-gray-500">Total Users</div>
                <div className="text-2xl font-bold">{totalCount}</div>
              </Card>
              <Card className="p-6">
                <div className="text-sm font-medium text-gray-500">Admins</div>
                <div className="text-2xl font-bold">{adminCount}</div>
              </Card>
              <Card
                className="p-6 cursor-pointer hover:shadow-md transition-shadow border-yellow-200 bg-yellow-50/30"
                onClick={() => setView("pending")}
              >
                <div className="text-sm font-medium text-yellow-700">Pending Approvals</div>
                <div className="text-2xl font-bold text-yellow-800">
                  {pendingCount}
                </div>
              </Card>
            </div>
          </>
        )}

        {view === "religion" && <ReligionMaster />}

        {view === "caste" && (
          <CasteMaster
            religions={religions}
            onBack={() => setView("religion")}
          />
        )}

        {view === "subcaste" && (
          <SubcasteMaster
            religions={religions}
            onBack={() => setView("caste")}
          />
        )}



        {(view === "users" || view === "pending") && (
          <>
            <div className="flex flex-col space-y-4 mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {view === "pending" ? "Pending Approvals" : "Users"}
                </h2>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Name, Email, or Profession..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <MultiSelectFilter
                  title="State"
                  options={uniqueStatesFromUsers}
                  selectedValues={selectedStates}
                  onChange={setSelectedStates}
                />
                <MultiSelectFilter
                  title="Religion"
                  options={uniqueReligionsFromUsers}
                  selectedValues={selectedReligions}
                  onChange={setSelectedReligions}
                />
                <MultiSelectFilter
                  title="Caste"
                  options={uniqueCastesFromUsers}
                  selectedValues={selectedCastes}
                  onChange={setSelectedCastes}
                />
                <MultiSelectFilter
                  title="Profession"
                  options={uniquePersonProfessions}
                  selectedValues={selectedPersonProfessions}
                  onChange={setSelectedPersonProfessions}
                />
                <MultiSelectFilter
                  title="Family Profession"
                  options={uniqueFatherProfessions}
                  selectedValues={selectedFatherProfessions}
                  onChange={setSelectedFatherProfessions}
                />
                <MultiSelectFilter
                  title="Status"
                  options={uniqueStatuses}
                  selectedValues={selectedStatuses}
                  onChange={setSelectedStatuses}
                />
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedStates([]);
                    setSelectedReligions([]);
                    setSelectedCastes([]);
                    setSelectedPersonProfessions([]);
                    setSelectedFatherProfessions([]);
                    setSelectedStatuses([]);
                  }}
                  className="h-10 px-2 lg:px-3 text-red-500"
                >
                  Reset
                </Button>
              </div>
            </div>

            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Religion/Caste</TableHead>
                      <TableHead>Profession</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u: any) => (
                      <TableRow key={u.Id}>
                        <TableCell className="font-medium">{u.username}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          <div className="text-sm">{u.district || "-"}</div>
                          <div className="text-xs text-gray-400">{u.state}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{u.religion || "-"}</div>
                          <div className="text-xs text-gray-400">{u.caste}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{u.PersonProfession || "-"}</div>
                          <div className="text-xs text-gray-400">Father: {u.FatherProfession}</div>
                        </TableCell>
                        <TableCell>{u.UserType === 1 ? "Admin" : "User"}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-xs ${u.Status === 'Active' ? "bg-green-100 text-green-800" :
                              u.Status === 'Expired' ? "bg-red-100 text-red-800" :
                                "bg-yellow-100 text-yellow-800"
                              }`}
                          >
                            {u.Status || (u.IsApproved ? 'Active' : 'Pending')}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#8E001C] text-[#8E001C] hover:bg-[#8E001C]/5"
                              onClick={() => window.open(`/admin/users/${u.Id}`, '_blank')}
                            >
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
              </div>
            )}
          </>
        )}

        {view === "create" && (
          <SignupPageAdmin onSuccess={() => setView("users")} />
        )}

        {view === "user_payments" && (
          <UserPaymentsView
            onViewDetail={(uid: number) => {
              setSelectedUserId(uid);
              setView("user_payment_details");
            }}
          />
        )}

        {view === "user_payment_details" && selectedUserId && (
          <UserPaymentDetailView
            userId={selectedUserId}
            onBack={() => setView("user_payments")}
          />
        )}

        {/* PARTNERS */}
        {view === "partners_list" && <PartnerListView />}
        {view === "partners_create" && <PartnerCreateView />}
        {view === "partners_payments" && <PartnerPaymentsView />}
      </main>
    </div>
  );
}
