import React from 'react'

let defaultState = {
    isLoggedIn: false,
    setLoginState: () => {  }
}

const AuthContext = React.createContext(defaultState)

export default AuthContext