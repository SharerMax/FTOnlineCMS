import { type $Fetch, ofetch } from 'ofetch'
import debug from 'debug'
import { AppDataSource } from '../data-source'
import { Episode } from '../entry/episode'
import { Genre } from '../entry/genre'
import { Poster } from '../entry/poster'
import { Video } from '../entry/video'
import { VideoGenre } from '../entry/video-genre'
import { VideoProvider } from '../entry/video-provider'
import { Parser } from './parser'
import type { ApiResponse, ParsedVideo, ParsedVideoEposide, VideoDetail, VideoType } from './types'

const log = debug('crawler:')
export class Crawler {
  readonly apiUrl: string
  readonly providerId: number
  #fetch: $Fetch
  #videoRepository = AppDataSource.getRepository(Video)
  #videoGenreRepository = AppDataSource.getRepository(VideoGenre)
  #genreRepository = AppDataSource.getRepository(Genre)
  #parser = new Parser()
  constructor(providerId: number, apiUrl: string) {
    this.apiUrl = apiUrl
    this.providerId = providerId
    this.#fetch = ofetch.create({ baseURL: apiUrl, parseResponse: JSON.parse })
  }

  async run() {
    let pageNum = 1
    let pageCount = 1
    do {
      log('start fetch page:', pageNum)
      const response = await this.fetchContent(pageNum)
      pageCount = Math.min(10, response.pagecount)
      const videoList = response.list
      for (const video of videoList) {
        log('parse video start: ', video.vod_name)
        const parsedVideo = this.#parser.parseVideo(video)
        const parsedGenses = this.#parser.parseVideoGenre(video)
        const parsedPoster = this.#parser.parseVideoPoster(video)
        const parsedEpisoderList = this.#parser.parseVideoEpisode(video)
        const parsedVideoType = this.#parser.parseVideoType(video)
        const updatedVideo = await this.#updateVideo(parsedVideo, parsedVideoType)
        await this.#updateGenre(updatedVideo, parsedGenses)
        const updatedVideoProvider = await this.#updateVideoProvider(updatedVideo.id, this.providerId)
        await this.#updateVideoEpisoder(updatedVideoProvider.id, parsedEpisoderList)
        await this.#updateVideoPoster(updatedVideo.id, parsedPoster)
        log('parse video end: ', video.vod_name)
      }
      pageNum++
    } while (pageCount > pageNum)
  }

  fetchContent(pageNum: number) {
    return this.#fetch<ApiResponse<VideoDetail>>('/', { query: { ac: 'detail', pg: pageNum } })
  }

  async #updateGenre(video: Video, genres: Set<string>) {
    const hasUpdateGenre: VideoGenre[] = []
    for (const genre of genres) {
      const trimGenre = genre.trim()
      if (!trimGenre)
        continue
      let savedGenre = await this.#genreRepository.findOneBy({ name: trimGenre })
      if (!savedGenre)
        savedGenre = await this.#genreRepository.save({ name: trimGenre })
      const savedVideoGenre = await this.#videoGenreRepository.findOneBy({ video, genre: savedGenre })
      if (!savedVideoGenre) {
        const savedVideoGenre = await this.#videoGenreRepository.save({ video, genre: savedGenre })
        hasUpdateGenre.push(savedVideoGenre)
      }
    }
    return hasUpdateGenre
  }

  async #updateVideo(parsedVideo: ParsedVideo, type: VideoType) {
    const oldMovie = await this.#videoRepository.findOneBy({ name: parsedVideo.name, year: parsedVideo.year })
    if (oldMovie) {
      oldMovie.updateDateTime = Date.now()
      const result = await this.#videoRepository.update({ id: oldMovie.id }, { ...parsedVideo, type })
      if (result.affected)
        return { ...oldMovie, ...parsedVideo, type }
      else
        return oldMovie
    }
    else {
      const video = new Video()
      Object.assign(video, parsedVideo)
      video.type = type
      video.createDateTime = Date.now()
      video.updateDateTime = video.createDateTime
      return await this.#videoRepository.save(video)
    }
  }

  async #updateVideoProvider(videoId: number, providerId: number) {
    const videoProviderRepository = AppDataSource.getRepository(VideoProvider)
    let savedVideoProvider = await videoProviderRepository.findOneBy({ videoId, providerId })
    if (!savedVideoProvider)
      savedVideoProvider = await videoProviderRepository.save({ videoId, providerId })
    return savedVideoProvider
  }

  async #updateVideoEpisoder(videoProviderId: number, parsedEpisodes: ParsedVideoEposide[]) {
    const episodeList: Episode[] = []
    for (const parsedEpisode of parsedEpisodes) {
      // skip invaild url
      if (!parsedEpisode.name || !parsedEpisode.url)
        continue

      const episodeRepository = AppDataSource.getRepository(Episode)
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

  async #updateVideoPoster(videoProviderId: number, posterUrl: string) {
    const poster = new Poster()
    poster.videoProviderId = videoProviderId
    poster.url = posterUrl
    const posterRepository = AppDataSource.getRepository(Poster)
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
