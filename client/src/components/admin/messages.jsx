import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../navbar'
import { useCookies } from 'react-cookie';
import swal from 'sweetalert';

export const Message = () => {

  let navigate = useNavigate()
  const [data, setdata] = useState(false)
  const [cookies, setCookies] = useCookies(['user']);

  const token = JSON.parse(localStorage.getItem('token'))
  const user_id = JSON.parse(localStorage.getItem("id"))
  const user = JSON.parse(localStorage.getItem("user"))

  const getMessages = async () => {

    if (!token || !user_id || !user && cookies._jwt) {
      window.alert('First Login...')
      navigate("/login")
    } else {
      try {
        const res = await fetch('/admin/message', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "token": token,
            "id": user_id
          }
        });
        const data = await res.json();
        if (res.status !== 200 || !data) {
          swal(data.error, "", "error");
          navigate("/")
        } else {
          setdata(data)
        }
      } catch (err) {
        alert(err);
      }
    }
  }

  useEffect(() => {
    getMessages()
    // console.log(data)
  }, [])

  const handleDelete = async(e) =>{
    // console.log(e.target.value)
    try{
    const res = await fetch(`/admin/message/${e.target.value}`,{
      method:"POST",
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "token": token,
        "id": user_id
      }
    })
    
    const data = await res.json();
        if (res.status !== 200 || !data) {
          swal(data.error, "", "error");
        } else {
          swal("Message Deleted", "", "success");
          getMessages()
        }
      }catch(e){
        swal("Something Went Wrong", "", "error");
        // setdata(data)
      }
  }

  return (
    <>
      <Header />
      <div className="container mt-5">
        <h2 className='text-center'>All Messages</h2>
        <table className="table  table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Subject</th>
              <th scope="col">Message</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {
              data && data.map((d, key) => {
                return (
                  <tr key={key}>
                    <td>{key + 1}</td>
                    <td>{d.name}</td>
                    <td>{d.email}</td>
                    <td>{d.subject}</td>
                    <td>{d.message}</td>
                    <td>
                      <div>
                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target={`#view${key + 1}`}>View</button>
                        <button className='btn btn-danger  mx-1' onClick={handleDelete} value={d._id}>Delete</button>


                        <div className="modal fade" id={`view${key + 1}`} tabIndex="-1" aria-labelledby={`viewDetail${key + 1}`} aria-hidden="true">
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title" id={`viewDetail${key + 1}`}>Message From: {d.name}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                              <div className="modal-body">

                                <div className="input-group mb-1">
                                  <span className="input-group-text" id="inputGroup-sizing-default">Name</span>
                                  <input type="text" className="form-control" disabled value={d.name} />
                                </div>
                                <div className="input-group mb-1">
                                  <span className="input-group-text" id="inputGroup-sizing-default">Email</span>
                                  <input type="text" className="form-control" disabled value={d.email} />
                                </div>
                                <div className="input-group mb-1">
                                  <span className="input-group-text" id="inputGroup-sizing-default">Subject</span>
                                  <input type="text" className="form-control" disabled value={d.subject} />
                                </div>
                                <div className="input-group mb-1">
                                  <span className="input-group-text" id="inputGroup-sizing-default">Message</span>
                                  <input type="text" className="form-control" disabled value={d.message} />
                                </div>
                                
                              </div>
                              <div className="modal-footer">
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Close</button>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </td>
                  </tr>
                )
              }
              )
            }
          </tbody>
        </table>
      </div>
    </>
  )
}


