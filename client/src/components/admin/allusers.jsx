import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../navbar'
import { useCookies } from 'react-cookie';
import swal from 'sweetalert';



const Allusers = () => {
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
                const res = await fetch('/admin/users', {
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
    
    const handleView = (e) =>{
      console.log(e.target.value)
    }

    return (
        <>
            <Header />
            <div className="container mt-5">
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
                  <button className='btn btn-info  mx-1'  value={d._id} onClick={handleView}>View</button>
                  <button className='btn btn-danger  mx-1'  value=''>Delete</button>
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