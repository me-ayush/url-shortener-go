import React, { useState } from 'react'
import './style.scss'

const NewActivationCode = () => {
  const [email, setEmail] = useState(false)

  const handleRequest = async(e) => {
    e.preventDefault();
    console.log(email)

  }

  return (
    <>
      <div id='new_activation_code_req'>

        <div className="container">
        <div className="row"><img src="https://iephosting.com/app/views/client/bootstrap/images/graphic8.svg" id="imageAsBackground" alt="" /></div>
          <div className="row align-items-center justify-content-center" style={{height:'100vh', overflow:'hidden'}}>
            <div className="col-sm-12 col-md-8 col-lg-6 col-xl-4">
              <div className="card">
                <div className="card-body">
                  <h3 className="text-center">New Activation Code</h3>
                  <form id="registerForm">
                    <div className="form-floating mb-3">
                      <input type="text" className="form-control" placeholder="Input your Email" name="email" required onChange={(e)=>setEmail(e.target.value)} />
                      <label htmlFor="userInput">Email</label>
                    </div>

                    <div className="text-center mb-5">
                      <button className="btn btn-outline-primary mt-2" type="submit" onClick={handleRequest}>Request</button>
                    </div>

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

export default NewActivationCode