'use strict'

const { createProxyClient } = require('ipfs-postmsg-proxy')
let node

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker-bundle.js')
    .then((registration) => {
      console.log('-> Registered the service worker successfuly')

      node = createProxyClient({
        addListener: navigator.serviceWorker.addEventListener.bind(navigator.serviceWorker),
        removeListener: navigator.serviceWorker.removeEventListener.bind(navigator.serviceWorker),
        postMessage: (data) => navigator.serviceWorker.controller.postMessage(data)
      })
    })
    .catch((err) => {
      console.log('-> Failed to register:', err)
    })
}

document.querySelector('#id').addEventListener('click', async () => {
  if (!node) return alert('Service worker not registered')
  const { agentVersion, id } = await node.id()
  alert(`${agentVersion} ${id}`)
})

document.querySelector('#show').addEventListener('click', () => {
  const multihash = document.querySelector('#input').value
  let imgElement = document.createElement('img')

  // imgElement.src = multihash
  imgElement.src = '/ipfs/' + multihash
  // imgElement.src = 'https://ipfs.io/ipfs/' + multihash
  document.querySelector('#display').appendChild(imgElement)
})
