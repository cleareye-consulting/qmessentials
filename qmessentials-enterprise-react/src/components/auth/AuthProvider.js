import React, { Component } from 'react'
import Login from './Login'
import AuthContext from './AuthContext'

export default class AuthProvider extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: false,
            setLoginState: this.setLoginState
        }
    }

    hasCurrentSessionToken () {
        if (!localStorage.sessionToken) {
            return false
        }
        if (!localStorage.sessionDate) {
            return false
        }
        var hours = (new Date() - new Date(parseInt(localStorage.sessionDate))) / (1000 * 60 * 60)
        return hours < 12
    }
    
    setLoginState(value) {
        this.setState({ isLoggedIn: value })
    }

    componentDidMount() {
        this.setLoginState(this.hasCurrentSessionToken())
    }

    render() {        
        return (
            <AuthContext.Provider value={this.state}>
                {
                    this.state.isLoggedIn ? this.props.children : <Login onSessionTokenSet={() => this.setLoginState(true)} />
                }
            </AuthContext.Provider>
        )
    }
}