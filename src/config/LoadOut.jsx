import React, { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Navbar/Sidebar";
import Header from "../components/Navbar/Header";
import apiClient from "../components/apiClient";
import UserSidebar from "../components/Navbar/UserSidebar";

const LoadOut = ({ children }) => {
  const [role, setRole] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();

  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";

  const accessToken = localStorage.getItem("access_token");

  const isUser = Boolean(accessToken);

  const guestPath = ["/"];
  const isGuest = guestPath.includes(location.pathname);

  useEffect(() => {
    const fetchRole = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await apiClient.get("/api/user-role", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRole(response.data.role);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false); 
      }
    };

    if (isUser) {
      fetchRole();
    } else {
      setIsLoading(false); 
    }
  }, [isUser]);

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  if (isLogin || isRegister) {
    return children;
  }

  if (isGuest) {
    return (
      <>
        <Navbar />
        {children}
      </>
    );
  }

  if (isUser) {
    if (role === "admin" || role === "vendor") {
      return (
        <div className="flex h-screen bg-white">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-2 bg-gray-100">{children}</main>
          </div>
        </div>
      );
    }

    if (role === "user") {
      return (
        <>
        <div className="flex h-screen bg-white">
          <UserSidebar/>
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 p-6 bg-gray-100">{children}</main>
          </div>
        </div>
        </>
      );
    }
  }

  return <Navigate to="/login" />;
};

export default LoadOut;
