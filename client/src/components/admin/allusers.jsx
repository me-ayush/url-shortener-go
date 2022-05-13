import React, { useEffect, useState } from 'react'
import Loader from '../loader/loader';
import { useNavigate, Link } from 'react-router-dom'
import Header from '../navbar'
import { useCookies } from 'react-cookie';
import swal from 'sweetalert';



const Allusers = () => {
  let navigate = useNavigate()
  const [isloading, setLoading] = useState(false)
  const [data, setdata] = useState(false)
  const [updateuser, setUpdateuser] = useState()
  const [cookies, setCookies] = useCookies(['user']);

  const token = JSON.parse(localStorage.getItem('token'))
  const user_id = JSON.parse(localStorage.getItem("id"))
  const user = JSON.parse(localStorage.getItem("user"))

  const getUsers = async () => {
    if (!token || !user_id || !user && cookies._jwt) {
      swal("Login First", "", "error").then(() => {
        navigate("/login")
      });
    } else {
      setLoading(true)
      try {
        const res = await fetch('/admin/users', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "token": token,
            "id": user_id
          }
        });
        setLoading(false)
        const data = await res.json();
        if (res.status !== 200 || !data) {
          swal(data.error, "", "error");
          localStorage.clear()
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
    getUsers()
  }, [])

  async function handleDelete(e) {
    var id = e.target.value.slice(1, e.target.value.length)
    setLoading(true)
    const res = await fetch(`/admin/users/delete/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "token": token,
        "id": user_id
      }
    });
    setLoading(false)
    const data = await res.json()
    if (res.status != 200 || !data) {
      swal(data.error, "", "error")
    } else {
      swal("User Deleted", "", "success")
      getUsers()
    }

  }


  const handleView = (e) => {
    let id = e.target.value
    setUpdateuser(data[id.slice(24, id.length)])
  }

  const handleSave = async (e) => {
    setLoading(true)
    const res = await fetch(`admin/users/${e.target.value}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "token": token,
        "id": user_id,
      },
      body: JSON.stringify({
        first_name: updateuser.first_name,
        last_name: updateuser.last_name,
        email: updateuser.email,
        user_type: updateuser.user_type
      })
    })
    setLoading(false)
    const data = await res.json()
    if (res.status != 200 || !data) {
      swal(data.error, "", "error");
    } else {
      swal("User Updated", "", "success");
      getUsers()
    }

  }

  function handleFirstNameChange(e) {
    setUpdateuser(prevState => {
      return { ...prevState, first_name: e.target.value }
    })
  }
  function handleLastNameChange(e) {
    setUpdateuser(prevState => {
      return { ...prevState, last_name: e.target.value }
    })
  }
  function handleEmailChange(e) {
    setUpdateuser(prevState => {
      return { ...prevState, email: e.target.value }
    })
  }
  function handleUserType(e) {
    setUpdateuser(prevState => {
      return { ...prevState, user_type: e.target.value }
    })
  }

  return (
    <>
      <Header />
      {isloading && <Loader />}
      <div className="container mt-5" style={{ "overflow": "auto" }}>
        <h2 className='text-center'>User Data</h2>
        <table className="table table-striped table-hover w-100 text-center">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Email</th>
              <th scope="col">User Type</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {
              data && data.map((d, key) => {
                return (
                  <tr key={d.user_id}>

                    <td>{key + 1}</td>
                    <td>{d.first_name}</td>
                    <td>{d.last_name}</td>
                    <td>{d.email}</td>
                    {/* <td>{d.user_id}</td> */}
                    {
                      d.user_type === 'ADMIN' ?
                        <td>Admin</td> :
                        <td>User</td>
                    }
                    <td className='column-8'>
                      <button className='btn btn-info  mx-1 my-1' value={[d._id + key]} defaultValue={d._id} data-bs-toggle="modal" data-bs-target={`#view${key + 1}`} onClick={handleView}>View</button>
                      <button className='btn btn-danger  mx-1 my-1' value={key + d._id} onClick={handleDelete}>Delete</button>


                      <div className="modal fade" id={`view${key + 1}`} tabIndex="-1" aria-labelledby={`viewDetail${key + 1}`} aria-hidden="true">
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title" id={`viewDetail${key + 1}`}>Edit User</h5>
                              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">

                              <div className="input-group mb-1">
                                <span className="input-group-text" id="inputGroup-sizing-default">First Name</span>
                                <input type="text" className="form-control" defaultValue={d.first_name} onChange={handleFirstNameChange} />
                              </div>
                              <div className="input-group mb-1">
                                <span className="input-group-text" id="inputGroup-sizing-default">Last Name</span>
                                <input type="text" className="form-control" defaultValue={d.last_name} onChange={handleLastNameChange} />
                              </div>
                              <div className="input-group mb-1">
                                <span className="input-group-text" id="inputGroup-sizing-default">Email</span>
                                <input type="text" className="form-control" defaultValue={d.email} onChange={handleEmailChange} />
                              </div>
                              <div className="input-group mb-3">
                                <label className="input-group-text" htmlFor="usertype">User Type</label>
                                <select className="form-select" id="usertype" onChange={handleUserType}>
                                  {d.user_type == "ADMIN" ? <>
                                    <option value="ADMIN">Admin</option>
                                    <option value="USER">User</option>
                                  </> :
                                    <>
                                      <option value="USER">User</option>
                                      <option value="ADMIN">Admin</option>
                                    </>
                                  }
                                </select>
                              </div>

                            </div>
                            <div className="modal-footer">
                              <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Close</button>
                              <button type="button" className="btn btn-success" value={d._id} onClick={handleSave}>Save Changes</button>
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


export default Allusers