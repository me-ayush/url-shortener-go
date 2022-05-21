import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie';
import swal from 'sweetalert';

import { handleSearch, sortData } from './helpers';
import { UserContext } from '../../UserContext';
import Loader from '../loader/loader';
import Header from '../navbar'

const Allusers = () => {
  let navigate = useNavigate()
  const userContext = useContext(UserContext)
  const [isloading, setLoading] = useState(false)
  const [data, setdata] = useState(false)
  const [updateuser, setUpdateuser] = useState()

  const [filteredData, setFilteredData] = useState(data);
  const [searchField, setSearchField] = useState("");
  const [sortedField, setSortedField] = useState();
  const [sortBy, setSortBy] = useState(0);

  const token = userContext.token[0]
  const user_id = userContext.id[0]

  const getUsers = async () => {
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
        localStorage.clear()
        navigate("/")
      } else {
        setdata(data)
        setFilteredData(data)
      }
    } catch (err) {
      swal(err, "", "error");
      setLoading(false)
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
      swal("User Deleted", "", "success").then(() => { getUsers() })
    }

  }


  const handleView = (e) => {
    let id = e.target.value
    setUpdateuser(data[id.slice(24, id.length)])
  }

  const handleSave = async (e) => {
    setLoading(true)
    const res = await fetch(`/admin/users/${e.target.value}`, {
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
        user_type: updateuser.user_type,
        isactivated: Number(updateuser.is_activated)
      })
    })
    setLoading(false)
    const data = await res.json()
    if (res.status != 200 || !data) {
      swal(data.error, "", "error");
    } else {
      swal("User Updated", "", "success").then(() => { getUsers() });
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
  function handleisActive(e) {
    setUpdateuser(prevState => {
      return { ...prevState, is_activated: e.target.value }
    })
  }

  const handleChange = (e) => {
    let x = handleSearch(e, searchField, data)
    if (x != undefined) {
      setFilteredData(x)
    }
  }

  const handelSorting = (field) => {
    if (field == sortedField) {
      setSortBy(sortBy => !sortBy)
    } else {
      setSortBy(1)
    }
    setSortedField(field)
    setFilteredData(sortData(field, filteredData, sortBy))
  }

  return (
    <>
      <Header />
      {isloading && <Loader />}
      <h2 className='text-center mt-5'>User Data</h2>
      <div className="container mt-1" style={{ "overflow": "auto" }}>
        {data &&
          <form className='mt-2'>
            <div className='row'>
              <div className="col-sm-12 col-md-2 mb-2">
                <select className="form-select shadow-none" onChange={(e) => { setSearchField(e.target.value.toLowerCase()) }} defaultValue={'DEFAULT'} >
                  <option value="DEFAULT" disabled>Select Filter</option>
                  <option value="first_name">First Name</option>
                  <option value="last_name">Last Name</option>
                  <option value="email">Email</option>
                  <option value="user_type">User Type</option>
                  <option value="is_activated">Status</option>
                </select>
              </div>
              <div className="col-sm-12 col-md-9">
                <input type="search" className='form-control shadow-none' placeholder="Type Something" onChange={(e) => handleChange(e)} />
              </div>
            </div>
          </form>
        }
        <table className="table table-striped table-hover w-100 text-center">
          <thead>
            <tr>
              <th scope="col"><button className='btn btn-none p-0 m-0 shadow-none' onClick={() => handelSorting(null)}>#</button></th>
              <th scope="col"><button className='btn btn-none p-0 m-0 shadow-none' onClick={() => handelSorting('first_name')}>First Name</button></th>
              <th scope="col"><button className='btn btn-none p-0 m-0 shadow-none' onClick={() => handelSorting('last_name')}>Last Name</button></th>
              <th scope="col"><button className='btn btn-none p-0 m-0 shadow-none' onClick={() => handelSorting('email')}>Email</button></th>
              <th scope="col"><button className='btn btn-none p-0 m-0 shadow-none' onClick={() => handelSorting('user_type')}>User Type</button></th>
              <th scope="col"><button className='btn btn-none p-0 m-0 shadow-none' onClick={() => handelSorting('is_activated')}>Status</button></th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {
              filteredData && filteredData.map((d, key) => {
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
                    {
                      d.is_activated == '1' ?
                        <td>Activated</td> :
                        <td>Deactivated</td>
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

                              <div className="input-group mb-3">
                                <label className="input-group-text" htmlFor="usertype">State</label>
                                <select className="form-select" id="isactivated" onChange={handleisActive}>
                                  {d.is_activated == 1 ? <>
                                    <option value={1}>Activated</option>
                                    <option value={0}>Deactivated</option>
                                  </> :
                                    <>
                                      <option value={0}>Deactivated</option>
                                      <option value={1}>Activated</option>
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