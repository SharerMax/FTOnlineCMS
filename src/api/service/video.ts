import type { FindOptionsWhere } from 'typeorm'
import { Like } from 'typeorm'
import type { VideoEpisodeListQuery, VideoPageListQuery } from '@/api/types/video'
import { makeListResult, makeResult } from '@/api/utils'
import { AppDataSource } from '@/repository/data-source'
import { Episode } from '@/repository/entry/episode'
import { Video } from '@/repository/entry/video'

// const log = debug('api:service:video')
const videoRepository = AppDataSource.getRepository(Video)
const videoEposideRepository = AppDataSource.getRepository(Episode)

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

  const total = await videoRepository.count({ where: condition })
  const videos = await videoRepository.find({
    where: condition,
    skip: pageItemSkipCount,
    take: pageSize,
    relations: {
      genres: {
        genre: true,
      },
      poster: true,
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
      poster: true,
    },
  })
}

export async function getVideoEposideList(param: VideoEpisodeListQuery) {
  const eposides = await videoEposideRepository.find({ where: { video: { id: param.videoId }, provider: { id: param.providerId } } })
  return makeResult(eposides)
}
