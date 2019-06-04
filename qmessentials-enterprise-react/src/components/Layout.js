import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Layout extends Component {
    render() {
        return (
            <div className="container">
                <header>
                    <nav className="navbar navbar-expand-md navbar-light bg-light">
                        <Link className="navbar-brand" to="/">QM Essentials Enterprise</Link>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </nav>                    
                </header>
                <main>
                    {this.props.children}
                </main>
                <footer>
                </footer>
            </div>
        )        
    }
}