import 'reflect-metadata'
import { Provider } from './repository/entry/provider'
import { Crawler } from './repository/crawler/crawler'
import { AppDataSource } from '@/repository/data-source'

try {
  await AppDataSource.initialize()
  const providerRepository = AppDataSource.getRepository(Provider)
  const providers = await providerRepository.find()
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
