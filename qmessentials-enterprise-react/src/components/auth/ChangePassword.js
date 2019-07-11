import React, { useState, useContext } from 'react'
import AuthContext from './AuthContext'
import ApiConnector from '../../ApiConnector';

export default () => {
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [canSubmit, setCanSubmit] = useState(false)
    const [showError, setShowError] = useState(false)
    const authContext = useContext(AuthContext)

    const inputChange = (event, setter) => {
        setter(event.target.value)
        setCanSubmit(newPassword.length > 0 && confirmPassword.length > 0 && newPassword === confirmPassword)
        setShowError(false)
    }

    const inputBlur = () => {
        setShowError(newPassword.length > 0 && confirmPassword.length > 0 && newPassword !== confirmPassword)
    }

    const submit = async () => {
        const api = new ApiConnector()
        await api.changePassword(authContext.userId, newPassword)
        this.props.history.push('/')
    }

    return (
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
                                    <input type="text" className="form-control" id="userId" name="userId" disabled value={authContext.userId} />
                                </div>
                                <div className="form-group">
                                    <label className="control-label" htmlFor="newPassword">New Password</label>
                                    <input type="password" className="form-control" id="newPassword" name="newPassword" onChange={event => inputChange(event, setNewPassword)} onBlur={inputBlur} />
                                </div>
                                <div className="form-group">
                                    <label className="control-label" htmlFor="confirmPassword">Confirm New Password</label>
                                    <input type="password" className="form-control" id="confirmPassword" name="confirmPassword" onChange={event => inputChange(event, setConfirmPassword)} onBlur={inputBlur} />
                                </div>
                                <div className="form-group">
                                    <button className="btn btn-primary" id="submitButton" onClick={submit} disabled={!canSubmit}>Submit</button>
                                </div>
                                {
                                    (showError)
                                        ? <div className="alert alert-danger" role="alert">Passwords don't match.</div>
                                        : null
                                }
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}