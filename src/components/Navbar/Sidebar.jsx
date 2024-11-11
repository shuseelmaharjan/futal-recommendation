import React from "react";

export const Sidebar = () => {
    return(
        <>
            <aside className="w-64 bg-green-900 text-white flex flex-col">
                <div className="p-4 font-bold text-2xl text-center">Dashboard</div>
                <nav className="flex-1 px-4 py-8">
                    <ul>
                        <li className="mb-4 hover:bg-green-600 p-2 rounded-lg cursor-pointer">
                            <span>Overview</span>
                        </li>
                        <li className="mb-4 hover:bg-green-600 p-2 rounded-lg cursor-pointer">
                            <span>Analytics</span>
                        </li>
                        <li className="mb-4 hover:bg-green-600 p-2 rounded-lg cursor-pointer">
                            <span>Settings</span>
                        </li>
                        <li className="mb-4 hover:bg-green-600 p-2 rounded-lg cursor-pointer">
                            <span>Profile</span>
                        </li>
                        <li className="mb-4 hover:bg-green-600 p-2 rounded-lg cursor-pointer">
                            <span>Logout</span>
                        </li>
                    </ul>
                </nav>
            </aside>
        </>
    );
};