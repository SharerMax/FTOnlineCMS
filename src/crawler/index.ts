import { AppDataSource } from '@/repository/data-source'
import { CrawlerTask } from '@/repository/entry/crawler-task'
import { Provider } from '@/repository/entry/provider'
import debug from 'debug'
import { Crawler } from './crawler'

const log = debug('crawler:')
async function startCrawler() {
  const providerRepository = AppDataSource.getRepository(Provider)
  const providers = await providerRepository.find({ where: { enable: true } })
  // const startTime = performance.now()
  if (providers.length > 0) {
    const crawlerTaskRepository = AppDataSource.getRepository(CrawlerTask)
    for (const provider of providers) {
      const crawler = new Crawler(provider.id, provider.apiUrl)
      const startTime = new Date()
      const crawlerTask = await crawlerTaskRepository.save({ providerId: provider.id, status: 1, startTime, endTime: startTime })
      try {
        await crawler.run()
        await crawlerTaskRepository.update({ id: crawlerTask.id }, { endTime: new Date(), status: 2 })
      }
      catch (error) {
        log(error)
        await crawlerTaskRepository.update({ id: crawlerTask.id }, { endTime: new Date(), status: 3 })
      }
    }
  }
}
startCrawler()
