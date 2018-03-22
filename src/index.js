/* global self, Response */

'use strict'

const IPFS = require('ipfs')
const { createProxyServer } = require('ipfs-postmsg-proxy')

let node

self.addEventListener('install', (event) => {
  console.log('install step')

  event.waitUntil(self.skipWaiting())
})


async function ipfsstart(verbose) {
    /*    Just start IPFS - promise resolves when its started
     */
    const self = this;
    return new Promise((resolve, reject) => {
        node = new IPFS({
            config: {
                Addresses: {
                    Swarm: []
                }
            }
        });
        node.on('ready', () => { resolve(); });
        node.on('error', (err) => reject(err));
    })
    .then(() => node.version())
    .then((version) => console.log('IPFS READY',version))
    .catch((err) => {
        console.log("Error caught in ipfsstart");
        throw(err);
    });
}

self.addEventListener('activate', (event) => {
  console.log('activate step')
  ipfsstart();  // Ignore promise
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith(self.location.origin + '/ipfs')) {
    return console.log('Fetch not in scope', event.request.url)
  }

  console.log('Handling fetch event for', event.request.url)

  const multihash = event.request.url.split('/ipfs/')[1]
  event.respondWith(catAndRespond(multihash))
})

async function catAndRespond (hash) {
  if (!node) await ipfsstart();
  const data = await node.files.cat(hash)
  const headers = { status: 200, statusText: 'OK', headers: {} }
  return new Response(data, headers)
}

createProxyServer(() => node, {
  addListener: self.addEventListener.bind(self),
  removeListener: self.removeEventListener.bind(self),
  async postMessage (data) {
    // TODO: post back to the client that sent the message?
    const clients = await self.clients.matchAll()
    clients.forEach(client => client.postMessage(data))
  }
})
