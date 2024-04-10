import { createRouter, defineEventHandler, getValidatedQuery, getValidatedRouterParams } from 'h3'
import { commomIntIdSchema, videoProviderByVideoSchema } from '../schema'
import { getProvider, getProviderList, getProvidersByVideo } from '../service/provider'

const providerRouter = createRouter()

providerRouter.get('/list', defineEventHandler(async (_event) => {
  return getProviderList()
}))

providerRouter.get('/:id', defineEventHandler(async (event) => {
  const param = await getValidatedRouterParams(event, commomIntIdSchema.parse)
  return getProvider(param)
}))

// video provider
providerRouter.get('/video/:videoId', defineEventHandler(async (event) => {
  const query = await getValidatedRouterParams(event, videoProviderByVideoSchema.parse)
  return getProvidersByVideo(query)
}))

export { providerRouter }
