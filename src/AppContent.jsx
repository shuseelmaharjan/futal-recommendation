import { useLocation, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { Home } from './components/Home/Home';
import { Login } from './components/Login/Login';
import { Register } from './components/Login/Register';
import { Dashboard } from './components/Dashboard/Dashboard';

const AppContent = ({ loggedIn, setLoggedIn, role, setRole }) => {
    const location = useLocation();

    const hideNavbarRoutes = ['/login', '/register'];
    const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname) || role === 'admin' || role === 'vendor';

    return (
        <>
            {!shouldHideNavbar && <Navbar loggedIn={loggedIn} />}

            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login setLoggedIn={setLoggedIn} setRole={setRole} />} />
                <Route path='/register' element={<Register />} />
                <Route path='/dashboard' element={<Dashboard />} />
            </Routes>
        </>
    );
};

export default AppContent;
