import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Api from '../../ApiConnector'


export default class Metrics extends Component {

    constructor() {
        super()
        this.state = {
            metrics: []
        }
    }

    async componentDidMount() {
        const api = new Api()
        console.log('Getting metrics')
        const metrics = (await api.listMetrics())
        console.log(metrics)
        this.setState({ metrics: metrics })
    }

    render() {
        return (
            <React.Fragment>
                <h2 className="subtitle">Metrics</h2>
                {
                    this.state.metrics.map(metric => 
                        <div key={metric._id}><Link to={"/metric/" + metric._id}>{metric.metricName}</Link></div>
                    )
                }
                <Link to="metric">Add a metric</Link>
            </React.Fragment>
        )
    }
}