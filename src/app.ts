import 'dotenv/config'
import 'reflect-metadata'
import process from 'node:process'
import { Crawler } from './repository/crawler/crawler'
import { CrawlerTask } from './repository/entry/crawler-task'
import { Provider } from './repository/entry/provider'
import { AppDataSource } from '@/repository/data-source'

try {
  await AppDataSource.initialize()
  const providerRepository = AppDataSource.getRepository(Provider)
  const providers = await providerRepository.find({ where: { enable: true } })
  const startTime = performance.now()
  console.log('start time: ', startTime)
  if (providers.length > 0) {
    const crawlerTaskRepository = AppDataSource.getRepository(CrawlerTask)
    for (const provider of providers) {
      const crawler = new Crawler(provider.id, provider.apiUrl)
      // console.log('start crawler:', crawler.mergeVideo({ id: 123, nickName: '123', genres: [], createDateTime: new Date(), updateDateTime: new Date(), name: '123', actors: '123', director: '123', type: 2, year: 123, language: '123', area: '123', score: 123, remarks: '123', doubanId: '123', description: '123' }, {
      //   name: '1231',
      //   actors: '1231',
      //   director: '1231',
      //   year: 1231,
      //   language: '1231',
      //   area: '1231',
      //   score: 1231,
      //   remarks: '1231',
      //   doubanId: '1231',
      //   description: '1231',
      //   nickName: '1231',
      // }))
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
  const endTime = performance.now()
  console.log('end time: ', endTime)
  console.log('total time: ', endTime - startTime)
  await AppDataSource.destroy()
  process.exit(0)
}
catch (error) {
  console.error(error)
}
