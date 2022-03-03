const EOS_CONTRACTS_BASE_PATH = "/zswdevmain/repos/eos/contracts/contracts/"
const EOSIO_CONTRACTS_BASE_PATH = "/zswdevmain/repos/zsw-sys-contracts/build/contracts/"
const ZSW_CORE_CONTRACTS_BASE_PATH = "/zswdevmain/repos/zsw.core/build/contracts/"

const CONTRACT_PATHS = {
  "zswhq.boot": {
    abi: EOS_CONTRACTS_BASE_PATH+"eosio.boot/bin/eosio.boot.abi",
    wasm: EOS_CONTRACTS_BASE_PATH+"eosio.boot/bin/eosio.boot.wasm",
  },
  "zswhq.token": {
    abi: EOSIO_CONTRACTS_BASE_PATH+"eosio.token/eosio.token.abi",
    wasm: EOSIO_CONTRACTS_BASE_PATH+"eosio.token/eosio.token.wasm",
  },
  "zswhq.msig": {
    abi: EOSIO_CONTRACTS_BASE_PATH+"eosio.msig/eosio.msig.abi",
    wasm: EOSIO_CONTRACTS_BASE_PATH+"eosio.msig/eosio.msig.wasm",
  },
  "zswhq.system": {
    abi: EOSIO_CONTRACTS_BASE_PATH+"eosio.system/eosio.system.abi",
    wasm: EOSIO_CONTRACTS_BASE_PATH+"eosio.system/eosio.system.wasm",
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