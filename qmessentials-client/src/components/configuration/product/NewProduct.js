import axios from 'axios'
import React, { useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import StandardInput from '../../StandardInput'

export default function NewProduct() {
  const history = useHistory()

  const [productId, setProductId] = useState('')
  const [productName, setProductName] = useState('')

  const [validationResults, setValidationResults] = useState({
    productId: null,
    productName: null,
  })

  const [saveError, setSaveError] = useState(null)

  const invalidCount = useMemo(() => {
    let count = 0
    for (let field in validationResults) {
      if (validationResults[field] === false) {
        count += 1
      }
    }
    return count
  }, [validationResults])

  const canSubmit = useMemo(
    () => productId && productName && invalidCount === 0,
    [productId, productName, invalidCount]
  )

  const handleSubmit = async () => {
    try {
      const existingRecord = (
        await axios.get(
          `${process.env.REACT_APP_CONFIGURATION_SERVICE}/products/${productId}`
        )
      ).data
      if (existingRecord) {
        setSaveError(
          `Product ID ${productId} already exists! Please choose another ID.`
        )
        return
      }
      const response = await axios.post(
        `${process.env.REACT_APP_CONFIGURATION_SERVICE}/products`,
        {
          productId: productId,
          productName: productName,
          isActive: true,
        }
      )
      if (response.status !== 201) {
        console.log(response)
        throw new Error('Invalid response received from configuration service')
      }
      history.push('/configuration/products')
    } catch (error) {
      console.error(error)
      setSaveError(
        'Error saving product. Please try again, or contact support.'
      )
    }
  }

  return (
    <>
      <h2>New Product</h2>
      <div className="col-xs-12 col-md-6 col-lg-4">
        <form className={invalidCount > 0 ? 'was-validated:invalid' : ''}>
          <StandardInput
            label="Product ID"
            name="productId"
            value={productId}
            setValue={setProductId}
            validationTest={(value) => /^[A-Z0-9_-]+$/.test(value)}
            validationMessage="Please use only uppercase letters, numbers, hyphens, and underscores"
            onValidationChange={(name, isValid) =>
              setValidationResults({ ...validationResults, [name]: isValid })
            }
            isRequired={true}
          />

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
          <hr />
          <div>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              Create
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary mx-2"
              onClick={() => history.goBack()}
            >
              Cancel
            </button>
          </div>
          {saveError !== null ? (
            <div className="alert alert-danger my-3">{saveError}</div>
          ) : (
            <></>
          )}
        </form>
      </div>
    </>
  )
}
