import React, { useState, useEffect } from 'react'
import { Link} from 'react-router-dom'
import ApiConnector from '../../ApiConnector';
import { useCriteria } from '../../Hooks'

const TestPlan = props => {
    const [, format] = useCriteria(props.tpm.resultType)
    return (
        <tr>
            <td>{props.tpm.metricName}</td>
            <td>{props.tpm.qualifiers.join(', ')}</td>
            <td>{props.tpm.usage}</td>
            <td>{format(props.tpm.criteria)}</td>
            <td>{props.tpm.unit}</td>
            <td>{props.tpm.isNullable ? 'Y' : ''}</td>
            <td>{props.tpm.isActive ? 'Y' : ''}</td>
            <td><Link className="btn btn-sm btn-outline-primary" to={`/test-plans/${props.testPlanId}/metrics/${props.tpm.metricId}/edit`}>Edit</Link></td>
        </tr>
    )
}

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
        const api = new ApiConnector()
        await api.postTestPlan(testPlan)
    }

    useEffect(() => {
        (async () => {
            const id = props.match.params.id
            if (id) {
                const api = new ApiConnector()
                const testPlan = await api.getTestPlan(id)
                setTestPlanName(testPlan.testPlanName)
                setIsActive(testPlan.isActive)
                for (let tpm of testPlan.metrics) {
                    const metric = await api.getMetric(tpm.metricId)                    
                    tpm.metricName = metric.metricName
                    tpm.resultType = metric.resultType
                }
                setMetrics(testPlan.metrics)
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
                            <th>Metric</th>
                            <th>Qualifiers</th>
                            <th>Usage</th>
                            <th>Criteria</th>
                            <th>Unit</th>
                            <th>Nullable</th>
                            <th>Active</th>
                            <th>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            metrics.map(metric => <TestPlan testPlanId={props.match.params.id} tpm={metric} key={metric.metricId + metric.qualifiers.join('')}/>)
                        }
                    </tbody>
                </table>
                <div className="form-group">                    
                    <Link to={`/test-plans/${props.match.params.id}/metrics/create`}>Add Metric</Link>
                </div>
                <div className="form-group">
                    <Link className="btn btn-outline-secondary" to="/test-plans">Return to List</Link>
                </div>
            </form>
        </>
    )

}

