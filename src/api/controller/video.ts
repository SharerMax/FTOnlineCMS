import { createRouter, defineEventHandler, getValidatedQuery, getValidatedRouterParams } from 'h3'
import { videoDetailSchema, videoEpisodeListSchema, videoPageListSchema, videoProviderSchema } from '../schema/video'
import { getProvidersByVideo, getVideList, getVideoById, getVideoEposideList } from '../service/video'

const videoRouter = createRouter()
// video list
videoRouter.get('/list', defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, videoPageListSchema.parse)
  return getVideList(query)
}))

// video detail
videoRouter.get('/detail/:id', defineEventHandler(async (event) => {
  const param = await getValidatedRouterParams(event, videoDetailSchema.parse)
  return getVideoById(param.id)
}))

// video episode
videoRouter.get('/episode', defineEventHandler(async (event) => {
  const param = await getValidatedQuery(event, videoEpisodeListSchema.parse)
  return getVideoEposideList(param)
}))

// video provider
videoRouter.get('/provider', defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, videoProviderSchema.parse)
  return getProvidersByVideo(query)
}))

export { videoRouter }
