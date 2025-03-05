import { createRouter, defineEventHandler, getValidatedRouterParams, readValidatedBody } from 'h3'
import { providerBodySchema, providerIdSchema } from '../schema/provider'
import { videoProviderByVideoSchema } from '../schema/video'
import { createProvider, deleteProvider, getProvider, getProviderList, getProvidersByVideo, updateProvider } from '../service/provider'

const providerRouter = createRouter()
providerRouter.post('/item', defineEventHandler(async (event) => {
  const providerBody = await readValidatedBody(event, providerBodySchema.parse)
  return createProvider(providerBody)
}))
// providerRouter.options('/**', defineEventHandler(event => console.log('options', event)))
providerRouter.get('/list', defineEventHandler(async () => {
  return getProviderList()
}))

providerRouter.get('/:id', defineEventHandler(async (event) => {
  const param = await getValidatedRouterParams(event, providerIdSchema.parse)
  return getProvider(param)
}))

providerRouter.delete('/:id', defineEventHandler(async (event) => {
  console.error('delete', providerIdSchema)
  const param = await getValidatedRouterParams(event, providerIdSchema.parse)
  return deleteProvider(param)
}))

providerRouter.put('/:id', defineEventHandler(async (event) => {
  const param = await getValidatedRouterParams(event, providerIdSchema.parse)
  const providerBody = await readValidatedBody(event, providerBodySchema.parse)
  return updateProvider(param, providerBody)
}))

// video provider
providerRouter.get('/video/:videoId', defineEventHandler(async (event) => {
  const query = await getValidatedRouterParams(event, videoProviderByVideoSchema.parse)
  return getProvidersByVideo(query)
}))

export { providerRouter }
