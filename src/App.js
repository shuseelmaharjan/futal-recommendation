import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Home } from './components/Home/Home';
import { Login } from './components/Login/Login';
import { Register } from './components/Login/Register';
import { Dashboard } from './components/Dashboard/Dashboard';
import LoadOut from './config/LoadOut';
import PrivateRoute from './config/PrivateRoute';
import { useEffect, useState } from 'react';
import apiClient from './components/apiClient';

function App() {
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('access_token');

    useEffect(() => {
        const fetchUserRole = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await apiClient.get('/api/user-role', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setUserRole(response.data.role);
            } catch (error) {
                console.error('Failed to fetch user role:', error);
                setUserRole(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserRole();
    }, [token]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoadOut><Home /></LoadOut>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/dashboard"
                    element={
                        <LoadOut>
                            <PrivateRoute>
                                <Dashboard userRole={userRole}/>
                            </PrivateRoute>
                        </LoadOut>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
