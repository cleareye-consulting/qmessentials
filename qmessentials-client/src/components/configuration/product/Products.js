import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { Link } from 'react-router-dom'

export default function Products() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    let cancel = false
    ;(async () => {
      const productsFromAPI = (
        await Axios.get(
          `${process.env.REACT_APP_CONFIGURATION_SERVICE}/products`
        )
      ).data
      if (!cancel) {
        setProducts(productsFromAPI)
      }
    })()
    return () => (cancel = true)
  }, [])

  return (
    <>
      <h2>Products</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.productId}>
              <td>{p.productId}</td>
              <td>
                {p.productName}
                {!p.isActive ? ' (INACTIVE)' : ''}
              </td>
              <td>
                <Link to={`/configuration/products/${p.productId}/edit`}>
                  edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/configuration/products/new">Add a Product</Link>
    </>
  )
}
