import { AppDataSource } from '@/repository/data-source'
import 'reflect-metadata'

try {
  // eslint-disable-next-line antfu/no-top-level-await
  await AppDataSource.initialize()
}
catch (error) {
  console.error(error)
}
