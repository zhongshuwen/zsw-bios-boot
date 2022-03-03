const CONFIG = require("../config");

const {
  getSystemSetupAPI,
  getZswAdminAPI,
  getZswMode2ContractAPI,
  getAPIForPrivateKeys,
} = require("../helpers/api");
const {
  createAccountBasic,
  createAccountWithResources,
  transferComputeCredits,
} = require("../helpers/account");
const {
  producerPreactivateFeatures,
  activateFeature,
} = require("../helpers/chain");
const { readParseContractBuildFiles } = require("../helpers/misc");
const CONTRACT_PATHS = require("../config/contractPaths");
const { deployContract } = require("../helpers/contract");
const { setUserPermissions } = require("../helpers/perms");
const {
  ZSW_ITEMS_PERMS_ENUM,
  ZSW_CORE_PERMS_ENUM,
  ITEM_CONFIG_ENUM,
  ALL_ITEM_PERMS
} = require("../enums");
const {
  makeRoyaltyReceiverUser,
  makeIssuer,
  makeCollection,
  mintItems,
  makeItem,
} = require("../helpers/items");

let sysAPI = getSystemSetupAPI();
let adminAPI = getZswAdminAPI();
//let m2API = getZswMode2ContractAPI();
const partner1API = getAPIForPrivateKeys([CONFIG.PARTNER_1_PRIVATE_KEY]);
const partner2API = getAPIForPrivateKeys([CONFIG.PARTNER_2_PRIVATE_KEY]);
const user1API = getAPIForPrivateKeys([CONFIG.EXAMPLE_USER_1_PRIVATE_KEY]);
const user2API = getAPIForPrivateKeys([CONFIG.EXAMPLE_USER_2_PRIVATE_KEY]);

async function setupZSWItems() {
  const iperms = ZSW_ITEMS_PERMS_ENUM;
  
  sysAPI = getSystemSetupAPI();
  adminAPI = getZswAdminAPI();
  const CORE_PERMS = ZSW_CORE_PERMS_ENUM;
  const PARNTER_CORE_PERMS =
    CORE_PERMS.ZSW_CORE_PERMS_TRANSFER_TOKEN_TO_CORE_CONTRACTS |
    CORE_PERMS.ZSW_CORE_PERMS_CONFIRM_AUTHORIZE_USER_TX |
    CORE_PERMS.ZSW_CORE_PERMS_CONFIRM_AUTHORIZE_USER_TRANSFER_ITEM |
    CORE_PERMS.ZSW_CORE_PERMS_GENERAL_RESOURCES;
  


  const PARNTER_ITEM_PERMS =
    iperms.ZSW_ITEMS_PERMS_AUTHORIZE_CREATE_COLLECTION |
    iperms.ZSW_ITEMS_PERMS_AUTHORIZE_CREATE_ITEM |
    iperms.ZSW_ITEMS_PERMS_AUTHORIZE_MINT_ITEM |
    iperms.ZSW_ITEMS_PERMS_AUTHORIZE_CREATE_ROYALTY_USER |
    iperms.ZSW_ITEMS_PERMS_AUTHORIZE_CREATE_SCHEMA;

  await createAccountWithResources(
    adminAPI,
    "zsw.admin@active",
    "zsw.admin",
    "aaaapartner1",
    CONFIG.PARTNER_1_PUBLIC_KEY,
    CONFIG.PARTNER_1_PUBLIC_KEY,
    {
      ramBytes: 100000,
      stakeCpu: 1000,
      stakeNet: 1000,
      transfer: true,
      from: "zsw.admin",
    }
  );

  await setUserPermissions(
    adminAPI,
    "zsw.admin@active",
    'zsw.admin',
    "zsw.prmcore",
    "aaaapartner1",
    PARNTER_CORE_PERMS
  );
  console.log("making issuer");
  await makeIssuer(adminAPI, "zsw.admin@active", {
    authorizer: "zsw.admin",
    issuerName: "aaaapartner1",
    zswId: 0x13370001,
    altId: 0x12300001,
    permissions: PARNTER_ITEM_PERMS,
    status: 0,
  });
  console.log("made issuer");

  await createAccountWithResources(
    adminAPI,
    "zsw.admin@active",
    "zsw.admin",
    "aaaapartner2",
    CONFIG.PARTNER_2_PUBLIC_KEY,
    CONFIG.PARTNER_2_PUBLIC_KEY,
    {
      ramBytes: 100000,
      stakeCpu: 1000,
      stakeNet: 1000,
      transfer: true,
      from: "zsw.admin",
    }
  );
  await setUserPermissions(
    adminAPI,
    "zsw.admin@active",
    'zsw.admin',
    "zsw.prmcore",
    "aaaapartner2",
    PARNTER_CORE_PERMS
  );

  await makeIssuer(adminAPI, "zsw.admin@active", {
    authorizer: "zsw.admin",
    issuerName: "aaaapartner2",
    zswId: 0x13370002,
    altId: 0x12300002,
    permissions: PARNTER_ITEM_PERMS,
    status: 0,
  });

  await createAccountWithResources(
    adminAPI,
    "zsw.admin@active",
    "zsw.admin",
    "aaaaaexuser1",
    CONFIG.EXAMPLE_USER_1_PUBLIC_KEY,
    CONFIG.EXAMPLE_USER_1_PUBLIC_KEY,
    {
      ramBytes: 100000,
      stakeCpu: 1000,
      stakeNet: 1000,
      transfer: true,
      from: "zsw.admin",
    }
  );
  await createAccountWithResources(
    adminAPI,
    "zsw.admin@active",
    "zsw.admin",
    "aaaaaexuser2",
    CONFIG.EXAMPLE_USER_2_PUBLIC_KEY,
    CONFIG.EXAMPLE_USER_2_PUBLIC_KEY,
    {
      ramBytes: 100000,
      stakeCpu: 1000,
      stakeNet: 1000,
      transfer: true,
      from: "zsw.admin",
    }
  );

  await makeRoyaltyReceiverUser(adminAPI, "zsw.admin@active", {
    authorizer: "zsw.admin",
    royaltyReceiverUserName: "aaaaaexuser1",
    zswId: 0x22220001,
    altId: 0x11110001,
    status: 0,
  });
  const p1adminAPI = getAPIForPrivateKeys([
    CONFIG.ZSW_ADMIN_PRIVATE_KEY,
    CONFIG.PARTNER_1_PRIVATE_KEY,
  ]);

  await makeCollection(p1adminAPI, "zsw.admin@active,aaaapartner1@active", {
    authorizer: "zsw.admin",
    creator: "aaaapartner1",
    issuingPlatform: "aaaapartner1",
    collectionId: 0x55550001,
    zswCode: 0x99990001,
    collectionType: 1,
    itemConfig:
      ITEM_CONFIG_ENUM.ITEM_CONFIG_ALLOW_NOTIFY |
      ITEM_CONFIG_ENUM.ITEM_CONFIG_TRANSFERABLE |
      ITEM_CONFIG_ENUM.ITEM_CONFIG_BURNABLE,
    secondaryMarketFee: 100,
    primaryMarketFee: 100,
    schemaName: "",
    externalMetadataUrl:
      "https://exampledata.zhongshuwen.com/schemas/example/example.json",
    royaltyFeeCollector: "exuser1",
    notifyAccounts: [],
    authorizedAccounts: ["platform1"],
    metadata: [],
  });
  console.log("make item");
  await makeItem(p1adminAPI, "zsw.admin@active,aaaapartner1@active", {
    authorizer: "zsw.admin",
    creator: "aaaapartner1",
    ramPayer: "aaaapartner1",
    itemId: 0x88880001,
    zswCode: 0x88880001,
    itemConfig:
      ITEM_CONFIG_ENUM.ITEM_CONFIG_ALLOW_NOTIFY |
      ITEM_CONFIG_ENUM.ITEM_CONFIG_TRANSFERABLE |
      ITEM_CONFIG_ENUM.ITEM_CONFIG_BURNABLE,

    collectionId: 0x55550001,
    maxSupply: 100,
    itemType: 1,
    externalMetadataUrl: "",
    schemaName: "",
    metadata: [],
  });
  console.log("mint items item");
  await mintItems(p1adminAPI, "aaaapartner1@active", {
    minter: "aaaapartner1",
    to: "aaaaaexuser2",
    itemIds: [0x88880001],
    amounts: [5],
    memo: "hello",
  });
}

module.exports = {
  setupZSWItems,
};
