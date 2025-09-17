import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const baseURL = 'https://api.coderun.site/';

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
