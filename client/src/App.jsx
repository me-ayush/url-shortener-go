import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import './static/css/bootstrap.min.css'
import './static/js/bootstrap.min.js'

import Geturl from "./components//static/Geturl";
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
import { Message } from "./components/admin/messages";




function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/connect" element={<Contact />} />

          <Route path="/addurl" element={<Addurl />} />
          <Route path="/myurl" element={<Myurl />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/allusers">
            <Route index element={<Allusers />} />
            <Route path=":user_id" element={<Allusers />} />
          </Route>
          <Route path="/alllinks" element={<Alllinks />} />
          <Route path="/messages" element={<Message />} />

          <Route path="/sigin" element={<Login />} />
          <Route path="/register" element={<Signup />} />

          <Route exact path="*" >
            <Route path=":short" element={<Geturl />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
