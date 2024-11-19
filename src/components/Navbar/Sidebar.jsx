import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from './../../assets/logoW.png';
import { FaHome, FaTasks, FaShoppingCart } from "react-icons/fa";
import apiClient from "../apiClient";

const Sidebar = () => {
    const [role, setRole] = useState('');
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        const fetchUserRole = async () => {
            try {
                const response = await apiClient.get("/api/user-role", {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                });
                setRole(response.data.role);
            } catch (error) {
                console.error("Error fetching role:", error);
            }
        };

        fetchUserRole();
    }, []); 

    const menuItems = [
        { path: "/dashboard", label: "Dashboard", icon: <FaHome /> },
        ...(role === "admin"
            ? [{ path: "/requests", label: "Requests", icon: <FaTasks /> }]
            : []),
        ...(role === "vendor"
            ? [{ path: "/bookings", label: "Booking", icon: <FaShoppingCart /> }]
            : []),
    ];

    return (
        <aside className="w-64 bg-emerald-950 text-white flex flex-col">
            <div className="p-6 flex justify-center items-center">
                <img 
                    src={logo} 
                    alt="Logo" 
                    className="h-16 w-auto" 
                />
            </div>

            <nav className="flex-1 py-8">
                <ul>
                    {menuItems.map(({ path, label, icon }) => (
                        <li
                            key={path}
                            className={`mb-4 p-2 cursor-pointer ${
                                location.pathname === path
                                    ? "bg-rose-600"
                                    : "hover:bg-green-900"
                            }`}
                        >
                            <Link to={path} className="mx-6 flex items-center">
                                <span>{icon}</span>
                                <span className="mx-2 font-semi-bold">{label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
