import React, { useState } from 'react';

export const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={`${
                    isSidebarOpen ? 'block' : 'hidden'
                } md:block md:w-64 w-16 bg-gray-800 text-white p-4 space-y-6`}
            >
                <div className="text-xl font-semibold">Dashboard</div>
                <ul className="space-y-4">
                    <li className="cursor-pointer hover:text-green-400">Home</li>
                    <li className="cursor-pointer hover:text-green-400">Profile</li>
                    <li className="cursor-pointer hover:text-green-400">Settings</li>
                    <li className="cursor-pointer hover:text-green-400">Logout</li>
                </ul>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Topbar */}
                <div className="bg-gray-800 text-white flex justify-between items-center p-4">
                    <div className="md:hidden">
                        <button onClick={toggleSidebar} className="text-white">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="h-6 w-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="text-lg">Username</div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 bg-gray-200">
                    <h2 className="text-2xl font-semibold">Welcome to the Dashboard</h2>
                    <p className="mt-4">This is the content section of the dashboard.</p>
                </div>
            </div>
        </div>
    );
};
