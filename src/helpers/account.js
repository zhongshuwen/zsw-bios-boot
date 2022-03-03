const {parseAuth, addNativeCreditSymbol} = require('./misc');

async function createAccountBasic(api, authorization, creator, accountName, ownerPublicKey, activePublicKey){

  const auth  = parseAuth(authorization);

  const result = await api.transact({
    actions: [
      {
        account: 'zswhq',
        name: 'newaccount',
        authorization:auth,
        data: {
          "creator": creator || auth[0].actor,
          "name": accountName,
          "owner": {
            "threshold": 1,
            "keys": [
              {
                "key": ownerPublicKey,
                "weight": 1
              }
            ],
            "accounts": [],
            "waits": []
          },
          "active": {
            "threshold": 1,
            "keys": [
              {
                "key": activePublicKey,
                "weight": 1
              }
            ],
            "accounts": [],
            "waits": []
          }
        },
      },
    ],
  },
  {
    blocksBehind: 3,
    expireSeconds: 30,
  });
  return result;
}

async function buyResources(api, authorization, accountName, {ramBytes, stakeNet, stakeCpu, transfer, from}={}){

  const auth  = parseAuth(authorization);
  const actions = [
  ];
  if(ramBytes){
    actions.push({
      account: 'zswhq',
      name: 'buyrambytes',
      authorization:auth,
      data: {"payer": from || creator || auth[0].actor,"receiver":accountName,"bytes":ramBytes},
    })
  }
  if(stakeNet||stakeCpu){
    actions.push({
      account: 'zswhq',
      name: 'delegatebw',
      authorization:auth,
      data: {

        "from": from || creator || auth[0].actor,
        "receiver": accountName,
        "stake_net_quantity": addNativeCreditSymbol(stakeNet),
        "stake_cpu_quantity": addNativeCreditSymbol(stakeCpu),
        "transfer": !!transfer
      },
    })
  }
  if(!actions.length){
    throw new Error("Invalid addResources call, must have at least some ram/net/cpu!");
  }

  const result = await api.transact({
    actions,
  },
  {
    blocksBehind: 3,
    expireSeconds: 30,
  });
  return result;
}

async function createAccountWithResources(api, authorization, creator, accountName, ownerPublicKey, activePublicKey, {ramBytes, stakeNet, stakeCpu, transfer, from}={}){

  const auth  = parseAuth(authorization);
  const actions = [
    {
      account: 'zswhq',
      name: 'newaccount',
      authorization:auth,
      data: {
        "creator": creator || auth[0].actor,
        "name": accountName,
        "owner": {
          "threshold": 1,
          "keys": [
            {
              "key": ownerPublicKey,
              "weight": 1
            }
          ],
          "accounts": [],
          "waits": []
        },
        "active": {
          "threshold": 1,
          "keys": [
            {
              "key": activePublicKey,
              "weight": 1
            }
          ],
          "accounts": [],
          "waits": []
        }
      },
    },
  ];
  if(ramBytes){
    actions.push({
      account: 'zswhq',
      name: 'buyrambytes',
      authorization:auth,
      data: {"payer": from || creator || auth[0].actor,"receiver":accountName,"bytes":ramBytes},
    })
  }
  if(stakeNet||stakeCpu){
    actions.push({
      account: 'zswhq',
      name: 'delegatebw',
      authorization:auth,
      data: {

        "from": from || creator || auth[0].actor,
        "receiver": accountName,
        "stake_net_quantity": addNativeCreditSymbol(stakeNet),
        "stake_cpu_quantity": addNativeCreditSymbol(stakeCpu),
        "transfer": !!transfer
      },
    })
  }

  const result = await api.transact({
    actions,
  },
  {
    blocksBehind: 3,
    expireSeconds: 30,
  });
  return result;
}
async function transferComputeCredits(api, authorization, {from, to, quantity, memo}) {

  const auth  = parseAuth(authorization);

  const result = await api.transact({
    actions: [
      {
        account: 'zswhq.token',
        name: 'transfer',
        authorization:auth,
        data: {
          "from": from || auth[0].actor,
          "to": to,
          "quantity":addNativeCreditSymbol(quantity),
          "memo": typeof memo === 'undefined'? "":(memo+""),
        },
      },
    ],
  },
  {
    blocksBehind: 3,
    expireSeconds: 30,
  });
  return result;


  
}
async function resignPermission(api, authorization, accountName, permission, parent, controller, controllerPermission) {
  return resignPermissionCustom(api, authorization, accountName, permission, parent,
    {
      'threshold': 1, 'keys': [], 'waits': [],
      'accounts': [{
        'weight': 1,
        'permission': { 'actor': controller, 'permission': controllerPermission || 'active' }
      }]
    });
}
async function resignPermissionTozswhqAndX(api, authorization, accountName, permission, parent, controller, controllerPermission) {
  return resignPermissionCustom(api, authorization, accountName, permission, parent,
    {
      'threshold': 1, 'keys': [], 'waits': [],
      'accounts': [{
        'weight': 1,
        'permission': { 'actor': controller, 'permission': controllerPermission || 'active' }
      },{
        'weight': 1,
        'permission': { 'actor': 'zswhq', 'permission': 'active' }
      }]
    });
}
async function resignPermissionCustom(api, authorization, accountName, permission, parent, authSettings){
  const auth  = parseAuth(authorization);

  const result = await api.transact({
    actions: [
      {
        account: 'zswhq',
        name: 'updateauth',
        authorization:auth,
        data: {
          'account': accountName,
          'permission': permission,
          'parent': parent,
          'auth': authSettings,
        },
      },
    ],
  },
  {
    blocksBehind: 3,
    expireSeconds: 30,
  });
  return result;
}
module.exports = {
  buyResources,
  createAccountWithResources,
  createAccountBasic,
  transferComputeCredits,
  resignPermission,
  resignPermissionTozswhqAndX,
  resignPermissionCustom,
  
  
}