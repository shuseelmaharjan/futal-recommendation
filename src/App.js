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

const App = () => {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoadOut><Home /></LoadOut>} />
                <Route path="/login" element={<LoadOut><Login /></LoadOut>} />
                <Route path="/register" element={<LoadOut><Register /></LoadOut>} />
                <Route path="/dashboard" element={<PrivateRoute><LoadOut><Dashboard /></LoadOut></PrivateRoute>} />
                <Route path="/requests" element={<PrivateRoute><LoadOut><Requests /></LoadOut></PrivateRoute>} />
                <Route path="/bookings" element={<PrivateRoute><LoadOut><Booking /></LoadOut></PrivateRoute>} />
            </Routes>
        </Router>
    );
};

export default App;
