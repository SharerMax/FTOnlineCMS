import type { ProviderBodyQuery, ProviderQuery, VideoProviderListQuery } from '../types/provider'
import { AppDataSource } from '@/repository/data-source'
import { Provider } from '@/repository/entry/provider'
import { makeResult } from '../utils'

const providerRepository = AppDataSource.getRepository(Provider)

export async function getProvider(params: ProviderQuery) {
  const provider = await providerRepository.findOneBy({ id: params.id })
  return makeResult(provider)
}

export async function deleteProvider(params: ProviderQuery) {
  const result = await providerRepository.delete({ id: params.id })
  if (result.affected === 0)
    return makeResult({ message: 'not found' })
  return makeResult('success')
}

export async function createOrUpdateProvider(provider: ProviderBodyQuery) {
  const result = await providerRepository.save(provider)
  return makeResult(result)
}

export async function updateProvider(provider: Provider) {
  const result = await providerRepository.update({ id: provider.id }, provider)
  return makeResult(result)
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
