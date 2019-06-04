import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Home extends Component {
    render() {
        return (
            <ul className="list-group">
                <li className="list-group-item"><Link to="metrics">Metrics</Link></li>
            </ul>
            
        )
    }
}