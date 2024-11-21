import React, { useEffect, useState, useCallback } from "react";
import { useLocation, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Navbar/Sidebar";
import Header from "../components/Navbar/Header";
import apiClient from "../components/apiClient";
import UserSidebar from "../components/Navbar/UserSidebar";

const LoadOut = ({ children }) => {
  const [role, setRole] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [slugExists, setSlugExists] = useState(false);
  const location = useLocation();

  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";

  const accessToken = localStorage.getItem("access_token");
  const isUser = Boolean(accessToken);
  const guestPath = ["/"];
  const isGuest = guestPath.includes(location.pathname);

  const currentSlug = location.pathname.split("/").pop(); 

  const checkSlug = useCallback(async () => {
    try {
      const response = await apiClient.post("api/check-slug", { slug: currentSlug });
      setSlugExists(response.data.exists);
    } catch (error) {
      console.error("Error checking slug:", error);
      setSlugExists(false);
    }
  }, [currentSlug]);

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

    if (currentSlug) {
      checkSlug();
    } else {
      setSlugExists(true); 
    }
  }, [isUser, currentSlug, checkSlug]);

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

  if (slugExists) {
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
        <div className="flex h-screen bg-white">
          <UserSidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 p-6 bg-gray-100">{children}</main>
          </div>
        </div>
      );
    }
  }

  return <Navigate to="/login" />;
};

export default LoadOut;
