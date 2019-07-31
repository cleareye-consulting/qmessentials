import React, { useState, useEffect } from 'react'
import { Link} from 'react-router-dom'
import Api from '../../ApiConnector'

export default props => {

    const [testPlanName, setTestPlanName] = useState('')
    const [metricName, setMetricName] = useState('')
    const [availableQualifiers, setAvailableQualifiers] = useState([])
    const [qualifiers, setQualifiers] = useState([])
    const [usage, setUsage] = useState('')
    const [criteria, setCriteria] = useState('')
    const [availableUnits, setAvailableUnits] = useState([])
    const [unit, setUnit] = useState('')
    const [isNullable, setIsNullable] = useState(false)
    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        (async () => {
            const api = new Api()
            const testPlan = await api.getTestPlan(props.match.params.testPlanId)
            setTestPlanName(testPlan.testPlanName)
            const testPlanMetric = testPlan.metrics.filter(tpm => tpm.metricId === props.match.params.metricId)[0]
            setQualifiers(testPlanMetric.qualifiers)
            setUsage(testPlanMetric.usage)
            setCriteria(testPlanMetric.criteria)            
            setUnit(testPlanMetric.unit)
            setIsNullable(testPlanMetric.isNullable)
            setIsActive(testPlanMetric.isActive)
            const metric = await api.getMetric(props.match.params.metricId)            
            setMetricName(metric.metricName)
            setAvailableQualifiers(metric.availableQualifiers)
            setAvailableUnits(metric.availableUnits)
        })()
    }, [props.match.params.testPlanId, props.match.params.metricId])

    const handleQualifierClick = event => {
        const value = event.target.value
        const checked = event.target.checked
        let newArray = Array.from(qualifiers)        
        if (checked) {
            newArray.push(value)
        }
        else {
            newArray = newArray.filter(q => q !== value)
        }
        let sortedArray = []
        for (const availableQualifier of availableQualifiers) { //doing this to put qualifiers in same order as available qualifiers
            if (newArray.includes(availableQualifier)) {
                sortedArray.push(availableQualifier)
            }
        }
        setQualifiers(sortedArray)
    }

    const submit = async event => {
        event.preventDefault()
        const api = new Api()
        let testPlan = await api.getTestPlan(props.match.params.testPlanId)
        let metric = testPlan.metrics.filter(tpm => tpm.metricId === props.match.params.metricId)[0]
        metric.qualifiers = qualifiers
        metric.usage = usage
        metric.criteria = criteria
        metric.unit = unit
        metric.isNullable = isNullable
        metric.isActive = isActive
        await api.postTestPlan(testPlan)
        props.history.push(`/test-plans/${props.match.params.testPlanId}/edit`)
    }
        return (
        <>
            <h3>Edit Test Plan Metric</h3>
            <form className="form">
                <div className="form-group">
                    <label className="control-label" htmlFor="testPlanName">Test Plan</label>
                    <input className="form-control" type="text" id="testPlanName" name="testPlanName" defaultValue={testPlanName} disabled={true} />
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="metric">Metric</label>
                    <input className="form-control" type="text" id="metricName" name="metricName" defaultValue={metricName} disabled={true} />
                </div>
                <div className="formGroup">
                    <label className="control-label mr-3" htmlFor="qualifiers">Qualifiers</label>
                    {                        
                        availableQualifiers.map(aq => 
                            <div key={aq} className="form-check form-check-inline mx-1">
                                <input className="form-check-input" type="checkbox" id={`qualifiers_${aq}`} name="qualifiers" defaultValue={aq} defaultChecked={qualifiers.includes(aq)} onChange={handleQualifierClick} />
                                <label className="form-check-label" htmlFor={`qualifiers_${aq}`}>{aq}</label>
                            </div>
                        )
                    }
                </div>
                <div className="formGroup">
                    <label className="control-label" htmlFor="usage">Usage</label>
                    <input className="form-control" type="text" id="usage" defaultValue={usage} onChange={event => setUsage(event.target.value)} />
                </div>
                <div className="formGroup">
                    <label className="control-label" htmlFor="criteria">Criteria</label>
                        <input className="form-control" type="text" id="criteria" defaultValue={criteria} onChange={event => setCriteria(event.target.value)} />
                </div>
                <div className="form-group">
                    <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="isNullable" checked={isNullable} onChange={event => setIsNullable(event.target.checked)} />
                        <label className="form-check-label" htmlFor="isNullable">
                            Nullable
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="unit">Unit</label>
                        <select className="form-control" id="unit" disabled={!availableUnits.length} value={unit} onChange={event => setUnit(event.target.value)}>
                        <option value="">&nbsp;</option>
                        {availableUnits.map(au => <option key={au} value={au}>{au}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="isActive" name="isActive" checked={isActive} onChange={event => setIsActive(event.target.checked)} />
                        <label className="form-check-label" htmlFor="isActive">
                            Active
                            </label>
                    </div>
                </div>
                <div className="form-group">
                    <div className="control-label">
                        <button className="btn btn-primary" onClick={submit}>Save Changes</button>
                        <Link className="btn btn-outline-secondary" to={`/test-plans/${props.match.params.testPlanId}/edit`}>Cancel</Link>
                    </div>
                </div>
            </form>
        </>
    )
}