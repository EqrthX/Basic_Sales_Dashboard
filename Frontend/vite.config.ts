import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    host: '0.0.0.0',
    watch: {
      usePolling: true,    // เพิ่มอันนี้ช่วยให้ vite detect การเปลี่ยนแปลงไฟล์ใน container / volume บน Windows/Linux
    },
  },
})
