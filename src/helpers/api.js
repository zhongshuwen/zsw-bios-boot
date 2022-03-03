const { Api, JsonRpc, RpcError } = require('zswjs');
const { JsSignatureProvider, PrivateKey } = require('zswjs/dist/zswjs-jssig');      // development only
const fetch = require('node-fetch');                                    // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util'); 

const CONFIG = require('../config');

var rpcGlobal = null;
const apiInstCache = {};

function getRPC(){
  return new JsonRpc(CONFIG.ZSW_BOOT_NODE_RPC_ENDPOINT, { fetch });
  if(!rpcGlobal){
    rpcGlobal = new JsonRpc(CONFIG.ZSW_RPC_ENDPOINT, { fetch });
  }
  return rpcGlobal;
}

function getAPIForPrivateKeys(privKeys){
  const pks = (Array.isArray(privKeys)?privKeys:[privKeys]);
  const joined = pks.concat([]).sort().join(",");
  if(apiInstCache.hasOwnProperty(joined)&&apiInstCache[joined]){
    //return apiInstCache[joined]
  }

  const api = new Api({ 
    rpc: getRPC(), 
    signatureProvider: new JsSignatureProvider(pks), 
    textDecoder: new TextDecoder(), 
    textEncoder: new TextEncoder() 
  });
  apiInstCache[joined] = api;
  return api;
}
function privToPub(privateKey){
  return PrivateKey.fromString(privateKey).getPublicKey().toString();
}

function getSystemSetupAPI(){
  return getAPIForPrivateKeys([CONFIG.SETUP_SYSTEM_PRIVATE_KEY])

  
}

function getZswMode2ContractAPI(){
  return getAPIForPrivateKeys([CONFIG.ZSW_MODE_2_PRIVATE_KEY]);
}

function getZswAdminAPI(){
  return getAPIForPrivateKeys([CONFIG.ZSW_ADMIN_PRIVATE_KEY]);
}

module.exports = {
  getRPC,
  getAPIForPrivateKeys,
  privToPub,
  getSystemSetupAPI,
  getZswMode2ContractAPI,
  getZswAdminAPI,
}

