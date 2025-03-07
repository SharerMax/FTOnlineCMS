import { createRouter, defineEventHandler } from 'h3'
import { getCrawlerTaskList } from '../service/crawler-task'

const crawlerRouter = createRouter()

crawlerRouter.get('/list', defineEventHandler(async () => {
  return getCrawlerTaskList()
}))

export { crawlerRouter }
