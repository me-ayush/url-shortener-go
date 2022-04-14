import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import './static/css/bootstrap.min.css'
import './static/js/bootstrap.min.js'

import Home from './components/static/home'
import Contact from './components/static/contact'
import About from './components/static/about'

import Addurl from './components/user/addurl'
import Myurl from './components/user/myurl'
import Profile from './components/user/profile'

import Allusers from './components/admin/allusers'
import Alllinks from './components/admin/alllinks'

import Login from './components/login/login'
import Signup from './components/signup/signup'




function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/addurl" element={<Addurl />} />
          <Route path="/myurl" element={<Myurl />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/allusers">
            <Route index element={<Allusers />} />
            <Route path=":user_id" element={<Allusers />} />
          </Route>
          <Route path="/alllinks" element={<Alllinks />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />


        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
