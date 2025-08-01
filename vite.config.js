import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('❌ Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('🔄 Proxying request:', req.method, req.url, '-> http://localhost:5000' + req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('✅ Proxy response:', req.url, '-> Status:', proxyRes.statusCode, 'Content-Type:', proxyRes.headers['content-type']);
          });
        }
      }
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173
    }
  }
});