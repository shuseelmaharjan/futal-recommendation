import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true); 
      } else {
        setIsScrolled(false); 
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch user role if logged in
  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await fetch('http://localhost:8000/api/user-role', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setRole(data.role); 
          } else {
            setRole(null); 
            setError('Failed to fetch role');
          }
        } catch (err) {
          setError('An error occurred while fetching user role');
        }
      } else {
        setRole(null); 
      }
      setIsLoading(false); 
    };

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
          ) : role ? (
            <span className="text-white">Role: {role}</span>
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
