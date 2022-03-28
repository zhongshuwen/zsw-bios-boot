const { Serialize } = require("zswjs");
const { parseAuth } = require('./misc')

function abiObjToBuffer2(api, abiObj) {
  const buffer = new Serialize.SerialBuffer({
    textEncoder: api.textEncoder,
    textDecoder: api.textDecoder,
  })

  const abiDefinitions = api.abiTypes.get('abi_def')

  abiObj = abiDefinitions.fields.reduce(
    (acc, { name: fieldName }) =>
      Object.assign(acc, { [fieldName]: acc[fieldName] || [] }),
    JSON.parse(JSON.stringify(abiObj))
  )
  abiDefinitions.serialize(buffer, abiObj)
  const retn = Buffer.from(buffer.asUint8Array()).toString('hex')
  return retn;
}
function abiObjToBuffer(api, abiObj) {

  const buffer = new Serialize.SerialBuffer({
    textEncoder: api.textEncoder,
    textDecoder: api.textDecoder,
  })

  let abiJSON = abiObj;
  const abiDefinitions = api.abiTypes.get('abi_def')
  abiJSON = abiDefinitions.fields.reduce(
    (acc, { name: fieldName }) =>
      Object.assign(acc, { [fieldName]: acc[fieldName] || [] }),
    abiJSON
  )
  abiDefinitions.serialize(buffer, abiJSON)
  serializedAbiHexString = Buffer.from(buffer.asUint8Array()).toString('hex')

  return serializedAbiHexString;

}
async function deployContract(api, authorization, contractName, code, abiObj) {
  const auth = typeof authorization === 'string' ? parseAuth(authorization) : authorization;

  const result = await api.transact({
    actions: [
      {
        account: 'zswhq',
        name: 'setcode',
        authorization: auth,
        data: {
          "vmtype": 0,
          "vmversion": 0,
          account: contractName,
          code: code.toString('hex'),
        },
      },
    ],
  },
    {
      blocksBehind: 3,
      expireSeconds: 30,
    });
  const result2 = await api.transact({
    actions: [
      {
        account: 'zswhq',
        name: 'setabi',
        authorization: auth,
        data: {
          account: contractName,
          abi: abiObjToBuffer(api, abiObj),
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
  deployContract,
  abiObjToBuffer,

}