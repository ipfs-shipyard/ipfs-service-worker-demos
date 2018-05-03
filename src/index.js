/* global self, Response */

'use strict'

const IPFS = require('ipfs')
const { createProxyServer } = require('ipfs-postmsg-proxy')

let node

/* start a IPFS node within the service worker */
const startNode = () => {
  node = new IPFS({
    config: {
      Addresses: {
        Swarm: []
      }
    }
  })
  node.on('error', (err) => console.log('js-ipfs node errored', err))
}

/* get a ready to use IPFS node */
const getNode = () => {
  if (!node) {
    startNode()
  }

  return new Promise(resolve => {
    if (node.isOnline()) {
      resolve(node)
    } else {
      node.on('ready', () => {
        if (node.isOnline()) {
          console.log('js-ipfs node is ready')
          resolve(node)
        }
      })
    }
  })
}

const headers = { status: 200, statusText: 'OK', headers: {} }

/* get the file from ipfs using its hash */
const getFileFromIpfs = async (hash) => {
  try {
    const node = await getNode()
    const files = await node.files.get(hash)
    if (files[0].type === 'dir') {
      /* Example
        {depth: 0, name: "QmeYxwj4CwCeGVhwi3xLrmBZUUFQdftshSiGLrTdTnWEVV", path: "QmeYxwj4CwCeGVhwi3xLrmBZUUFQdftshSiGLrTdTnWEVV", size: 344, hash: Uint8Array(34), type: "dir", content: undefined}
        ,
        {depth: 1, name: "style.css", path: "QmeYxwj4CwCeGVhwi3xLrmBZUUFQdftshSiGLrTdTnWEVV/style.css", size: 30, hash: Uint8Array(34), …}
      */
      await Promise.all(
        [files[1], files[2]].map(async file => {
          const url = file.path.split(files[0].path)[1]
          const cache = await caches.open('js-ipfs')
          return cache.put(url, new Response(file.content, headers))
        })
      )
      return new Response(files[1].content, headers)
    }
    return new Response(files[0].content, headers)
  } catch (error) {
    console.error(error)
  }
}

const getFile = async (multihash) => {
  // Try to get the file from the service worker cache API
  try {
    const cachedContent = await caches.match(multihash)
    if (cachedContent) {
      console.log(`Browser requested ${multihash}, trying to response it with content cached from IPFS.`)
      return cachedContent
    }
  } catch (error) {
    console.log(error)
  }
  // Try to get file from the IPFS node
  console.log(`Browser is requesting ${multihash}, trying to get files from IPFS.`)
  return getFileFromIpfs(multihash)
}

/* Fecth request */
self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith(self.location.origin + '/ipfs')) {
    return console.log(`Fetch not in scope: ${event.request.url}`)
  }

  const multihash = event.request.url.split('/ipfs/')[1]

  console.log(`Service worker trying to get ${multihash}`)
  event.respondWith(getFile(multihash))
})

/* Install service worker */
self.addEventListener('install', (event) => {
  console.log('install step')
  event.waitUntil(self.skipWaiting())
})

/* Activate service worker */
self.addEventListener('activate', (event) => {
  console.log('activate step')
  if (!node) {
    startNode()
  }
  event.waitUntil(self.clients.claim())
})

createProxyServer(() => node, {
  addListener: self.addEventListener.bind(self),
  removeListener: self.removeEventListener.bind(self),
  async postMessage (data) {
    const clients = await self.clients.matchAll()
    clients.forEach(client => client.postMessage(data))
  }
})
