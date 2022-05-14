import React, { useState } from 'react'
import Loader from '../loader/loader';
import Header from '../navbar'
import './css/contact.scss'
import swal from 'sweetalert';


const Contact = () => {
  const [isloading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [subject, setSubject] = useState('')


  const handleContact = async (e) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/contact', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "name": name,
        "email": email,
        "subject": subject,
        "message": message
      })
    })
    const data = await res.json()
    setLoading(false)
    if (res.status != 200 || !data) {
      swal(data.error, "", "error");
    } else {
      swal("Message Recieved", "", "success")
    }
  }

  return (
    <>
      <Header />
      {isloading && <Loader />}
      <div className='contact-con'>
        <section className="ftco-section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10 col-md-12">
                <div className="wrapper">
                  <div className="row no-gutters">
                    <div className="col-md-7 d-flex align-items-stretch">
                      <div className="contact-wrap w-100 p-md-5 p-4">
                        <h3 className="mb-4">Get in touch</h3>
                        <div id="form-message-warning" className="mb-4"></div>
                        <div id="form-message-success" className="mb-4">
                          Your message was sent, thank you!
                        </div>
                        <form method="POST" id="contactForm" name="contactForm" onSubmit={(e) => { handleContact(e) }}>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group first">
                                <div className="form-floating mb-3">
                                  <input type="text" className="form-control " id="Name" placeholder="Name" onChange={(e) => { setName(e.target.value) }} />
                                  <label htmlFor="Name">Name</label>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group first">
                                <div className="form-floating mb-3">
                                  <input type="text" className="form-control " id="Email" placeholder="name@example.com" onChange={(e) => { setEmail(e.target.value) }} />
                                  <label htmlFor="Email">Email</label>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="form-group first">
                                <div className="form-floating mb-3">
                                  <input type="text" className="form-control " id="Subject" placeholder="name@example.com" onChange={(e) => { setSubject(e.target.value) }} />
                                  <label htmlFor="Subject">Subject</label>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="form-group first">
                                <div className="form-floating mb-3">
                                  <textarea name="message" className="form-control" id="Message" cols={30} rows={7} placeholder="Message" onChange={(e) => { setMessage(e.target.value) }}></textarea>
                                  <label htmlFor="Message">Message</label>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="form-group">
                                <input type="submit" value="Send Message" className="btn btn-primary" />
                                <div className="submitting"></div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="col-md-5 d-flex align-items-stretch">
                      <div className="info-wrap bg-primary w-100 p-lg-5 p-4">
                        <h3 className="mb-4 mt-md-4">Contact us</h3>
                        <div className="dbox w-100 d-flex align-items-start">
                          <div className="icon d-flex align-items-center justify-content-center">
                            <span className="fa fa-map-marker"></span>
                          </div>
                          <div className="text pl-3 pt-0 ps-2">
                            <p><span>Address:</span> Kanpur, Uttar Pradesh - 208025</p>
                          </div>
                        </div>
                        <div className="dbox w-100 d-flex align-items-center">
                          <div className="icon d-flex align-items-center justify-content-center">
                            <span className="fa fa-phone"></span>
                          </div>
                          <div className="text pl-3 ps-2">
                            <p><span>Phone:</span> <a href="tel://1234567920">+91 1234567890</a></p>
                          </div>
                        </div>
                        <div className="dbox w-100 d-flex align-items-center">
                          <div className="icon d-flex align-items-center justify-content-center">
                            <span className="fa fa-paper-plane"></span>
                          </div>
                          <div className="text pl-3 ps-2">
                            <p><span>Email:</span> <a href="mailto:info@yoursite.com">info@urlshortener.com</a></p>
                          </div>
                        </div>
                        <div className="dbox w-100 d-flex align-items-center">
                          <div className="icon d-flex align-items-center justify-content-center">
                            <span className="fa fa-globe"></span>
                          </div>
                          <div className="text pl-3 ps-2">
                            <p><span>Website</span> <a href="#">urlshortener.com</a></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Contact