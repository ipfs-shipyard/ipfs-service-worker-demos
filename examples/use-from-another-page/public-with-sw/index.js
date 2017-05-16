'use strict'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker-bundle.js')
    .then((registration) => {
      console.log('registered')
    })
    .catch((err) => {
      console.log('failed to register:', err)
    })
}

document.querySelector('#show').addEventListener('click', () => {
  const multihash = document.querySelector('#input').value
  let imgElement = document.createElement('img')
  imgElement.src = '/ipfs/' + multihash
  // imgElement.src = 'https://ipfs.io/ipfs/' + multihash
  document.querySelector('#display').appendChild(imgElement)
})
