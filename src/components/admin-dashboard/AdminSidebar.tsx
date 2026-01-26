
import React from "react";
import { MenuItem, adminMenuItems } from "./menu-config";

interface AdminSidebarProps {
    openMenu: string | null;
    setOpenMenu: React.Dispatch<React.SetStateAction<string | null>>;
    setView: React.Dispatch<React.SetStateAction<any>>;
    currentView: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
    openMenu,
    setOpenMenu,
    setView,
    currentView
}) => {
    const toggleMenu = (id: string) => {
        setOpenMenu(openMenu === id ? null : id);
    };

    const renderMenuItem = (item: MenuItem) => {
        const isExpanded = openMenu === item.id;
        const isActive = item.view === currentView;
        const hasSubItems = item.subItems && item.subItems.length > 0;

        // Top-level item without sub-items (like Dashboard)
        if (!hasSubItems) {
            return (
                <button
                    key={item.id}
                    className={`w-full text-left px-4 py-2 rounded mb-2 transition-colors ${isActive ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                    onClick={() => item.view && setView(item.view)}
                >
                    {item.label}
                </button>
            );
        }

        // Item with sub-items (Accordion style)
        return (
            <div key={item.id} className="mb-2">
                <button
                    className={`w-full flex items-center justify-between px-4 py-2 rounded transition-colors ${isExpanded ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                    onClick={() => toggleMenu(item.id)}
                >
                    <span>{item.label}</span>
                    <svg
                        className={`w-4 h-4 transition-transform ${isExpanded ? "transform rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isExpanded && (
                    <div className="bg-gray-900 mt-1 rounded py-2 pl-4">
                        {item.subItems!.map((subItem) => (
                            <button
                                key={subItem.id}
                                className={`w-full text-left px-4 py-2 text-sm rounded transition-colors ${subItem.view === currentView
                                    ? "text-white font-medium"
                                    : "text-gray-400 hover:text-white"
                                    }`}
                                onClick={() => subItem.view && setView(subItem.view)}
                            >
                                {subItem.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-1">
            {adminMenuItems.map((item) => renderMenuItem(item))}
        </div>
    );
};
