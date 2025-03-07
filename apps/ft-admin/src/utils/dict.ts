import { CrawlerTaskStatus } from '@/api/types/crawler-task'

type Dict<T extends string | number> = {
  [key in T]: string
}
export const crawlerTaskStatusDict: Dict<CrawlerTaskStatus> = {
  [CrawlerTaskStatus.PENDING]: '等待中',
  [CrawlerTaskStatus.RUNNING]: '采集中',
  [CrawlerTaskStatus.SUCCESS]: '采集成功',
  [CrawlerTaskStatus.FAILED]: '采集失败',
}
