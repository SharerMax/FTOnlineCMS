import debug from 'debug'
import type { FindOptionsWhere } from 'typeorm'
import { Like } from 'typeorm'
import type { VideoEpisodeListQuery, VideoPageListQuery, VideoProviderListQuery } from '@/api/types/video'
import { makeListResult, makeResult } from '@/api/utils'
import { AppDataSource } from '@/repository/data-source'
import { Video } from '@/repository/entry/video'
import { VideoGenre } from '@/repository/entry/video-genre'
import { Episode } from '@/repository/entry/episode'
import { VideoProvider } from '@/repository/entry/video-provider'
import { Provider } from '@/repository/entry/provider'

// const log = debug('api:service:video')
const videoRepository = AppDataSource.getRepository(Video)
const videoEposideRepository = AppDataSource.getRepository(Episode)
const videoProviderRepository = AppDataSource.getRepository(VideoProvider)
export async function getVideList(param: VideoPageListQuery) {
  const pageSize = param.pageSize ?? 20
  const pageItemSkipCount = (param.page - 1) * pageSize
  const condition: FindOptionsWhere<Video> = {}
  if (param.name)
    condition.name = Like(`%${param.name}%`)

  if (param.type)
    condition.type = param.type

  if (param.year)
    condition.year = param.year

  if (param.genre)
    condition.genres = { id: param.genre }

  const total = await videoRepository.count({ where: { name: Like(`%${param.name}%`) } })
  const videos = await videoRepository.find({
    where: { name: Like(`%${param.name}%`) },
    skip: pageItemSkipCount,
    take: pageSize,
    relations: {
      genres: {
        genre: true,
      },
    },
  })
  return makeListResult(videos, total, param.page, pageSize)
}

export async function getVideoById(id: number) {
  return videoRepository.findOne({
    where: { id },
    relations: {
      genres: {
        genre: true,
      },
    },
  })
}

export async function getVideoEposideList(param: VideoEpisodeListQuery) {
  const queryBuilder = videoEposideRepository.createQueryBuilder('eposide')
  const eposide = await queryBuilder.leftJoin('video_provider', 'videoProvider', 'videoProvider.id = eposide.videoProviderId')
    .where('videoProvider.videoId = :videoId AND videoProvider.providerId = :providerId', { videoId: param.videoId, providerId: param.providerId })
    .getMany()
  return makeResult(eposide)
}

export async function getProvidersByVideo(param: VideoProviderListQuery) {
  const queryBuilder = videoProviderRepository.createQueryBuilder('videoProvider')
  const providers = await queryBuilder.leftJoinAndSelect(Provider, 'provider', 'provider.id = videoProvider.providerId')
    .select('videoProvider.*')
    .addSelect('provider.name', 'providerName')
    .where('videoProvider.videoId = :videoId', { videoId: param.videoId })
    .getRawMany()
  return makeResult(providers)
}
