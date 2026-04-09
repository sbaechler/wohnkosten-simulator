import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
      plugins: [react()],
    }
  } else {
    // command === 'build'
    return {
      plugins: [react(), cloudflare()],
    }
  }
})