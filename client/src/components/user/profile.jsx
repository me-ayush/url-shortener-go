import React, { useState, useEffect } from 'react'
import Header from '../navbar'
import { useNavigate, Link } from 'react-router-dom'

const Profile = () => {
  const [detail, setDetail] = useState({})

  const check_auth = async () => {
    const token = JSON.parse(localStorage.getItem('token'))
    const user_id = JSON.parse(localStorage.getItem("id"))

    if (!token || !user_id) {
      window.alert('First Login...')
      navigate("/login")
    } else {
      try {
        const res = await fetch(`/user/${user_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "token": token,
          }
        });

        const data = await res.json();
        if (res.status === 500 || !data) {
          window.alert(data.error)
          // navigate("/login")
        } else {
          setDetail({
            first: data.first_name,
            last: data.last_name,
            email: data.email,
            type: data.user_type,
          })
        }
      } catch (err) {
        console.warn(err);
      }

    }

  }

  useEffect(() => {
    check_auth()
    console.log(detail)
  }, [])


  return (
    <>
      <Header />
      <div className="container rounded bg-white mt-5 mb-5">
        <div className="row">
          <div className="col-md-3 border-right">
            <div className="d-flex flex-column align-items-center text-center p-3 py-5"><img className="rounded-circle mt-5" width="150px" src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" /><span className="font-weight-bold">{detail.first + " " +detail.last}</span><span className="text-black-50">{detail.email}</span><span> </span></div>
          </div>
          <div className="col-md-9 border-right">
            <div className="p-3 py-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-right">Profile Settings</h4>
              </div>
              <div className="row mt-2">
                <div className="col-md-6"><label className="labels">First Name</label><input type="text" className="form-control" placeholder="First name" value={detail.first}/></div>
                <div className="col-md-6"><label className="labels">Last Name</label><input type="text" className="form-control" placeholder="Last Name" value={detail.last}/></div>
              </div>
              <div className="row mt-3">
                <div className="col-md-12"><label className="labels">Email ID</label><input type="text" className="form-control" placeholder="Email ID" value={detail.email}/></div>
              </div>
              {/* <div className="row mt-3">
                <div className="col-md-6"><label className="labels">Country</label><input type="text" className="form-control" placeholder="Country" /></div>
                <div className="col-md-6"><label className="labels">State/Region</label><input type="text" className="form-control" placeholder="State" /></div>
              </div> */}
              <div className="mt-5 text-center"><button className="btn btn-primary profile-button" type="button">Save Profile</button></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile