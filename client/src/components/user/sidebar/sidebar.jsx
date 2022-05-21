import React, { useEffect, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom';

import { UserContext } from '../../../UserContext';
import './style.scss'

const SidebarUser = () => {
    const nav = useNavigate()
    const userContext = useContext(UserContext)
    const token = userContext.token[0]
    const user_id = userContext.id[0]
    const name = userContext.name[0]
    const email = userContext.email[0]

    useEffect(() => {
        if (!token || !user_id) {
            swal("Wrong Credentials", "", "error");
            nav("/signin")
        }

        if(window.innerWidth<950){
            document.getElementById('sidebar').classList.add("active")
        }

    })

    const toggleMenu = (e) => {
        e.preventDefault();
        document.getElementById('sidebar').classList.toggle("active")
    }
    
    return (
        <>
            <nav id="sidebar">
                <div className="custom-menu">
                    <button type="button" id="sidebarCollapse" className="btn btn-primary" onClick={toggleMenu}>
                        <i className="fa fa-bars"></i>
                        <span className="sr-only">Toggle Menu</span>
                    </button>
                </div>
                <div className="p-4">
                    <h1><a href="#" className="logo">{name} <span>{email}</span></a></h1>
                    <ul className="list-unstyled components mb-5">
                        <li>
                            <Link to="/profile"><span className="fa fa-home mr-3"></span> Dashboard</Link>
                        </li>
                        <li>
                            <Link to="/profile/settings"><span className="fa fa-cogs mr-3"></span> Account Setting</Link>
                        </li>
                        <li>
                            <Link to="/"><span className="fa fa-backward mr-3"></span> Home Page</Link>
                        </li>
                    </ul>

                </div>
            </nav>
        </>
    )
}

export default SidebarUser