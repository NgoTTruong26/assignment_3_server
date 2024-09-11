/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const TransactionController = () => import('#modules/transaction/transaction.controller')

router
  .group(() => {
    router.get('/', async () => {
      return {
        hello: 'world',
      }
    })

    router
      .get('/transactions', [TransactionController, 'getTransactionList'])
      .use(middleware.pagination())
  })
  .prefix('api')
