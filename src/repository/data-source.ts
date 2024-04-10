import process from 'node:process'
import { DataSource } from 'typeorm'
import { Episode } from './entry/episode'
import { Genre } from './entry/genre'
import { Poster } from './entry/poster'
import { Provider } from './entry/provider'
import { Video } from './entry/video'
import { VideoGenre } from './entry/video-genre'
import { CrawlerTask } from './entry/crawler-task'

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: './db/db.sqlite',
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  entities: [Video, Episode, Poster, Provider, VideoGenre, Genre, CrawlerTask],
  // migrations: ['src/migration/*.ts'],
  // subscribers: ['src/subscriber/*.ts'],
})
