import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import Loader from '../loader/loader';
import Header from '../navbar'
import './table.scss'
import swal from 'sweetalert';


const Myurl = () => {
	const nav = useNavigate()
	const [isloading, setLoading] = useState(false)
	const [links, setLinks] = useState([])
	const [data, setData] = useState(false)

	const token = JSON.parse(localStorage.getItem('token'))
	const user_id = JSON.parse(localStorage.getItem("id"))

	const getMinute = (millis) => {
		var minutes = Math.floor(millis / 60000);
		var seconds = ((millis % 60000) / 1000).toFixed(0);
		return millis
	}

	const set_links = async () => {
		setLoading(true)
		if (!token || !user_id) {
			swal("Wrong Credentials", "", "error");
			nav("/signin")
		} else {
			try {
				const res = await fetch(`/user/mylinks/${user_id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${token}`,
						"token": token,
					}
				});
				const data = await res.json();
				setLoading(false)
				if (res.status !== 200 || !data) {
					swal(data.error, "", "error");
					localStorage.clear();
				} else {
					setLinks(data)
					setData(true)
				}
			} catch (err) {
				setData(false)
			}

		}

	}

	useEffect(() => {
		set_links()
	}, [])

	const handleDelete = async (e) => {
		e.preventDefault()
		setLoading(true)
		const url_id = e.target.value
		const res = await fetch(`/user/${user_id}/delete/${url_id}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"token": token,
			}
		})
		const data = await res.json()
		setLoading(false)
		if (res.status !== 200 || !data) {
			swal(data.error, "", "error");
		} else {
			swal("Successfully Deleted", "", "success").then(() => { set_links() });
		}
	}


	return (
		<>
			<Header />
			{isloading && <Loader />}
			<div id="user-table">
				<div className="container mt-5 p-0" style={{ "overflow": "auto" }}>
					<table className="table table-striped table-hover w-100 text-center">
						<thead>
							<tr>
								<th scope="col">#</th>
								<th scope="col">URL</th>
								<th scope="col">Short</th>
								<th scope="col">Clicks</th>
								<th scope="col">Expiry</th>
								<th scope="col">Action</th>
							</tr>
						</thead>
						<tbody>
							{!data && <><tr><td colSpan={7} className='text-center fs-3'>No Links Yet...</td></tr></>}
							{data && links && links.map((item, i) => (
								<tr key={i}>
									<td>{i + 1}</td>
									{/* <td className="column100 column2" data-column="column2">{item._id}</td> */}
									<td><a href={item.url} target="_blank">{item.url}</a></td>
									<td><Link to={'/' + item.short} target="_blank">{item.short}</Link></td>
									<td>{getMinute(item.clicks)}</td>
									<td>{getMinute(item.expiryat)}</td>
									{/* <td className="column100 column6" data-column="column6">{item.rate_limit == 0 ? <>--</> : item.rate_limit}</td> */}
									{/* <td className="column100 column7" data-column="column6">{item.rate_limit_reset == 0 ? <>--</> : item.rate_limit_reset}</td> */}
									<td className='btn-c'><button className='btn btn-danger' value={item._id} onClick={(e) => handleDelete(e)}>Delete</button> </td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	)
}

export default Myurl