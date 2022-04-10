import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../navbar/index'
import { useNavigate } from 'react-router-dom'
import Logo from './img.svg'

const Signup = () => {
    const [first, setFirst] = useState('')
    const [second, setSecond] = useState('')
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [cpass, setCpass] = useState('')

    const handleSignup = (e) => {
        e.preventDefault();


        // (function () {
        //     'use strict'

            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            // var forms = document.querySelectorAll('.needs-validation')

            // Loop over them and prevent submission
        //     Array.prototype.slice.call(forms)
        //         .forEach(function (form) {
        //             form.addEventListener('submit', function (event) {
        //                 if (!form.checkValidity()) {
        //                     event.preventDefault()
        //                     event.stopPropagation()
        //                 }
        //                 form.classList.add('was-validated')
        //                 console.log(form.classList)
        //             }, false)
        //         })
        // })()



        let f = 0
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
            document.getElementById('email').classList.remove('is-invalid')
        }else{
            document.getElementById('email').classList.add('is-invalid')
            f = 1
        }
        
        if(first == ''){
            document.getElementById('firstname').classList.add('is-invalid')
            f = 1
        }else{
            document.getElementById('firstname').classList.remove('is-invalid')
        }

        if(second == ''){
            document.getElementById('lastname').classList.add('is-invalid')
            f = 1
        }else{
            document.getElementById('lastname').classList.remove('is-invalid')
        }

        if(pass == ''){
            document.getElementById('password').classList.add('is-invalid')
            f = 1
        }else{
            document.getElementById('password').classList.remove('is-invalid')
        }

        if(cpass == '' || cpass!=pass){
            document.getElementById('cpassword').classList.add('is-invalid')
            f = 1
        }else{
            document.getElementById('cpassword').classList.remove('is-invalid')
        }

        if(f == 1){
            return
        }

        console.log(first, second, email, pass, cpass)
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
                                        <h3>Create a New Account</h3>
                                    </div>
                                    <form class="row g-3 " method='post' onSubmit={(e) => { handleSignup(e) }}>
                                        <div class="col-md-6 form-floating px-1 ">
                                            <input type="text" className="form-control " id="firstname" placeholder="First Name" onChange={(e) => { setFirst(e.target.value) }} />
                                            <label htmlFor="firstname">First Name</label>
                                            <div class="invalid-feedback">
                                                Please Enter First Name.
                                            </div>
                                            <div class="valid-feedback">
                                                Looks good!
                                            </div>
                                        </div>
                                        <div class="col-md-6 form-floating px-1">
                                            <input type="text" className="form-control " id="lastname" placeholder="Last Name" onChange={(e) => { setSecond(e.target.value) }} />
                                            <label htmlFor="lastname">Last Name</label>
                                            <div class="invalid-feedback">
                                                Please Enter Last Name.
                                            </div>
                                        </div>
                                        <div class="col-12 form-floating px-1">
                                            <input type="text" class="form-control" id="email" placeholder="name@domain.com" onChange={(e) => { setEmail(e.target.value) }} />
                                            <label for="email" class="form-label">Email</label>
                                            <div class="invalid-feedback">
                                                Please Enter Correct Email.
                                            </div>
                                        </div>
                                        <div class="col-12 form-floating px-1">
                                            <input type="password" class="form-control" id="password" placeholder="Password" onChange={(e) => { setPass(e.target.value) }} />
                                            <label for="password" class="form-label">Password</label>
                                            <div class="invalid-feedback">
                                                Please Enter Password.
                                            </div>
                                        </div>
                                        <div class="col-12 form-floating px-1">
                                            <input type="password" class="form-control" id="cpassword" placeholder="Password" onChange={(e) => { setCpass(e.target.value) }} />
                                            <label for="cpassword" class="form-label">Confirm Password</label>
                                            <div class="invalid-feedback">
                                                Password do Not Matched.
                                            </div>
                                        </div>

                                        <div class="col-12 form-floating px-1">
                                            <button type="submit" class="btn py-3 btn-primary btn-block w-100">Create My Account</button>
                                        </div>
                                        <span className="d-block text-left my-4 text-muted">&mdash; Already have an account? &mdash; <Link className='text-decoration-none' to="/login">Login Now</Link> </span>

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

export default Signup