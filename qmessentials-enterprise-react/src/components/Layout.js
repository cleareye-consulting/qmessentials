import React, { Component } from 'react'

export default class Layout extends Component {
    render() {
        return (
            <div className="container">
                <header>
                    <h1 className="title">QMEssentials</h1>
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