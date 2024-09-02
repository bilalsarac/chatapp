import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allows access from other machines on the network
    port: 5173, // Ensure this matches the port you're using
    strictPort: true, // Ensure the port is not changed if it's in use
  },
})
