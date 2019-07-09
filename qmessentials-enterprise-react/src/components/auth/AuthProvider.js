import React, { Component } from 'react'
import AuthContext from './AuthContext'


export default class AuthProvider extends Component {

    constructor(props) {
        super(props)
        this.setAuthToken = token => {
            this.setState({authToken: token})
        }
        this.state = {
            authToken: '',
            setAuthToken: this.setAuthToken
        }
    }    

    render() {        
        return (
            <AuthContext.Provider value={this.state}>                
                {this.props.children}
            </AuthContext.Provider>
        )
    }
}