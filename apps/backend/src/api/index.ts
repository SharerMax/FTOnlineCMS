import { createServer } from 'node:http'
import process from 'node:process'
import debug from 'debug'
import { appendCorsHeaders, createApp, createError, createRouter, defaultContentType, defineEventHandler, getResponseStatus, handleCors, sendError, toNodeListener, useBase } from 'h3'
import { genreRouter } from './controller/genre'
import { providerRouter } from './controller/provider'
import { videoRouter } from './controller/video'

const log = debug('api:')
const app = createApp({
  debug: process.env.NODE_ENV === 'development',
  onRequest(event) {
    log('[incoming request]', event.method, event.path, event.headers)
  },
  onBeforeResponse(event, _response) {
    appendCorsHeaders(event, {
      origin: '*',
      methods: '*',
      allowHeaders: '*',
    })
    const statusCode = getResponseStatus(event)
    if (statusCode >= 500) {
      sendError(event, createError({ statusCode, message: 'Internal Server Error', statusMessage: 'Internal Server Error' }))
      return
    }
    defaultContentType(event, 'application/json')
  },
})
const router = createRouter()

router.get('/hello', defineEventHandler(() => 'Hello World!'))

const apiRouter = createRouter()
apiRouter.use('/video/**', useBase('/video', videoRouter.handler))
apiRouter.use('/provider/**', useBase('/provider', providerRouter.handler))
apiRouter.use('/genre/**', useBase('/genre', genreRouter.handler))
router.use('/api/**', useBase('/api', apiRouter.handler))
app.use(router)

// CORS middleware
app.use(defineEventHandler(async (event) => {
  handleCors(event, {
    origin: '*',
    methods: '*',
    allowHeaders: '*',
    preflight: {
      statusCode: 204,
    },
  })
}))

const server = createServer(toNodeListener(app))
server.listen(8080)
