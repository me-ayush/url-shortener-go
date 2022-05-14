import React from 'react'
import SidebarUser from './sidebar/sidebar';
import UserProfileRoutes from './routes/userroiutes';

const ProfileIndex = () => {
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