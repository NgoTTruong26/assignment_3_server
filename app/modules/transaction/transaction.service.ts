import Transaction from '#models/transaction'
import { GetTransactionDTO } from './dto/getTransaction.dto.js'

export default class TransactionService {
  async getTransactionList({ page, perPage, keyword, sortedByDateTime }: GetTransactionDTO) {
    return await Transaction.query()
      .where((builder) => {
        if (keyword) {
          builder
            .whereRaw('LOWER("transaction_hash") LIKE LOWER(?)', [`%${keyword}%`])
            .orWhereRaw('CAST("block_number" AS TEXT) LIKE ?', [`%${keyword}%`])
            .orWhereRaw('LOWER("from") LIKE LOWER(?)', [`%${keyword}%`])
            .orWhereRaw('LOWER("to") LIKE LOWER(?)', [`%${keyword}%`])
            .orWhereRaw('LOWER("contract_address") LIKE LOWER(?)', [`%${keyword}%`])
            .orWhereRaw('LOWER("event_name") LIKE LOWER(?)', [`%${keyword}%`])
        }
      })
      .if(!sortedByDateTime, (builder) => {
        builder.orderBy('createdAt', 'desc')
      })
      .if(sortedByDateTime, (builder) => {
        builder.orderBy('dateTime', sortedByDateTime)
      })
      .paginate(page, perPage)
  }
}
