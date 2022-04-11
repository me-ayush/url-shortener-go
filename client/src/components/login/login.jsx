import React, { useState } from 'react'
import Header from '../navbar/index'
import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom";
import Logo from './img.svg'
import swal from 'sweetalert';


const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const nav = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault();
        let f = 0
        // if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
        //     document.getElementById('floatingInput').classList.remove('is-invalid')
        // }else{
        //     document.getElementById('floatingInput').classList.add('is-invalid')
        //     f = 1
        // }

        if (password == '') {
            document.getElementById('floatingPassword').classList.add('is-invalid')
            f = 1
        } else {
            document.getElementById('floatingPassword').classList.remove('is-invalid')
        }
        if (f == 1) {
            return
        }


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
        // console.log(data)

        if (res.status != 200 || !data) {
            // window.alert(data.error);
            swal("Login Error", data.error, "error");
        } else {
            localStorage.setItem('user', JSON.stringify(data.first_name + ' ' + data.last_name))
            localStorage.setItem('id', JSON.stringify(data.user_id))
            localStorage.setItem('token', JSON.stringify(data.token))
            swal("Login Successfull", '', "success");
            nav('/')
        }
    }

    return (
        <>
            <Header />
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
                                        <span className="d-block text-left my-4 text-muted">&mdash; Don't have an account? &mdash; <Link className='text-decoration-none' to="/signup">Create a Account</Link> </span>
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