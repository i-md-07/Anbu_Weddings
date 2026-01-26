import React from "react";
import { Card } from "../ui/card";

export const PartnerPaymentsView: React.FC = () => {
  // Dummy data
  const payments = [
    { id: 1, partner: "ABC Matrimony", amount: 5000, date: "2024-12-01" },
    { id: 2, partner: "XYZ Services", amount: 3000, date: "2024-12-05" }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Partner Payments</h2>

      {payments.length === 0 ? (
        <div className="text-gray-500">No payments found</div>
      ) : (
        <div className="space-y-3">
          {payments.map(p => (
            <Card key={p.id} className="p-4">
              <div className="font-semibold">{p.partner}</div>
              <div className="text-sm text-gray-600">
                Amount: ₹{p.amount}
              </div>
              <div className="text-xs text-gray-400">
                Date: {p.date}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
