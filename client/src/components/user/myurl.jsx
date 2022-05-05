import React, { useState, useEffect } from 'react'
import Header from '../navbar'
import './table.scss'
import swal from 'sweetalert';
import { useNavigate, Link } from 'react-router-dom';


const Myurl = () => {
	const nav = useNavigate()
	const [links, setLinks] = useState([])
	const domain = "http://localhost:3000"

	const token = JSON.parse(localStorage.getItem('token'))
	const user_id = JSON.parse(localStorage.getItem("id"))

	const getMinute = (millis) => {
		var minutes = Math.floor(millis / 60000);
		var seconds = ((millis % 60000) / 1000).toFixed(0);
		return millis
	}

	const set_links = async () => {

		if (!token || !user_id) {
			swal("Wrong Credentials", "", "error");
			nav("/login")
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
				if (res.status !== 200 || !data) {
					swal(data.error, "", "error");
                    localStorage.clear();
				} else {
					setLinks(data)
				}
			} catch (err) {
				console.warn(err);
			}

		}

	}

	useEffect(() => {
		set_links()
	}, [])

	const handleDelete = async (e) => {
		e.preventDefault()
		const url_id = e.target.value
		const res = await fetch(`/user/${user_id}/delete/${url_id}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"token": token,
			}
		})
		const data = await res.json()
		console.log(data)
		if (res.status !== 200 || !data) {
			swal(data.error, "", "error");
		} else {
			swal("Successfully Deleted", "", "success");
			set_links()
		}
	}


	return (
		<>
			<Header />


			<div className="limiter">
				<div className="container-table100">
					<div className="wrap-table100">

						<div className="table100 ver1 m-b-110">
							<table data-vertable="ver1">
								<thead>
									<tr className="row100 head">
										<th className="column100 column1" data-column="column1">#</th>
										<th className="column100 column2" data-column="column2">Id</th>
										<th className="column100 column3" data-column="column3">URL</th>
										<th className="column100 column4" data-column="column4">Short</th>
										<th className="column100 column5" data-column="column5">Clicks</th>
										<th className="column100 column5" data-column="column5">Expiry</th>
										{/* <th className="column100 column6" data-column="column6">Rate Limit</th> */}
										{/* <th className="column100 column7" data-column="column7">Rate Limit Reset</th> */}
										<th className="column100 column7 ps-5" data-column="column7">Action</th>
									</tr>
								</thead>
								<tbody>
									{links && links.map((item, i) => (
										<tr className="row100" key={i}>
											<td className="column100 column1" data-column="column1">{i + 1}</td>
											<td className="column100 column2" data-column="column2">{item._id}</td>
											<td className="column100 column3" data-column="column3"><a href={item.url} target="_blank">{item.url}</a></td>
											<td className="column100 column4" data-column="column4"><Link to={'/'+item.short} target="_blank">{item.short}</Link></td>
											<td className="column100 column5" data-column="column5">{getMinute(item.clicks)}</td>
											<td className="column100 column5" data-column="column5">{getMinute(item.expiry)}</td>
											{/* <td className="column100 column6" data-column="column6">{item.rate_limit == 0 ? <>--</> : item.rate_limit}</td> */}
											{/* <td className="column100 column7" data-column="column6">{item.rate_limit_reset == 0 ? <>--</> : item.rate_limit_reset}</td> */}
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

export default Myurl