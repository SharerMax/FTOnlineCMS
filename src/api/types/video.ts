import type { z } from 'zod'
import type { videoDetailSchema, videoEpisodeListSchema, videoPageListSchema, videoProviderSchema } from '../schema/video'

export type VideoPageListQuery = z.infer<typeof videoPageListSchema>
export type VideoDetailQuery = z.infer<typeof videoDetailSchema>
export type VideoEpisodeListQuery = z.infer<typeof videoEpisodeListSchema>
export type VideoProviderListQuery = z.infer<typeof videoProviderSchema>
