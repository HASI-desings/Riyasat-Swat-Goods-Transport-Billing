// Fallback manual service worker (vite-plugin-pwa generates its own at build time
// under dist/sw.js). This file is kept per structure.md as a placeholder for any
// custom caching logic layered on top of the generated worker.
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
