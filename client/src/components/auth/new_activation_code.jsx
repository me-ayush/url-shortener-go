import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.scss'

const NewActivationCode = () => {
  const nav = useNavigate()
  const [email, setEmail] = useState(false)
  const [show, setShow] = useState(true)
  const [countDown, setCountDown] = useState(0);
  const [runTimer, setRunTimer] = useState(false);

  const togglerTimer = () => setRunTimer((t) => !t);
  const seconds = String(countDown % 60).padStart(2, 0);
  const minutes = String(Math.floor(countDown / 60)).padStart(2, 0);


  const handleCancel = () => {
    nav('/signin')
  }

  const handleRequest = async (e) => {
    e.preventDefault();
    const path = import.meta.env.VITE_AUTH_NEW_CODE

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      document.getElementById('floatingInput').classList.remove('is-invalid')
    } else {
      document.getElementById('floatingInput').classList.add('is-invalid')
      return
    }

    const res = await fetch(`authentication/req_new_code/${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    })
    const data = await res.json();
    if (res.status != 200 || !data) {
      const finalSentence = data.error.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
      swal({
        title: finalSentence,
        text: "",
        icon: "error",
        button: "Try Again",
      });
    } else {
      swal({
        title: "Activation Link Sent",
        icon: "success",
        text: "",
        buttons:{
            catch:{
                text:"Login now",
                value:true,
            },
            cancel: "Resend Link",
        },
      }).then((e)=>{
          if(e){
              nav('/signin')
          }
      });
      
    setShow(false)
    togglerTimer()
    localStorage.setItem("flag", "1")
    }
  }

  useEffect(() => {
    let timerId;

    if (runTimer) {
      setCountDown(60 * 1);
      timerId = setInterval(() => {
        setCountDown((countDown) => countDown - 1);
      }, 1000);
    } else {
      clearInterval(timerId);
    }

    return () => clearInterval(timerId);
  }, [runTimer]);

  useEffect(() => {

    if (countDown < 0 && runTimer) {
      localStorage.setItem("flag", "0")
      setRunTimer(false);
      setShow(true)
      setCountDown(0);
    }
  }, [countDown, runTimer]);



  return (
    <>
      <div id='new_activation_code_req'>

        <div className="container">
          <div className="row"><img src="https://iephosting.com/app/views/client/bootstrap/images/graphic8.svg" id="imageAsBackground" alt="" /></div>
          <div className="row align-items-center justify-content-center" style={{ height: '100vh', overflow: 'hidden' }}>
            <div className="col-sm-12 col-md-8 col-lg-6 col-xl-4">
              <div className="card">
                <div className="card-body">
                  <h3 className="text-center">New Activation Code</h3>
                  <form id="registerForm">
                    <div className="form-floating mb-3">
                      <input type="text" className="form-control" id='floatingInput' placeholder="Input your Email" name="email" onChange={(e) => setEmail(e.target.value)} required />
                      <label htmlFor="userInput">Email</label>
                    </div>

                    <div className="text-center mb-5">
                      {show ?
                        <button className="btn btn-primary mt-2 mx-1" type="submit" onClick={handleRequest}>Request</button>
                        :
                        <button className="btn btn-primary mt-2 mx-1 disabled" type="submit">Wait for {minutes}:{seconds}</button>
                      }

                      <button className="btn btn-danger mt-2 mx-1" type="submit" onClick={handleCancel}>Cancel</button>
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