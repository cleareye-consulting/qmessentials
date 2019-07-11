import React, { Component } from 'react'
import AuthContext from './AuthContext'
import axios from 'axios';

export default class AuthProvider extends Component {

    constructor(props) {
        super(props)
        this.setAuthToken = (token, userId) => {
            this.setState({ authToken: token, userId: userId })
            if (token.length > 0) {
                sessionStorage['authToken'] = token
                sessionStorage['userId'] = userId
            }
            else {
                sessionStorage.removeItem('authToken')
                sessionStorage.removeItem('userId')
            }
            axios.defaults.headers.common['Authorization'] = (token.length > 0) ? ('Bearer ' + token) : null;
            console.log('Auth header: ')
            console.log(axios.defaults.headers.common['Authorization']);
        }
        this.state = {
            authToken: '',
            userId: '',
            setAuthToken: this.setAuthToken
        }
    }        

    componentDidMount() {
        if (sessionStorage['authToken']) {
            this.setState({authToken: sessionStorage['authToken'], userId: sessionStorage['userId']})
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