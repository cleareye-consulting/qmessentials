import { useMemo, useState } from 'react'
import StandardInput from '../StandardInput'
import DisabledInput from '../DisabledInput'
import { useAuth, AuthState } from './AuthProvider'

export default function Login() {
  const { authState, logIn } = useAuth()
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')

  const canInput = useMemo(() => authState === AuthState.None || authState === AuthState.Error, [authState])

  const handleLoginButtonClick = () => {
    logIn(userId, password)
  }

  return (
    <>
      <h2>User Login</h2>
      <div className="col-xs-12 col-md-6 col-lg-4">
        <form className="form">
          {canInput ? (
            <StandardInput label="User ID" name="userId" value={userId} setValue={setUserId} />
          ) : (
            <DisabledInput label="User ID" name="userId" value={userId} />
          )}
          {canInput ? (
            <StandardInput label="Password" name="password" value={password} setValue={setPassword} />
          ) : (
            <DisabledInput label="Password" name="password" value="*****" />
          )}
          <hr />
          <div>
            <button type="button" className="btn btn-primary" onClick={handleLoginButtonClick} disabled={!canInput || !userId || !password}>
              <>
                {!canInput ? <span className="spinner-border-sm" /> : <></>}
                <span>Log In</span>
              </>
            </button>
          </div>
          {authState === AuthState.Error ? (
            <div className="alert alert-danger my-3">There was a problem with your login. Please try again, or contact support</div>
          ) : (
            <></>
          )}
        </form>
      </div>
    </>
  )
}
