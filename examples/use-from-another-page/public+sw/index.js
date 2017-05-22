'use strict'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker-bundle.js')
    .then((registration) => {
      console.log('-> Registered the service worker successfuly')
    })
    .catch((err) => {
      console.log('-> Failed to register:', err)
    })
}

document.querySelector('#show').addEventListener('click', () => {
  const multihash = document.querySelector('#input').value
  let imgElement = document.createElement('img')

  // imgElement.src = multihash
  imgElement.src = '/ipfs/' + multihash
  // imgElement.src = 'https://ipfs.io/ipfs/' + multihash
  document.querySelector('#display').appendChild(imgElement)
})
