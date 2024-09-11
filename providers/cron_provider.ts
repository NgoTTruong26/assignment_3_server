import CrawlDataController from '#modules/crawl_data/crawl_data.controller'
import CrawlDataService from '#modules/crawl_data/crawl_data.service'
import { inject } from '@adonisjs/core'
import type { ApplicationService } from '@adonisjs/core/types'
import { CronJob } from 'cron'

@inject()
export default class CronProvider {
  private cronJob: CronJob | null = null

  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {
    const crawlDataService = new CrawlDataService()
    const crawlDataController = new CrawlDataController(crawlDataService)

    this.cronJob = CronJob.from({
      cronTime: '* * * * *',
      onTick: () => {
        console.log('Cron job runs every 5 minutes')
        console.log('----------------------------------------------------------------')
        crawlDataController.crawlData().catch((err) => console.error('Error when run Cron', err))
      },
    })
    this.cronJob.start()
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {
    if (this.cronJob) {
      this.cronJob.stop()
      console.log('Cron job stopped')
    }
  }
}
