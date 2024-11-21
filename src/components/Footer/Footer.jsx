import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gray-300 text-gray-900 py-4">
      <div className="container mx-auto text-center">
        <nav className="flex justify-center space-x-8 mb-4">
          <Link to="/" className="hover:text-black">Home</Link>
          <Link to="/login" className="hover:text-black">Login</Link>
        </nav>
      </div>
      <div className="container mx-auto text-center border-t border-gray-400 pt-4">
        <p>&copy; 2024 Futsal Recommendation System</p>
      </div>
    </footer>
  );
};
