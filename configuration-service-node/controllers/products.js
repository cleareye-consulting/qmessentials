import { list as listProducts, select as selectProduct, add as addProduct, update as updateProduct } from '../repositories/products.js'

export async function getMultiple(req, res) {
  const activeOnly = req.query ? req.query.activeOnly : null
  const results = await listProducts({ activeOnly })
  res.send(results)
}

export async function getSingle(req, res) {
  const result = await selectProduct(req.params['productId'])
  res.send(result)
}

export async function post(req, res) {
  const id = await addProduct(req.body, req.user)
  res.send(id)
}

export async function put(req, res) {
  await updateProduct(req.params['productId'], req.body, req.user)
  res.end()
}
