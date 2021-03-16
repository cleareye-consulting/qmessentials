import { useState } from 'react'

export default function StandardInput({
  label,
  name,
  value,
  setValue,
  isRequired,
  validationTest,
  validationMessage,
  onValidationChange,
}) {
  const [isValid, setIsValid] = useState(true)

  const handleInputChange = (event) => {
    const isValidLocal = event.target.value
      ? validationTest(event.target.value)
      : !isRequired
    onValidationChange(name, isValidLocal)
    setIsValid(isValidLocal)
    setValue(event.target.value)
  }

  return (
    <div className="mb-3">
      <label className="control-label" htmlFor={name}>
        {label}
        {isRequired ? '*' : ''}
      </label>
      <input
        type="text"
        name={name}
        className={`form-control${!isValid ? ' is-invalid' : ''}`}
        value={value}
        onChange={handleInputChange}
      />
      <div className="invalid-feedback">{validationMessage}</div>
    </div>
  )
}
