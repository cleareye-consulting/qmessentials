import { ChangeEventHandler, useState } from 'react'

export interface MaskedInputProps {
  label: string
  name: string
  value: string
  setValue: (value: string) => void
  isRequired?: boolean
  validationTest?: (value: string) => boolean
  validationMessage?: string
  onValidationChange?: (name: string, isValid: boolean) => void
}

export default function MaskedInput({
  label,
  name,
  value,
  setValue,
  isRequired,
  validationTest,
  validationMessage,
  onValidationChange,
}: MaskedInputProps) {
  const [isValid, setIsValid] = useState(true)

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (validationTest && onValidationChange) {
      const isValidLocal = event.target.value ? validationTest(event.target.value) : !isRequired
      onValidationChange(name, isValidLocal)
      setIsValid(isValidLocal)
    }
    setValue(event.target.value)
  }

  return (
    <div className="mb-3">
      <label className="control-label" htmlFor={name}>
        {label}
        {isRequired ? '*' : ''}
      </label>
      <input
        type="password"
        name={name}
        className={`form-control${!isValid ? ' is-invalid' : ''}`}
        value={value}
        onChange={handleInputChange}
      />
      <div className="invalid-feedback">{validationMessage}</div>
    </div>
  )
}
