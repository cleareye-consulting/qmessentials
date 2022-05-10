import { listProducts } from '../repositories/products.js'

export async function list(req, res) {
  const activeOnly = req.query ? req.query.activeOnly : null
  const results = await listProducts({ activeOnly })
  res.send(results)
}
