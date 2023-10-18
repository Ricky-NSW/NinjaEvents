// service-worker.js
const CACHE_NAME = "v1_cache";
const urlsToCache = [
    "./",
    "./index.html",
    "./static/css/main.css", // Replace with the path to your main CSS file if different
    "./static/js/main.js",   // Replace with the path to your main JS file if different
    // Add any other local assets you'd like to cache
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;  // if valid response is found in cache return it
                } else {
                    return fetch(event.request)     //fetch from internet
                        .then(res => {
                            return caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request.url, res.clone());    //save the response for future
                                    return res;
                                })
                        })
                        .catch(err => {       // fallback mechanism
                            return caches.open(CACHE_NAME)
                                .then(cache => {
                                    return cache.match('./index.html');
                                });
                        });
                }
            })
    );
});

self.addEventListener("activate", event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
