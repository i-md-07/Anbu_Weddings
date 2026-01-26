import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { processPayment } from "../services/api";
import { toast } from "sonner";
import { CheckCircle, CreditCard } from "lucide-react";

interface PaymentPageProps {
    onNavigate?: (page: string) => void;
}

export function PaymentPage({ onNavigate }: PaymentPageProps) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login first");
                onNavigate?.("login");
                return;
            }

            await processPayment(1000, token); // Fixed amount for now
            setSuccess(true);
            toast.success("Payment Successful! Your validity has been extended.");
            setTimeout(() => {
                onNavigate?.("home");
            }, 2000);
        } catch (error) {
            console.error("Payment failed", error);
            toast.error("Payment failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="p-8 text-center max-w-md space-y-4">
                    <div className="flex justify-center text-green-600">
                        <CheckCircle className="w-16 h-16" />
                    </div>
                    <h2 className="text-2xl font-bold">Payment Successful!</h2>
                    <p className="text-gray-600">
                        Your account validity has been extended by 6 months.
                    </p>
                    <Button onClick={() => onNavigate?.("home")}>Go to Dashboard</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="p-6 w-full max-w-md bg-white shadow-xl">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-[#8E001C]">Complete Payment</h2>
                    <p className="text-gray-600">Pay subscription to activate your profile</p>
                </div>

                <div className="space-y-6">
                    <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                        <span className="font-semibold">6 Months Subscription</span>
                        <span className="font-bold text-lg">₹1000.00</span>
                    </div>

                    {/* Mock Card Input */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Card Number</Label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <Input placeholder="0000 0000 0000 0000" className="pl-10" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Expiry</Label>
                                <Input placeholder="MM/YY" />
                            </div>
                            <div className="space-y-2">
                                <Label>CVV</Label>
                                <Input type="password" placeholder="123" />
                            </div>
                        </div>
                    </div>

                    <Button
                        className="w-full bg-[#8E001C] hover:bg-[#6E0015] py-6"
                        onClick={handlePayment}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Pay ₹1000"}
                    </Button>

                    <p className="text-xs text-center text-gray-500">
                        This is a secure 256-bit encrypted transaction.
                    </p>
                </div>
            </Card>
        </div>
    );
}
