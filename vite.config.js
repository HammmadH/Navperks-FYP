import { defineConfig } from 'vite'
import fs from "fs"
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('./key.pem'),
      cert: fs.readFileSync('./cert.pem'),
    },
    // Optional: Set the server to open automatically in the browser
    open: true, 
  },
})
