'use strict'

document.querySelector('#show').addEventListener('click', () => {
  const multihash = document.querySelector('#input').value
  let imgElement = document.createElement('img')

  imgElement.src = 'http://localhost:8080' + '/ipfs/' + multihash
  document.querySelector('#display').appendChild(imgElement)
})
