import type { ProviderRes } from './provider'

export enum CrawlerTaskStatus {
  PENDING = 0,
  RUNNING = 1,
  SUCCESS = 2,
  FAILED = 3,
}
export interface CrawlerTaskRes {
  id: number
  status: CrawlerTaskStatus
  provider: ProviderRes
  startTime: string
  endTime: string
}
