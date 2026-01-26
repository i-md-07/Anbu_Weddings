import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from "sonner";

interface Religion {
  Id: number;
  Name: string;
}

export const ReligionMaster: React.FC = () => {
  const [religions, setReligions] = useState<Religion[]>([]);
  const [loading, setLoading] = useState(false);
  const [newReligion, setNewReligion] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const token = localStorage.getItem('token');
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const loadReligions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/admin/masters/religions', authHeaders);
      setReligions(res.data.religions || []);
    } catch (err) {
      setReligions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReligions(); }, []);

  const handleAdd = async () => {
    if (!newReligion.trim()) return toast.error('Enter religion name');
    try {
      await axios.post('http://localhost:5000/api/admin/masters/religions', { name: newReligion }, authHeaders);
      setNewReligion('');
      loadReligions();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Add failed');
    }
  };

  const handleEdit = (r: Religion) => {
    setEditId(r.Id);
    setEditName(r.Name);
  };

  const handleEditSave = async () => {
    if (!editName.trim()) return toast.error('Enter religion name');
    try {
      await axios.put(`http://localhost:5000/api/admin/masters/religions/${editId}`, { name: editName }, authHeaders);
      setEditId(null);
      setEditName('');
      loadReligions();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Edit failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this religion?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/masters/religions/${id}`, authHeaders);
      loadReligions();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Religion Master</h2>
        <div className="flex gap-2">
          <Input value={newReligion} onChange={e => setNewReligion(e.target.value)} placeholder="Add new religion" />
          <Button onClick={handleAdd}>Add</Button>
        </div>
      </div>
      {loading ? <div>Loading...</div> : (
        <table className="min-w-full text-sm border">
          <thead>
            <tr className="bg-[#f5f5f5]">
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Religion</th>
              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {religions.map((r, idx) => (
              <tr key={r.Id}>
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">
                  {editId === r.Id ? (
                    <Input value={editName} onChange={e => setEditName(e.target.value)} />
                  ) : (
                    r.Name
                  )}
                </td>
                <td className="px-4 py-2 flex items-center justify-center gap-2">
                  {editId === r.Id ? (
                    <Button size="sm" onClick={handleEditSave}>Save</Button>
                  ) : (
                    <Button size="sm" onClick={() => handleEdit(r)}>Edit</Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(r.Id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
