import axios from 'axios'
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const AuthContext = createContext()

function AuthProvider(props) {
  const [userInfo, setUserInfo] = useState({
    userId: '',
    givenNames: [],
    familyNames: [],
    roles: [],
  })

  const [hasValidToken, setHasValidToken] = useState(false)
  const [isCheckingToken, setIsCheckingToken] = useState(false)

  const storedToken = useMemo(() => localStorage.getItem('authToken'), [])

  useEffect(() => {
    if (hasValidToken) {
      return
    }
  }, [hasValidToken, isCheckingToken, storedToken])

  const logIn = async (userId, password) => {
    const token = (
      await axios.post(`${process.env.REACT_APP_AUTH_SERVICE}/logins`, {
        userId,
        password,
      })
    ).data //bubble up any error that occurs
    localStorage.setItem('authToken', token)
    const userInfoFromApi = (
      await axios.post(`${process.env.REACT_APP_AUTH_SERVICE}/tokens`, token)
    ).data
    setUserInfo(userInfoFromApi)
  }

  const logOut = () => {
    localStorage.removeItem('authToken')
  }
  return <AuthContext.Provider value={{ userInfo, logIn, logOut }} {...props} />
}

const useAuth = () => useContext(AuthContext)

export { AuthProvider, useAuth }
