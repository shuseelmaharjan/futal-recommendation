import { useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { Home } from './components/Home/Home';
import { Login } from './components/Login/Login';
import { Register } from './components/Login/Register';
import { Dashboard } from './components/Dashboard/Dashboard';

const AppContent = ({ loggedIn, setLoggedIn, role, setRole }) => {
    const location = useLocation();

    // Determine whether to hide Navbar
    const shouldHideNavbar =
        location.pathname === '/login' ||
        location.pathname === '/register' ||
        (location.pathname === '/dashboard' && (role === 'admin' || role === 'vendor'));

    return (
        <>
            {/* Render Navbar only when shouldHideNavbar is false */}
            {!shouldHideNavbar && <Navbar loggedIn={loggedIn} />}

            <Routes>
                {/* Public Routes */}
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login setLoggedIn={setLoggedIn} setRole={setRole} />} />
                <Route path='/register' element={<Register />} />

                {/* Private Route: Dashboard */}
                <Route
                    path='/dashboard'
                    element={<PrivateRoute loggedIn={loggedIn}><Dashboard /></PrivateRoute>}
                />
            </Routes>
        </>
    );
};

// PrivateRoute component to restrict access to authenticated users
const PrivateRoute = ({ loggedIn, children }) => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    // If tokens or login status are missing, redirect to /login
    if (!accessToken || !refreshToken || !loggedIn) {
        return <Navigate to='/login' />;
    }

    // If all checks pass, render the children component
    return children;
};

export default AppContent;
