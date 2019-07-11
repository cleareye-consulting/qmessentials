import React from 'react'
import { Link } from 'react-router-dom'

export default () => {
    return (
        <ul className="list-group">
            <li className="list-group-item"><Link to="/metrics">Metrics</Link></li>
            <li className="list-group-item"><Link to="/test-plans">Test Plans</Link></li>
        </ul>
    )
}