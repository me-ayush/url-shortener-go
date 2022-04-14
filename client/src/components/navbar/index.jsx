import React, { useState, useEffect } from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie';

const Header = () => {
    const [user, setUser] = useState('No User')
    const nav = useNavigate()
    const [cookies, setCookies] = useCookies(['user']);

    useEffect(() => {
        if (localStorage.getItem("user")) {
            let x = localStorage.getItem("user")
            x = x.slice(1, x.length - 1)
            setUser(x)
        }
    }, [])


    const handleLogout = function () {
        localStorage.clear()
        nav('/')
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">URL Shortener</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav m-auto">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/about">About</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/contact">Contact Me</Link>
                            </li>
                            {localStorage.getItem("token") ?
                                <>
                                    {/* <li className="nav-item">
                                        <Link className="nav-link active" to="/addurl">Add URL</Link>
                                    </li> */}
                                    <li className="nav-item">
                                        <Link className="nav-link active" to="/myurl">My URL</Link>
                                    </li>


                                    {cookies._jwt ? <>
                                        <li className="nav-item">
                                            <Link className="nav-link active" to="/allusers">All Users</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link active" to="/alllinks">All Links</Link>
                                        </li>
                                    </> : null}

                                </>
                                : null
                            }

                        </ul>
                        {localStorage.getItem("token") ?
                            <>
                                <ul className="navbar-nav">
                                    <li className="nav-item dropdown text-right active">
                                        <a className="nav-link dropdown-toggle active" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            {user && user}
                                        </a>
                                        <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                            <li> <Link className="dropdown-item" to="/profile">Profile</Link></li>

                                            <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                                        </ul>
                                    </li>
                                </ul>
                            </> :

                            <>
                                <ul className="navbar-nav">
                                    <li className="nav-item">
                                        <Link className="nav-link active" to="/login">Login</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link active" to="/signup">Signup</Link>
                                    </li>
                                </ul>
                            </>
                        }
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header