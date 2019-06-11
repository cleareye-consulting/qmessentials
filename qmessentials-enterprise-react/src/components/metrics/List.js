import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Api from '../../ApiConnector'


export default class List extends Component {

    constructor() {
        super()
        this.state = {
            metrics: []
        }
    }

    async componentDidMount() {
        const api = new Api()
        const metrics = (await api.listMetrics({isActive: true}))
        this.setState({ metrics: metrics })
    }

    render() {
        return (
            <React.Fragment>
                <h3 className="subtitle">Metrics</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.metrics.map(metric => 
                            <tr key={metric._id}>
                                <td><Link to={"/metric/" + metric._id + "/edit"}>{metric.metricName}</Link></td>
                            </tr>
                        )
                    }                        
                    </tbody>
                </table>
                <Link to="/metric/create">Add a metric</Link>
            </React.Fragment>
        )
    }
}