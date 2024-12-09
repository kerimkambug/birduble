import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Bunu ekleyin, böylece ağdaki tüm cihazlardan erişilebilir olur.
    port: 8080         // Portu kontrol edin, varsayılan olarak 5173 kullanılır
  }
})
