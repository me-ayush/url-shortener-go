import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { CookiesProvider } from "react-cookie";

ReactDOM.render(
  
  <CookiesProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  
  </CookiesProvider>,
  document.getElementById('root')
)
