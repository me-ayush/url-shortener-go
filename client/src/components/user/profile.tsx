import React, { useState, useEffect } from 'react'
import Loader from '../loader/loader';
import Header from '../navbar'
import { useNavigate, Link } from 'react-router-dom'
import swal from 'sweetalert';
import SidebarUser from './sidebar/sidebar';


const Profile = () => {
  const nav = useNavigate()
  const [isloading, setLoading] = useState(false)
  const [detail, setDetail] = useState({
    first: "",
    email: "",
    last: "",
    type: "",
  })
  

  const token = JSON.parse(localStorage.getItem('token'))
  const user_id = JSON.parse(localStorage.getItem("id"))
  const user = JSON.parse(localStorage.getItem("user"))

  const handleFirstName = (e) => {
    setDetail(prevState => {
      return { ...prevState, first: e.target.value }
    })
  }
  const handleLastName = (e) => {
    setDetail(prevState => {
      return { ...prevState, last: e.target.value }
    })
  }
  const handleEmail = (e) => {
    setDetail(prevState => {
      return { ...prevState, email: e.target.value }
    })
  }

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true)
    const res = await fetch(`/user/${user_id}/updateprofile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "token": token
      },
      body: JSON.stringify({
        "email": detail.email,
        "first_name": detail.first,
        "last_name": detail.last,
      })
    })
    setLoading(false)
    const data = await res.json()
    if (res.status != 200 || !data) {
      swal(data.msg, "", "error");
    } else {
      swal("User Updated Successfully", "", "success");
    }
  }


  const check_auth = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/user/${user_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "token": token,
        }
      });

      const data = await res.json();
      if (res.status != 200 || !data) {
        swal(data.error, "", "error");
        localStorage.clear()
        nav("/login")
      } else {
        setDetail({
          first: data.first_name,
          last: data.last_name,
          email: data.email,
          type: data.user_type,
        })
      }
    } catch (err) {
      // console.warn(err);
    }

    setLoading(false)

  }

  useEffect(() => {
    if (!token || !user_id || !user || token == '' || user_id == '' || user == '') {
      localStorage.clear()
      swal("Wrong Credentials", "", "error");
      nav("/login")
    } else {
      check_auth()
    }
  }, [])


  return (
    <>
      {/* <Header /> */}
      {isloading && <Loader />}

      {/* <div id="profile-wrapper"> */}
        {/* <div id="wrapper"> */}
          {/* <SidebarUser /> */}


          {/* <div id="page-content-wrapper"> */}
            {/* <div className="container-fluid"> */}
              {/* <div className="row"> */}
                {/* <div className="col-lg-12"> */}




                  <form method="POST">
                    <div className="container rounded bg-white mt-5 mb-5">
                      <div className="row">
                        <div className="col-md-3 border-right">
                          <div className="d-flex flex-column align-items-center text-center p-3 py-5"><img className="rounded-circle mt-5" width="150px" src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" /><span className="font-weight-bold">{detail.first + " " + detail.last}</span><span className="text-black-50">{detail.email}</span><span> </span></div>
                        </div>
                        <div className="col-md-9 border-right">
                          <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <h4 className="text-right">Profile Settings</h4>
                            </div>
                            <div className="row mt-2">
                              <div className="col-md-6"><label className="labels">First Name</label><input type="text" className="form-control" placeholder="First name" defaultValue={detail && detail.first} onChange={handleFirstName} /></div>
                              <div className="col-md-6"><label className="labels">Last Name</label><input type="text" className="form-control" placeholder="Last Name" defaultValue={detail && detail.last} onChange={handleLastName} /></div>
                            </div>
                            <div className="row mt-3">
                              <div className="col-md-12"><label className="labels">Email ID</label><input type="text" className="form-control" placeholder="Email ID" defaultValue={detail && detail.email} disabled /></div>
                            </div>
                            {/* <div className="row mt-3">
                <div className="col-md-6"><label className="labels">Country</label><input type="text" className="form-control" placeholder="Country" /></div>
                <div className="col-md-6"><label className="labels">State/Region</label><input type="text" className="form-control" placeholder="State" /></div>
              </div> */}
                            <div className="mt-5 text-center"><button className="btn btn-primary profile-button" type="submit" onClick={updateProfile}>Save Profile</button></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>






                {/* </div>
              </div>
            </div>
          </div>

        </div>
      </div> */}
    </>
  )
}

export default Profile