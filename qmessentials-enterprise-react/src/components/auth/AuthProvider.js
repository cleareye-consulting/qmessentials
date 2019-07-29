import React, { useState, useEffect } from 'react'
import AuthContext from './AuthContext'
import axios from 'axios';

export default props => {
    const [authToken, setAuthTokenLocal] = useState('')
    const [userId, setUserId] = useState('')
    const setAuthToken = (token, userId) => {
        setAuthTokenLocal(token)
        setUserId(userId)
        if (token.length > 0) {
            sessionStorage['authToken'] = token
            sessionStorage['userId'] = userId
        }
        else {
            sessionStorage.removeItem('authToken')
            sessionStorage.removeItem('userId')
        }
        axios.defaults.headers.common['Authorization'] = (token.length > 0) ? ('Bearer ' + token) : null;
    }
    useEffect(() => {
        if (sessionStorage['authToken']) {
            setAuthToken(sessionStorage['authToken'], sessionStorage['userId'])
        }
    })
    const defaultValue = {
        authToken: authToken,
        userId: userId,
        setAuthToken: setAuthToken
    }
    return (
        <AuthContext.Provider value={defaultValue}>
            {props.children}
        </AuthContext.Provider>
    )
}