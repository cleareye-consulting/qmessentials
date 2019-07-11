import React, { Component } from 'react'
import AuthContext from './AuthContext'
import ApiConnector from '../../ApiConnector';

export default class ChangePassword extends Component {

    constructor() {
        super()
        this.state = {
            userId: '',
            newPassword: '',
            confirmPassword: '',
            canSubmit: false,
            showError: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        let newState = this.state        
        newState[event.target.name] = event.target.value                
        newState.canSubmit = newState.newPassword.length > 0 && newState.confirmPassword.length > 0 && newState.newPassword === newState.confirmPassword
        newState.showError = false
        this.setState(newState)
    }

    handleBlur() {
        let newState = this.state        
        newState.showError = newState.newPassword.length > 0 && newState.confirmPassword.length > 0 && newState.newPassword !== newState.confirmPassword
        this.setState(newState)
    }    

    async handleSubmit() {
        const api = new ApiConnector()
        await api.changePassword(this.state.userId, this.state.newPassword)
        this.props.history.push('/')
    }

    render() {
        return (
            <AuthContext.Consumer>{
                ({ setAuthToken, userId }) => (
                    <>
                        <div className="row justify-content-center">
                            <div className="col-md-8">
                                <div className="card">
                                    <div className="card-header">
                                        Change Password
                                    </div>
                                    <div className="card-body">
                                        <form className="form">
                                            <div className="form-group">
                                                <label className="control-label" htmlFor="userId">User ID</label>
                                                <input type="text" className="form-control" id="userId" name="userId" disabled value={userId} />
                                            </div>
                                            <div className="form-group">
                                                <label className="control-label" htmlFor="newPassword">New Password</label>
                                                <input type="password" className="form-control" id="newPassword" name="newPassword" onChange={this.handleChange} onBlur={this.handleBlur} />
                                            </div>
                                            <div className="form-group">
                                                <label className="control-label" htmlFor="confirmPassword">Confirm New Password</label>
                                                <input type="password" className="form-control" id="confirmPassword" name="confirmPassword" onChange={this.handleChange} onBlur={this.handleBlur} />
                                            </div>
                                            <div className="form-group">
                                                <button className="btn btn-primary" id="submitButton" onClick={this.handleSubmit} disabled={!this.state.canSubmit}>Submit</button>
                                            </div>
                                            {
                                                (this.state.showError)
                                                    ? <div className="alert alert-danger" role="alert">Passwords don't match.</div>
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