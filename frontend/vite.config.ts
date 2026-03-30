import { defineConfig } from 'vitest/config'; // Use vitest/config
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,           // This makes 'describe', 'it', 'expect' global
    environment: 'jsdom',    // This simulates the browser
    setupFiles: './src/setupTests.ts', // Points to the file we just made
  },
});