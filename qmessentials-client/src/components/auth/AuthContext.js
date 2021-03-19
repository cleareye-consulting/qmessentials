import React, { createContext, useContext } from 'react'

const userInfo = {}

const AuthContext = createContext(userInfo)

function AuthProvider(props) {
  return <AuthContext.Provider value={{ ...props }} />
}

const useAuth = () => useContext(AuthContext)

export { AuthProvider, useAuth }
