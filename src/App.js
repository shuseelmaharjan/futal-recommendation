import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Navbar } from './components/Navbar/Navbar';
import { Home } from './components/Home/Home';
import { Login } from './components/Login/Login';
import { Register } from "./components/Login/Register";
import { useState } from 'react';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);  

  return (
    <Router>
      <Navbar loggedIn={loggedIn} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login setLoggedIn={setLoggedIn} />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
