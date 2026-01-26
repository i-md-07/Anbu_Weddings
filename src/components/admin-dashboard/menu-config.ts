
import React from "react";

export type ViewType =
    | "overview"
    | "users"
    | "create"
    | "edit"
    | "religion"
    | "caste"
    | "subcaste"
    | "pending"
    | "partners_list"
    | "partners_create"
    | "partners_payments"
    | "user_payments"
    | "user_payment_details";

export interface MenuItem {
    id: string;
    label: string;
    view?: string; // Corresponds to ViewType
    icon?: React.ReactNode;
    subItems?: MenuItem[];
}

export const adminMenuItems: MenuItem[] = [
    {
        id: "dashboard",
        label: "Dashboard",
        view: "overview"
    },
    {
        id: "masters",
        label: "Masters",
        subItems: [
            { id: "religion", label: "Religion Master", view: "religion" },
            { id: "caste", label: "Caste Master", view: "caste" },
            { id: "subcaste", label: "Subcaste Master", view: "subcaste" }
        ]
    },
    {
        id: "users",
        label: "User Management",
        subItems: [
            { id: "all_users", label: "All Users", view: "users" },
            { id: "pending_users", label: "Pending Approvals", view: "pending" },
            { id: "create_user", label: "Create User", view: "create" },
            { id: "user_payments", label: "Payment Details", view: "user_payments" }
        ]
    },
    {
        id: "partners",
        label: "Partnership Management",
        subItems: [
            { id: "partner_list", label: "Partner List", view: "partners_list" },
            { id: "partner_create", label: "Create Partner", view: "partners_create" },
            { id: "partner_payments", label: "Payment Details", view: "partners_payments" }
        ]
    }
];
