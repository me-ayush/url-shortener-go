import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    host: true,
    port:3001,
    proxy:{
      '/contact':{
        target: 'http://localhost:3000',
        secure: false,
        ws: true,
      },
      '/login':{
        target: 'http://localhost:3000',
        secure: false,
        ws: true,
      },
      '/signup':{
        target: 'http://localhost:3000',
        secure: false,
        ws: true,
      },
      '/user':{
        target: 'http://localhost:3000',
        secure: false,
        ws: true,
      },
      '/api/v1':{
        target: 'http://localhost:3000',
        secure: false,
        ws: true,
      },
      '/admin':{
        target: 'http://localhost:3000',
        secure: false,
        ws: true,
      },
      '/geturl':{
        target: 'http://localhost:3000',
        secure: false,
        ws: true,
      },
      '/auth/authentication':{
        target: 'http://localhost:3000',
        secure: false,
        ws: true,
      },
      '/validation':{
        target: 'http://localhost:3000',
        secure: false,
        ws: true,
      },
    }
  }
})
