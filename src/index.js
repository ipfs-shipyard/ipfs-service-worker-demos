/* global self */

'use strict'

const IPFS = require('ipfs')
let node

self.addEventListener('install', (event) => {
  console.log('Installing')

  // event.waitUntil(self.skipWaiting())

  event.waitUntil(() => {
    return new Promise((resolve, reject) => {
      node = new IPFS()
      node.on('ready', () => {
        console.log('js-ipfs node is ready')
        resolve()
      })
    })
  })
})

self.addEventListener('activate', (event) => {
  event.waitUntil(Promise.resolve().then(() => {
    console.log('Activate complete')
  }))
})

self.addEventListener('fetch', (event) => {
  console.log('Handling fetch event for', event.request.url)

  // skip cross-origin
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }
  console.log('->')
})
