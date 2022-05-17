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
    const [filteredData, setFilteredData] = useState(links);
    const [searchField, setSearchField] = useState("");
    const [rowPerPage, setRowPerPage] = useState(10);
    const [sortedField, setSortedField] = useState();
    const [sortBy, setSortBy] = useState(0);

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
                    setFilteredData(data)
                }
            } catch (err) {
                setLoading(false)
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

    const handleChange = (e) => {
        try {
            let value = e.target.value.toLowerCase();
            let result = [];
            result = links.filter((data) => {
                let x = data[searchField].toLowerCase();
                return x.search(value) != -1;
            });
            setFilteredData(result);
        } catch { }
    };

    const sortData = (field) => {
        setLoading(true)
        if(field == sortedField){
            setSortBy(sortBy => !sortBy)
        }else{
            setSortBy(1)
        }
        setSortedField(field)
        let x = [...filteredData];
        if (field !== null) {
            x.sort((a, b) => {
                if (a[field] < b[field]) {
                    return sortBy ? 1 : -1;
                }
                if (a[field] > b[field]) {
                    return sortBy ? -1 : 1;
                }
                return 0;
            });
        }
        setFilteredData(x)
        setLoading(false)
    }

    return (
        <>
            <Header />
            {isloading && <Loader />}
            <div className="container mt-5" style={{ "overflow": "auto" }}>
                {links &&
                    <form className='mt-2'>
                        <div className='row'>
                            {/* <div className="input-group mb-3 mt-1"> */}
                            <div className="col-sm-12 col-md-2 mb-2">
                                <select className="form-select shadow-none" onChange={(e) => { setSearchField(e.target.value.toLowerCase()) }} defaultValue={'DEFAULT'} >
                                    <option value="DEFAULT" disabled>Select Filter</option>
                                    <option value="User">Name</option>
                                    <option value="url">URL</option>
                                    <option value="short">Short</option>
                                    <option value="clicks">Clicks</option>
                                    <option value="expiryat">Expiry</option>
                                </select>
                            </div>
                            <div className="col-sm-12 col-md-9">
                                <input type="search" className='form-control shadow-none' placeholder="Type Something" onChange={(e) => handleChange(e)} />
                            </div>
                            {/* </div> */}
                        </div>
                    </form>
                }
                <table className="table  table-striped table-hover w-100 text-center mt-3">
                    <thead>
                        <tr>
                            <th scope="col"><button className='btn btn-none p-0 m-0 shadow-none' onClick={() => sortData(null)}>#</button></th>
                            <th scope="col"><button className='btn btn-none p-0 m-0 shadow-none' onClick={() => sortData('_id')}>ID</button></th>
                            <th scope="col"><button className='btn btn-none p-0 m-0 shadow-none' onClick={() => sortData('user')}>Added By</button></th>
                            <th scope="col"><button className='btn btn-none p-0 m-0 shadow-none' onClick={() => sortData('url')}>URL</button></th>
                            <th scope="col"><button className='btn btn-none p-0 m-0 shadow-none' onClick={() => sortData('short')}>Short</button></th>
                            <th scope="col"><button className='btn btn-none p-0 m-0 shadow-none' onClick={() => sortData('clicks')}>Clicks</button></th>
                            <th scope="col"><button className='btn btn-none p-0 m-0 shadow-none' onClick={() => sortData('expiryat')}>Expiry On</button></th>

                            {/* <th scope="col" onClick={() => setSortedField('user')}>Added By</th>
                            <th scope="col" onClick={() => setSortedField('url')}>URL</th>
                            <th scope="col" onClick={() => setSortedField('short')}>Short</th>
                            <th scope="col" onClick={() => setSortedField('clicks')}>Clicks</th>
                            <th scope="col" onClick={() => setSortedField('expiryat')}>Expiry</th> */}
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!links ? <><tr><td colSpan="8" className='text-center fs-3'>No Links</td></tr></> : null}
                        {filteredData && filteredData.map((item, i) => (
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