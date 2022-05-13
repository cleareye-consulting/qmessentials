import pkg from 'pg'
import { logger } from '../app.js'
const { Pool } = pkg

export async function list({ activeOnly }) {
  const pool = new Pool()
  const { rows } = await pool.query(
    "select product_id, product_name, product_status from product where case when $1::boolean is null then true else product_status = 'Active' end;",
    [activeOnly]
  )
  return rows
}

export async function add(product, userId) {
  logger.info(`Call to add product from user ${userId}`)
  const pool = new Pool()
  const result = await pool.query(
    'insert into product (product_id, product_name, product_status, created_date, created_by_user_id, last_updated_date, last_updated_by_user_id) \
    values ($1::text, $2::text, $3::text, $4, $5, $4, $5) \
    returning product_id; \
    ',
    [product.productId, product.productName, 'Active', new Date(), userId]
  )
  return result.rows[0].product_id
}
