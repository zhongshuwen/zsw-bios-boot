

const CONFIG = require("../config");


const { getSystemSetupAPI, getZswAdminAPI, getZswMode2ContractAPI, getAPIForPrivateKeys } = require("../helpers/api");
const {createAccountBasic, createAccountWithResources, resignPermission, transferComputeCredits, resignPermissionTozswhqAndX, buyResources, setAuthKey} = require('../helpers/account');
const {producerPreactivateFeatures, activateFeature} = require('../helpers/chain')
const {readParseContractBuildFiles, parseAuth} = require('../helpers/misc')
const {registerProducer, voteProducer} = require('../helpers/voting')
const {CONTRACT_PATHS} = require('../config/contractPaths');
const { deployContract, abiObjToBuffer } = require("../helpers/contract");
const { setUserPermissions, updateUserAuthAddzswhqCode } = require("../helpers/perms");
const { ZSW_CORE_PERMS_ENUM, ALL_CORE_PERMS, ALL_ITEM_PERMS, ALL_CORE_PERMS_EXCEPT_RECEIVE_FROM_ANYONE } = require("../enums");
const { setupZSWItems } = require("./items");
const { stopNode } = require("../helpers/nodecmd");
const PRODUCER_CORE_PERMS = ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_TRANSFER_TOKEN_TO_CORE_CONTRACTS
| ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_RECEIVE_TOKEN_AS_CORE_CONTRACTS
| ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_UPDATE_AUTH
| ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_DELETE_AUTH
| ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_LINK_AUTH
| ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_UNLINK_AUTH
| ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_CANCEL_DELAY
| ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_GENERAL_RESOURCES
| ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_REGISTER_PRODUCER
| ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_VOTE_PRODUCER;
const BOOT_SYSTEM_ACCOUNTS = [
  'zswhq.bpay',
  'zswhq.msig',
  'zswhq.names',
  'zswhq.ram',
  'zswhq.ramfee',
  'zswhq.saving',
  'zswhq.stake',
  'zswhq.token',
  'zswhq.vpay',
  'zswhq.rex',
  'zsw.perms',
  'zsw.prmcore',
  'noopnoopnoop'
];
let sysAPI = getSystemSetupAPI();
let adminAPI = getZswAdminAPI();
let m2API = getZswMode2ContractAPI();

const FEATURES_TO_ACTIVATE = [
  /*
//KV_DATABASE
"825ee6288fb1373eab1b5187ec2f04f6eacb39cb3a97f356a07c91622dd61d16",
// ACTION_RETURN_VALUE
"c3a6138c5061cf291310887c0b5c71fcaffeab90d5deb50d3b9e687cead45071",
// CONFIGURABLE_WASM_LIMITS
"bf61537fd21c61a60e542a5d66c3f6a78da0589336868307f94a82bccea84e88",
// BLOCKCHAIN_PARAMETERS
"5443fcf88330c586bc0e5f3dee10e7f63c76c00249c87fe4fbf7f38c082006b4",
// GET_SENDER
"f0af56d2c5a48d60a4a5b5c903edfb7db3a736a94ed589d0b797df33ff9d3e1d",
*/
// FORWARD_SETCODE
"2652f5f96006294109b3dd0bbde63693f55324af452b799ee137a81a905eed25",
// ONLY_BILL_FIRST_AUTHORIZER
"8ba52fe7a3956c5cd3a656a3174b931d3bb2abb45578befc59f283ecd816a405",
// RESTRICT_ACTION_TO_SELF
"ad9e3d8f650687709fd68f4b90b41f7d825a365b02c23a636cef88ac2ac00c43",
// DISALLOW_EMPTY_PRODUCER_SCHEDULE
"68dcaa34c0517d19666e6b33add67351d8c5f69e999ca1e37931bc410a297428",
 // FIX_LINKAUTH_RESTRICTION
"e0fb64b1085cc5538970158d05a009c24e276fb94e1a0bf6a528b48fbc4ff526",
 // REPLACE_DEFERRED
"ef43112c6543b88db2283a2e077278c315ae2c84719a8b25f25cc88565fbea99",
// NO_DUPLICATE_DEFERRED_ID
"4a90c00d55454dc5b059055ca213579c6ea856967712a56017487886a4d4cc0f",
// ONLY_LINK_TO_EXISTING_PERMISSION
"1a99a59d87e06e09ec5b028a9cbb7749b4a5ad8819004365d02dc4379a8b7241",
// RAM_RESTRICTIONS
"4e7bf348da00a945489b2a681749eb56f5de00b900014e137ddae39f48f69d67",
// WEBAUTHN_KEY
"4fca8bd82bbd181e714e283f83e1b45d95ca5af40fb89ad3977b653c448f78c2",
// WTMSIG_BLOCK_SIGNATURES
"299dcb6af692324b899b39f16d5a530a33062804e41f09dc97e9f156b4476707",
]
/*
  - FORWARD_SETCODE
  - ONLY_BILL_FIRST_AUTHORIZER
  - RESTRICT_ACTION_TO_SELF
  - DISALLOW_EMPTY_PRODUCER_SCHEDULE
  - FIX_LINKAUTH_RESTRICTION
  - REPLACE_DEFERRED
  - NO_DUPLICATE_DEFERRED_ID
  - ONLY_LINK_TO_EXISTING_PERMISSION
  - RAM_RESTRICTIONS
  - WEBAUTHN_KEY
  - WTMSIG_BLOCK_SIGNATURES
*/
async function setupSystemAccounts() {
  const sysPublicKey = CONFIG.SETUP_SYSTEM_PUBLIC_KEY;
  console.log("setting up system accounts...")
  for(let acc of BOOT_SYSTEM_ACCOUNTS){
    await createAccountBasic(sysAPI, 'zswhq@active', 'zswhq', acc, sysPublicKey, sysPublicKey);
  }
  await createAccountBasic(sysAPI, 'zswhq@active', 'zswhq', 'zsw.init', CONFIG.ZSW_MODE_2_PUBLIC_KEY, CONFIG.ZSW_MODE_2_PUBLIC_KEY);

}
async function setNoopABI(api, authorization, contractName){
  const auth = parseAuth(authorization);
  const abiObj = {
      "version": "zswhq::abi/1.1",
      "types": [],
      "structs": [
          {
              "name": "noop",
              "base": "",
              "fields": []
          }
      ],
      "actions": [
          {
              "name": "noop",
              "type": "noop",
              "ricardian_contract": "This action does nothing."
          }
      ],
      "tables": [],
      "ricardian_clauses": [],
      "error_messages": [],
      "abi_extensions": [],
      "variants": []
  }


  const result = await api.transact({
    actions: [
      {
        account: 'zswhq',
        name: 'setabi',
        authorization: auth,
        data: {
          account: contractName,
          abi: abiObjToBuffer(api,abiObj),
        },
      },
    ],
  },
  {
    blocksBehind: 3,
    expireSeconds: 30,
  });
}
async function setupFeatures(){
  for (let feature of FEATURES_TO_ACTIVATE){
    console.log('activating ',feature);
    try {
    await activateFeature(sysAPI, 'zswhq@active', feature);
    }catch(err){
      console.log('retrying ',feature);
      
      await sleep(20000);
      await activateFeature(sysAPI, 'zswhq@active', feature);


    }

  }
}
async function setupZSWCoreContracts() {
  const CORE_PERMS = ZSW_CORE_PERMS_ENUM;

  await setUserPermissions(m2API, 'zsw.init@active', 'zsw.init', 'zsw.prmcore', 'zsw.init', CORE_PERMS.ZSW_CORE_PERMS_SETCODE | CORE_PERMS.ZSW_CORE_PERMS_SETABI);
  sysAPI = getSystemSetupAPI();
  adminAPI = getZswAdminAPI();
  m2API = getZswMode2ContractAPI();


  const accountList = [
    'zswhq.bpay',
    'zswhq.msig',
    'zswhq.names',
    'zswhq.ram',
    'zswhq.ramfee',
    'zswhq.saving',
    'zswhq.stake',
    'zswhq.token',
    'zswhq.vpay',
    'zswhq.rex',
    'zsw.perms',
    'zsw.prmcore',
    'zswhq',
  ];
  for(let acc of accountList){
    await setUserPermissions(m2API, 'zsw.init@active', 'zsw.init', 'zsw.prmcore', acc, ALL_CORE_PERMS_EXCEPT_RECEIVE_FROM_ANYONE);
  }
  await createAccountWithResources(sysAPI, 'zswhq@active', 'zswhq', 'zsw.admin', CONFIG.ZSW_ADMIN_PUBLIC_KEY, CONFIG.ZSW_ADMIN_PUBLIC_KEY,{
    ramBytes: 500000,
    stakeCpu: 1000,
    stakeNet: 1000,
    transfer: true,
    from: 'zswhq'
  })
  await setUserPermissions(m2API, 'zsw.init@active', 'zsw.init',  'zsw.prmcore', 'zsw.admin', ALL_CORE_PERMS_EXCEPT_RECEIVE_FROM_ANYONE);
  await createAccountWithResources(sysAPI, 'zswhq@active', 'zswhq', 'zsw.items', CONFIG.ZSW_ADMIN_PUBLIC_KEY, CONFIG.ZSW_ADMIN_PUBLIC_KEY,{
    ramBytes: 5000000,
    stakeCpu: 3000,
    stakeNet: 1000,
    transfer: true,
    from: 'zswhq'
  })

  await setUserPermissions(m2API, 'zsw.init@active', 'zsw.init',  'zsw.prmcore', 'zsw.items', CORE_PERMS.ZSW_CORE_PERMS_SETCODE | CORE_PERMS.ZSW_CORE_PERMS_SETABI);
  const zswItems = await readParseContractBuildFiles(CONTRACT_PATHS["zsw.items"].wasm, CONTRACT_PATHS["zsw.items"].abi);
  sysAPI = getSystemSetupAPI();
  adminAPI = getZswAdminAPI();
  m2API = getZswMode2ContractAPI();
  await deployContract(adminAPI,'zsw.items@active','zsw.items', zswItems.wasm, zswItems.abi);
  //await updateUserAuthAddzswhqCode(adminAPI, 'zsw.items');



  const result1 = await adminAPI.transact({
    actions: [

      {
        "account": "zsw.items",
        "name": "init",
        "authorization": [
          {
            "actor": "zsw.admin",
            "permission": "active"
          }
        ],
        "data": {
          "initializer": "zsw.admin",
        }
      },
    ],
  },
  {
    blocksBehind: 3,
    expireSeconds: 30,
  });
}
function sleep(ms){
  return new Promise(resolve=>setTimeout(()=>resolve(), ms));
}
async function setupCoreContracts(){
  const zswhqToken = await readParseContractBuildFiles(CONTRACT_PATHS["zswhq.token"].wasm, CONTRACT_PATHS["zswhq.token"].abi);
  await deployContract(sysAPI,'zswhq.token@active','zswhq.token', zswhqToken.wasm, zswhqToken.abi);
  await setNoopABI(sysAPI, 'noopnoopnoop@active', 'noopnoopnoop');

  const zswhqMsig = await readParseContractBuildFiles(CONTRACT_PATHS["zswhq.msig"].wasm, CONTRACT_PATHS["zswhq.msig"].abi);
  await deployContract(sysAPI,'zswhq.msig@active','zswhq.msig', zswhqMsig.wasm, zswhqMsig.abi);

  await setupzswhqToken();
  const zswPerms = await readParseContractBuildFiles(CONTRACT_PATHS["zsw.perms"].wasm, CONTRACT_PATHS["zsw.perms"].abi);
  await deployContract(sysAPI,'zsw.perms@active','zsw.perms', zswPerms.wasm, zswPerms.abi);

  await producerPreactivateFeatures(CONFIG.ZSW_BOOT_NODE_RPC_ENDPOINT,["0ec7e080177b2c02b278d5088611686b49d739925a92d9bfcacd7fc6b74053bd"]);
  await sleep(3000);


  const zswhqBoot = await readParseContractBuildFiles(CONTRACT_PATHS["zswhq.boot"].wasm, CONTRACT_PATHS["zswhq.boot"].abi);
  await deployContract(sysAPI,'zswhq@active','zswhq', zswhqBoot.wasm, zswhqBoot.abi);
  sysAPI = getSystemSetupAPI();

  await sleep(3000);
  await setupFeatures();
  await sleep(3000);
  const zswhqSystem = await readParseContractBuildFiles(CONTRACT_PATHS["zswhq.system"].wasm, CONTRACT_PATHS["zswhq.system"].abi);
  await deployContract(sysAPI,'zswhq@active','zswhq', zswhqSystem.wasm, zswhqSystem.abi);
  sysAPI = getSystemSetupAPI();
  await sysAPI.transact({
    actions: [

      {
        "account": "zswhq",
        "name": "setpriv",
        "authorization": [
          {
            "actor": "zswhq",
            "permission": "active"
          }
        ],
        "data": {
          "account": "zswhq.msig",
          "is_priv": 1,
        }
      },
    ],
  },
  {
    blocksBehind: 3,
    expireSeconds: 30,
  });
  await sysAPI.transact({
    actions: [

      {
        "account": "zswhq",
        "name": "init",
        "authorization": [
          {
            "actor": "zswhq",
            "permission": "active"
          }
        ],
        "data": {
          "core": "4,"+CONFIG.NATIVE_CREDIT_SYMBOL,
          "version": 0,
        }
      },
    ],
  },
  {
    blocksBehind: 3,
    expireSeconds: 30,
  });


  console.log("setup core contracts");
  

}

async function setupzswhqToken(){

  const result1 = await sysAPI.transact({
    actions: [

      {
        "account": "zswhq.token",
        "name": "create",
        "authorization": [
          {
            "actor": "zswhq.token",
            "permission": "active"
          }
        ],
        "data": {
          "issuer": "zswhq",
          "maximum_supply": "1000000000.0000 ZSWCC"
        }
      },
    ],
  },
  {
    blocksBehind: 3,
    expireSeconds: 30,
  });
  const result2 = await sysAPI.transact({
    actions: [
      {
        "account": "zswhq.token",
        "name": "issue",
        "authorization": [
          {
            "actor": "zswhq",
            "permission": "active"
          }
        ],
        "data": {
          "to": "zswhq",
          "quantity": "700000000.0000 ZSWCC",
          "memo": "memo"
        }
      }
    ],
  },
  {
    blocksBehind: 3,
    expireSeconds: 30,
  });
}
async function setupNewBPAccount(api, accountName, ownerPubKey, activePubKey, producerPubKey, url, location=0){
  await setUserPermissions(adminAPI, 'zsw.admin@active', 'zsw.admin', 'zsw.prmcore', accountName, PRODUCER_CORE_PERMS);
  
  await createAccountWithResources(adminAPI, 'zsw.admin@active', 'zsw.admin', accountName, ownerPubKey, activePubKey,{
    ramBytes: 5000000,
    stakeCpu: 3000,
    stakeNet: 1000,
    transfer: true,
    from: 'zsw.admin'
  });
  await registerProducer(api, accountName+'@active', accountName, producerPubKey, url, location);
}
async function setupFirstProducer() {
  const fpAPI = getAPIForPrivateKeys([CONFIG.ZSW_MODE_2_PRIVATE_KEY]);
  const prodName = CONFIG.PRODUCER_1_NAME;
  await setupNewBPAccount(fpAPI, prodName, CONFIG.ZSW_MODE_2_PUBLIC_KEY, CONFIG.ZSW_MODE_2_PUBLIC_KEY, CONFIG.PRODUCER_1_PUBLIC_KEY, "https://producer1.zhongshuwen.com", 0);
  console.log("created first bp account");
  await voteProducer(adminAPI, 'zsw.admin@active', 'zsw.admin', '', [prodName]);
  await setAuthKey(fpAPI, prodName+"@active", prodName, "active", "owner", CONFIG.PRODUCER_1_ACTIVE_PUBLIC_KEY);
  await setAuthKey(fpAPI, prodName+"@owner", prodName, "owner", "owner", CONFIG.PRODUCER_1_ACTIVE_PUBLIC_KEY);
}
async function setupChain(){

  await setupSystemAccounts();
  await setupCoreContracts();
  await setupZSWCoreContracts();
  await finishBaseSetupAndResign();
  await stopNode(CONFIG.ZSW_BOOT_NODE_DIR);
  console.log("stopped zswhq boot node")
  //await setupZSWItems();

  


}

async function resignBootAccount(api, accountName, controller, controllerPermission){
  await resignPermission(api, accountName+'@owner', accountName,'owner', '', controller, controllerPermission || 'active');
  await resignPermission(api, accountName+'@active', accountName, 'active', 'owner', controller, controllerPermission || 'active');
}
async function resignBootAccountToCodeAndzswhq(api, accountName){
  console.log("resigning...");
  await resignPermissionTozswhqAndX(api, accountName+'@owner', accountName,'owner', '', accountName, 'zswhq.code');
  await resignPermissionTozswhqAndX(api, accountName+'@active', accountName,'active', 'owner', accountName, 'zswhq.code');
  console.log("resigning done...");
}
async function resignBootAccounts(){
  const ALL_STANDARD_RESIGN_ACCOUNTS = BOOT_SYSTEM_ACCOUNTS;
  
  await resignBootAccount(m2API, 'zsw.init', 'zswhq');
  for(let acc of ALL_STANDARD_RESIGN_ACCOUNTS){
    await resignBootAccount(sysAPI, acc, 'zswhq');
  }
  await resignBootAccountToCodeAndzswhq(adminAPI, 'zsw.items');
  await resignBootAccount(sysAPI, 'zswhq', 'zswhq.prods');
}
async function finishBaseSetupAndResign(){



  await setUserPermissions(
    m2API,
    "zsw.init@active",
    'zsw.init',
    "zsw.items",
    "zsw.admin",
    ALL_ITEM_PERMS
  );
  await transferComputeCredits(sysAPI, "zswhq@active", {
    from: "zswhq",
    to: "zsw.admin",
    quantity: "680000000.0000 " + CONFIG.NATIVE_CREDIT_SYMBOL,
    memo: "first",
  });
  await buyResources(adminAPI, 'zsw.admin@active', 'zsw.admin', {ramBytes:1000000, stakeCpu: 280000000, stakeNet: 180000000, from: 'zsw.admin'})

  await setupFirstProducer();

  await sleep(20000);

  await resignBootAccounts();
  await sleep(2000);
  if(CONFIG.ZSW_ADMIN_ACTIVE_PUBLIC_KEY !== CONFIG.ZSW_ADMIN_PUBLIC_KEY){
    await setAuthKey(adminAPI, 'zsw.admin@active', 'zsw.admin', 'active', 'owner', CONFIG.ZSW_ADMIN_ACTIVE_PUBLIC_KEY);
  }
  if(CONFIG.ZSW_ADMIN_OWNER_PUBLIC_KEY !== CONFIG.ZSW_ADMIN_PUBLIC_KEY){
    await setAuthKey(adminAPI, 'zsw.admin@owner', 'zsw.admin', 'owner', 'owner', CONFIG.ZSW_ADMIN_OWNER_PUBLIC_KEY);
  }
}
module.exports = {
  setupChain,
}