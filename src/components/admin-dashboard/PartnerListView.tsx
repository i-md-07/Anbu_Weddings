import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

export const PartnerListView: React.FC = () => {
  // Temporary dummy data (replace with API later)
  const partners = [
    { id: 1, name: "ABC Matrimony", email: "abc@mail.com", status: "Active" },
    { id: 2, name: "XYZ Services", email: "xyz@mail.com", status: "Inactive" }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Partners</h2>

      {partners.length === 0 ? (
        <div className="text-gray-500">No partners found</div>
      ) : (
        <div className="space-y-3">
          {partners.map(p => (
            <Card key={p.id} className="p-4 flex justify-between items-center">
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-gray-500">{p.email}</div>
                <div className="text-xs text-gray-400">Status: {p.status}</div>
              </div>

              <div className="flex gap-2">
                <Button size="sm">Edit</Button>
                <Button size="sm" variant="destructive">Disable</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
