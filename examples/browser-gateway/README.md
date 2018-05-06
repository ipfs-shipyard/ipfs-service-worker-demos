# ipfs-browser-gateway

Given an IPFS multihash, print the content and try to render web page if the content is HTML.

## Development

This is a "create-react-app" app, so just:

`yarn && yarn start`

## Drawback

1. The first visit is way slower than traditional HTTP page. Though ```http://ipfs.io/ipfs``` is slow too.
1. Can't promise long-term cache, compared to a gateway running on a server, who can pin a file for a longer time.
1. Large folders like [QmRoYXgYMfcP7YQR4sCuSeJy9afgA5XDJ78JzWntpRhmcu](http://ipfs.io/ipfs/QmRoYXgYMfcP7YQR4sCuSeJy9afgA5XDJ78JzWntpRhmcu) may destroy service worker (maybe due to my using ```files.get```), so it's more suitable to just load HTML pages in this way.
1. Don't work with AJAX likes fetch API.
1. Loading dependencies by importScripts synchronously are slow (10s).

## Road Map

- Bundle all dependencies.
- There will be a pull request to [ipfs-service-worker](https://github.com/ipfs/ipfs-service-worker) ones this project is done.

## Reference

- [Discussion](https://github.com/ipfs/ipfs-service-worker/issues/11)
- [JS-IPFS-Gateway](https://github.com/ipfs/js-ipfs/tree/master/src/http/gateway)
- [readable-stream in SW](https://developers.google.com/web/updates/2016/06/sw-readablestreams)
