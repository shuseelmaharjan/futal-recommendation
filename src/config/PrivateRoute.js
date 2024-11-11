import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
    const accessToken = localStorage.getItem('access_token');

    return accessToken ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
