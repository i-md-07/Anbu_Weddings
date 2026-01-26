import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "../ui/select";
import axios from "axios";
import { toast } from "sonner";

interface Subcaste {
  Id: number;
  Name: string;
}

interface Caste {
  Id: number;
  Name: string;
}

interface Religion {
  Id: number;
  Name: string;
}

interface SubcasteMasterProps {
  religions: Religion[];
  onBack: () => void;
}

export const SubcasteMaster: React.FC<SubcasteMasterProps> = ({
  religions,
  onBack
}) => {
  const [subcastes, setSubcastes] = useState<Subcaste[]>([]);
  const [castes, setCastes] = useState<Caste[]>([]);

  const [selectedReligionId, setSelectedReligionId] = useState<number | null>(null);
  const [selectedCasteId, setSelectedCasteId] = useState<number | null>(null);

  const [newSubcaste, setNewSubcaste] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const token = localStorage.getItem("token");

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  };

  const loadCastes = async (religionId: number) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/masters/religions/${religionId}/castes`,
        authHeaders
      );
      setCastes(res.data.castes || []);
    } catch (err) {
      console.error("Error loading castes:", err);
      setCastes([]);
    }
  };

  const loadSubcastes = async (casteId: number) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/masters/castes/${casteId}/subcastes`,
        authHeaders
      );
      setSubcastes(res.data.subcastes || []);
    } catch (err) {
      console.error("Error loading subcastes:", err);
      setSubcastes([]);
    }
  };

  useEffect(() => {
    if (selectedReligionId) {
      loadCastes(selectedReligionId);
      setSelectedCasteId(null); // Reset caste selection
      setSubcastes([]); // Reset subcastes
    }
  }, [selectedReligionId]);

  useEffect(() => {
    if (selectedCasteId) {
      loadSubcastes(selectedCasteId);
    }
  }, [selectedCasteId]);

  const handleAdd = async () => {
    if (!selectedCasteId) return toast.error("Select a caste first");
    if (!newSubcaste.trim()) return toast.error("Enter subcaste name");

    try {
      await axios.post(
        `http://localhost:5000/api/admin/masters/castes/${selectedCasteId}/subcastes`,
        { name: newSubcaste.trim() },
        authHeaders
      );

      setNewSubcaste("");
      loadSubcastes(selectedCasteId);
    } catch (err) {
      console.error("Error adding subcaste:", err);
      toast.error("Failed to add subcaste");
    }
  };

  const handleEditSave = async () => {
    if (!editId) return;
    try {
      await axios.put(
        `http://localhost:5000/api/admin/masters/subcastes/${editId}`,
        { name: editName },
        authHeaders
      );

      setEditId(null);
      setEditName("");
      if (selectedCasteId) loadSubcastes(selectedCasteId);
    } catch (err) {
      console.error("Error updating subcaste:", err);
      toast.error("Failed to update subcaste");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete subcaste?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/admin/masters/subcastes/${id}`,
        authHeaders
      );

      if (selectedCasteId) loadSubcastes(selectedCasteId);
    } catch (err) {
      console.error("Error deleting subcaste:", err);
      toast.error("Failed to delete subcaste");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Subcaste Master</h2>
        <Button onClick={onBack}>Back</Button>
      </div>

      <div className="flex gap-4 mb-6">
        {/* RELIGION DROPDOWN */}
        <div className="w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Religion</label>
          <Select
            value={selectedReligionId ? String(selectedReligionId) : ""}
            onValueChange={(val: string) => setSelectedReligionId(Number(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Religion" />
            </SelectTrigger>
            <SelectContent>
              {religions.map((r) => (
                <SelectItem key={r.Id} value={String(r.Id)}>
                  {r.Name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* CASTE DROPDOWN */}
        <div className="w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Caste</label>
          <Select
            disabled={!selectedReligionId}
            value={selectedCasteId ? String(selectedCasteId) : ""}
            onValueChange={(val: string) => setSelectedCasteId(Number(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Caste" />
            </SelectTrigger>
            <SelectContent>
              {castes.map((c) => (
                <SelectItem key={c.Id} value={String(c.Id)}>
                  {c.Name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ADD SUBCASTE */}
      {selectedCasteId && (
        <div className="flex gap-2 mb-4">
          <Input
            value={newSubcaste}
            onChange={(e) => setNewSubcaste(e.target.value)}
            placeholder="Add new subcaste"
          />
          <Button onClick={handleAdd}>Add</Button>
        </div>
      )}

      {/* SUBCASTE LIST */}
      {selectedCasteId && (
        <table className="min-w-full text-sm border">
          <tbody>
            {subcastes.map((s, i) => (
              <tr key={s.Id}>
                <td className="border p-2">{i + 1}</td>
                <td className="border p-2">
                  {editId === s.Id ? (
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                  ) : (
                    s.Name
                  )}
                </td>
                <td className="border p-2">
                  {editId === s.Id ? (
                    <Button size="sm" onClick={handleEditSave}>Save</Button>
                  ) : (
                    <>
                      <Button size="sm" onClick={() => { setEditId(s.Id); setEditName(s.Name); }}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(s.Id)}>
                        Delete
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {subcastes.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">No subcastes found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};
