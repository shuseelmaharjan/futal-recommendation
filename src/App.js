import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./components/Home/Home";
import LoadOut from "./config/LoadOut";
import Login from "./components/Login/Login";
import Register from "./components/Login/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import PrivateRoute from "./config/PrivateRoute";
import Requests from "./components/Requests/Requests";
import Booking from "./components/Booking/Booking";
import Futsal from "./components/Futsal/Futsal";
import Payment from "./components/Payment/Payment";
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from "./components/Profile/Profile";
import ChangePassword from "./components/ChangePassword/ChangePassword";

const App = () => {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoadOut><Home /></LoadOut>} />
                <Route path="/login" element={<LoadOut><Login /></LoadOut>} />
                <Route path="/register" element={<LoadOut><Register /></LoadOut>} />
                <Route path="/dashboard" element={<PrivateRoute><LoadOut><Dashboard /></LoadOut></PrivateRoute>} />
                <Route path="/requests" element={<PrivateRoute><LoadOut><Requests /></LoadOut></PrivateRoute>} />
                <Route path="/futsal" element={<PrivateRoute><LoadOut><Futsal /></LoadOut></PrivateRoute>} />
                <Route path="/billing" element={<PrivateRoute><LoadOut><Payment /></LoadOut></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><LoadOut><Profile /></LoadOut></PrivateRoute>} />
                <Route path="/booking" element={<PrivateRoute><LoadOut><Booking /></LoadOut></PrivateRoute>} />
                <Route path="/change-password" element={<PrivateRoute><LoadOut><ChangePassword /></LoadOut></PrivateRoute>} />

            </Routes>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </Router>
    );
};

export default App;
