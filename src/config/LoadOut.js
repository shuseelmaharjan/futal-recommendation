import { Navigate, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";
import {Login} from "../components/Login/Login";

function LoadOut({ children }) {
    const location = useLocation();
    const isLogin = location.pathname === '/login';
    const refreshToken = localStorage.getItem('refresh_token');
    const accessToken = localStorage.getItem('access_token');
    const isAuthenticated = refreshToken && accessToken;

    const guestRoutes = ['/'];
    const IsGuest = guestRoutes.includes(location.pathname);

    return (
        <>
            {isLogin && <Login/>}
            {IsGuest && <Navbar />}
            {isAuthenticated || IsGuest ? (
                children
            ) : (
                <Navigate to="/login" replace />
            )}
        </>
    );
}

export default LoadOut;
