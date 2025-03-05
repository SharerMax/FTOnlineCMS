import { z } from 'zod'
import { commonIntIdSchema } from './common'

export const providerIdSchema = commonIntIdSchema

export const providerBodySchema = z.object({
  name: z.string(),
  apiUrl: z.string().url(),
  apikey: z.string().optional(),
  priority: z.number({ coerce: true }).int().gte(0).default(0),
  enable: z.boolean().default(true),
})
