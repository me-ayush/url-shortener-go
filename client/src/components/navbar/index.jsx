import React, { useState, useContext } from 'react'
import { Link, useNavigate} from "react-router-dom";
import { useCookies } from 'react-cookie';
import { UserContext } from '../../UserContext';

const Header = () => {
    const userContext = useContext(UserContext)
    const [user, setUser] = useState('No User')
    const nav = useNavigate()
    const [cookies, setCookies] = useCookies(['user']);

    const handleLogout = function () {
        localStorage.clear()
        userContext.id[1](null)
        userContext.name[1](null)
        userContext.email[1](null)
        userContext.token[1](null)
        userContext.isAdmin[1](null)
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
                                <Link className="nav-link active" aria-current="page" to="/connect">Contact Me</Link>
                            </li>
                            {userContext.token[0] ?
                                <>
                                    {/* <li className="nav-item">
                                        <Link className="nav-link active" to="/addurl">Add URL</Link>
                                    </li> */}
                                    <li className="nav-item">
                                        <Link className="nav-link active" to="/myurl">My URL</Link>
                                    </li>


                                    {userContext.isAdmin[0] ? <>
                                        <li className="nav-item">
                                            <Link className="nav-link active" to="/Admin/allusers">All Users</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link active" to="/Admin/alllinks">All Links</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link active" to="/Admin/messages">All Messages</Link>
                                        </li>
                                    </> : null}

                                </>
                                : null
                            }

                        </ul>
                        {userContext.token[0] ?
                            <>
                                <ul className="navbar-nav">
                                    <li className="nav-item dropdown text-right active">
                                        <a className="nav-link dropdown-toggle active" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            {userContext.name[0] ? userContext.name[0] : user}
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
                                        <Link className="nav-link active" to="/signin">Login</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link active" to="/register">Signup</Link>
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