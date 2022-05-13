import React, {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

const AuthIndex = () => {
  const nav = useNavigate();
  useEffect(() => {
    nav('/')
  })

  return (
    <div>AuthIndex</div>
  )
}

export default AuthIndex