import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from "../apiClient";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchUsername = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await apiClient.get('/api/username', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setUsername(response.data.username);
      console.log("Username fetched from Navbar:" + (response.data.username));
    } catch (err) {
      console.error(err)
    }
  };

  useEffect(() => {
    fetchUsername();
  }, []);

  return (
      <nav className={`fixed w-full top-0 left-0 z-10 transition-all duration-1000 ${isScrolled ? 'bg-green-700' : 'bg-transparent'}`}>
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="text-white text-2xl font-bold">
            <Link to="/">Logo</Link>
          </div>

          <div className="flex items-center">
            { username ? (
                <span className="text-white">Hello {username} !</span>
            ) : (
                <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Login
                </Link>
            )}
          </div>
        </div>
      </nav>
  );
};
