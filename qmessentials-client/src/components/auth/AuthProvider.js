import axios from 'axios'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthState = {
  None: 0, //render log in
  CheckingToken: 1, //render spinner
  LoggingIn: 2, //render spinner
  RetrievingUserInfo: 3, //render spinner
  UserInfoRetrieved: 4, //render children
  Error: 5, //render login with error
}

const AuthContext = createContext()

function AuthProvider(props) {
  const defaultUserInfo = useMemo(() => {
    return {
      userId: '',
      givenNames: [],
      familyNames: [],
      roles: [],
    }
  }, [])
  const [userInfo, setUserInfo] = useState(defaultUserInfo)

  const [authState, setAuthState] = useState(AuthState.None)

  useEffect(() => {
    ;(async () => {
      if (authState === AuthState.None) {
        const storedToken = localStorage.getItem('authToken')
        if (!storedToken) {
          return
        }
        axios.defaults.headers.common['Authorization'] = null
        setAuthState(AuthState.CheckingToken)
        try {
          const tokenPostResponse = await axios.post(`${process.env.REACT_APP_AUTH_SERVICE}/tokens`, storedToken)
          if (tokenPostResponse.status !== 200) {
            localStorage.removeItem('authToken')
            setUserInfo(defaultUserInfo)
            setAuthState(AuthState.None)
            return
          }
          const userInfoFromApi = tokenPostResponse.data
          setUserInfo(userInfoFromApi)
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
          setAuthState(AuthState.UserInfoRetrieved)
        } catch (error) {
          console.error(error)
          setAuthState(AuthState.Error)
        }
      }
    })()
  }, [authState, defaultUserInfo])

  const logIn = async (userId, password) => {
    setAuthState(AuthState.LoggingIn)
    try {
      const loginResponse = await axios.post(`${process.env.REACT_APP_AUTH_SERVICE}/logins`, {
        userId,
        password,
      })
      if (loginResponse.status !== 200) {
        localStorage.removeItem('authToken')
        setUserInfo(defaultUserInfo)
        setAuthState(AuthState.Error)
      }
      const token = loginResponse.data
      localStorage.setItem('authToken', token)
      setAuthState(AuthState.RetrievingUserInfo)
      const userInfoFromApi = (await axios.post(`${process.env.REACT_APP_AUTH_SERVICE}/tokens`, token)).data
      setUserInfo(userInfoFromApi)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setAuthState(AuthState.UserInfoRetrieved)
    } catch (error) {
      console.error(error)
      localStorage.removeItem('authToken')
      setUserInfo(defaultUserInfo)
      setAuthState(AuthState.Error)
    }
  }

  const logOut = () => {
    localStorage.removeItem('authToken')
    setUserInfo(defaultUserInfo)
    setAuthState(AuthState.None)
  }

  return <AuthContext.Provider value={{ authState, userInfo, logIn, logOut }} {...props} />
}

const useAuth = () => useContext(AuthContext)

export { AuthState, AuthProvider, useAuth, AuthContext }
