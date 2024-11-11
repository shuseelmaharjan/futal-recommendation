import { Navigate, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";
import { Login } from "../components/Login/Login";
import { Register } from "../components/Login/Register";
import { useEffect, useState } from "react";
import apiClient from "../components/apiClient";

function LoadOut({ children }) {
    const location = useLocation();
    const isLogin = location.pathname === '/login';
    const isRegister = location.pathname === '/register';
    const refreshToken = localStorage.getItem('refresh_token');
    const accessToken = localStorage.getItem('access_token');
    const isAuthenticated = refreshToken && accessToken;
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchUserRole = async () => {
            if (isAuthenticated) {
                const token = localStorage.getItem('access_token');
                try {
                    const response = await apiClient.get('/api/user-role', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    setUserRole(response.data.role);
                } catch (error) {
                    console.error("Failed to fetch user role:", error);
                }
            }
        };

        fetchUserRole();
    }, [isAuthenticated]);

    const guestRoutes = ['/'];
    const IsGuest = guestRoutes.includes(location.pathname);

    return (
        <>
            {isLogin && <Login />}
            {isRegister && <Register />}

            {IsGuest && !isAuthenticated && <Navbar />}

            {isAuthenticated || IsGuest ? (
                <>
                    {isAuthenticated && userRole === 'user' && <Navbar />}
                    {children}
                </>
            ) : (
                <Navigate to="/login" replace />
            )}
        </>
    );
}

export default LoadOut;
