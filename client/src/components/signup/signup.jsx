import React from 'react'
import Header from '../navbar/index'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
  return (
      <>
          <Header />
          <div>
              <h1>Sign up</h1>
              <button>Sign up</button>
          </div>
      </>
  )
}

export default Signup