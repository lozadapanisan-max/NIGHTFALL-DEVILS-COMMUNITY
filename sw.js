const CACHE_NAME = "nightfall-devils-v2";

/* =====================================================
   APP SHELL
===================================================== */

const APP_SHELL = [
    "./",
    "./index.html",
    "./offline.html",
    "./manifest.json",

    /* CSS */
    "./css/style.css",

    /* JavaScript */
    "./js/firebase.js",

    /* Main Logo */
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

                console.log(
                    "[NIGHTFALL DEVILS] Caching app shell..."
                );

                return cache.addAll(APP_SHELL);
            })

            .then(function () {

                console.log(
                    "[NIGHTFALL DEVILS] App shell cached."
                );

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

                            return (
                                cacheName !== CACHE_NAME
                            );

                        })

                        .map(function (cacheName) {

                            console.log(
                                "[NIGHTFALL DEVILS] Removing old cache:",
                                cacheName
                            );

                            return caches.delete(
                                cacheName
                            );

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


    const requestURL =
        new URL(event.request.url);


    /* =================================================
       FIREBASE / API REQUESTS
    ================================================= */

    /*
     * Do NOT cache Firebase live data.
     *
     * Firestore members, schedules,
     * announcements, organization, etc.
     * should remain live.
     */

    if (
        requestURL.hostname.includes(
            "googleapis.com"
        ) ||

        requestURL.hostname.includes(
            "firebaseapp.com"
        ) ||

        requestURL.hostname.includes(
            "firebasestorage.app"
        ) ||

        requestURL.hostname.includes(
            "firebaseio.com"
        )
    ) {

        event.respondWith(

            fetch(event.request)

                .catch(function () {

                    return caches.match(
                        event.request
                    );

                })

        );

        return;
    }


    /* =================================================
       EXTERNAL FIREBASE SDK
    ================================================= */

    if (
        requestURL.hostname.includes(
            "gstatic.com"
        )
    ) {

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

                                caches.open(
                                    CACHE_NAME
                                ).then(function (cache) {

                                    cache.put(
                                        event.request,
                                        responseClone
                                    );

                                });

                            }

                            return response;

                        });

                })

        );

        return;
    }


    /* =================================================
       HTML / PAGE REQUESTS
    ================================================= */

    if (
        event.request.mode === "navigate" ||

        requestURL.pathname.endsWith(
            ".html"
        )
    ) {

        event.respondWith(

            fetch(event.request)

                .then(function (response) {

                    /*
                     * Save successful HTML
                     * responses in cache.
                     */

                    if (
                        response &&
                        response.status === 200
                    ) {

                        const responseClone =
                            response.clone();

                        caches.open(
                            CACHE_NAME
                        ).then(function (cache) {

                            cache.put(
                                event.request,
                                responseClone
                            );

                        });

                    }

                    return response;

                })

                .catch(function () {

                    /*
                     * Internet unavailable.
                     * Try cached page first.
                     */

                    return caches.match(
                        event.request
                    )

                    .then(function (cachedResponse) {

                        if (cachedResponse) {
                            return cachedResponse;
                        }


                        /*
                         * If requested page is
                         * not cached, show
                         * offline.html.
                         */

                        return caches.match(
                            "./offline.html"
                        );

                    });

                })

        );

        return;
    }


    /* =================================================
       CSS / JS / IMAGES / OTHER STATIC FILES
    ================================================= */

    event.respondWith(

        caches.match(event.request)

            .then(function (cachedResponse) {

                /*
                 * CACHE FIRST
                 */

                if (cachedResponse) {
                    return cachedResponse;
                }


                /*
                 * Not in cache.
                 * Try network.
                 */

                return fetch(event.request)

                    .then(function (response) {

                        /*
                         * Cache successful
                         * static resources.
                         */

                        if (
                            response &&
                            response.status === 200 &&
                            response.type !== "opaque"
                        ) {

                            const responseClone =
                                response.clone();

                            caches.open(
                                CACHE_NAME
                            ).then(function (cache) {

                                cache.put(
                                    event.request,
                                    responseClone
                                );

                            });

                        }

                        return response;

                    })

                    .catch(function () {

                        /*
                         * Resource unavailable.
                         */

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
