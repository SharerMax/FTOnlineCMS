import { createRouter, defineEventHandler } from 'h3'
import { getGenreList } from '../service/genre'

const genreRouter = createRouter()

genreRouter.get('/list', defineEventHandler(async (_event) => {
  return getGenreList()
}))
export { genreRouter }
