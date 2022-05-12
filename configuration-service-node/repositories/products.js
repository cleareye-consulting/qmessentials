import pkg from 'pg'
const { Pool } = pkg

export async function list({ activeOnly }) {
  const pool = new Pool()
  const { rows } = await pool.query(
    "select product_id, product_name, product_status from product where case when $1::boolean is null then true else product_status = 'Active' end;",
    [activeOnly]
  )
  return rows
}
