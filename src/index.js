/* global self */

'use strict'

self.addEventListener('install', (event) => {
  console.log('Installing')

  // event.waitUntil(Promise.resolve().then(() => {
  //  console.log('Install complete')
  // }))

  event.waitUntil(self.skipWaiting())
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
