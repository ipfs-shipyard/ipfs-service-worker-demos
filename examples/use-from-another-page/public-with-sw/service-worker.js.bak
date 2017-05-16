/* global self, caches */
'use strict'

self.addEventListener('install', function (event) {
  console.log('Installing')

  // event.waitUntil(Promise.resolve().then(() => {
  //  console.log('Install complete')
  // }))

  // Do I need to open caches?
  event.waitUntil(self.skipWaiting())
  /*
    caches.open('my-cache-is-better-than-yours').then((cache) => {
      return Promise.resolve().then(() => {
        console.log('loaded caches')
      })
    }).then(() => {
      console.log('Install complete')
    })
  )
  */
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
  /*
  event.waitUntil(Promise.resolve().then(() => {
    console.log('Activate complete')
  }))
  */
})

self.addEventListener('fetch', (event) => {
  console.log('Handling fetch event for', event.request.url)

  // skip cross-origin
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }
  console.log('->')
})
