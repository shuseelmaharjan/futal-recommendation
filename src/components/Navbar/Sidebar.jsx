import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from './../../assets/logoW.png';
import { FaHome, FaTasks, FaShoppingCart, FaKey, FaUser } from "react-icons/fa";
import { RiFootballLine } from "react-icons/ri";
import { MdAttachMoney } from "react-icons/md";
import apiClient from "../apiClient";

const Sidebar = () => {
    const [role, setRole] = useState('');
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        const fetchUserRole = async () => {
            try {
                const response = await apiClient.get("api/user-role", {
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

    const isActive = (path) => location.pathname === path;

    const menuItems = [
        { path: "/dashboard", label: "Dashboard", icon: <FaHome /> },
        ...(role === "admin" 
            ? [{ path: "/requests", label: "Requests", icon: <FaTasks /> }]
            : []),
        ...(role === "vendor"
            ? [
                { path: "/booking", label: "Booking", icon: <FaShoppingCart /> },
                { path: "/futsal", label: "My Futsal", icon: <RiFootballLine /> },
                { path: "/billing", label: "Billing", icon: <MdAttachMoney /> },
              ]
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
                            className={`mb-2 p-2 cursor-pointer ${
                                isActive(path) ? "bg-rose-600" : "hover:bg-green-900"
                            }`}
                        >
                            <Link to={path} className="mx-6 flex items-center">
                                <span>{icon}</span>
                                <span className="mx-2 font-semibold">{label}</span>
                            </Link>
                        </li>
                    ))}
                    <li className={`mb-2 p-2 cursor-pointer ${ isActive("/profile") ? "bg-rose-600" : "hover:bg-green-900"}`}>
                        <Link
                            to="/profile"
                            className="mx-6 flex items-center">
                                <span><FaUser/></span>
                                <span className="mx-2 font-semibold">Profile</span>
                        </Link>
                    </li>
                    <li className={`mb-2 p-2 cursor-pointer ${ isActive("/change-password") ? "bg-rose-600" : "hover:bg-green-900"}`}>
                        <Link
                            to="/change-password"
                            className="mx-6 flex items-center">
                                <span><FaKey/></span>
                                <span className="mx-2 font-semibold">Change Password</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
