import axios from 'axios'
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { User } from '../../types'

enum AuthState {
  None, //render log in
  CheckingToken, //render spinner
  LoggingIn, //render spinner
  RetrievingUserInfo, //render spinner
  UserInfoRetrieved, //render children
  Error, //render login with error
}

export interface AuthContextInfo {
  authState: AuthState
  userInfo: User
  logIn: (userId: string, password: string) => void
  logOut: () => void
}

const defaultUserInfo: User = {
  userId: '',
  givenNames: [],
  familyNames: [],
  roles: [],
  emailAddress: '',
  isActive: false,
}

const AuthContext = createContext<AuthContextInfo>({
  authState: AuthState.None,
  userInfo: defaultUserInfo,
  logIn: () => {},
  logOut: () => {},
})

function AuthProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState(defaultUserInfo)

  const [authState, setAuthState] = useState(AuthState.None)

  useEffect(() => {
    ;(async () => {
      if (authState === AuthState.None) {
        const storedToken = localStorage.getItem('authToken')
        if (!storedToken) {
          return
        }
        axios.defaults.headers.common['Authorization'] = ''
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
  }, [authState])

  const logIn = async (userId: string, password: string) => {
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

  return <AuthContext.Provider value={{ authState, userInfo, logIn, logOut }}>{children}</AuthContext.Provider>
}

const useAuth = () => useContext(AuthContext)

export { AuthState, AuthProvider, useAuth, AuthContext }
