import 'reflect-metadata'
import process from 'node:process'
import { Provider } from './repository/entry/provider'
import { Crawler } from './repository/crawler/crawler'
import { CrawlerTask } from './repository/entry/crawler-task'
import { AppDataSource } from '@/repository/data-source'
import 'dotenv/config'

try {
  await AppDataSource.initialize()
  const providerRepository = AppDataSource.getRepository(Provider)
  const providers = await providerRepository.find({ where: { enable: true } })
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
        await crawlerTaskRepository.update({ id: crawlerTask.id }, { endTime: new Date(), status: 3 })
      }
    }
  }
}
catch (error) {
  console.error(error)
}
