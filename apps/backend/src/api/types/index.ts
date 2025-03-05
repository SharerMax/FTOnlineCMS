import type { z } from 'zod'
import type { commonIntIdSchema } from '../schema/common'

export * from './provider'
export * from './video'

export type CommonIntIdQuery = z.infer<typeof commonIntIdSchema>
