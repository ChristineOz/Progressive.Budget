// Cache all files in public directory (client-side files)
const FILES_TO_CACHE = [
    '/', // this is the same as index.html
    '/styles.css',
    '/index.js',
    '/manifest.webmanifest',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/db.js'
];

const CACHE_NAME = 'static-cache-v1'; // static files
const DATA_CACHE_NAME = 'data-cache-v1' // withdrawals and transactions will get added here

// Install 
self.addEventListener('install', function (e) {
    // Pre-cache static files
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => cache.addAll(FILES_TO_CACHE))
    );

    // Cache data
    // e.waitUntil(
    //     caches.open(DATA_CACHE_NAME)
    //     .then((cache) => cache.add())
    // );

    // Activate service worker immediately once it has finished installing
    self.skipWaiting();
});

// Activation and clean up

// Intercept network requests 
self.addEventListener('fetch', function(e) {
    // Intercept a post to api/transaction
    if (e.request.url.includes('/api/')) {
        // Handle fetch request
    }
    
    // Load requests from static cache if possible
    e.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(e.request).then(response => {
                return response || fetch(e.request);
            });
        })
    );
    
});
