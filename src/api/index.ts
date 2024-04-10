import { createServer } from 'node:http'
import process from 'node:process'
import { appendCorsHeaders, createApp, createRouter, defaultContentType, defineEventHandler, handleCors, isPreflightRequest, toNodeListener, useBase } from 'h3'
import debug from 'debug'
import { videoRouter } from './controller/video'
import { providerRouter } from './controller/provider'
import { genreRouter } from './controller/genre'

const log = debug('api:')
const app = createApp({
  debug: process.env.NODE_ENV === 'development',
  onRequest(event) {
    log('[incoming request]', event.method, event.path, event.headers)
  },
  onBeforeResponse(event, _response) {
    defaultContentType(event, 'application/json')
    appendCorsHeaders(event, {
      origin: '*',
      methods: '*',
      allowHeaders: '*',
    })
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

const server = createServer(toNodeListener(app))
server.listen(8080)
