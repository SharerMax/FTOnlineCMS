import { z } from 'zod'

export const commonIntIdSchema = z.object({ id: z.number({ coerce: true }).int().positive() })
