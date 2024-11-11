import React, { useState, useEffect } from "react";
import apiClient from "../apiClient";

export const Header = () => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('access_token');

            try {
                const response = await apiClient.get('/api/username', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setUsername(response.data.username);
            } catch (e) {
                console.error(e);
            }
        };

        fetchUser();
    }, []);

    return (
        <header className="bg-white shadow-lg px-6 py-4 flex justify-between items-end">
            <div className="text-xl font-bold ml-auto">Welcome, {username}</div>
        </header>
    );
};
