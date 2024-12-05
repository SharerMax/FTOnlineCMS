import z from 'zod'
import { commomIntIdSchema } from '.'

export const videoPageListSchema = z.object({
  page: z.number({ coerce: true }).int().positive(), // > 0
  pageSize: z.number({ coerce: true }).int().positive().lte(50).optional(), // <= 50
  name: z.string().optional(),
  type: z.number({ coerce: true }).int().positive().optional(), // <= 4   1: 电影 2: 电视剧 3: 综艺 4: 动漫
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

export const videoProviderByVideoSchema = z.object({
  videoId: z.number({ coerce: true }).int().positive(),
})

export const videoProviderDetailQuerySchema = commomIntIdSchema
