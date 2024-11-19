import React, { useState, useEffect } from "react";
import apiClient from "../apiClient";
import { Link } from "react-router-dom";

const Header = () => {
    const [username, setUsername] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;