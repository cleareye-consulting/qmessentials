import React, { useEffect, useState } from 'react'
import Axios from 'axios'

export default function Products() {

    const [products, setProducts] = useState([])

    useEffect(() => {
        let cancel = false;
        (async () => {
            const productsFromAPI = (await Axios.get('/configuration/products')).data
            if (!cancel) {
                setProducts(productsFromAPI)
            }
        })()
        return () => cancel = true
    }, [])

    return (
        <>
        <h2>Products</h2>
        <table>
            <thead>
                <tr>
                    <th>Product ID</th>
                    <th>Product Name</th>
                </tr>
            </thead>
            <tbody>
                {products.map(p => <tr key={p.productId}>
                    <td>{p.productId}</td>
                    <td>{p.productName}</td>
                </tr>)}
            </tbody>
        </table>
        </>
    )
}