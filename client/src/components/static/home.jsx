import React, { useState, useContext } from 'react'
import swal from 'sweetalert';

import { UserContext } from '../../UserContext';
import Loader from '../loader/loader'
import Header from '../navbar'
import './css/home.scss'

const Home = () => {
  const userContext = useContext(UserContext)
  const [isloading, setLoading] = useState(false)
  const [url, setUrl] = useState('')
  const [custom, setCustom] = useState('')
  const [days, setDays] = useState(10)
  const domain = import.meta.env.VITE_DOMAIN

  var token = ''
  var user_id = ''
  token = userContext.token[0]
  user_id = userContext.id[0]

  const handleAdd = async (e) => {
    e.preventDefault()

    const regex = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');

    if (!regex.test(url)) {
      swal("Invalid URL", "", "error").then(() => {
        toastSuccess("ok");
      });
      return
    }

    setLoading(true)
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
    } else {
      if (days <= 0 || isNaN(days)) {
        swal("Invalid Expirys Days", "", "warning");
        setLoading(false)
        return
      }
      res = await fetch(`/user/${user_id}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": token
        },
        body: JSON.stringify({
          "url": url,
          "short": custom,
          "days": days
        })
      });
    }

    const data = await res.json();
    if (res.status != 200 || !data) {
      swal(data.error, "", "error").then(() => {
      });
    } else {
      let link = domain + data.short
      // swal("Short Added", `Link: ${domain + data.short}`, "success");
      swal({
        title: "Link Added",
        text: `Link: ${domain + data.short}`,
        icon: "success",
        button: "Copy Link",
      }).then(() => {
        const text = document.createElement('textarea')
        text.value = link
        document.body.appendChild(text)
        text.select()
        document.execCommand('copy')
        document.body.removeChild(text)
      });
    }
    setLoading(false)
  }

  return (
    <>
      <Header />

      {isloading ? <Loader /> : null}

      <section id='home'>
        <div className="banner">
          <div className="container">
            <div className="row">
              <div className="col-md-8 mt-5 pt-5 offset-md-2">
                <div className="header-text caption text-center mt-5">
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

                        {userContext.name[0] &&
                          <>
                            <div className=" col-sm-12 col-md-6">
                              <div className="form-group last mb-4">
                                <div className="form-floating mb-3">
                                  <input type="text" className="form-control" id="custom" placeholder="Valid Upto (In Days)" onChange={(e) => { setDays(Number(e.target.value)) }} />
                                  {/* <input type="datetime-local" className="form-control" id="custom" placeholder="Valid Upto (In Days)" onChange={(e) => { setDays(Number(e.target.value)) }} /> */}
                                  <label htmlFor="custom">Valid Upto (In Days)</label>
                                </div>
                              </div>
                            </div>
                            <div className=" col-sm-12 col-md-6">
                              <div className="form-group last mb-4">
                                <div className="form-floating mb-3">
                                  {/* <input type="text" className="form-control" id="custom" placeholder="Valid Upto (In Days)" onChange={(e) => { setDays(Number(e.target.value)) }} /> */}
                                  <input type="datetime-local" className="form-control" id="custom-time" placeholder="Set Time (Optional)"  />
                                  <label htmlFor="custom">Set Time (Optional)</label>
                                </div>
                              </div>
                            </div>
                          </>
                        }

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