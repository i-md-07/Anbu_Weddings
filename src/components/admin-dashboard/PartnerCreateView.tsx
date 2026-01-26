import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { toast } from "sonner";

export const PartnerCreateView: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Replace with API call
    console.log({
      name,
      email,
      mobile
    });

    toast.success("Partner created (mock)");
    setName("");
    setEmail("");
    setMobile("");
  };

  return (
    <div className="max-w-lg">
      <h2 className="text-xl font-semibold mb-4">Create Partner</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Partner Name</Label>
          <Input value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div>
          <Label>Email</Label>
          <Input value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        <div>
          <Label>Mobile</Label>
          <Input value={mobile} onChange={e => setMobile(e.target.value)} />
        </div>

        <Button type="submit">Create Partner</Button>
      </form>
    </div>
  );
};
