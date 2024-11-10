import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';  
import { Navbar } from './components/Navbar/Navbar';
import { Home } from './components/Home/Home';
import { Login } from './components/Login/Login';
import {Register} from "./components/Login/Register";


function App() {
  return (
    <>
      <Router>
        <Navbar/>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
          </Routes>
      </Router>      
    </>
  );
}
export default App;
