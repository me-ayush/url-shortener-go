import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import './static/css/bootstrap.min.css'
import './static/js/bootstrap.min.js'

import Loader from "./components/loader/loader";

import Geturl from "./components/static/Geturl";
import Home from './components/static/home'
import Contact from './components/static/contact'
import About from './components/static/about'

import Addurl from './components/user/addurl'
import Myurl from './components/user/myurl'
import Profile from './components/user/profile'
import ProfileIndex from './components/user/index'

import Allusers from './components/admin/allusers'
import Alllinks from './components/admin/alllinks'
import { Message } from "./components/admin/messages";

import Login from './components/login/login'
import Signup from './components/signup/signup'

import AuthIndex from "./components/auth/auth";
import NewActivationCode from "./components/auth/new_activation_code";
import Accountactivation from "./components/auth/accountvalidation";
import ResetPassword from "./components/auth/reset_pass";
import ProfileSettings from "./components/user/profile_settings";



function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>

        <Route path="/loader"  element={<Loader />} />

          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/connect" element={<Contact />} />

          <Route path="/addurl" element={<Addurl />} />
          <Route path="/myurl" element={<Myurl />} />
          <Route path="/profile/*" element={<ProfileIndex />} />

          <Route path="/allusers">
            <Route index element={<Allusers />} />
            <Route path=":user_id" element={<Allusers />} />
          </Route>
          <Route path="/alllinks" element={<Alllinks />} />
          <Route path="/messages" element={<Message />} />

          <Route path="/signin" element={<Login />} />
          <Route path="/register" element={<Signup />} />

          <Route path="auth" >
            <Route index element={<AuthIndex />} />
            <Route path="activate" >
              <Route path=":token" element={<Accountactivation />} />
            </Route>
            <Route path="resetpass" element={<ResetPassword />}/>
            <Route path="newcode" element={<NewActivationCode />}/>
          </Route>

          <Route exact path="*" >
            <Route path=":short" element={<Geturl />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
