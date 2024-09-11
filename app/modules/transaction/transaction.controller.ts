import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import TransactionService from './transaction.service.js'

@inject()
export default class TransactionController {
  constructor(private transactionService: TransactionService) {}

  async getTransactionList(ctx: HttpContext) {
    try {
      const sortedByDateTime = ctx.request.qs().sortedByDateTime
      const keyword = ctx.request.qs().keyword

      const data = await this.transactionService.getTransactionList({
        ...ctx.pagination,
        sortedByDateTime,
        keyword,
      })
      ctx.response.send(data)
    } catch (error) {
      throw new Error(error)
    }
  }
}
