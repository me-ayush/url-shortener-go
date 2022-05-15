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
        console.log(data)
        if (res.status != 200 || !data) {
            swal(data.error, "", "error");
        } else {
            swal("Link Deleted", "", "success").then(()=>{getUsers()});
        }
    }

    return (
        <>
            <Header />
            {isloading && <Loader />}
            <div className="limiter">
                <div className="container-table100">
                    <div className="wrap-table100">

                        <div className="table100 ver1 m-b-110">
                            <table data-vertable="ver1" className='text-center'>
                                <thead>
                                    <tr className="row100 head">
                                        <th className="column100 column1" data-column="column1">#</th>
                                        <th className="column100 column2" data-column="column2">Id</th>
                                        <th className="column100 column5" data-column="column5">Added By</th>
                                        <th className="column100 column3" data-column="column3">URL</th>
                                        <th className="column100 column4" data-column="column4">Short</th>
                                        <th className="column100 column5" data-column="column5">Clicks</th>
                                        <th className="column100 column5" data-column="column5">Expiry</th>
                                        <th className="column100 column7 ps-5" data-column="column7">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {links && links.map((item, i) => (
                                        <tr className="row100" key={i}>
                                            <td className="column100 column1" data-column="column1">{i + 1}</td>
                                            <td className="column100 column2" data-column="column2">{item._id}</td>
                                            <td className="column100 column1" data-column="column1">{item.user == "" || item.user == " " ? 'Unregistered' : item.user}</td>
                                            <td className="column100 column3" data-column="column3"><a href={item.url} target="_blank">{item.url}</a></td>
                                            <td className="column100 column4" data-column="column4"><Link to={'/' + item.short} target="_blank">{item.short}</Link></td>
                                            <td className="column100 column5" data-column="column5">{(item.clicks)}</td>
                                            <td className="column100 column5" data-column="column5">{(item.expiry)}</td>
                                            <td className='column100 column8 text-center p-0 m-0 btn-c'><button className='btn btn-danger' value={item._id} onClick={(e) => handleDelete(e)}>Delete</button> </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default Alllinks