import { DataSource } from 'typeorm'
import { Episode } from './entry/episode'
import { Genre } from './entry/genre'
import { Poster } from './entry/poster'
import { Provider } from './entry/provider'
import { Video } from './entry/video'
import { VideoGenre } from './entry/video-genre'
import { VideoProvider } from './entry/video-provider'
import { CrawlerTask } from './entry/crawler-task'

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: './db/db.sqlite',
  synchronize: true,
  logging: false,
  entities: [Video, Episode, Poster, Provider, VideoGenre, Genre, VideoProvider, CrawlerTask],
  // migrations: ['src/migration/*.ts'],
  // subscribers: ['src/subscriber/*.ts'],
})
