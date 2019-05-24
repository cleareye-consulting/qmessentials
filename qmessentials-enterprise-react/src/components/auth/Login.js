import React, { Component } from 'react'
import ApiConnector from '../../ApiConnector'

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: {
                userId: '',
                password: ''
            },
            failed: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        let login = this.state.login
        login[event.target.name] = event.target.value
        this.setState({login: login, failed: false})
    }

    async handleSubmit(event) {        
        event.preventDefault()
        const login = this.state.login;
        const api = new ApiConnector()
        const token = await api.logIn(login)
        if (token) {
            localStorage.sessionToken = token
            this.props.history.push('/')
        }
        else {
            this.setState({failed: true})
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="form">
                    <div className="form-group">
                        <label className="control-label" htmlFor="userId">User ID</label>
                        <input type="text" className="form-control" id="userId" name="userId" onChange={this.handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="password">Password</label>
                        <input type="password" className="form-control"id="password" name="password" onChange={this.handleChange}/>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary" id="submitButton" onClick={this.handleSubmit}>Log In</button>
                    </div>
                    {
                        this.state.failed
                            ? <div className="alert alert-danger" role="alert">There was a problem with your login credentials.</div>
                            : null
                    }
                    
                </div>
            </React.Fragment>
        )
    }
}