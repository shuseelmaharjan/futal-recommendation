import React from 'react';
import { Link } from 'react-router-dom';
export const Login = () => {
  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Login
          </h2>
          <p className="text-center text-gray-500">
            Welcome back! Please log in.
          </p>

          <form className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <input
                  type="email"
                  className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
                  placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Password</label>
              <input
                  type="password"
                  className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
                  placeholder="Enter your password"
              />
            </div>
            <button
                type="submit"
                className="w-full py-2 font-semibold text-white bg-green-700 rounded-lg hover:bg-green-800 transition duration-300"
            >
              Login
            </button>
          </form>

          <div className="text-center">
            <p className="text-gray-500">
              Don't have an account?
              <span className="font-medium text-green-700 cursor-pointer hover:underline mx-2"><Link to='/register'>Sign Up</Link></span>
            </p>
          </div>
        </div>
      </div>
  );
};
