import type { z } from 'zod'
import type { providerSchema, videoProviderByVideoSchema, videoProviderDetailQuerySchema } from '../schema'

export type ProviderQuery = z.infer<typeof providerSchema>
export type VideoProviderListQuery = z.infer<typeof videoProviderByVideoSchema>
export type VideoProviderDetailQuery = z.infer<typeof videoProviderDetailQuerySchema>
