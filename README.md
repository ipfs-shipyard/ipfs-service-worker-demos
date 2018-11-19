# Demo: use `js-ipfs` within a Service Worker

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](http://ipn.io)
[![](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](http://ipfs.io/)
[![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23ipfs)
[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
<!--
[![Build Status](https://travis-ci.org/ipfs/ipfs-service-worker.svg?style=flat-square)](https://travis-ci.org/ipfs/ipfs-service-worker)
[![Coverage Status](https://coveralls.io/repos/github/ipfs/ipfs-service-worker/badge.svg?branch=master)](https://coveralls.io/github/ipfs/ipfs-service-worker?branch=master)
[![Dependency Status](https://david-dm.org/ipfs/ipfs-service-worker.svg?style=flat-square)](https://david-dm.org/ipfs/ipfs-service-worker)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)
![](https://img.shields.io/badge/npm-%3E%3D3.0.0-orange.svg?style=flat-square)
![](https://img.shields.io/badge/Node.js-%3E%3D4.0.0-orange.svg?style=flat-square)
-->

> Run an IPFS node inside a service worker and serve all your IPFS URLs directly from IPFS!

## BEWARE BEWARE there may be dragons! 🐉

This module is still experimental because it is indeed an experiment part of the [ipfs/in-web-browsers](https://github.com/ipfs/in-web-browsers) endeavour.

Follow latest developments in [in-web-browsers/issues/55](https://github.com/ipfs/in-web-browsers/issues/55).

## Usage

This project is a how to, that you can use as a basis for building an application with `js-ipfs` (`>=0.33.1`) running in a service worker.

Note, the following code snippets are edited from the actual source code for brevity.

### Service worker code

The service worker code lives in `src/index.js`. This is the code that will run as a service worker. It boots up an IPFS node, responds to requests and exposes the running node for use by web pages within the scope of the service worker.

The IPFS node is created when the service worker ['activate' event](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/onactivate) is fired:

```js
const IPFS = require('ipfs')

self.addEventListener('activate', () => {
  ipfs = new IPFS({ /* ...config... */ })
})
```

The service worker listens for ['fetch' events](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent) so that it can [respond](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response) to requests:

```js
self.addEventListener('fetch', (event) => {
  const hash = event.request.url.split('/ipfs/')[1]
  event.respondWith(catAndRespond(hash))
})

async function catAndRespond (hash) {
  const data = await ipfs.files.cat(hash)
  return new Response(data, { status: 200, statusText: 'OK', headers: {} })
}
```

Finally, the IPFS node is exposed for use by web pages/apps. Service workers are permitted to talk to web pages via a messaging API so we can use [`ipfs-postmsg-proxy`](https://github.com/tableflip/ipfs-postmsg-proxy) to talk to the IPFS node running in the worker. We create a "proxy server" for this purpose:

```js
const { createProxyServer } = require('ipfs-postmsg-proxy')
// Setup a proxy server that talks to our real IPFS node
createProxyServer(() => ipfs, { /* ...config... */ })
```

### Application code

The application code lives in `examples/use-from-another-page/public+sw`. It registers the service worker and talks to the IPFS node that runs in it.

First we feature detect that the client's browser supports service workers, and then we [register the service worker](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register).

```js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker-bundle.js')
    .then((reg) => console.log('Successful service worker register'))
    .catch((err) => console.error('Failed service worker register', err))
}
```

Once the service worker is registered, we can start talking to the IPFS node that it is running. To do this we create a "proxy client" which can talk to our "proxy server" over the messaging API:

```js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker-bundle.js')
    .then(async () => {
      ipfs = createProxyClient({ /* ...config... */ })

      // Now use `ipfs` as usual! e.g.
      const { agentVersion, id } = await ipfs.id()
    })
}
```
