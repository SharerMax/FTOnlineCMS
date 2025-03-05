import type { z } from 'zod'
import type { videoProviderByVideoSchema, videoProviderDetailQuerySchema } from '../schema'
import type { providerBodySchema, providerIdSchema } from '../schema/provider'

export type ProviderIdQuery = z.infer<typeof providerIdSchema>
export type VideoProviderListQuery = z.infer<typeof videoProviderByVideoSchema>
export type VideoProviderDetailQuery = z.infer<typeof videoProviderDetailQuerySchema>

export type ProviderBodyQuery = z.infer<typeof providerBodySchema>
