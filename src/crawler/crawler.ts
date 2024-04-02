import process from 'node:process'
import os from 'node:os'
import debug from 'debug'
import { mergeWith } from 'lodash-es'
import { type $Fetch, ofetch } from 'ofetch'
import type { EntityManager } from 'typeorm'
import { AppDataSource } from '../repository/data-source'
import { Episode } from '../repository/entry/episode'
import { Genre } from '../repository/entry/genre'
import { Poster } from '../repository/entry/poster'
import { Video } from '../repository/entry/video'
import { VideoGenre } from '../repository/entry/video-genre'
import { VideoProvider } from '../repository/entry/video-provider'
import { Parser } from './parser'
import type { ApiResponse, ParsedVideo, ParsedVideoEposide, VideoDetail } from './types'
import type { VideoType } from '@/repository/types'

const log = debug('crawler:')

export class Crawler {
  readonly apiUrl: string
  readonly providerId: number
  #fetch: $Fetch
  #parser = new Parser()
  #pageCount = 1
  #pageNum = 1
  #maxHandleNum = os.cpus().length + 1
  constructor(providerId: number, apiUrl: string) {
    this.apiUrl = apiUrl
    this.providerId = providerId
    this.#fetch = ofetch.create({ baseURL: apiUrl, parseResponse: JSON.parse, retry: 3, retryDelay: 1000, async onRequest({ request, options }) {
      log('[fetch request]', request, options)
    } })
  }

  async run() {
    // parallelLimit(this, this.#maxHandleNum)
    const tasks: Promise<any>[] = []
    for (let i = 0; i < this.#maxHandleNum; i++) {
      tasks.push(this.next(this.#pageNum))
      this.#pageNum++
    }
    await Promise.all(tasks)
  }

  // [Symbol.asyncIterator]() {
  //   const current = this.#pageNum
  //   const last = this.#pageCount
  //   const nextPage = this.next
  //   return {
  //     current,
  //     last,
  //     async next() {
  //       if (last > current) {
  //         return {
  //           done: true,
  //         }
  //       }
  //       return {
  //         value: await nextPage(current),
  //         done: false,
  //       }
  //     },
  //   }
  // }

  async next(pageNum: number) {
    try {
      log('start fetch page(%d): %d', this.providerId, pageNum)
      const response = await this.fetchContent(pageNum)
      this.#pageCount = Math.min(+(process.env.MAX_PAGE ?? 1), response.pagecount)
      await this.updateContent(response.list)
    }
    catch (error) {
      log('fetch page error(%d): %s', this.providerId, error)
    }
    log('end fetch page(%d): %d', this.providerId, pageNum)
    this.#pageNum++
    if (this.#pageCount > this.#pageNum)
      await this.next(this.#pageNum)
  }

  fetchContent(pageNum: number) {
    return this.#fetch<ApiResponse<VideoDetail>>('/', { query: { ac: 'detail', pg: pageNum } })
  }

  async updateContent(videoList: VideoDetail[]) {
    for (const [index, video] of videoList.entries()) {
      log('parse video start(%d): %s --- %d', this.providerId, video.vod_name, index)
      const parsedVideo = this.#parser.parseVideo(video)
      const parsedGenses = this.#parser.parseVideoGenre(video)
      const parsedPoster = this.#parser.parseVideoPoster(video)
      const parsedEpisoderList = this.#parser.parseVideoEpisode(video)
      const parsedVideoType = this.#parser.parseVideoType(video)

      // await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
      //   const updatedVideo = await this.#updateVideo(transactionalEntityManager, parsedVideo, parsedVideoType)
      //   await this.#updateGenre(transactionalEntityManager, updatedVideo, parsedGenses)
      //   const updatedVideoProvider = await this.#updateVideoProvider(transactionalEntityManager, updatedVideo.id, this.providerId)
      //   await this.#updateVideoEpisoder(transactionalEntityManager, updatedVideoProvider.id, parsedEpisoderList)
      //   await this.#updateVideoPoster(transactionalEntityManager, updatedVideo.id, parsedPoster)
      // })
      const entityManager = AppDataSource.createEntityManager()
      const updatedVideo = await this.#updateVideo(entityManager, parsedVideo, parsedVideoType)
      await this.#updateGenre(entityManager, updatedVideo, parsedGenses)
      const updatedVideoProvider = await this.#updateVideoProvider(entityManager, updatedVideo.id, this.providerId)
      await this.#updateVideoEpisoder(entityManager, updatedVideoProvider.id, parsedEpisoderList)
      await this.#updateVideoPoster(entityManager, updatedVideo.id, parsedPoster)

      log('parse video end(%d): %s --- %d', this.providerId, video.vod_name, index)
    }
  }

  async #updateGenre(entityManager: EntityManager, video: Video, genres: Set<string>) {
    const hasUpdateGenre: VideoGenre[] = []
    for (const genre of genres) {
      const trimGenre = genre.trim()
      if (!trimGenre)
        continue
      const genreRepository = entityManager.getRepository(Genre)
      let savedGenre = await genreRepository.findOneBy({ name: trimGenre })
      if (!savedGenre)
        savedGenre = await genreRepository.save({ name: trimGenre })
      const videoGenreRepository = entityManager.getRepository(VideoGenre)
      const savedVideoGenre = await videoGenreRepository.findOneBy({ video: { id: video.id }, genre: { id: savedGenre.id } })
      if (!savedVideoGenre) {
        const savedVideoGenre = await videoGenreRepository.save({ video, genre: savedGenre })
        hasUpdateGenre.push(savedVideoGenre)
      }
    }
    return hasUpdateGenre
  }

  mergeVideo(video: Video, newVideo: ParsedVideo): Video {
    return mergeWith(video, newVideo, (objValue, srcValue, key) => {
      const a = key as keyof Video
      if (a === 'createDateTime' || a === 'updateDateTime')
        return void 0
      if (!srcValue)
        return objValue

      if (!objValue)
        return srcValue

      if (typeof objValue === 'string' && typeof srcValue === 'string') {
        if (srcValue.includes(objValue))
          return srcValue

        if (objValue.includes(srcValue))
          return objValue
      }
      if (a === 'score')
        return Math.max(objValue, srcValue)
      if (a === 'director' || a === 'actors' || a === 'nickName') {
        const set = new Set<string>((srcValue as string).split(','))
        ;(objValue as string).split(',').forEach(v => set.add(v))
        return Array.from(set).join(',')
      }
      return srcValue
    })
  }

  async #updateVideo(entityManager: EntityManager, parsedVideo: ParsedVideo, type: VideoType) {
    const videoRepository = entityManager.getRepository(Video)
    const oldVideo = await videoRepository.findOneBy({ name: parsedVideo.name, year: parsedVideo.year, type })
    if (oldVideo) {
      const toUpdateVideo = this.mergeVideo(oldVideo, parsedVideo)
      toUpdateVideo.createDateTime = undefined
      toUpdateVideo.updateDateTime = undefined
      const result = await videoRepository.update({ id: oldVideo.id }, toUpdateVideo)
      if (result.affected)
        return { ...oldVideo, ...parsedVideo, type }
      else
        return oldVideo
    }
    else {
      const video = new Video()
      Object.assign(video, parsedVideo)
      video.type = type
      return await videoRepository.save(video)
    }
  }

  async #updateVideoProvider(entityManager: EntityManager, videoId: number, providerId: number) {
    const videoProviderRepository = entityManager.getRepository(VideoProvider)
    let savedVideoProvider = await videoProviderRepository.findOneBy({ videoId, providerId })
    if (!savedVideoProvider)
      savedVideoProvider = await videoProviderRepository.save({ videoId, providerId })
    return savedVideoProvider
  }

  async #updateVideoEpisoder(entityManager: EntityManager, videoProviderId: number, parsedEpisodes: ParsedVideoEposide[]) {
    const episodeList: Episode[] = []
    for (const parsedEpisode of parsedEpisodes) {
      // skip invaild url
      if (!parsedEpisode.name || !parsedEpisode.url)
        continue

      const episodeRepository = entityManager.getRepository(Episode)
      const oldEpisode = await episodeRepository.findOneBy({ videoProviderId, number: parsedEpisode.number })
      if (oldEpisode) {
        await episodeRepository.update({ id: oldEpisode.id }, parsedEpisode)
        episodeList.push(episodeRepository.merge(oldEpisode, parsedEpisode))
      }
      else {
        episodeList.push(await episodeRepository.save(episodeRepository.merge(new Episode(), parsedEpisode, { videoProviderId })))
      }
    }
    return episodeList
  }

  async #updateVideoPoster(entityManager: EntityManager, videoProviderId: number, posterUrl: string) {
    const poster = new Poster()
    poster.videoProviderId = videoProviderId
    poster.url = posterUrl
    const posterRepository = entityManager.getRepository(Poster)
    const oldPoster = await posterRepository.findOneBy({ videoProviderId })
    if (oldPoster) {
      await posterRepository.update({ id: oldPoster.id }, poster)
      poster.id = oldPoster.id
    }
    else {
      Object.assign(poster, await posterRepository.save(poster))
    }
    return poster
  }
}
