import axios from 'axios'
import React, { useMemo, useState } from 'react'
import { useHistory } from 'react-router'
import StandardInput from '../../StandardInput'

export default function NewUser() {
  const history = useHistory()
  const [userId, setUserId] = useState('')
  const [familyNames, setFamilyNames] = useState('')
  const [givenNames, setGivenNames] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [roles, setRoles] = useState([])

  const [validationResults, setValidationResults] = useState({
    userId: null,
    familyNames: null,
    givenNames: null,
    emailAddress: null,
    roles: null,
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
      const existingRecord = (
        await axios.get(`${process.env.REACT_APP_AUTH_SERVICE}/users/${userId}`)
      ).data
      if (existingRecord) {
        setSaveError(
          `User ID ${userId} already exists! Please choose another ID.`
        )
        return
      }
      const response = await axios.post(
        `${process.env.REACT_APP_AUTH_SERVICE}/users`,
        {
          userId,
          givenNames: givenNames.split(' '),
          familyNames: familyNames.split(' '),
          emailAddress,
          roles,
          isActive: true,
        }
      )
      if (response.status !== 201) {
        console.log(response)
        throw new Error('Invalid response received from auth service')
      }
      history.push('/auth/users')
    } catch (error) {
      console.error(error)
      setSaveError('Error saving user. Please try again, or contact support.')
    }
  }
  return (
    <>
      <h2>New User</h2>
      <div className="col-xs-12 col-md-6 col-lg-4">
        <form
          className={`form ${invalidCount > 0 ? 'was-validated:invalid' : ''}`}
        >
          <StandardInput
            label="User ID"
            name="userId"
            value={userId}
            setValue={setUserId}
            validationTest={(value) => /^[A-Za-z0-9_-]+$/.test(value)}
            validationMessage="Please use only letters, numbers, hyphens, and underscores"
            onValidationChange={(name, isValid) =>
              setValidationResults({ ...validationResults, [name]: isValid })
            }
            isRequired={true}
          />
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
