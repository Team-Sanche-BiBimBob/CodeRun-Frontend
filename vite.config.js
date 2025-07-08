import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const baseURL = 'http://10.80.163.113:8080';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      "/api":{
        target: baseURL,
        changeOrigin:true,
        rewrite:(path)=>path
      }
    }
  }
})
