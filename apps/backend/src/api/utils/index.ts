export function makeListResult<T>(list: T[], total: number, page?: number, pageSize?: number) {
  return {
    list,
    total,
    page,
    pageSize,
  }
}

export function makeResult<T>(data: T) {
  return data
}
