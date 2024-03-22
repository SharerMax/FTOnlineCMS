import 'reflect-metadata'
import process from 'node:process'
import { Provider } from './repository/entry/provider'
import { Crawler } from './repository/crawler/crawler'
import { AppDataSource } from '@/repository/data-source'
import 'dotenv/config'

try {
  await AppDataSource.initialize()
  const providerRepository = AppDataSource.getRepository(Provider)
  const providers = await providerRepository.find({ where: { enable: true } })
  if (providers.length > 0) {
    for (const provider of providers) {
      const crawler = new Crawler(provider.id, provider.apiUrl)
      await crawler.run()
    }
  }
}
catch (error) {
  console.error(error)
}
