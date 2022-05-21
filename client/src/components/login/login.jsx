import React, { useContext, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate, Link } from 'react-router-dom'
import swal from 'sweetalert';

import { UserContext } from '../../UserContext';
import Header from '../navbar/index'
import Loader from '../loader/loader';
import Logo from './img.svg'



const Login = () => {
    const userContext = useContext(UserContext)
    const [isloading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const nav = useNavigate()
    const [cookies, setCookie, removeCookie] = useCookies(['user']);

    const handleLogin = async (e) => {
        e.preventDefault();
        let f = 0
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
            document.getElementById('floatingInput').classList.remove('is-invalid')
        }else{
            document.getElementById('floatingInput').classList.add('is-invalid')
            f = 1
        }

        if (password == '') {
            document.getElementById('floatingPassword').classList.add('is-invalid')
            f = 1
        } else {
            document.getElementById('floatingPassword').classList.remove('is-invalid')
        }
        if (f == 1) {
            return
        }
        setLoading(true)
        const res = await fetch('/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email, password: password
            })
        })

        const data = await res.json();
        setLoading(false)
        if (res.status != 200 || !data) {
            if(data.error=="Account Is Not Activated"){
                swal({
                    title: data.error,
                    icon: "error",
                    buttons:{
                        catch:{
                            text:"Activate Now",
                            value:true,
                        },
                        cancel: "I will do it later",
                    },
                  }).then((e)=>{
                      if(e){
                          nav('/auth/newcode')
                      }
                  });
            }else{
            swal("Login Error", data.error, "error");
            }
        } else {
            let x = JSON.stringify(data.user_id)
            userContext.id[1](x.slice(1, x.length - 1))

            x = JSON.stringify(data.first_name + ' ' + data.last_name)
            userContext.name[1](x.slice(1, x.length - 1))
            
            x = JSON.stringify(data.email)
            userContext.email[1](x.slice(1, x.length - 1))
            
            x = JSON.stringify(data.token)
            userContext.token[1](x.slice(1, x.length - 1))
            
            localStorage.setItem('user', JSON.stringify(data.first_name + ' ' + data.last_name))
            localStorage.setItem('id', JSON.stringify(data.user_id))
            localStorage.setItem('email', JSON.stringify(data.email))
            localStorage.setItem('token', JSON.stringify(data.token))
            
            if(data.user_type==="ADMIN"){
                userContext.isAdmin[1](true)
                setCookie('_jwt', Math.floor((Math.random() * 1000000) + 1), { path: '/' });
            }else{
                userContext.isAdmin[1](false)
                removeCookie('_jwt')
            }

            swal("Login Successfull", '', "success").then((e)=>{
                nav('/')
              });
        }
    }

    return (
        <>
            <Header />
            {isloading && <Loader />}
            <div className="content d-flex justify-content-center align-items-center mt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <img src={Logo} alt="Image" className="img-fluid" />
                        </div>
                        <div className="col-md-6 contents">
                            <div className="row justify-content-center">
                                <div className="col-md-8">
                                    <div className="mb-4">
                                        <h3>Sign In</h3>
                                        <p className="mb-4">Welcome Back User</p>
                                    </div>
                                    <form method='POST' onSubmit={(e) => handleLogin(e)}>
                                        <div className="form-group first">
                                            <div className="form-floating mb-3">
                                                <input type="text" className="form-control " id="floatingInput" placeholder="name@example.com" onChange={(e) => { setEmail(e.target.value) }} />
                                                <label htmlFor="floatingInput">Email address</label>
                                            </div>
                                        </div>

                                        <div className="form-group last mb-4">
                                            <div className="form-floating mb-3">
                                                <input type="password" className="form-control" id="floatingPassword" placeholder="Password" onChange={(e) => { setPassword(e.target.value) }} />
                                                <label htmlFor="floatingPassword">Password</label>
                                            </div>
                                        </div>
                                        
                                        <button type="submit" value="Log In" className="btn btn-block btn-primary" > Log In</button>
                                        <span className="d-block text-left my-4 text-muted">&mdash; Don't have an account? &mdash; <Link className='text-decoration-none' to="/register">Create a Account</Link> </span>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login