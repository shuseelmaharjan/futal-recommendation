import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from "../components/apiClient";

function LoggedUser({ children }) {
    const accessToken = localStorage.getItem('access_token');
    const navigate = useNavigate();

    const validateToken = async () => {
        try {
            const response = await apiClient.post('/api/validate-token', {}, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            if (response.status === 200) {
                console.log(response.data.message);
            }
        } catch (error) {
            console.error("Token validation error:", error);
            navigate('/login', { state: { message: "Please log in again. Your session has expired." } });
        }
    };

    useEffect(() => {
        if (accessToken) {
            validateToken();
        }
    }, [accessToken]);

    return children;
}

export default LoggedUser;
