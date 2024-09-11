import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { StatusCodes } from 'http-status-codes'
import { PaginationDTO } from '../dto/pagination.dto.js'

export default class PaginationMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    try {
      /**
       * Middleware logic goes here (before the next call)
       */
      const { request } = ctx
      const page = Number(request.input('page' as keyof PaginationDTO, 1))
      const perPage = Number(request.input('perPage' as keyof PaginationDTO, 5))

      if (!page || !perPage) {
        throw new Error()
      }

      ctx.pagination = {
        page,
        perPage,
      }

      /**
       * Call next method in the pipeline and return its output
       */
      const output = await next()
      return output
    } catch (error) {
      return ctx.response.status(StatusCodes.BAD_REQUEST).send({
        status: StatusCodes.BAD_REQUEST,
        messages: 'Invalid pagination params',
      })
    }
  }
}
