import React, { useState } from 'react'
import Header from '../navbar'
import './home.scss'

import ReactDOM from 'react-dom';
import swal from 'sweetalert';


const Home = () => {

  const [url, setUrl] = useState('')
  const [custom, setCustom] = useState('')
  const domain = "http://localhost:3001/"

  
	var token = ''
	var user_id = ''
	token = JSON.parse(localStorage.getItem('token'))
	user_id = JSON.parse(localStorage.getItem("id"))


  const handleAdd = async (e) => {
    e.preventDefault()

    var res = ''

    if (!token || !user_id) {
    res = await fetch("/api/v1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "url": url,
        "short": custom,
      })
    });
  }else{
    res = await fetch(`/user/${user_id}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "token": token
      },
      body: JSON.stringify({
        "url": url,
        "short": custom,
      })
    });

  }

    const data = await res.json();
    if (res.status != 200 || !data) {
      swal(data.error, "", "error");
    } else {
      swal("Short Added", `Link: ${domain+data.short}`, "success");
    }

  }

  return (
    <>
      <Header />

      <section id='home'>

        <div className="banner">
          <div className="container">
            <div className="row">
              <div className="col-md-8 mt-5 pt-5 offset-md-2">
                <div className="header-text caption text-center">
                  <h2 >Add Your URL Now</h2>
                </div>
                <form method='POST' id='suggestion_form' onSubmit={(e) => handleAdd(e)} autoComplete="false">
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group first">
                        <div className="form-floating mb-3">
                          <input type="text" className="form-control " id="url" placeholder="Enter URL" onChange={(e) => { setUrl(e.target.value) }} />
                          <label htmlFor="url">Enter URL</label>
                        </div>
                      </div>
                    </div>
                    <div className="col">

                      <div className="row">
                        <div className=" col-sm-12 col-md-6">
                          <div className="form-group last mb-4">
                            <div className="form-floating mb-3">
                              <input type="text" className="form-control" id="custom" placeholder="Custom Short (Optional)" onChange={(e) => { setCustom(e.target.value) }} />
                              <label htmlFor="custom">Custom Short (Optional)</label>
                            </div>
                          </div>
                        </div>
                        <div className="col">
                          <button className='btn btn-success mb-3 p-3 w-100'>Add This URL</button>
                        </div>
                      </div>

                    </div>


                  </div>

                </form>


              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}

export default Home