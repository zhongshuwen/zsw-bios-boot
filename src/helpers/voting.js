
const {parseAuth, addNativeCreditSymbol} = require('./misc');

async function registerProducer(api, authorization, accountName, producerKey, url, location = 0){

  const auth  = parseAuth(authorization);

  const result = await api.transact({
    actions: [
      {
        account: 'zswhq',
        name: 'regproducer',
        authorization:auth,
        data: {
          producer: accountName,
          producer_key: producerKey,
          url: url,
          location: location
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
async function unregisterProducer(api, authorization, accountName){

  const auth  = parseAuth(authorization);

  const result = await api.transact({
    actions: [
      {
        account: 'zswhq',
        name: 'unregprod',
        authorization:auth,
        data: {
          producer: accountName,
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

async function voteProducer(api, authorization, voter, proxy='', producers=[]){

  const auth  = parseAuth(authorization);

  const result = await api.transact({
    actions: [
      {
        account: 'zswhq',
        name: 'voteproducer',
        authorization:auth,
        data: {
          voter: voter,
          proxy,
          producers,
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

module.exports= {
  registerProducer,
  unregisterProducer,
  voteProducer,
}