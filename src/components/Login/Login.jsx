import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdClose } from 'react-icons/md'; 

export const Login = ({ setLoggedIn }) => { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResponseMessage('');

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store tokens in localStorage
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        
        setLoggedIn(true);  
        navigate('/dashboard'); 
      } else {
        setResponseMessage(data.non_field_errors || 'Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Login
        </h2>
        <p className="text-center text-gray-500">
          Welcome back! Please log in.
        </p>

        {responseMessage && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{responseMessage}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <MdClose
                className="h-6 w-6 text-red-500 cursor-pointer"
                onClick={() => setResponseMessage('')}
                role="button"
                title="Close"
              />
            </span>
          </div>
        )}

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
