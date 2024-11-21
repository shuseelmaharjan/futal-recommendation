import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from "../apiClient";
import logo from './../../assets/logoW.png';
const Navbar = () => {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const usernameResponse = await apiClient.get('api/username', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
        });
        setUsername(usernameResponse.data.username);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (!token || !refreshToken) {
      return;
    }

    try {
      await apiClient.post(
        '/api/logout',
        { refresh_token: refreshToken },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      navigate('/login');
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <nav
      className="fixed w-full top-0 left-0 z-10 transition-all duration-1000 bg-emerald-950">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="text-white text-2xl font-bold">
          <Link to="/">
          <img 
                    src={logo} 
                    alt="Logo" 
                    className="h-[35px] w-auto" 
                />
          </Link>
        </div>

        <div className="flex items-center">
          {username ? (
            <div className="relative">
              <button
                className="text-lg font-semibold text-white hover:text-yellow-600 focus:outline-none"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Welcome, {username}
              </button>
              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md"
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <ul className="py-1 text-gray-700">
                    <li>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                        onClick={() => setShowLogoutConfirm(true)}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-semibold">Confirm Logout</h3>
            <p className="mt-2">Are you sure you want to logout?</p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
