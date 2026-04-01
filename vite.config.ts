import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // Separate coverage/reporting for functional vs fachliche tests
    // Run functional tests: npx vitest run --configFunctional
    // Run fachliche tests: npx vitest run --configFachlich
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
})
