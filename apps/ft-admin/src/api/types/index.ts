export interface ApiRes<T> {
  code: number
  message: string
  data: T
}
