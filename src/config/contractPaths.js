const ZSW_CHAIN_CONTRACTS_BASE_PATH = process.env.ZSW_CHAIN_CONTRACTS_BASE_PATH || "/zswdevmain/repos/eos/contracts/contracts/"
const ZSWHQ_CONTRACTS_BASE_PATH = process.env.ZSWHQ_CONTRACTS_BASE_PATH || "/zswdevmain/repos/zsw-sys-contracts/build/contracts/"
const ZSW_CORE_CONTRACTS_BASE_PATH = process.env.ZSW_CORE_CONTRACTS_BASE_PATH || "/zswdevmain/repos/zsw.core/build/contracts/"

const CONTRACT_PATHS = {
  "zswhq.boot": {
    /*
    abi: ZSW_CHAIN_CONTRACTS_BASE_PATH+"eosio.boot/bin/eosio.boot.abi",
    wasm: ZSW_CHAIN_CONTRACTS_BASE_PATH+"eosio.boot/bin/eosio.boot.wasm",
    */
    
    abi: ZSW_CHAIN_CONTRACTS_BASE_PATH+"eosio.boot/eosio.boot.abi",
    wasm: ZSW_CHAIN_CONTRACTS_BASE_PATH+"eosio.boot/eosio.boot.wasm",
  },
  "zswhq.token": {
    abi: ZSWHQ_CONTRACTS_BASE_PATH+"eosio.token/eosio.token.abi",
    wasm: ZSWHQ_CONTRACTS_BASE_PATH+"eosio.token/eosio.token.wasm",
  },
  "zswhq.msig": {
    abi: ZSWHQ_CONTRACTS_BASE_PATH+"eosio.msig/eosio.msig.abi",
    wasm: ZSWHQ_CONTRACTS_BASE_PATH+"eosio.msig/eosio.msig.wasm",
  },
  "zswhq.system": {
    abi: ZSWHQ_CONTRACTS_BASE_PATH+"eosio.system/eosio.system.abi",
    wasm: ZSWHQ_CONTRACTS_BASE_PATH+"eosio.system/eosio.system.wasm",
  },

  "zsw.perms": {
    abi: ZSW_CORE_CONTRACTS_BASE_PATH+"zsw.perms/zsw.perms.abi",
    wasm: ZSW_CORE_CONTRACTS_BASE_PATH+"zsw.perms/zsw.perms.wasm",
  },
  "zsw.items": {
    abi: ZSW_CORE_CONTRACTS_BASE_PATH+"zsw.items/zsw.items.abi",
    wasm: ZSW_CORE_CONTRACTS_BASE_PATH+"zsw.items/zsw.items.wasm",
  },

}

module.exports = {
  CONTRACT_PATHS,
}
