import { makeResult } from '../utils'
import { AppDataSource } from '@/repository/data-source'
import { Genre } from '@/repository/entry/genre'

const genreRepository = AppDataSource.getRepository(Genre)
export async function getGenreList() {
  return makeResult(await genreRepository.find())
}
