import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import { useState } from 'react';
import AppContent from './AppContent';

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [role, setRole] = useState('');

    return (
        <Router>
            <AppContent loggedIn={loggedIn} setLoggedIn={setLoggedIn} role={role} setRole={setRole} />
        </Router>
    );
}

export default App;
