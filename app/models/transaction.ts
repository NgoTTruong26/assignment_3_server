import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { EthAddress } from '../types/eth_address.js'

export type Status = 'success' | 'reverted'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare transactionHash: EthAddress

  @column()
  declare status: Status

  @column()
  declare blockNumber: number

  @column()
  declare dateTime: DateTime

  @column()
  declare from: EthAddress

  @column()
  declare to?: EthAddress

  @column()
  declare contractAddress?: EthAddress

  @column()
  declare eventName: string

  @column()
  declare transferFrom?: EthAddress

  @column()
  declare transferTo?: EthAddress

  @column()
  declare nftId?: number

  @column()
  declare amount?: number

  @column()
  declare gasPriceUsed: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
