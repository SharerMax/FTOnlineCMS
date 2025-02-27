import { z } from 'zod'

export * from './provider'
export * from './video'

export const commomIntIdSchema = z.object({ id: z.number({ coerce: true }).int().positive() })
