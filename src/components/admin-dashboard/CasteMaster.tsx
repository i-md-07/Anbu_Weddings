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
import { toast } from "sonner";

interface Religion {
  Id: number;
  Name: string;
}

interface Caste {
  Id: number;
  Name: string;
}

interface CasteMasterProps {
  religions: Religion[];
  onBack: () => void;
}

export const CasteMaster: React.FC<CasteMasterProps> = ({
  religions,
  onBack
}) => {
  const [castes, setCastes] = useState<Caste[]>([]);
  const [loading, setLoading] = useState(false);
  const [newCaste, setNewCaste] = useState("");
  const [selectedReligionId, setSelectedReligionId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const token = localStorage.getItem("token");

  const authHeaders: HeadersInit = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  /* ---------------- LOAD ALL CASTES ---------------- */
  const loadCastes = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/admin/masters/castes",
        { headers: authHeaders }
      );
      const data = await res.json();
      setCastes(data.castes || []);
    } catch {
      setCastes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCastes();
  }, []);

  /* ---------------- ADD CASTE ---------------- */
  const handleAdd = async () => {
    if (!selectedReligionId) return toast.error("Select a religion");
    if (!newCaste.trim()) return toast.error("Enter caste name");

    await fetch(
      `http://localhost:5000/api/admin/masters/religions/${selectedReligionId}/castes`,
      {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ name: newCaste.trim() })
      }
    );

    setNewCaste("");
    loadCastes();
  };

  /* ---------------- EDIT CASTE ---------------- */
  const handleEdit = (c: Caste) => {
    setEditId(c.Id);
    setEditName(c.Name);
  };

  const handleEditSave = async () => {
    if (!editName.trim()) return toast.error("Enter caste name");

    await fetch(
      `http://localhost:5000/api/admin/masters/castes/${editId}`,
      {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ name: editName.trim() })
      }
    );

    setEditId(null);
    setEditName("");
    loadCastes();
  };

  /* ---------------- DELETE CASTE ---------------- */
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this caste?")) return;

    await fetch(
      `http://localhost:5000/api/admin/masters/castes/${id}`,
      {
        method: "DELETE",
        headers: authHeaders
      }
    );

    loadCastes();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Caste Master</h2>
        <Button onClick={onBack}>Back</Button>
      </div>

      <div className="flex gap-2 mb-4">
        <Select
          value={selectedReligionId ? String(selectedReligionId) : ""}
          onValueChange={(val: string) => setSelectedReligionId(Number(val))}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Religion" />
          </SelectTrigger>
          <SelectContent>
            {religions.map(r => (
              <SelectItem key={r.Id} value={String(r.Id)}>
                {r.Name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          value={newCaste}
          onChange={e => setNewCaste(e.target.value)}
          placeholder="Add new caste"
        />

        <Button onClick={handleAdd}>Add</Button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">#</th>
              <th className="border p-2">Caste</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {castes.map((c, i) => (
              <tr key={c.Id}>
                <td className="border p-2">{i + 1}</td>
                <td className="border p-2">
                  {editId === c.Id ? (
                    <Input value={editName} onChange={e => setEditName(e.target.value)} />
                  ) : (
                    c.Name
                  )}
                </td>
                <td className="border p-2 space-x-2">
                  {editId === c.Id ? (
                    <Button size="sm" onClick={handleEditSave}>Save</Button>
                  ) : (
                    <>
                      <Button size="sm" onClick={() => handleEdit(c)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(c.Id)}>
                        Delete
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
