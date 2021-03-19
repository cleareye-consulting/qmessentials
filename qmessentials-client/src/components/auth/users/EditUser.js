import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import StandardInput from '../../StandardInput'
import DisabledInput from '../../DisabledInput'

export default function EditUser() {
  const history = useHistory()
  const [familyNames, setFamilyNames] = useState('')
  const [givenNames, setGivenNames] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [roles, setRoles] = useState([])
  const [isActive, setIsActive] = useState(null)

  const { userId } = useParams()

  useEffect(() => {
    let cancel = false
    ;(async () => {
      try {
        const user = (
          await axios.get(
            `${process.env.REACT_APP_AUTH_SERVICE}/users/${userId}`
          )
        ).data
        if (!cancel) {
          setGivenNames(user.givenNames.join(' '))
          setFamilyNames(user.familyNames.join(' '))
          setEmailAddress(user.emailAddress)
          setRoles(user.roles)
          setIsActive(user.isActive)
        }
      } catch (error) {
        console.error(error)
        setErrorMessage(
          'Unable to retrieve user from database. Please try again, or contact support.'
        )
      }
    })()
    return () => (cancel = true)
  }, [userId])

  const [validationResults, setValidationResults] = useState({
    userId: null,
    familyNames: null,
    givenNames: null,
    emailAddress: null,
    roles: null,
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

  const canSubmit = useMemo(
    () =>
      userId &&
      givenNames &&
      familyNames &&
      emailAddress &&
      roles.length !== 0 &&
      invalidCount === 0,
    [userId, givenNames, familyNames, emailAddress, roles, invalidCount]
  )
  const handleSubmit = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_AUTH_SERVICE}/users/${userId}`, {
        userId,
        givenNames: givenNames.split(' '),
        familyNames: familyNames.split(' '),
        emailAddress,
        roles,
        isActive,
      })
      history.push('/auth/users')
    } catch (error) {
      console.error(error)
      setErrorMessage(
        'Error saving user. Please try again, or contact support.'
      )
    }
  }

  return (
    <>
      <h2>Edit User</h2>
      <div className="col-xs-12 col-md-6 col-lg-4">
        <form
          className={`form ${invalidCount > 0 ? 'was-validated:invalid' : ''}`}
        >
          <DisabledInput label="User ID" name="userId" value={userId} />
          <StandardInput
            name="givenNames"
            label="Given Names (First, Middle, etc.)"
            value={givenNames}
            setValue={setGivenNames}
            validationTest={(value) => /^[A-Za-z0-9-' ]+$/.test(value)}
            validationMessage="Please use only letters, numbers, hyphens, and apostrophes"
            onValidationChange={(name, isValid) =>
              setValidationResults({ ...validationResults, [name]: isValid })
            }
            isRequired={true}
          />
          <StandardInput
            name="familyNames"
            label="Family Names (Last)"
            value={familyNames}
            setValue={setFamilyNames}
            validationTest={(value) => /^[A-Za-z0-9-' ]+$/.test(value)}
            validationMessage="Please use only letters, numbers, hyphens, and apostrophes"
            onValidationChange={(name, isValid) =>
              setValidationResults({ ...validationResults, [name]: isValid })
            }
            isRequired={true}
          />
          <StandardInput
            name="emailAddress"
            label="Email"
            value={emailAddress}
            setValue={setEmailAddress}
            validationTest={(value) => /^[^@]+@[^.]+.+$/.test(value)}
            validationMessage="Please enter a valid email address"
            onValidationChange={(name, isValid) =>
              setValidationResults({ ...validationResults, [name]: isValid })
            }
            isRequired={true}
          />
          <div className="mb-3">
            <label className="control-label" htmlFor="roles">
              Roles*
            </label>
            <select
              name="roles"
              className="form-control"
              value={roles}
              onChange={(event) =>
                setRoles(
                  Array.from(event.target.selectedOptions).map((o) => o.value)
                )
              }
              size={3}
              multiple={true}
            >
              <option value="Administrator">Administrator</option>
              <option value="Analyst">Analyst</option>
              <option value="Tester">Tester</option>
            </select>
          </div>
          <div className="mb-3 form-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={isActive}
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
      </div>
    </>
  )
}
