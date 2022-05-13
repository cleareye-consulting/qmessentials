import { list as listProducts, add as addProduct } from '../repositories/products.js'

export async function getMultiple(req, res) {
  const activeOnly = req.query ? req.query.activeOnly : null
  const results = await listProducts({ activeOnly })
  res.send(results)
}

export async function post(req, res) {
  const id = await addProduct(req.body, req.user)
  res.send(id)
}
