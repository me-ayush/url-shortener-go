import React, { useState } from 'react'
import Header from '../navbar/index'
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

const Addurl = () => {
    const [url, setUrl] = useState('')
    const [custom, setCustom] = useState('')

    const nav = useNavigate()

    const token = JSON.parse(localStorage.getItem('token'))
    const user_id = JSON.parse(localStorage.getItem("id"))

    const handleAdd = async (e) => {
        e.preventDefault()
        if (!token || !user_id) {
            window.alert('First Login...')
            nav("/signin")
        } else {
            try {
                const res = await fetch(`/user/${user_id}/add`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "token": token,
                    },
                    body: JSON.stringify({
                        "url": url,
                        "short": custom,
                    })
                });

                const data = await res.json();
                if (res.status != 200 || !data) {
                    swal(data.error, "", "error");
                    localStorage.clear();
                } else {
                    swal("Short Added", "", "success");
                }
            } catch (err) {
                swal(err, "", "error");
                // console.warn(err);
            }
        }

    }

    return (
        <>
            <Header />
            <div className='container mt-5'>
                <form method='POST' onSubmit={(e) => handleAdd(e)} autoComplete="false">
                    <div className="row">
                        <div className="col">
                            <div className="form-group first">
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control " id="url" placeholder="Enter URL" onChange={(e) => { setUrl(e.target.value) }} />
                                    <label htmlFor="url">Enter URL</label>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group last mb-4">
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" id="custom" placeholder="Custom Short (Optional)" onChange={(e) => { setCustom(e.target.value) }} />
                                    <label htmlFor="custom">Custom Short (Optional)</label>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <button className='btn btn-success mb-3 p-3'>Add This URL</button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Addurl