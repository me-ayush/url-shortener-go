import React, { useEffect } from 'react'
import SidebarUser from './sidebar/sidebar';
import UserProfileRoutes from './routes/userroiutes';
import { useNavigate } from 'react-router-dom';

const ProfileIndex = () => {
    const nav = useNavigate()
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'))
        const user_id = JSON.parse(localStorage.getItem("id"))
        if (!token || !user_id) {
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