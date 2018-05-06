/* eslint-disable no-unused-vars */
/* global importScripts, Cids, Multihashes, IpfsUnixfs, promisify, splitPath, async, renderFolder */
importScripts('https://unpkg.com/cids@0.5.3/dist/index.min.js');
importScripts('https://unpkg.com/multihashes@0.4.13/dist/index.min.js');
importScripts('https://npmcdn.com/ipfs-unixfs@0.1.14/dist/index.min.js');
importScripts('https://unpkg.com/promisify-es6@1.0.3/index.min.js');
importScripts('https://unpkg.com/async@2.6.0/dist/async.js');
importScripts('./renderFolder.js');

const INDEX_HTML_FILES = ['index.html', 'index.htm', 'index.shtml'];
function getIndexHtml(links) {
  return links.filter(link => INDEX_HTML_FILES.indexOf(link.name) !== -1);
}

const resolveDirectory = promisify((ipfs, path, multihash, callback) => {
  Multihashes.validate(Multihashes.fromB58String(multihash));

  ipfs.object.get(multihash, { enc: 'base58' }, (err, dagNode) => {
    if (err) {
      return callback(err);
    }

    // if it is a web site, return index.html
    const indexFiles = getIndexHtml(dagNode.links);
    if (indexFiles.length > 0) {
      // TODO: add *.css and *.ico to cache
      return callback(null, indexFiles);
    }

    return callback(null, renderFolder(path, dagNode.links));
  });
});

const resolveMultihash = promisify((ipfs, path, callback) => {
  const parts = splitPath(path);
  const firstMultihash = parts.shift();
  let currentCid;

  return async.reduce(
    parts,
    firstMultihash,
    (memo, item, next) => {
      try {
        currentCid = new Cids(Multihashes.fromB58String(memo));
      } catch (err) {
        return next(err);
      }

      ipfs.dag.get(currentCid, (err, result) => {
        if (err) {
          return next(err);
        }

        const dagNode = result.value;
        // find multihash of requested named-file in current dagNode's links
        let multihashOfNextFile;
        const nextFileName = item;

        const { links } = dagNode;

        for (const link of links) {
          if (link.name === nextFileName) {
            // found multihash of requested named-file
            multihashOfNextFile = Multihashes.toB58String(link.multihash);
            break;
          }
        }

        if (!multihashOfNextFile) {
          return next(new Error(`no link named "${nextFileName}" under ${memo}`));
        }

        next(null, multihashOfNextFile);
      });
    },
    (err, result) => {
      if (err) {
        return callback(err);
      }

      let cid;
      try {
        cid = new Cids(Multihashes.fromB58String(result));
      } catch (error) {
        return callback(error);
      }

      ipfs.dag.get(cid, (error, dagResult) => {
        if (error) return callback(err);

        const dagDataObj = IpfsUnixfs.unmarshal(dagResult.value.data);
        if (dagDataObj.type === 'directory') {
          const isDirErr = new Error('This dag node is a directory');
          // add memo (last multihash) as a fileName so it can be used by resolveDirectory
          isDirErr.fileName = result;
          return callback(isDirErr);
        }

        callback(null, { multihash: result });
      });
    },
  );
});
