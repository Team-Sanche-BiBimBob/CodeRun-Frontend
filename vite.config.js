import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const baseURL = 'http://54.180.121.132:8080/';

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
