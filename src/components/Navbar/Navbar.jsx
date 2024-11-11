import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from "../apiClient";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [username, setUsername] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility
  const navigate = useNavigate(); // For redirecting after logout

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

  const handleLogout = () => {
    // Clear tokens from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
      <nav
          className={`fixed w-full top-0 left-0 z-10 transition-all duration-1000 ${userRole === 'user' ? 'bg-green-500' : isScrolled ? 'bg-green-700' : 'bg-transparent'}`}
      >
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="text-white text-2xl font-bold">
            <Link to="/">Logo</Link>
          </div>

          <div className="flex items-center">
            {username ? (
                <div className="relative">
                  {/* Username clicked to toggle the dropdown */}
                  <span
                      className="text-white cursor-pointer"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                Hello, {username}!
              </span>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                      <div className="absolute right-0 mt-6 w-48 bg-white text-black rounded-lg shadow-lg">
                        <ul>
                          <li>
                            <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-200">
                              Dashboard
                            </Link>
                          </li>
                          <li>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left block px-4 py-2 hover:bg-gray-200"
                            >
                              Logout
                            </button>
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
