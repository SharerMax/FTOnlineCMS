import type { ProviderBodyQuery, ProviderIdQuery, VideoProviderListQuery } from '../types/provider'
import { makeResult } from '@/api/utils'
import { AppDataSource } from '@/repository/data-source'
import { Provider } from '@/repository/entry/provider'

const providerRepository = AppDataSource.getRepository(Provider)

export async function getProvider(params: ProviderIdQuery) {
  const provider = await providerRepository.findOneBy({ id: params.id })
  return makeResult(provider)
}

export async function deleteProvider(params: ProviderIdQuery) {
  const result = await providerRepository.delete({ id: params.id })
  if (result.affected === 0)
    return makeResult({ message: 'not found' })
  return makeResult('success')
}

export async function updateProvider(providerId: ProviderIdQuery, provider: ProviderBodyQuery) {
  const result = await providerRepository.update({ id: providerId.id }, provider)
  return makeResult(result)
}

export async function createProvider(provider: ProviderBodyQuery) {
  await providerRepository.insert(provider)
  return makeResult('success')
}

export async function getProviderList() {
  const providers = await providerRepository.find()
  return makeResult(providers)
}

export async function getProvidersByVideo(params: VideoProviderListQuery) {
  const query = providerRepository.createQueryBuilder('provider')
  const providers = await query.leftJoin('episode', 'episode', 'episode.providerId = provider.id').where('episode.videoId = :videoId', { videoId: params.videoId }).getMany()
  return makeResult(providers)
}
