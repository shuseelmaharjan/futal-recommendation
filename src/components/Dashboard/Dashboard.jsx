import React from 'react';
import {Sidebar} from "../Navbar/Sidebar";
import {Header} from "../Navbar/Header";

export const Dashboard = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar/>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                <Header/>
                {/* Content Area */}
                <main className="flex-1 p-6 bg-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Example of Content Cards */}
                        <div className="bg-white rounded-lg shadow-lg p-4">
                            <h3 className="text-lg font-semibold mb-2">Total Sales</h3>
                            <p className="text-2xl font-bold text-green-700">$12,345</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-4">
                            <h3 className="text-lg font-semibold mb-2">New Users</h3>
                            <p className="text-2xl font-bold text-blue-700">245</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-4">
                            <h3 className="text-lg font-semibold mb-2">Active Sessions</h3>
                            <p className="text-2xl font-bold text-yellow-700">56</p>
                        </div>
                        {/* Add more cards as needed */}
                    </div>

                    {/* Detailed Section */}
                    <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Analytics Overview</h2>
                        <p>Here you can display charts, graphs, and further detailed data.</p>
                    </div>
                </main>
            </div>
        </div>
    );
};
