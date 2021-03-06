const ZSW_ITEMS_PERMS_ENUM = {
  ZSW_ITEMS_PERMS_AUTHORIZE_CREATE_COLLECTION: 1<<0,
  ZSW_ITEMS_PERMS_AUTHORIZE_MODIFY_COLLECTION: 1<<1,
  ZSW_ITEMS_PERMS_AUTHORIZE_CREATE_ITEM: 1<<2,
  ZSW_ITEMS_PERMS_AUTHORIZE_MODIFY_ITEM: 1<<3,
  ZSW_ITEMS_PERMS_AUTHORIZE_MINT_ITEM: 1<<4,
  ZSW_ITEMS_PERMS_AUTHORIZE_CREATE_ISSUER: 1<<5,
  ZSW_ITEMS_PERMS_AUTHORIZE_MODIFY_ISSUER: 1<<6,
  ZSW_ITEMS_PERMS_AUTHORIZE_CREATE_ROYALTY_USER: 1<<7,
  ZSW_ITEMS_PERMS_AUTHORIZE_MODIFY_ROYALTY_USER: 1<<8,
  ZSW_ITEMS_PERMS_AUTHORIZE_CREATE_SCHEMA: 1<<9,
  ZSW_ITEMS_PERMS_AUTHORIZE_MODIFY_SCHEMA: 1<<10,
  ZSW_ITEMS_PERMS_ADMIN: 1<<11,
  ZSW_ITEMS_PERMS_AUTHORIZE_CREATE_CUSTODIAN: 1<<12,
  ZSW_ITEMS_PERMS_AUTHORIZE_MODIFY_CUSTODIAN: 1<<13,
  ZSW_ITEMS_PERMS_AUTHORIZE_MINT_TO_OTHER_CUSTODIANS: 1<<14,
  ZSW_ITEMS_PERMS_AUTHORIZE_MINT_TO_NULL_CUSTODIAN: 1<<15,
  ZSW_ITEMS_PERMS_AUTHORIZE_CREATE_ITEM_TEMPLATE: 1<<16,
  ZSW_ITEMS_PERMS_AUTHORIZE_MODIFY_ITEM_TEMPLATE: 1<<17,
  ZSW_ITEMS_PERMS_AUTHORIZE_MODIFY_ITEM_METADATA: 1<<18
}
const ZSW_CORE_PERMS_ENUM = {
  ZSW_CORE_PERMS_ADMIN: 1<<0,
  ZSW_CORE_PERMS_SETCODE: 1<<1,
  ZSW_CORE_PERMS_SETABI: 1<<2,
  ZSW_CORE_PERMS_TRANSFER_TOKEN_TO_ANYONE: 1<<3,
  ZSW_CORE_PERMS_RECEIVE_TOKEN_FROM_ANYONE: 1<<4,
  ZSW_CORE_PERMS_TRANSFER_TOKEN_TO_CORE_CONTRACTS: 1<<5,
  ZSW_CORE_PERMS_RECEIVE_TOKEN_AS_CORE_CONTRACTS: 1<<6,
  ZSW_CORE_PERMS_CREATE_USER: 1<<7,
  ZSW_CORE_PERMS_UPDATE_AUTH: 1<<8,
  ZSW_CORE_PERMS_DELETE_AUTH: 1<<9,
  ZSW_CORE_PERMS_LINK_AUTH: 1<<10,
  ZSW_CORE_PERMS_UNLINK_AUTH: 1<<11,
  ZSW_CORE_PERMS_CANCEL_DELAY: 1<<12,
  ZSW_CORE_PERMS_CONFIRM_AUTHORIZE_USER_TX: 1<<13,
  ZSW_CORE_PERMS_CONFIRM_AUTHORIZE_USER_TRANSFER_ITEM: 1<<14,
  ZSW_CORE_PERMS_GENERAL_RESOURCES: 1<<15,
  ZSW_CORE_PERMS_REGISTER_PRODUCER: 1<<16,
  ZSW_CORE_PERMS_VOTE_PRODUCER: 1<<17,
  ZSW_CORE_PERMS_MISC_FUNCTIONS: 1<<18,
}
const ALL_CORE_PERMS = ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_ADMIN
  | ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_SETCODE
  | ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_SETABI
  | ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_TRANSFER_TOKEN_TO_ANYONE
  | ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_RECEIVE_TOKEN_FROM_ANYONE
  | ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_TRANSFER_TOKEN_TO_CORE_CONTRACTS
  | ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_RECEIVE_TOKEN_AS_CORE_CONTRACTS
  | ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_CREATE_USER
  | ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_UPDATE_AUTH
  | ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_DELETE_AUTH
  | ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_LINK_AUTH
  | ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_UNLINK_AUTH
  | ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_CANCEL_DELAY
  | ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_CONFIRM_AUTHORIZE_USER_TX
  | ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_CONFIRM_AUTHORIZE_USER_TRANSFER_ITEM
  | ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_GENERAL_RESOURCES
  | ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_REGISTER_PRODUCER
  | ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_VOTE_PRODUCER
  | ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_MISC_FUNCTIONS;
const ALL_CORE_PERMS_EXCEPT_RECEIVE_FROM_ANYONE = ((ALL_CORE_PERMS | ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_RECEIVE_TOKEN_FROM_ANYONE)^ZSW_CORE_PERMS_ENUM.ZSW_CORE_PERMS_RECEIVE_TOKEN_FROM_ANYONE)>>>0;

const ALL_ITEM_PERMS = (1<<19)-1;

const ITEM_CONFIG_ENUM = {
  ITEM_CONFIG_TRANSFERABLE: (1<<0),
  ITEM_CONFIG_BURNABLE: (1<<1),
  ITEM_CONFIG_FROZEN: (1<<2),
  ITEM_CONFIG_ALLOW_NOTIFY: (1<<3),
  ITEM_CONFIG_ALLOW_MUTABLE_DATA: (1<<4),

}
module.exports = {
  ZSW_ITEMS_PERMS_ENUM,
  ZSW_CORE_PERMS_ENUM,
  ITEM_CONFIG_ENUM,
  ALL_CORE_PERMS,
  ALL_ITEM_PERMS,
  ALL_CORE_PERMS_EXCEPT_RECEIVE_FROM_ANYONE,

  
}