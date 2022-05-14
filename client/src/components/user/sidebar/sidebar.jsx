import React from 'react'
import { Link } from 'react-router-dom'
import './style.scss'

const SidebarUser = () => {

    var name = localStorage.getItem("user")
    name = name.slice(1, name.length - 1)
    
    var email = localStorage.getItem("email")
    email = email.slice(1, email.length - 1)

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
                            <a href="#"><span className="fa fa-briefcase mr-3"></span> Works</a>
                        </li>
                        <li>
                            <a href="#"><span className="fa fa-sticky-note mr-3"></span> Blog</a>
                        </li>
                        <li>
                            <a href="#"><span className="fa fa-suitcase mr-3"></span> Gallery</a>
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