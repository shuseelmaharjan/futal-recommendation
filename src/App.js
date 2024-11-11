import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Home } from './components/Home/Home';
import { Login } from './components/Login/Login';
import { Register } from './components/Login/Register';
import { Dashboard } from "./components/Dashboard/Dashboard";
import LoadOut  from "./config/LoadOut";
import PrivateRoute from "./config/PrivateRoute";

function App() {
    return (
        <Router>
            <LoadOut>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/dashboard' element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } />
                </Routes>
            </LoadOut>
        </Router>
    );
}

export default App;
