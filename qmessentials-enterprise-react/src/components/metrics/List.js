import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Api from '../../ApiConnector'

export default () => {
    const [metrics, setMetrics] = useState([])
    useEffect(() => {
        (async () => {
            const api = new Api()
            const metricsFromApi = (await api.listMetrics({ isActive: true }))
            setMetrics(metricsFromApi)
        })()
    }, [])
    return (
        <>
            <h3 className="subtitle">Metrics</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        metrics.map(metric =>
                            <tr key={metric._id}>
                                <td><Link to={"/metric/" + metric._id + "/edit"}>{metric.metricName}</Link></td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
            <Link to="/metric/create">Add a metric</Link>
        </>
    )
}