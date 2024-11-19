import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from "../apiClient";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [username, setUsername] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const [usernameResponse, roleResponse] = await Promise.all([
          apiClient.get('/api/username', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }),
          apiClient.get('/api/user-role', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })
        ]);

        setUsername(usernameResponse.data.username);
        setUserRole(roleResponse.data.role);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
      <nav className={`fixed w-full top-0 left-0 z-10 transition-all duration-1000 
      ${userRole === 'user' ? 'bg-emerald-950' : 
      isScrolled ? 'bg-emerald-950' : 'bg-transparent'}`}>
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="text-white text-2xl font-bold">
            <Link to="/">Logo</Link>
          </div>

          <div className="flex items-center">
            {username ? (
                <div className="relative">
                    <button className="text-lg font-semibold text-white hover:text-yellow-600 focus:outline-none" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
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

export default Navbar;
