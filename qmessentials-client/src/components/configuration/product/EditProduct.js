import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import DisabledInput from '../../DisabledInput'
import StandardInput from '../../StandardInput'

export default function EditProduct() {
  const history = useHistory()

  const [productName, setProductName] = useState('')
  const [isActive, setIsActive] = useState(null)
  const [createdDate, setCreatedDate] = useState(null)

  const { productId } = useParams()

  useEffect(() => {
    let cancel = false
    ;(async () => {
      try {
        const product = (
          await axios.get(
            `${process.env.REACT_APP_CONFIGURATION_SERVICE}/products/${productId}`
          )
        ).data
        if (!cancel) {
          setProductName(product.productName)
          setCreatedDate(product.createdDate)
          setIsActive(product.isActive)
        }
      } catch (error) {
        console.error(error)
        setErrorMessage(
          'Unable to retrieve product from database. Please try again, or contact support.'
        )
      }
    })()
    return () => (cancel = true)
  }, [productId])

  const [validationResults, setValidationResults] = useState({
    productName: null,
  })

  const [errorMessage, setErrorMessage] = useState(null)

  const invalidCount = useMemo(() => {
    let count = 0
    for (let field in validationResults) {
      if (validationResults[field] === false) {
        count += 1
      }
    }
    return count
  }, [validationResults])

  const canSubmit = useMemo(() => productName && invalidCount === 0, [
    productName,
    invalidCount,
  ])

  const handleSubmit = () => {
    try {
      axios.put(
        `${process.env.REACT_APP_CONFIGURATION_SERVICE}/products/${productId}`,
        {
          productId,
          productName,
          createdDate,
          isActive,
        }
      )
      history.push('/configuration/products')
    } catch (error) {
      console.error(error)
      setErrorMessage(
        'Error saving product. Please try again, or contact support.'
      )
    }
  }

  return (
    <>
      <h2>Edit Product {productId}</h2>
      <form>
        <DisabledInput label="Product ID" name="productId" value={productId} />
        <StandardInput
          label="Product Name"
          name="productName"
          value={productName}
          setValue={setProductName}
          validationTest={(value) => /^[A-Za-z0-9_ '-]+$/.test(value)}
          validationMessage="Please use only letters, numbers, hyphens, underscores, apostrophes, and spaces"
          onValidationChange={(name, isValid) =>
            setValidationResults({ ...validationResults, [name]: isValid })
          }
          isRequired={true}
        />
        <div className="mb-3 form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={isActive || false}
            disabled={isActive === null}
            onChange={(event) => setIsActive(event.target.checked)}
            name="isActive"
            id="isActive"
          />
          <label className="form-check-label" htmlFor="isActive">
            Active
          </label>
        </div>
        <hr />
        <div>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            Save
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary mx-2"
            onClick={() => history.goBack()}
          >
            Cancel
          </button>
        </div>
        {errorMessage !== null ? (
          <div className="alert alert-danger my-3">{errorMessage}</div>
        ) : (
          <></>
        )}
      </form>
    </>
  )
}
