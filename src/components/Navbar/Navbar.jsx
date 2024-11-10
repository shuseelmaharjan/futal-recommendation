import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from "../apiClient";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [username, setUsername] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch user role if logged in
  const fetchUserRole = async () => {
    const token = localStorage.getItem('access_token');
    setIsLoading(true);

    if (!token) {
      setUsername(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.get('/api/username', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setUsername(response.data.username);
      } else {
        setUsername(null);
        setError('Failed to fetch role');
      }
    } catch (err) {
      setError('An error occurred while fetching user role');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, []);

  return (
      <nav className={`fixed w-full top-0 left-0 z-10 transition-all duration-1000 ${isScrolled ? 'bg-green-700' : 'bg-transparent'}`}>
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="text-white text-2xl font-bold">
            <Link to="/">Logo</Link>
          </div>

          <div className="flex items-center">
            {/* Check if user is logged in and role is available */}
            {isLoading ? (
                <span className="text-white">Loading...</span>
            ) : username ? (
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
