/* global self, Response */

'use strict'

const IPFS = require('ipfs')
const bl = require('bl')
let node

self.addEventListener('install', (event) => {
  console.log('install step')

  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  console.log('activate step')

  node = new IPFS({
    config: {
      Addresses: {
        Swarm: []
      }
    }
  })
  node.on('ready', () => console.log('js-ipfs node is ready'))
  node.on('error', (err) => console.log('js-ipfs node errored', err))

  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith(self.location.origin + '/ipfs')) {
    return console.log('Fetch not in scope', event.request.url)
  }

  console.log('Handling fetch event for', event.request.url)

  const headers = {
    status: 200,
    statusText: 'OK',
    headers: {}
  }

  event.respondWith(new Promise((resolve, reject) => {
    const multihash = event.request.url.split('/ipfs/')[1]

    node.files.cat(multihash, (err, stream) => {
      if (err) {
        console.log('Could not fetch multihash', multihash)
        return
      }

      stream.pipe(bl((err, data) => {
        if (err) {
          return console.log(err)
        }

        const response = new Response(data, headers)

        resolve(response)
      }))
    })
  }))
})
