import React from "react";
import { Link, useLocation } from "react-router-dom"; 
import { FaHouseUser } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";
import { RiReservedFill } from "react-icons/ri";
import { FaKey } from "react-icons/fa";
import { FaUser } from "react-icons/fa";

const UserSidebar = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-white text-gray-800 flex flex-col shadow-md">
      <div className="bg-emerald-950 p-4 text-white font-semibold text-xl">
        <span>Dashboard</span>
      </div>
      <nav className="flex-1 py-8 px-4">
        <ul>
          <li className="mb-4">
            <Link
              to="/dashboard"
              className={`flex items-center p-3 rounded-lg transition duration-200 
                ${isActive("/dashboard") ? "bg-emerald-100 text-emerald-950" : "hover:bg-emerald-100 hover:text-emerald-950"}`}
            >
              <FaHouseUser className="mr-2" />
              <span className="font-medium">Home</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/mybooking"
              className={`flex items-center p-3 rounded-lg transition duration-200 
                ${isActive("/mybooking") ? "bg-emerald-100 text-emerald-950" : "hover:bg-emerald-100 hover:text-emerald-950"}`}
            >
              <RiReservedFill className="mr-2" />
              <span className="font-medium">My Booking</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/confirmation"
              className={`flex items-center p-3 rounded-lg transition duration-200 
                ${isActive("/confirmation") ? "bg-emerald-100 text-emerald-950" : "hover:bg-emerald-100 hover:text-emerald-950"}`}
            >
              <GiConfirmed className="mr-2" />
              <span className="font-medium">Confirmation</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/profile"
              className={`flex items-center p-3 rounded-lg transition duration-200 
                ${isActive("/profile") ? "bg-emerald-100 text-emerald-950" : "hover:bg-emerald-100 hover:text-emerald-950"}`}
            >
              <FaUser  className="mr-2" />
              <span className="font-medium">Profile</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/change-password"
              className={`flex items-center p-3 rounded-lg transition duration-200 
                ${isActive("/change-password") ? "bg-emerald-100 text-emerald-950" : "hover:bg-emerald-100 hover:text-emerald-950"}`}
            >
              <FaKey  className="mr-2" />
              <span className="font-medium">Change Password</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default UserSidebar;
