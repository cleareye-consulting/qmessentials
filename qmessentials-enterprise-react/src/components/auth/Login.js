import React, { useState, useContext } from 'react'
import ApiConnector from '../../ApiConnector'
import AuthContext from './AuthContext';

export default () => {
    const [userId, setUserId] = useState('')
    const [password, setPassword] = useState('')
    const [failed, setFailed] = useState(false)

    const { setAuthToken } = useContext(AuthContext)

    const submit = async event => {
        setFailed(false)
        event.preventDefault()
        try {
            const login = { userId: userId, password: password }
            const api = new ApiConnector()
            const token = await api.logIn(login)
            if (token) {
                setAuthToken(token, userId)
            }
            else {
                setFailed(true)
            }
        }
        catch (error) {
            console.error(error)
            setFailed(true)
        }
    }

    return (
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
                                    <input type="text" className="form-control" id="userId" name="userId" onChange={event => setUserId(event.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="control-label" htmlFor="password">Password</label>
                                    <input type="password" className="form-control" id="password" name="password" onChange={event => setPassword(event.target.value)} />
                                </div>
                                <div className="form-group">
                                    <button className="btn btn-primary" id="submitButton" onClick={submit}>Log In</button>
                                </div>
                                {
                                    failed
                                        ? <div className="alert alert-danger" role="alert">There was a problem with your login credentials.</div>
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
