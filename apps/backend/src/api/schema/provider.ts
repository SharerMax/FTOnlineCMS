import { z } from 'zod'
import { commomIntIdSchema } from '.'

export const providerIdSchema = commomIntIdSchema

export const providerBodySchema = z.object({
  id: z.number({ coerce: true }).int().positive().optional(),
  name: z.string(),
  apiUrl: z.string().url(),
  apikey: z.string().optional(),
  priority: z.number({ coerce: true }).int().positive().default(0),
  enable: z.boolean().default(true),
})
