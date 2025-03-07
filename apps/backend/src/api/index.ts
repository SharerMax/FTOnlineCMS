import { createServer } from 'node:http'
import process from 'node:process'
import debug from 'debug'
import { createApp, createError, createRouter, defaultContentType, defineEventHandler, getResponseStatus, handleCors, sendError, toNodeListener, useBase } from 'h3'
import { crawlerRouter } from './controller/crawler-task'
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
    const statusCode = getResponseStatus(event)
    if (statusCode >= 500) {
      sendError(event, createError({ statusCode, message: 'Internal Server Error', statusMessage: 'Internal Server Error' }))
      return
    }
    defaultContentType(event, 'application/json')
  },
  onError(error) {
    log('[error]', error)
  },
})
const router = createRouter()

router.get('/hello', defineEventHandler(() => 'Hello World!'))

const apiRouter = createRouter()
apiRouter.use('/video/**', useBase('/video', videoRouter.handler))
apiRouter.use('/provider/**', useBase('/provider', providerRouter.handler))
apiRouter.use('/genre/**', useBase('/genre', genreRouter.handler))
apiRouter.use('/crawlerTask/**', useBase('/crawlerTask', crawlerRouter.handler))
router.use('/api/**', useBase('/api', apiRouter.handler))

// CORS middleware
app.use(defineEventHandler(async (event) => {
  handleCors(event, {
    origin: '*',
    methods: '*',
  })
}))
app.use(router.handler)

const server = createServer(toNodeListener(app))
server.listen(8080)
