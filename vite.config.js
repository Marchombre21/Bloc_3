import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  //en prod ce proxy ne servira à rien, il faudra sans doute le retirer.
  server: {
    proxy: {
      '/api.php': 'http://localhost:8000'
    }
  }

})
