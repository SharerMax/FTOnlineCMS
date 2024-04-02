import z from 'zod'
import { VideoType } from '@/repository/types'

export const videoPageListSchema = z.object({
  page: z.number({ coerce: true }).int().positive(), // > 0
  pageSize: z.number({ coerce: true }).int().positive().lte(20).optional(), // <= 20
  name: z.string().optional(),
  type: z.nativeEnum(VideoType).optional(), // <= 4   1: 电影 2: 电视剧 3: 综艺 4: 动漫
  year: z.number({ coerce: true }).int().positive().lte(2024).optional(), // <= 2024
  genre: z.number({ coerce: true }).int().positive().optional(),
})

export const videoDetailSchema = z.object({
  id: z.number({ coerce: true }).int().positive(),
})

export const videoEpisodeListSchema = z.object({
  videoId: z.number({ coerce: true }).int().positive(),
  providerId: z.number({ coerce: true }).int().positive(),
})

export const videoProviderSchema = z.object({
  videoId: z.number({ coerce: true }).int().positive(),
})
