const fsp = require('fs').promises;
const CONFIG = require('../config')

function parseAuth(p){
  if(Array.isArray(p)){
    return p.map(x=>parseAuth(x))
  }else if(typeof p==='object'){
    return [p];
  }
  const commas = p.split(",");
  if(commas.length>1){
    return commas.map(x=>parseAuth(x)[0]);
  }

  let x = p.split(":");
  if(x.length===2){
    return [{
      actor: x[0],
      permission: x[1],
    }]
  }
  x = p.split("@");
  if(x.length===2){
    return [{
      actor: x[0],
      permission: x[1],
    }]
  }

}

function addNativeCreditSymbol(x){
  return parseFloat((x+"").split(" ").filter(x=>x.trim().length)[0]).toFixed(4)+" "+CONFIG.NATIVE_CREDIT_SYMBOL;
}
async function readParseContractBuildFiles(wasmPath, abiPath) {
  const wasm = await fsp.readFile(wasmPath, {});
  const abiText = await fsp.readFile(abiPath, 'utf-8');
  const abi = JSON.parse(abiText);
  return {wasm, abi};
}
module.exports = {
  parseAuth,
  addNativeCreditSymbol,
  readParseContractBuildFiles,
}