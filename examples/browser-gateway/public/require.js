/* eslint-disable no-unused-vars, no-restricted-globals */
/* global self, importScripts */
function require(moduleName) {
  self.module = { exports: null };
  self.global = {};
  importScripts(moduleName);
  return Object.keys(self.global).length > 0 ? self.global[Object.keys(self.global)[0]] : self.module.exports;
}
