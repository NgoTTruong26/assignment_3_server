/* import CrawlDataController from '#modules/crawl_data/crawl_data.controller'
import CrawlDataService from '#modules/crawl_data/crawl_data.service'
import { CronJob } from 'cron'

const crawlDataService = new CrawlDataService()
const crawlDataController = new CrawlDataController(crawlDataService)

export const cronCrawlData = CronJob.from({
  cronTime: '* * * * *',
  onTick: () => {
    crawlDataController.crawlData().catch((err) => console.error('Error when run Cron', err))
  },
})
 */
