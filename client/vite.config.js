import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    host: true,
    port:3001,
    // proxy:{
    //   '/login':{
    //     target: 'http://localhost:3000',
    //     secure: false,
    //     ws: true,
    //   },
    // }
  }
})
