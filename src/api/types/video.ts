import type { z } from 'zod'
import type { videoDetailSchema, videoEpisodeListSchema, videoPageListSchema } from '../schema/video'

export type VideoPageListQuery = z.infer<typeof videoPageListSchema>
export type VideoDetailQuery = z.infer<typeof videoDetailSchema>
export type VideoEpisodeListQuery = z.infer<typeof videoEpisodeListSchema>
