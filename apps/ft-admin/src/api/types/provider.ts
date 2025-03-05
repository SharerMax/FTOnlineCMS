export interface ProviderRes {
  id: number
  name: string
  apiUrl: string
  apiKey?: string
  priority: number
  enable: boolean
  createDateTime: string
  updateDateTime: string
}
export interface ProviderData {
  name: string
  apiUrl: string
  apiKey?: string
  priority: number
  enable: boolean
}
