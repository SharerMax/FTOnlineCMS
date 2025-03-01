import type { z } from 'zod'
import type { providerBodySchema, providerIdSchema, videoProviderByVideoSchema, videoProviderDetailQuerySchema } from '../schema'

export type ProviderQuery = z.infer<typeof providerIdSchema>
export type VideoProviderListQuery = z.infer<typeof videoProviderByVideoSchema>
export type VideoProviderDetailQuery = z.infer<typeof videoProviderDetailQuerySchema>

export type ProviderBodyQuery = z.infer<typeof providerBodySchema>
