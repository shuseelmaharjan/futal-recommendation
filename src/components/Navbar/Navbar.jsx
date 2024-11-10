import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <nav className={`fixed w-full top-0 left-0 z-10 transition-all duration-1000 ${isScrolled ? 'bg-green-700' : 'bg-transparent'}`}>
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="text-white text-2xl font-bold">
          <Link to='/'>Logo</Link>
        </div>

        <div className="flex">
          <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};
