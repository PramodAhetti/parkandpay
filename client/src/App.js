import { BrowserRouter,Route,Routes } from "react-router-dom";

import Navbar from './components/nav'
import Home from './components/home'
import Login from './components/login'
import Signup from './components/signup'
import About from "./components/about";


function App() {
  return (
       <div className="mainbox">
        <BrowserRouter className='mainbox'>
          <Navbar className="navbox"></Navbar>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login/>} />
              <Route path='/signup' element={<Signup/>} />
              <Route path='/about' element={<About/>} />
            </Routes>
        </BrowserRouter>
        </div>
  );
}

export default App;
