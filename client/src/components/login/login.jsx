import React from 'react'
import Header from '../navbar/index'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const nav = useNavigate()

    const handleLogin = () =>{
      localStorage.setItem('token', 'ok')
      nav('/')
    }

    return (
        <>
            <Header />
            <div>
                <h1>Login</h1>
                <button onClick={handleLogin}>Login</button>
            </div>
        </>
    )
}

export default Login