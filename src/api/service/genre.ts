import { AppDataSource } from '@/repository/data-source'
import { Genre } from '@/repository/entry/genre'
import { makeResult } from '../utils'

const genreRepository = AppDataSource.getRepository(Genre)
export async function getGenreList() {
  return makeResult(await genreRepository.find())
}
