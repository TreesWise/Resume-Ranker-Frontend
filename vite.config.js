import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from '@svgr/rollup';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const base = process.env.VITE_ENV === 'prod'
    ? '/resume-ranker/'
    : '/';
  return defineConfig({
    base,
    plugins: [react(), svgr()],
    server: {
      watch: { usePolling: true },
      port: 3000,
      open: base
    },
  })
}
