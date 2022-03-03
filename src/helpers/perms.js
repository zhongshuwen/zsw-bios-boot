const {parseAuth, addNativeCreditSymbol} = require('./misc');

async function getUserPermissions(rpc, scope, user){
  const result = await rpc.get_table_rows({
    json: 1,
    code: "zsw.perms",
    scope: scope,
    table:"permissions",
    key_type: "i64",
    limit: "1",
    lower_bound: " " + user,
    upper_bound: " " + user
  })
  if (
    (!result && !Array.isArray(result.rows)) ||
    result.rows.length !== 1 ||
    !result.rows[0]
  ) {
    throw new Error("Permissions not found for this user!");
  }
  return result.rows[0];
}

async function setUserPermissions(api, authorization, sender, scope, user, permissions) {
  const auth  = parseAuth(authorization);
  const result = await api.transact({
    actions: [
      {
        account: 'zsw.perms',
        name: 'setperms',
        authorization:auth,
        data: {
          sender:sender,
          "scope":scope,
          user: user,
          "perm_bits":permissions,
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

async function updateUserAuthAddzswhqCode(api, accountName, pubKey){


  const authorization_object = { 
    threshold: 1, 
    accounts: [{
      permission: {
        actor: accountName, 
        permission: 'zswhq.code'
      }, 
      weight: 1 
    }], 
    keys: pubKey?[{ 
      key: pubKey, 
      weight: 1 
    }]:[],
    waits: []
  };
  
  const updateauth_input = {
    account: accountName,
    permission: 'active',
    parent: 'owner',
    auth: authorization_object
  };

  const r = await api.transact({
    actions: [
    {
      account: 'zswhq',
      name: 'updateauth',
      authorization: [{
        actor: accountName,
        permission: 'active',
      }],
      data: updateauth_input,
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
  return r;
}


module.exports =  {
  getUserPermissions,
  setUserPermissions,
  updateUserAuthAddzswhqCode,
}
