import React, { useEffect, useState } from 'react'
import { handleSearch, sortData } from './helpers';
import { useNavigate, Link } from 'react-router-dom'
import Loader from '../loader/loader';
import Header from '../navbar'
import { useCookies } from 'react-cookie';
import swal from 'sweetalert';

export const Message = () => {

  let navigate = useNavigate()
  const [isloading, setLoading] = useState(false)
  const [data, setdata] = useState(false)
  const [messages, setMessages] = useState(false)
  const [cookies, setCookies] = useCookies(['user']);

  const [filteredData, setFilteredData] = useState(data);
  const [searchField, setSearchField] = useState("");
  const [sortedField, setSortedField] = useState();
  const [sortBy, setSortBy] = useState(0);

  const token = JSON.parse(localStorage.getItem('token'))
  const user_id = JSON.parse(localStorage.getItem("id"))
  const user = JSON.parse(localStorage.getItem("user"))

  const getMessages = async () => {

    if (!token || !user_id || !user && cookies._jwt) {
      swal("Please Login", "", "error");
      navigate("/signin")
    } else {
      try {
        setLoading(true)
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
        setLoading(false)
        if (res.status !== 200 || !data) {
          swal(data.error, "", "error");
        } else {
          setMessages(data)
          setFilteredData(data)
          console.log(data)
          setdata(false)
        }
      } catch (err) {
        setLoading(false)
        setdata(true)
      }
    }
  }

  useEffect(() => {
    getMessages()
  }, [])

  const handleDelete = async (e) => {
    try {
      setLoading(true)
      const res = await fetch(`/admin/message/${e.target.value}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "token": token,
          "id": user_id
        }
      })

      const data = await res.json();
      setLoading(false)
      if (res.status !== 200 || !data) {
        swal(data.error, "", "error");
      } else {
        swal("Message Deleted", "", "success").then(() => { getMessages() });
      }
    } catch (e) {
      swal("Something Went Wrong", "", "error");
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    let x = handleSearch(e, searchField, messages)
    if(x != undefined){
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
      <div className="container mt-5">
        <h2 className='text-center'>All Messages</h2>
        {messages &&
          <form className='mt-2'>
            <div className='row'>
              <div className="col-sm-12 col-md-2 mb-2">
                <select className="form-select shadow-none" onChange={(e) => { setSearchField(e.target.value.toLowerCase()) }} defaultValue={'DEFAULT'} >
                  <option value="DEFAULT" disabled>Select Filter</option>
                  <option value="email">Email</option>
                  <option value="subject">Subject</option>
                  <option value="name">Name</option>
                </select>
              </div>
              <div className="col-sm-12 col-md-9">
                <input type="search" className='form-control shadow-none' placeholder="Type Something" onChange={(e) => handleChange(e)} />
              </div>
            </div>
          </form>
        }
        <table className="table  table-striped table-hover w-100 text-center">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col"><button className='btn btn-none p-0 m-0 shadow-none' onClick={() => handelSorting('name')}>Name</button></th>
              <th scope="col"><button className='btn btn-none p-0 m-0 shadow-none' onClick={() => handelSorting('email')}>Email</button></th>
              <th scope="col"><button className='btn btn-none p-0 m-0 shadow-none' onClick={() => handelSorting('subject')}>Subject</button></th>

              {/* <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Subject</th> */}
              <th scope="col">Message</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {data ? <><tr><td colSpan="6" className='text-center fs-3'>No Messages Yet...</td></tr></> : null}
            {
              !data && filteredData && filteredData.map((d, key) => {
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


