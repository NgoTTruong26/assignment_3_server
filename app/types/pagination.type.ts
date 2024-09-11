export interface Pagination {
  page: number
  perPage: number
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    pagination: Pagination
  }
}
