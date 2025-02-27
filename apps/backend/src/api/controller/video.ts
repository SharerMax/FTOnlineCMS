import { VideoType } from '@/repository/types'
import { createError, createRouter, defineEventHandler, getValidatedQuery, getValidatedRouterParams } from 'h3'
import { videoDetailSchema, videoEpisodeListSchema, videoPageListSchema } from '../schema/video'
import { getVideList, getVideoById, getVideoEposideList } from '../service/video'

const videoRouter = createRouter()
// video list
videoRouter.get('/list', defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, videoPageListSchema.parse)
  if (query.type && !Object.values(VideoType).includes(query.type))
    throw createError({ statusCode: 400, statusMessage: 'type is invalid' })

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

export { videoRouter }
