import React from 'react'

let defaultState = {
    authToken: '',    
    userId: '',
    setAuthToken: () => {  }
}

const AuthContext = React.createContext(defaultState)

export default AuthContext