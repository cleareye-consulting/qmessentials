import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Api from './Api';


export default class Metrics extends Component {

    constructor() {
        super()
        this.state = {
            metrics: []
        }
    }

    async componentDidMount() {
        const api = new Api();
        const metrics = (await api.getMetrics()).data;
        this.setState({ metrics: metrics });
    }

    render() {
        return (
            <React.Fragment>
                <h2 className="subtitle">Metrics</h2>
                {
                    this.state.metrics.map(metric => 
                        <div key={metric.name}><Link to={"/metric/" + metric.name}>{metric.name}</Link></div>
                    )
                }
                <Link to="metric">Add a metric</Link>
            </React.Fragment>
        )
    }
}