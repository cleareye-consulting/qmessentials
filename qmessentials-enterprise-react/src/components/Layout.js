import React from 'react'
import { Link } from 'react-router-dom'
import UserNavItem from './auth/UserNavItem'
import AuthContext from './auth/AuthContext'
import Login from './auth/Login'

export default props => {
    return (
        <AuthContext.Consumer>{
            ({ authToken }) => (
                <>
                    <header>
                        <nav className="navbar navbar-expand-md navbar-dark bg-primary">
                            <div className="container">
                                <Link className="navbar-brand" to="/">QM Essentials Enterprise</Link>
                                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <UserNavItem></UserNavItem>
                            </div>
                        </nav>
                    </header>
                    <main className="py-4">
                        <div className="container">
                            {authToken.length > 0 ? props.children : <Login />}
                        </div>
                    </main>
                    <footer>
                    
                    </footer>
                    
                </>)}
        </AuthContext.Consumer>
    )
}
