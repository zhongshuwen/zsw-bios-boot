const {parseAuth, addNativeCreditSymbol} = require('./misc');

async function makeIssuer(api, authorization, {authorizer, issuerName, zswId, altId, permissions, status}){
  const auth  = parseAuth(authorization);
  const actions = [
    {
      account: 'zsw.items',
      name: 'mkissuer',
      authorization:auth,
      data: {
        authorizer,
        issuer_name: issuerName,
        zsw_id: zswId,
        alt_id: altId,
        permissions,
        status,
      },
    }
  ];

  const result = await api.transact({
    actions,
  },
  {
    blocksBehind: 3,
    expireSeconds: 30,
  });
  return result;
}
async function makeRoyaltyReceiverUser(api, authorization, {authorizer, royaltyReceiverUserName, zswId, altId, status}){
  const auth  = parseAuth(authorization);
  const actions = [
    {
      account: 'zsw.items',
      name: 'mkroyaltyusr',
      authorization:auth,
      data: {
        authorizer,
        zsw_id: zswId,
        newroyaltyusr: royaltyReceiverUserName,
        alt_id: altId,
        status,
      },
    }
  ];

  const result = await api.transact({
    actions,
  },
  {
    blocksBehind: 3,
    expireSeconds: 30,
  });
  return result;
}
async function makeSchema(api, authorization, {authorizer, creator, schemaName, schemaFormat}){
  const auth  = parseAuth(authorization);
  const actions = [
    {
      account: 'zsw.items',
      name: 'mkschema',
      authorization:auth,
      data: {
        authorizer,
        creator,
        schema_name: schemaName,
        schema_format: schemaFormat,
      },
    }
  ];

  const result = await api.transact({
    actions,
  },
  {
    blocksBehind: 3,
    expireSeconds: 30,
  });
  return result;
}
async function makeCollection(api, authorization, {authorizer, creator, issuingPlatform, collectionId, zswCode, collectionType, itemConfig, secondaryMarketFee, primaryMarketFee, schemaName, externalMetadataUrl, royaltyFeeCollector, notifyAccounts, authorizedAccounts, metadata}){
  const auth  = parseAuth(authorization);
  const actions = [
    {
      account: 'zsw.items',
      name: 'mkcollection',
      authorization:auth,
      data: {
        authorizer: authorizer,
        creator: creator,
        issuing_platform: issuingPlatform,
        collection_id: collectionId,
        zsw_code: zswCode,
        collection_type: collectionType,
        item_config: itemConfig,
        secondary_market_fee: secondaryMarketFee,
        primary_market_fee: primaryMarketFee,
        schema_name: schemaName,
        external_metadata_url: externalMetadataUrl,
        royalty_fee_collector: royaltyFeeCollector,
        notify_accounts: notifyAccounts,
        authorized_accounts: authorizedAccounts,
        metadata: metadata,
      },
    }
  ];

  const result = await api.transact({
    actions,
  },
  {
    blocksBehind: 3,
    expireSeconds: 30,
  });
  return result;
}


async function makeItem(api, authorization, {authorizer, creator, ramPayer, itemId, zswCode, itemConfig, collectionId, maxSupply, itemType, externalMetadataUrl, schemaName, metadata}){
  const auth  = parseAuth(authorization);
  const actions = [
    {
      account: 'zsw.items',
      name: 'mkitem',
      authorization:auth,
      data: {
        authorizer: authorizer,
        creator: creator,
        ram_payer: ramPayer,
        item_id: itemId,
        zsw_code: zswCode,
        item_config: itemConfig,
        collection_id: collectionId,
        max_supply: maxSupply,
        item_type: itemType,
        external_metadata_url: externalMetadataUrl,
        schema_name: schemaName,
        metadata: metadata,
      },
    }
  ];

  const result = await api.transact({
    actions,
  },
  {
    blocksBehind: 3,
    expireSeconds: 30,
  });
  return result;
}


async function transferItems(api, authorization, {authorizer, from, to, itemIds, amounts, memo}){
  const auth  = parseAuth(authorization);
  const actions = [
    {
      account: 'zsw.items',
      name: 'transfer',
      authorization:auth,
      data: {
        authorizer, from, to, item_ids: itemIds, amounts, memo
      },
    }
  ];

  const result = await api.transact({
    actions,
  },
  {
    blocksBehind: 3,
    expireSeconds: 30,
  });
  return result;
}
async function mintItems(api, authorization, {minter, to, itemIds, amounts, memo}){
  const auth  = parseAuth(authorization);
  const actions = [
    {
      account: 'zsw.items',
      name: 'mint',
      authorization:auth,
      data: {
        minter, to, item_ids: itemIds, amounts, memo
      },
    }
  ];

  const result = await api.transact({
    actions,
  },
  {
    blocksBehind: 3,
    expireSeconds: 30,
  });
  return result;
}

module.exports = {
  makeIssuer,
  makeCollection,
  makeItem,
  makeRoyaltyReceiverUser,
  makeSchema,
  mintItems,
  transferItems,
  
}