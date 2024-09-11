import { clientPublic } from '#config/viemClient'
import LatestBlock from '#models/latest_block'
import Transaction from '#models/transaction'
import { DateTime } from 'luxon'
import pLimit from 'p-limit'
import { GetLogsReturnType, decodeEventLog, formatEther } from 'viem'
import mainContractAddress from '../../../contracts/MainContract-address.json' assert { type: 'json' }
import mainContract from '../../../contracts/MainContract.json' assert { type: 'json' }
import { ArgsEventLog } from '../../types/decodeAddress.js'
import { EthAddress } from '../../types/eth_address.js'
import { CrawlDataDTO } from './dto/crawl_data.dto.js'
import { IDataTransaction } from './interfaces/transaction.js'

export default class CrawlDataService {
  private _limit = pLimit(10)

  async updateLatestBlock(blockNumber: number) {
    await LatestBlock.create({
      latestBlock: blockNumber,
    })
  }

  async getLatestBlock() {
    return await LatestBlock.query().orderBy('id', 'desc').first()
  }

  async getLatestBlockOnChain() {
    return await clientPublic.getBlock()
  }

  private async getBlockTransactions(
    logs: GetLogsReturnType<undefined, undefined, undefined, bigint, bigint>
  ) {
    const combinedPromises = logs.map(async (log) => {
      const blockPromise = this._limit(() => clientPublic.getBlock({ blockHash: log.blockHash }))
      const transactionPromise = this._limit(() =>
        clientPublic.getTransaction({ hash: log.transactionHash })
      )
      const receiptPromise = this._limit(() =>
        clientPublic.getTransactionReceipt({ hash: log.transactionHash })
      )

      const [transaction, receipt, block] = await Promise.all([
        transactionPromise,
        receiptPromise,
        blockPromise,
      ])
      return { transaction, receipt, log, block }
    })

    return await Promise.all(combinedPromises)
  }

  async crawlData({ startBlock, endBlock }: CrawlDataDTO) {
    const logs = await clientPublic.getLogs({
      address: mainContractAddress.MainContract as EthAddress,
      fromBlock: BigInt(startBlock),
      toBlock: BigInt(endBlock),
    })

    const { abi: mainContractAbi } = mainContract

    const blockTransactions = await this.getBlockTransactions(logs)

    if (logs.length === 0) {
      return null
    }

    const data = blockTransactions.reduce((prevs: any[], { transaction, receipt, log, block }) => {
      const decodedEvent = decodeEventLog({
        abi: mainContractAbi,
        data: log.data,
        topics: log.topics,
      })

      if (!decodedEvent.args) {
        throw new Error()
      }

      const args: ArgsEventLog = decodedEvent.args as ArgsEventLog

      if (receipt.contractAddress) {
        return [
          ...prevs,
          {
            transactionHash: log.transactionHash,
            status: receipt.status,
            blockNumber: Number(log.blockNumber),
            dateTime: DateTime.fromSeconds(Number(block.timestamp), { zone: 'utc' }),
            from: transaction.from,
            to: transaction.to,
            contractAddress: receipt.contractAddress,
            eventName: decodedEvent.eventName,
            transferFrom: args.newOwner,
            transferTo: receipt.contractAddress,
            gasPriceUsed: transaction.gasPrice
              ? parseFloat(Number(formatEther(transaction.gasPrice * receipt.gasUsed)).toFixed(7))
              : 0,
          },
        ]
      }

      return [
        ...prevs,
        {
          transactionHash: log.transactionHash,
          status: receipt.status,
          blockNumber: Number(log.blockNumber),
          dateTime: DateTime.fromSeconds(Number(block.timestamp), { zone: 'utc' }),
          from: transaction.from,
          to: transaction.to,
          contractAddress: receipt.contractAddress,
          eventName: decodedEvent.eventName,
          transferFrom: args.from,
          transferTo: args.to,
          amount: args.amount ? Number(formatEther(args.amount)) : null,
          nftId: args.NFTId || Number(args.NFTId) === 0 ? Number(args.NFTId) : null,
          gasPriceUsed: transaction.gasPrice
            ? parseFloat(Number(formatEther(transaction.gasPrice * receipt.gasUsed)).toFixed(7))
            : 0,
        },
      ]
    }, [])

    await Transaction.createMany(data as IDataTransaction[])

    const sortBlock = logs.sort((a, b) => Number(a.blockNumber) - Number(b.blockNumber))

    return {
      latestBlock: sortBlock[sortBlock.length - 1].blockNumber,
    }
  }
}
