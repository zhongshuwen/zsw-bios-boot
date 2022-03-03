require('dotenv').config();
const CONFIG = require("./src/config");
const { getSystemSetupAPI, getZswAdminAPI, getZswMode2ContractAPI } = require("./src/helpers/api");

const sysAPI = getSystemSetupAPI();
const adminAPI = getZswAdminAPI();
const m2API = getZswMode2ContractAPI();

const {setupChain} = require('./src/boot');

async function runMain() {
  await setupChain();

}

runMain().then(()=>0).catch(err=>{
  console.error("FATAL ERROR: ",err);
  process.exit(1);
})