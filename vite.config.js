import { defineConfig } from 'vite'
import fs from "fs"
import mkcert from 'vite-plugin-mkcert'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  server: { https: true }, // Not needed for Vite 5+

  plugins: [react(),  mkcert()],
})
