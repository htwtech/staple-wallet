import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Подавить предупреждения о /*#__PURE__*/ в зависимостях (Privy, ox и др.)
        if (
          warning.message?.includes('annotation that Rollup cannot interpret') ||
          warning.message?.includes('comment will be removed')
        ) {
          return
        }
        warn(warning)
      },
    },
  },
})
