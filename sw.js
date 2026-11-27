const CACHE_NAME = "nightfall-devils-v1";

const APP_SHELL = [
    "./",
    "./index.html",
    "./offline.html",
    "./manifest.json",

    "./css/style.css",

    "./js/firebase.js",

    "./assets/logo/nightfall-devils-logo.png"
];

/* =====================================================
   INSTALL
===================================================== */

self.addEventListener("install", function (event) {
    console.log(
        "[NIGHTFALL DEVILS] Service Worker installing..."
    );

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(APP_SHELL);
            })
            .then(function () {
                return self.skipWaiting();
            })
    );
});


/* =====================================================
   ACTIVATE
===================================================== */

self.addEventListener("activate", function (event) {
    console.log(
        "[NIGHTFALL DEVILS] Service Worker activated."
    );

    event.waitUntil(
        caches.keys()
            .then(function (cacheNames) {
                return Promise.all(
                    cacheNames
                        .filter(function (cacheName) {
                            return cacheName !== CACHE_NAME;
                        })
                        .map(function (cacheName) {
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(function () {
                return self.clients.claim();
            })
    );
});


/* =====================================================
   FETCH
===================================================== */

self.addEventListener("fetch", function (event) {

    /*
     * Only handle GET requests.
     */
    if (event.request.method !== "GET") {
        return;
    }

    /*
     * Firebase/API requests should use the network.
     * This keeps Firestore data live.
     */
    const requestURL = new URL(event.request.url);

    if (
        requestURL.hostname.includes("googleapis.com") ||
        requestURL.hostname.includes("firebaseapp.com") ||
        requestURL.hostname.includes("firebasestorage.app")
    ) {
        event.respondWith(
            fetch(event.request).catch(function () {
                return caches.match(event.request);
            })
        );

        return;
    }


    /*
     * App pages:
     * Network first, then cache,
     * then offline page.
     */
    if (
        event.request.mode === "navigate" ||
        requestURL.pathname.endsWith(".html")
    ) {
        event.respondWith(
            fetch(event.request)
                .then(function (response) {

                    if (response && response.status === 200) {
                        const responseClone =
                            response.clone();

                        caches.open(CACHE_NAME)
                            .then(function (cache) {
                                cache.put(
                                    event.request,
                                    responseClone
                                );
                            });
                    }

                    return response;
                })
                .catch(function () {

                    return caches.match(
                        event.request
                    ).then(function (cachedResponse) {

                        if (cachedResponse) {
                            return cachedResponse;
                        }

                        return caches.match(
                            "./offline.html"
                        );
                    });

                })
        );

        return;
    }


    /*
     * CSS / JS / Images:
     * Cache first, then network.
     */
    event.respondWith(
        caches.match(event.request)
            .then(function (cachedResponse) {

                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .then(function (response) {

                        if (
                            response &&
                            response.status === 200
                        ) {
                            const responseClone =
                                response.clone();

                            caches.open(CACHE_NAME)
                                .then(function (cache) {
                                    cache.put(
                                        event.request,
                                        responseClone
                                    );
                                });
                        }

                        return response;
                    })
                    .catch(function () {
                        return new Response(
                            "NIGHTFALL DEVILS is currently offline.",
                            {
                                status: 503,
                                headers: {
                                    "Content-Type":
                                        "text/plain"
                                }
                            }
                        );
                    });
            })
    );
});
