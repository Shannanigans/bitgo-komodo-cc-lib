const url = require('url')
const ws = require('ws')
const encodeHeader = require('bitcoin-protocol').types.header.encode
const encodeTx = require('bitcoin-protocol').types.transaction.encode

// TODO: create-hash package
const { createHash } = require('crypto')

function getRandom (array) {
  return array[Math.floor(Math.random() * array.length)]
}

function parseAddress (address) {
  // if address has a protocol in it, we don't need to add a fake one
  if ((/^\w+:\/\//).test(address)) return url.parse(address)
  return url.parse('x://' + address)
}

function assertParams (params) {
  // TODO: check more things
  // TODO: give more specific errors
  if (!params ||
    params.network == null
    /*|| !params.defaultPort*/) {
    throw new Error('Invalid network parameters')
  }
}

function sha256 (data) {
  return createHash('sha256').update(data).digest()
}

function getBlockHash (header) {
  let headerBytes = encodeHeader(header)
  return sha256(sha256(headerBytes))
}

function getTxHash (tx) {
  let txBytes = encodeTx(tx)
  return sha256(sha256(txBytes))
}

function isWebSocketPeer(peer)
{
  return peer.socket !== undefined && peer.socket.socket instanceof ws;
}
exports.isWebSocketPeer = isWebSocketPeer

function getPeerUrl(peer)
{
  let remotep = '';
  if (isWebSocketPeer(peer))
    return peer.socket.socket.url;
  else if (peer.socket) {
    if (peer.socket.remoteAddress)
        remotep += peer.socket.remoteAddress
    if (peer.socket.remotePort)
        remotep += ':' + peer.socket.remotePort
  }
  return remotep
}

function getSocketUrl(socket)
{
  let remotep = '';
  if (socket !== undefined) {
    if (isWebSocket(socket))
      return socket.socket.url;
    else {
      if (socket.remoteAddress)
          remotep += socket.remoteAddress
      if (socket.remotePort)
          remotep += ':' + socket.remotePort
    }
  }
  return remotep
}

function isWebSocket(socket)
{
  return socket !== undefined && socket.socket instanceof ws;
}

module.exports = {
  getRandom,
  parseAddress,
  assertParams,
  getBlockHash,
  getTxHash,
  sha256,
  isWebSocketPeer,
  isWebSocket,
  getPeerUrl,
  getSocketUrl
}
