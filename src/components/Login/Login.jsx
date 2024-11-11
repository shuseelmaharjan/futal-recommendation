import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MdClose } from 'react-icons/md';
import apiClient from "../apiClient";

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to dashboard if tokens exist
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (accessToken && refreshToken) {
      navigate('/dashboard');
    }
  }, [navigate]);

  useEffect(() => {
    if (location.state?.message) {
      setError(location.state.message);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/api/login', formData);
      if (response.status === 200) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);

        // Check user role and navigate accordingly
        const roleResponse = await apiClient.get('/api/user-role', {
          headers: {
            'Authorization': `Bearer ${response.data.access_token}`,
          }
        });

        const userRole = roleResponse.data.role;
        if (userRole === 'user') {
          navigate('/');
        } else if (['admin', 'vendor'].includes(userRole)) {
          navigate('/dashboard');
        } else {
          setError('Role not found or invalid.');
        }
      } else {
        setError(response.data.non_field_errors || 'Invalid email or password');
      }
    } catch (error) {
      setError("Invalid username or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-3xl font-bold text-center text-gray-800">Login</h2>
          <p className="text-center text-gray-500">Welcome back! Please log in.</p>
          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Password</label>
              <input
                  type="password"
                  name="password"
                  className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
              />
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 font-semibold text-white bg-green-700 rounded-lg hover:bg-green-800 transition duration-300"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
                <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                  <MdClose
                      className="h-6 w-6 text-red-500 cursor-pointer"
                      onClick={() => setError('')}
                      role="button"
                      title="Close"
                  />
                </span>
              </div>
          )}

          <div className="text-center">
            <p className="text-gray-500">
              Don't have an account?
              <span className="font-medium text-green-700 cursor-pointer hover:underline mx-2">
                <Link to="/register">Sign Up</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
  );
};
