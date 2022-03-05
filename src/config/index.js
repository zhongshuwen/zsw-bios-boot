
const { PrivateKey } = require('zswjs/dist/zswjs-jssig');      // development only
const {convertLegacyPublicKey} = require('zswjs/dist/zswjs-numeric')

function privToPub(privateKey){
  return convertLegacyPublicKey(PrivateKey.fromString(privateKey).getPublicKey().toString());
}

const CONFIG = {
  ZSW_RPC_ENDPOINT: process.env.ZSW_RPC_ENDPOINT,
  ZSW_BOOT_NODE_DIR: process.env.ZSW_BOOT_NODE_DIR,
  ZSW_BOOT_NODE_RPC_ENDPOINT: process.env.ZSW_BOOT_NODE_RPC_ENDPOINT,
  
  SETUP_SYSTEM_PRIVATE_KEY: process.env.SETUP_SYSTEM_PRIVATE_KEY,
  SETUP_SYSTEM_PUBLIC_KEY: privToPub(process.env.SETUP_SYSTEM_PRIVATE_KEY),
  
  ZSW_MODE_2_PRIVATE_KEY: process.env.ZSW_MODE_2_PRIVATE_KEY,
  ZSW_MODE_2_PUBLIC_KEY: privToPub(process.env.ZSW_MODE_2_PRIVATE_KEY),

  ZSW_ADMIN_PRIVATE_KEY: process.env.ZSW_ADMIN_PRIVATE_KEY,
  ZSW_ADMIN_PUBLIC_KEY: privToPub(process.env.ZSW_ADMIN_PRIVATE_KEY),
  ZSW_ADMIN_ACTIVE_PUBLIC_KEY: process.env.ZSW_ADMIN_ACTIVE_PUBLIC_KEY || privToPub(process.env.ZSW_ADMIN_PRIVATE_KEY),
  ZSW_ADMIN_OWNER_PUBLIC_KEY: process.env.ZSW_ADMIN_OWNER_PUBLIC_KEY || privToPub(process.env.ZSW_ADMIN_PRIVATE_KEY),
  
  PARTNER_1_PRIVATE_KEY: process.env.PARTNER_1_PRIVATE_KEY || '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3',
  PARTNER_1_PUBLIC_KEY: privToPub(process.env.PARTNER_1_PRIVATE_KEY || '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'),
  
  PARTNER_2_PRIVATE_KEY: process.env.PARTNER_1_PRIVATE_KEY || '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3',
  PARTNER_2_PUBLIC_KEY: privToPub(process.env.PARTNER_1_PRIVATE_KEY || '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'),

  EXAMPLE_USER_1_PRIVATE_KEY: process.env.EXAMPLE_USER_1_PRIVATE_KEY || '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3',
  EXAMPLE_USER_1_PUBLIC_KEY: privToPub(process.env.EXAMPLE_USER_1_PRIVATE_KEY || '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'),

  EXAMPLE_USER_2_PRIVATE_KEY: process.env.EXAMPLE_USER_2_PRIVATE_KEY || '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3',
  EXAMPLE_USER_2_PUBLIC_KEY: privToPub(process.env.EXAMPLE_USER_2_PRIVATE_KEY || '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'),

  PRODUCER_1_NAME: process.env.PRODUCER_1_NAME,
  PRODUCER_1_PRIVATE_KEY: process.env.PRODUCER_1_PRIVATE_KEY,
  PRODUCER_1_PUBLIC_KEY: privToPub(process.env.PRODUCER_1_PRIVATE_KEY),
  PRODUCER_1_ACTIVE_PUBLIC_KEY: process.env.PRODUCER_1_ACTIVE_PUBLIC_KEY || privToPub(process.env.PRODUCER_1_PRIVATE_KEY),
  PRODUCER_1_OWNER_PUBLIC_KEY: process.env.PRODUCER_1_OWNER_PUBLIC_KEY || privToPub(process.env.PRODUCER_1_PRIVATE_KEY),
  
  NATIVE_CREDIT_SYMBOL:"ZSWCC",
  
  
}

module.exports = {
  ...CONFIG,
}