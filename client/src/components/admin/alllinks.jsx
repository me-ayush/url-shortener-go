import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Loader from '../loader/loader';
import Header from '../navbar'
import { useCookies } from 'react-cookie';
import swal from 'sweetalert';
// import '../user/table.scss'


const Alllinks = () => {
    let navigate = useNavigate()
    const [links, setLinks] = useState(false)
    const [isloading, setLoading] = useState(false)
    const [cookies, setCookies] = useCookies(['user']);

    const token = JSON.parse(localStorage.getItem('token'))
    const user_id = JSON.parse(localStorage.getItem("id"))
    const user = JSON.parse(localStorage.getItem("user"))

    const getUsers = async () => {
        if (!token || !user_id || !user && cookies._jwt != "") {
            swal("Please Login", "", "error");
            navigate("/signin")
        } else {
            try {
                setLoading(true)
                const res = await fetch('/admin/links', {
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
                    setLinks(data)
                }
            } catch (err) {
                setLoading(false)
                swal(err, "", "error");
            }
        }
    }

    useEffect(() => {
        getUsers()
    }, [])


    const handleDelete = async (e) => {
        setLoading(true)
        const res = await fetch(`admin/links/${e.target.value}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "token": token,
                "id": user_id
            }
        })
        setLoading(false)
        const data = await res.json()
        if (res.status != 200 || !data) {
            swal(data.error, "", "error");
        } else {
            swal("Link Deleted", "", "success").then(() => { getUsers() });
        }
    }

    return (
        <>
            <Header />
            {isloading && <Loader />}
            <div className="container mt-5" style={{ "overflow": "auto" }}>
                <table className="table  table-striped table-hover w-100 text-center">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Id</th>
                            <th scope="col">Added By</th>
                            <th scope="col">URL</th>
                            <th scope="col">Short</th>
                            <th scope="col">Clicks</th>
                            <th scope="col">Expiry</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>

                        {links && links.map((item, i) => (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{item._id}</td>
                                <td>{item.user == "" || item.user == " " ? 'Unregistered' : item.user}</td>
                                <td><a href={item.url} target="_blank">{item.url}</a></td>
                                <td><Link to={'/' + item.short} target="_blank">{item.short}</Link></td>
                                <td>{(item.clicks)}</td>
                                <td>{(item.expiryat)}</td>
                                <td className='btn-c'><button className='btn btn-danger' value={item._id} onClick={(e) => handleDelete(e)}>Delete</button> </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}


export default Alllinks