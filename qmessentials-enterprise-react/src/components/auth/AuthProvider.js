import React, { Component } from 'react'
import AuthContext from './AuthContext'
import Axios from 'axios';

export default class AuthProvider extends Component {

    constructor(props) {
        super(props)
        this.setAuthToken = token => {
            this.setState({ authToken: token })
            Axios.defaults.headers.common['Authorization'] = token.length > 0 ? ('Bearer ' + token) : null;
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