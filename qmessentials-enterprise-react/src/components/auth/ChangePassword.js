import React, { Component } from 'react'
import AuthContext from './AuthContext'

export default class ChangePassword extends Component {

    constructor() {
        super()
        this.state = {
            userId: '',
            newPassword: '',
            confirmPassword: ''
        }
    }

    render() {
        return (
            <AuthContext.Consumer>{
                ({ setAuthToken }) => (
                    <>
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
                                                <input type="password" className="form-control" id="password" name="password" onChange={this.handleChange} />
                                            </div>
                                            <div className="form-group">
                                                <button className="btn btn-primary" id="submitButton" onClick={e => this.handleSubmit(e, setAuthToken)}>Log In</button>
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
                    </>
                )}
            </AuthContext.Consumer>
        )
    }

}