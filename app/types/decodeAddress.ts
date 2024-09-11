import { EthAddress } from './eth_address.js'

export interface ArgsEventLog {
  newOwner?: EthAddress
  from?: EthAddress
  to?: EthAddress
  NFTId?: bigint
  amount?: bigint
}
