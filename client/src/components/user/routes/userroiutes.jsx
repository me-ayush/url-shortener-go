import React from 'react'
import Profile from '../profile';
import { Route, Routes } from 'react-router-dom'
import ProfileSettings from '../profile_settings';

const UserProfileRoutes = () => {
  return (
      <>
    <Routes>
        <Route index element={<Profile />} />
        <Route path="settings" element={<ProfileSettings />} />
    </Routes>
      </>
  )
}

export default UserProfileRoutes