import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../navbar'
import { useCookies } from 'react-cookie';
import swal from 'sweetalert';

export const Message = () => {
  
  let navigate = useNavigate()
    const [data, setdata] = useState(false)
    const [cookies, setCookies] = useCookies(['user']);


    const getUsers = async () => {
        const token = JSON.parse(localStorage.getItem('token'))
        const user_id = JSON.parse(localStorage.getItem("id"))
        const user = JSON.parse(localStorage.getItem("user"))

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
                        "id":user_id
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
        getUsers()
        console.log(data)
    }, [])

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
                <tr key={d.user_id}>
                  <td>{key + 1}</td>
                  <td>{d.name}</td>
                  <td>{d.email}</td>
                  <td>{d.subject}</td>
                  <td>{d.message}</td>
                  <td><Link className='nav-link' to={`/user/${d.user_id}`} target="_blank">View</Link></td>
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
