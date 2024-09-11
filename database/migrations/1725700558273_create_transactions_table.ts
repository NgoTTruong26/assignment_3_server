import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('transaction_hash', 66)
      table.string('status', 66).nullable().defaultTo(null)
      table.integer('block_number').notNullable()
      table.timestamp('date_time', { useTz: true }).notNullable()
      table.string('from', 66).notNullable()
      table.string('to', 66).nullable().defaultTo(null)
      table.string('contract_address', 66).nullable().defaultTo(null)
      table.string('event_name').notNullable()
      table.string('transfer_from', 66).nullable()
      table.string('transfer_to', 66).nullable()
      table.integer('nft_id').nullable().defaultTo(null)
      table.decimal('amount', 15, 8).nullable().defaultTo(null)
      table.decimal('gas_price_used', 15, 8).notNullable()

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
