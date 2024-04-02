import { createServer } from 'node:http'
import process from 'node:process'
import { createApp, createRouter, defaultContentType, defineEventHandler, toNodeListener, useBase } from 'h3'
import debug from 'debug'
import { videoRouter } from './controller/video'

const log = debug('api:')
const app = createApp({
  debug: process.env.NODE_ENV === 'development',
  onRequest(event) {
    log('[incoming request]', event.method, event.path, event.headers)
  },
  onBeforeResponse(event, _response) {
    defaultContentType(event, 'application/json')
  },
})
const router = createRouter()
router.get('/hello', defineEventHandler(() => 'Hello World!'))

const apiRouter = createRouter()
apiRouter.use('/video/**', useBase('/video', videoRouter.handler))

router.use('/api/**', useBase('/api', apiRouter.handler))
app.use(router)

const server = createServer(toNodeListener(app))
server.listen(8080)
