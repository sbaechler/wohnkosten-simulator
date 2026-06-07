import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitest.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json-summary'],
      // Nur src/model/** (Pipeline-Code) messen — keine Widgets, keine
      // generated/ Dateien, keine Scripts, keine Types.
      include: ['src/model/**/*.{ts,tsx}'],
      exclude: [
        'src/model/__tests__/**',
        'src/model/utils.ts',          // trivial wrapper
        'src/model/phases.ts',         // statische Konstanten
        'src/model/phase-weights.ts',  // statische DAG-Definition
        'src/model/params.ts',         // statische Typen + Labels
        'src/model/dag-topology.ts',   // reine Projektion
        '**/*.d.ts',
      ],
      // Schwellwerte als Soft-Warn (Vitest failed nicht, sondern printed).
      // Konsistent mit Blackbox-Test-Strategie: Implementation darf refactored
      // werden, ohne dass CI bricht — Coverage ist Beobachtung, nicht Vertrag.
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70,
      },
    },
  },
})
