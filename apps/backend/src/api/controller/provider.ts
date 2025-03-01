import { createRouter, defineEventHandler, getValidatedRouterParams, readValidatedBody } from 'h3'
import { providerBodySchema, providerIdSchema, videoProviderByVideoSchema } from '../schema'
import { createOrUpdateProvider, deleteProvider, getProvider, getProviderList, getProvidersByVideo } from '../service/provider'

const providerRouter = createRouter()
// providerRouter.options('/**', defineEventHandler(event => console.log('options', event)))
providerRouter.get('/list', defineEventHandler(async (_event) => {
  return getProviderList()
}))

providerRouter.get('/:id', defineEventHandler(async (event) => {
  const param = await getValidatedRouterParams(event, providerIdSchema.parse)
  return getProvider(param)
}))

providerRouter.delete('/:id', defineEventHandler(async (event) => {
  const param = await getValidatedRouterParams(event, providerIdSchema.parse)
  return deleteProvider(param)
}))

providerRouter.use('/', defineEventHandler(async (event) => {
  const providerBody = await readValidatedBody(event, providerBodySchema.parse)
  return createOrUpdateProvider(providerBody)
}), ['post', 'put'])

// video provider
providerRouter.get('/video/:videoId', defineEventHandler(async (event) => {
  const query = await getValidatedRouterParams(event, videoProviderByVideoSchema.parse)
  return getProvidersByVideo(query)
}))

export { providerRouter }
