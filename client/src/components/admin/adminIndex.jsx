import React, { useEffect, useContext } from 'react'
import { Routes, Route, useNavigate } from "react-router-dom";
import { UserContext } from '../../UserContext';
import Alllinks from './alllinks'
import Allusers from './allusers'
import { Message } from './messages'
const AdminIndex = () => {
    let navigate = useNavigate()
    const userContext = useContext(UserContext)

    const token = userContext.token[0]
    const user_id = userContext.id[0]
    const user = userContext.name[0]
    const isAdmin = userContext.isAdmin[0]

    const clearContextUser = () => {
        userContext.id[1](null)
        userContext.name[1](null)
        userContext.email[1](null)
        userContext.token[1](null)
        userContext.isAdmin[1](null)
    }

    useEffect(() => {
        if (!isAdmin || !token || !user_id || !user) {
            localStorage.clear()
            clearContextUser()
            swal("User Is Not Admin", "", "error");
            navigate("/signin")
        }
    }, [])

    return (
        <>
            <Routes>
                <Route index element={<Alllinks />} />
                <Route path="alllinks" element={<Alllinks />} />
                <Route path="allusers" element={<Allusers />} />
                <Route path="messages" element={<Message />} />
            </Routes>
        </>
    )
}

export default AdminIndex