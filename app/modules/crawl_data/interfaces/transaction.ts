import { Status } from '#models/transaction'
import { DateTime } from 'luxon'
import { EthAddress } from '../../../types/eth_address.js'

export interface IDataTransaction {
  transactionHash: EthAddress
  status: Status
  blockNumber: number
  dateTime: DateTime
  from: EthAddress
  to?: EthAddress
  contractAddress?: EthAddress
  eventName: string
  transferFrom: EthAddress
  transferTo: EthAddress
  nftId?: number
  amount?: number
  gasPriceUsed: number
}
