import { AppDataSource } from '@/repository/data-source'
import { CrawlerTask } from '@/repository/entry/crawler-task'
import { makeResult } from '../utils'

const crawlerTaskRepository = AppDataSource.getRepository(CrawlerTask)
export async function getCrawlerTaskList() {
  return makeResult(await crawlerTaskRepository.find({ relations: { provider: true }, order: { startTime: 'DESC' } }))
}
