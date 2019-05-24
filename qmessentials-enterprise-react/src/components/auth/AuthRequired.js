import React, { Component } from 'react'
import Login from './Login';

function hasCurrentSessionToken () {
    if (!localStorage.sessionToken) {
        return false
    }
    if (!localStorage.sessionDate) {
        return false
    }
    var hours = (new Date() - new Date(parseInt(localStorage.sessionDate))) / (1000 * 60 * 60)
    return hours < 12
}

export default class AuthRequired extends Component {    
    constructor() {
        super()
        this.state = {
            hasCurrentSessionToken: false
        }
    }    
    render() {        
        if (this.state.hasCurrentSessionToken) {
            return this.props.children
        }
        return (<Login onSessionTokenSet={() => this.setState({hasCurrentSessionToken: true})}/>)
    }
    componentDidMount() {
        this.setState({hasCurrentSessionToken: hasCurrentSessionToken()})
    }
}