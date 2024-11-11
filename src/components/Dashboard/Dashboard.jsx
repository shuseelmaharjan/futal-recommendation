import React from 'react';
import { Sidebar } from "../Navbar/Sidebar";
import { Navbar } from "../Navbar/Navbar";
import {Header} from "../Navbar/Header";

export const Dashboard = ({ userRole }) => {
    return (
        <>
            {userRole === 'user' && (
                <>
                    <Navbar />
                    <h1 className='mt-4'>Content for User</h1>
                </>
            )}

            {userRole === 'admin' && (
                <>
                    <div className="flex h-screen bg-gray-100">
                        <Sidebar />
                        <div className="flex-1 flex flex-col">
                            <Header/>
                            <main className="flex-1 p-6 bg-gray-100">
                                {/* Add admin specific content here */}
                            </main>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};
