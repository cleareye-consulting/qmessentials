import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Layout extends Component {
    render() {
        return (
            <React.Fragment>                    
                <header>
                    <nav className="navbar navbar-expand-md navbar-dark bg-primary">
                        <div className="container">
                            <Link className="navbar-brand" to="/">QM Essentials Enterprise</Link>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                        </div>
                    </nav>
                </header>
                <main>
                    <div className="container">
                        {this.props.children}
                    </div>
                </main>
                <footer>
                    
                </footer>
                        

            </React.Fragment>
        )        
    }
}