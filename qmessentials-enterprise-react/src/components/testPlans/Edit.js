import React, { useState, useEffect } from 'react'
import { Link} from 'react-router-dom'
import ApiConnector from '../../ApiConnector';

export default props => {
    const [testPlanName, setTestPlanName] = useState('')
    const [isActive, setIsActive] = useState(false)
    const [metrics, setMetrics] = useState([])

    const changeIsActive = async event => {
        setIsActive(event.target.checked)
        const testPlan = {
            _id: props.match.params.id,
            isActive: event.target.checked //using event value rather than state value because state value may not be updated yet, and I don't really care
        }
        var api = new ApiConnector()
        await api.postTestPlan(testPlan)
    }

    useEffect(() => {
        (async () => {
            const id = props.match.params.id
            if (id) {
                var api = new ApiConnector()
                var testPlan = await api.getTestPlan(id)
                setTestPlanName(testPlan.testPlanName)
                setIsActive(testPlan.isActive)
                if (testPlan.metrics.length) {
                    setMetrics(await api.getMultipleMetrics(testPlan.metrics))
                }
            }
        })()
    }, [props.match.params.id])
    
    return (
        <>
            <h3>Edit Test Plan</h3>
            <form className="form">
                <div className="form-group">
                    <label className="control-label" htmlFor="testPlanName">Name</label>
                    <input className="form-control" type="text" id="testPlanName" name="testPlanName" defaultValue={testPlanName} disabled={true} />
                </div>
                <div className="form-group">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="isActive" name="isActive" checked={isActive} onChange={changeIsActive} />
                        <label className="form-check-label" htmlFor="isActive">
                            Active
                            </label>
                    </div>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Order</th>
                            <th>Metric</th>
                            <th>Qualifiers</th>
                            <th>Usage</th>
                            <th>Criteria</th>
                            <th>Units</th>
                            <th>Nullable</th>
                            <th>Active</th>
                            <th>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            metrics.map(metric =>
                                <tr key={metric._id}>                                            
                                    <td>{metric.order}</td>
                                    <td>{metric.qualifiers}</td>
                                    <td>{metric.usage}</td>
                                    <td>{metric.criteria}</td>
                                    <td>{metric.units}</td>
                                    <td>{metric.isNullable}</td>
                                    <td>{metric.isActive}</td>
                                    <td><button type="button" className="btn btn-sm btn-outline-primary" data-testPlanMetricId={metric._id}>Edit</button></td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
                <div className="form-group">
                    <div className="control-label">
                        <Link className="btn btn-default" to="/test-plans">Return to List</Link>
                    </div>
                </div>
            </form>
        </>
    )

}

