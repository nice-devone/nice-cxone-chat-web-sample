import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
const prefixes = ['REACT_APP'];

export default defineConfig({
  base: './',
  build: {
    outDir: 'build',
  },
  envPrefix: prefixes,
  plugins: [react()],
});
