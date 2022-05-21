import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';

import UserProfileRoutes from './routes/userroiutes';
import { UserContext } from '../../UserContext';
import SidebarUser from './sidebar/sidebar';

const ProfileIndex = () => {
    const nav = useNavigate()
    const userContext = useContext(UserContext)

    const clearContextUser = () => {
        userContext.id[1](null)
        userContext.name[1](null)
        userContext.email[1](null)
        userContext.token[1](null)
        userContext.isAdmin[1](null)
    }

    useEffect(() => {
        const token = userContext.token[0]
        const user_id = userContext.id[0]

        if (!token || !user_id) {
            localStorage.clear()
            clearContextUser()
            swal("Wrong Credentials", "", "error");
            nav("/signin")
        }
    })

    return (
        <>
            <div id="profile-wrapper">
                <div id="wrapper">
                    <div className="wrapper d-flex align-items-stretch">
                        <SidebarUser />
                        <div id="content" className="p-4 p-md-5 pt-5">
                            <UserProfileRoutes />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfileIndex