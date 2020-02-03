workbox.googleAnalytics.initialize()

/* eslint-disable */
workbox.core.setCacheNameDetails({ prefix: 'modular-web-app' })

workbox.skipWaiting()
workbox.clientsClaim()

var CACHE_VERSION = 1
var CURRENT_CACHES = 's3-image-caches' + CACHE_VERSION

self.addEventListener('fetch', function(event) {
  console.log('Handling fetch event for', event.request.url)
  if (event.request.method !== 'GET') {
    return
  }
  if (/.*\.(?:pdf)/.test(event.request.url)) {
    const documentCacheName = 'cached-documents'
    event.respondWith(
      caches.open(documentCacheName).then(function(cache) {
        return cache.match(event.request).then(function (response) {
          return response || fetch(event.request).then(function(response) {
            return response
          })
        })
      })
    )
    return
  }
  if (!/https:\/\/reams-elias-mwa-.*-tenant\d-images.s3.*.\.amazonaws\.com\/.*\.(?:png|jpg|jpeg|svg)/.test(event.request.url)) {
    return
  }
  event.respondWith(
    caches.open(CURRENT_CACHES).then(function(cache) {
      return cache
        .match(event.request)
        .then(function(response) {
          if (response) {
            // If there is an entry in the cache for event.request, then response will be defined
            // and we can just return it. Note that in this example, only font resources are cached.
            console.log(' Found response in cache:', response)

            return response
          }

          // Otherwise, if there is no entry in the cache for event.request, response will be
          // undefined, and we need to fetch() the resource.
          console.log(
            ' No response for %s found in cache. About to fetch ' + 'from network...',
            event.request.url,
          )

          // We call .clone() on the request since we might use it in a call to cache.put() later on.
          // Both fetch() and cache.put() "consume" the request, so we need to make a copy.
          // (see https://fetch.spec.whatwg.org/#dom-request-clone)
          return fetch(event.request.clone()).then(function(response) {
            console.log('  Response for %s from network is: %O', event.request.url, response)

            if (response.status < 400) {
              // This avoids caching responses that we know are errors (i.e. HTTP status code of 4xx or 5xx).
              // We also only want to cache responses that correspond to fonts,
              // i.e. have a Content-Type response header that starts with "font/".
              // Note that for opaque filtered responses (https://fetch.spec.whatwg.org/#concept-filtered-response-opaque)
              // we can't access to the response headers, so this check will always fail and the font won't be cached.
              // All of the Google Web Fonts are served off of a domain that supports CORS, so that isn't an issue here.
              // It is something to keep in mind if you're attempting to cache other resources from a cross-origin
              // domain that doesn't support CORS, though!
              // We call .clone() on the response to save a copy of it to the cache. By doing so, we get to keep
              // the original response object which we will return back to the controlled page.
              // (see https://fetch.spec.whatwg.org/#dom-response-clone)
              console.log('  Caching the response to', event.request.url)
              cache.put(event.request, response.clone())
            } else {
              console.log('  Not caching the response to', event.request.url)
            }

            // Return the original response object, which will be used to fulfill the resource request.
            return response
          })
        })
        .catch(function(error) {
          // This catch() will handle exceptions that arise from the match() or fetch() operations.
          // Note that a HTTP error response (e.g. 404) will NOT trigger an exception.
          // It will return a normal response object that has the appropriate error code set.
          console.error('  Error in fetch handler:', error)

          throw error
        })
    }),
  )
})

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.precaching.suppressWarnings()
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})

onmessage = function(e) {
  try {
    if (e.data && e.data.command === 'preload') {
      const documentCacheName = 'cached-documents'
      e.waitUntil(
        caches.open(documentCacheName).then(function(cache) {
          const uniqueDocLinks = [...new Set(e.data.preloadDocLinks)]
          return cache.addAll(uniqueDocLinks)
        })
      )
    }
  } catch (err) {
    console.error(err)
  }
}