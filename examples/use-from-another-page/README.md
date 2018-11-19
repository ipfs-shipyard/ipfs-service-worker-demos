# Learn how to use the IPFS Service Worker from another page!

This directory contains two examples:

- `public` - loads image from local HTTP gateway
- `public+sw` - loads image from js-ipfs running in service worker

How to play with it?

1. `npm ci`
2. `npm run build`
3. `npm start`
   - Open http://127.0.0.1:9042/public/
   - Open http://127.0.0.1:9042/public%2Bsw/
