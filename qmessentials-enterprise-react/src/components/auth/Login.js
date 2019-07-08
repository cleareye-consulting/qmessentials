import React, { Component } from 'react'
import ApiConnector from '../../ApiConnector'
import AuthContext from './AuthContext';

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
        try {
            const login = this.state.login;
            const api = new ApiConnector()
            const token = await api.logIn(login)
            if (token) {
                localStorage.sessionToken = token
                localStorage.sessionDate = +(new Date())
                this.props.onSessionTokenSet()
            }
            else {
                this.setState({ failed: true })
            }
        }
        catch (error) {
            console.error(error)
            this.setState({ failed: true })
        }
    }

    render() {
        return (
            <React.Fragment>
                    <div className="row justify-content-center">
                    <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            Login
                        </div>
                        <div className="card-body">
                            <form className="form">
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
                            </form>
                        </div>
                        </div>    
                    </div>
                    </div>
                
            </React.Fragment>
        )
    }
}

Login.contextType = AuthContext