import pkg from 'pg'
import { logger } from '../app.js'
const { Pool } = pkg

export async function list({ activeOnly }) {
  const pool = new Pool()
  const { rows } = await pool.query(
    "select product_id, product_name, product_status \
    from product \
    where case when $1::boolean is null then true else product_status = 'Active' end;",
    [activeOnly]
  )
  return rows.map((r) => {
    return {
      productId: r.product_id,
      productName: r.product_name,
      productStatus: r.product_status,
    }
  })
}

export async function select(productId) {
  const pool = new Pool()
  const { rows } = await pool.query('select product_id, product_name, product_status \
    from product \
    where product_id = $1::text', [
    productId,
  ])
  if (rows.length > 1) {
    throw Error(`Multiple records returned for product_id ${productId}`)
  }
  if (rows.length === 0) {
    return null
  }
  return {
    productId: rows[0].product_id,
    productName: rows[0].product_name,
    productStatus: rows[0].product_status,
  }
}

export async function add(product, userId) {
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

export async function update(productId, product, userId) {
  const pool = new Pool()
  await pool.query(
    'update product \
    set product_name = $1::text, \
      product_status = $2::text, \
      last_updated_date = $3, \
      last_updated_by_user_id = $4 \
    where product_id = $5',
    [product.productName, product.productStatus, new Date(), userId, productId]
  )
}
