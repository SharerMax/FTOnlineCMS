import type { z } from 'zod'
import type { commomIntIdSchema } from '../schema'

export * from './provider'
export * from './video'

export type CommonIntIdQuery = z.infer<typeof commomIntIdSchema>
