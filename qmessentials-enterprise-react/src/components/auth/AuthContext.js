import React from 'react'

let defaultState = {
    authToken: '',    
    setAuthToken: () => {  }
}

const AuthContext = React.createContext(defaultState)

export default AuthContext