import React, { useState, useEffect } from "react";
import apiClient from "../apiClient";
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const [username, setUsername] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("access_token");

            try {
                const response = await apiClient.get("/api/username", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsername(response.data.username || "Guest");
            } catch (e) {
                console.error(e);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        const token = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
    
        if (!token || !refreshToken) {
          return;
        }
    
        try {
          await apiClient.post(
            '/api/logout',
            { refresh_token: refreshToken },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
    
          // Clear tokens from local storage
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
    
          // Redirect to login
          navigate('/login');
        } catch (err) {
          console.error("Logout failed:", err);
        }
      };
    

    return (
        <header className="bg-white shadow-md px-6 py-4 flex justify-end items-center">
            <div className="relative">
                <button className="text-lg font-semibold text-gray-800 hover:text-black focus:outline-none" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    Welcome, {username}
                </button>
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md" onMouseLeave={() => setIsDropdownOpen(false)}>
                        <ul className="py-1 text-gray-700">
                            <li>
                                <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                            <button
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                                onClick={() => setShowLogoutConfirm(true)}
                            >
                                Logout
                            </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                <div className="bg-white p-6 rounded shadow-lg">
                    <h3 className="text-lg font-semibold">Confirm Logout</h3>
                    <p className="mt-2">Are you sure you want to logout?</p>
                    <div className="flex justify-end mt-4 space-x-2">
                    <button
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        onClick={() => setShowLogoutConfirm(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                    </div>
                </div>
                </div>
            )}
        </header>
    );
};

export default Header;