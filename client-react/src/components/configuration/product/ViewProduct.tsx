import axios from 'axios'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'

export default function EditProduct() {
  const history = useHistory()

  const [productName, setProductName] = useState('')
  const [isActive, setIsActive] = useState(null)

  const { productId } = useParams<{ productId: string }>()
  const [errorMessage, setErrorMessage] = useState('')

  useEffect((): void | (() => void) => {
    let cancel = false
    ;(async () => {
      try {
        const product = (await axios.get(`${process.env.REACT_APP_CONFIGURATION_SERVICE}/products/${productId}`)).data
        if (!cancel) {
          setProductName(product.productName)
          setIsActive(product.isActive)
        }
      } catch (error) {
        console.error(error)
        setErrorMessage('Unable to retrieve product from database. Please try again, or contact support.')
      }
    })()
    return () => (cancel = true)
  }, [productId])

  return (
    <>
      <h2>View Product {productId}</h2>
      <dl>
        <dt>Product ID</dt>
        <dd>{productId}</dd>
        <dt>Product Name</dt>
        <dd>{productName}</dd>
        <dt>Active</dt>
        <dd>{isActive ? 'Yes' : 'No'}</dd>
      </dl>
      <hr />
      <div>
        <button type="button" className="btn btn-primary" onClick={() => history.goBack()}>
          Go Back
        </button>
      </div>
      {errorMessage !== null ? <div className="alert alert-danger my-3">{errorMessage}</div> : <></>}
    </>
  )
}
