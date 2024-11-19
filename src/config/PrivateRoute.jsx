import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (accessToken || refreshToken) {
        return children;
    }

    return <Navigate to="/login" />;
}

export default PrivateRoute;
