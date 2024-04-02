import { AppDataSource } from '@/repository/data-source'
import 'reflect-metadata'

try {
  await AppDataSource.initialize()
}
catch (error) {
  console.error(error)
}
