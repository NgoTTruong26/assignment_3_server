export type sortedByDateTime = 'asc' | 'desc'

export interface GetTransactionDTO {
  page: number
  perPage: number
  keyword?: string
  sortedByDateTime?: sortedByDateTime
}
