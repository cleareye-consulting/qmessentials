import React, { Component } from 'react'
import { Link } from 'react-router-dom'


export default class Metrics extends Component {
    render() {
        return (
            <React.Fragment>
                <Link to="metric">Add a metric</Link>
            </React.Fragment>
        )
    }
}