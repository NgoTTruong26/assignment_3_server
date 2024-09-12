import { inject } from '@adonisjs/core'
import CrawlDataService from './crawl_data.service.js'

@inject()
export default class CrawlDataController {
  private _initBlock = 43797445
  private _stepBlock = 1000

  constructor(private crawlDataService: CrawlDataService) {}
  async crawlData() {
    try {
      const startBlock = await this.crawlDataService.getLatestBlock()
      const latestBlockOnChain = await this.crawlDataService.getLatestBlockOnChain()

      if (!startBlock) {
        const endBlock = this._initBlock + this._stepBlock
        await this.crawlDataService.crawlData({
          startBlock: this._initBlock,
          endBlock,
        })

        if (endBlock > Number(latestBlockOnChain.number)) {
          return this.crawlDataService.updateLatestBlock(Number(latestBlockOnChain.number))
        }

        return await this.crawlDataService.updateLatestBlock(endBlock)
      }

      const endBlock = startBlock.latestBlock + this._stepBlock
      await this.crawlDataService.crawlData({
        startBlock: startBlock.latestBlock,
        endBlock,
      })

      if (endBlock > Number(latestBlockOnChain.number)) {
        return this.crawlDataService.updateLatestBlock(Number(latestBlockOnChain.number))
      }

      return await this.crawlDataService.updateLatestBlock(endBlock)
    } catch (error) {
      throw new Error(error)
    }
  }
}
