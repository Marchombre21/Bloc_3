import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  //en prod ce proxy ne servira à rien, il faudra sans doute le retirer.
  server: {
    proxy: {
      '/api.php': 'http://localhost:8000'
    }
  }

})
