import pkg from 'pg'
const { Pool } = pkg

export async function listProducts({ activeOnly }) {
  const pool = new Pool()
  const { rows } = await pool.query(
    "select product_id, product_name, product_status from product where case when $1 is null then true else product_status = 'Active'",
    [activeOnly]
  )
  return rows
}
