import React, { useState, useEffect } from 'react'
import { Link} from 'react-router-dom'
import Api from '../../ApiConnector'
import CriteriaEditor from './CriteriaEditor'

export default props => {

    const [testPlanName, setTestPlanName] = useState('')
    const [availableMetrics, setAvailableMetrics] = useState([])
    const [metricId, setMetricId] = useState('')
    const [availableQualifiers, setAvailableQualifiers] = useState([])
    const [qualifiers, setQualifiers] = useState([])
    const [usage, setUsage] = useState('')
    const [criteria, setCriteria] = useState('')
    const [availableUnits, setAvailableUnits] = useState([])
    const [unit, setUnit] = useState('')
    const [isNullable, setIsNullable] = useState(false)
    const [resultType, setResultType] = useState('')

    useEffect(() => {
        (async () => {
            const api = new Api()
            const testPlan = await api.getTestPlan(props.match.params.testPlanId)
            setTestPlanName(testPlan.testPlanName)
            const allMetrics = await api.listMetrics()
            setAvailableMetrics(allMetrics)
        })()
    }, [props.match.params.testPlanId])

    useEffect(() => {
        (async () => {
            if (!metricId) {
                return
            }
            const api = new Api()
            const metric = await api.getMetric(metricId)
            setAvailableQualifiers(metric.availableQualifiers)
            setAvailableUnits(metric.availableUnits)
            setResultType(metric.resultType)
        })()
    }, [metricId])

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
        const metric = {
            metricId: metricId,
            qualifiers: qualifiers,
            usage: usage,
            criteria: criteria,
            unit: unit,
            isNullable: isNullable,
            isActive: true
        }
        testPlan.metrics.push(metric)
        await api.postTestPlan(testPlan)
        props.history.push(`/test-plans/${props.match.params.testPlanId}/edit`)
    }
    
    return (
        <>
            <h3>Add Test Plan Metric</h3>
            <form className="form">
                <div className="form-group">
                    <label className="control-label" htmlFor="testPlanName">Test Plan</label>
                    <input className="form-control" type="text" id="testPlanName" name="testPlanName" defaultValue={testPlanName} disabled={true} />
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="metric">Metric</label>
                    <select className="form-control" id="metric" onChange={event => setMetricId(event.target.value)}>
                        <option value="">&nbsp;</option>
                        {availableMetrics.map(metric => <option key={metric._id} value={metric._id}>{metric.metricName}</option>)}
                    </select>
                </div>
                <div className="formGroup">
                    <label className="control-label mr-3" htmlFor="qualifiers">Qualifiers</label>
                    {
                        availableQualifiers.map(aq => 
                            <div key={aq} className="form-check form-check-inline mx-1">
                                <input className="form-check-input" type="checkbox" id={`qualifiers_${aq}`} name="qualifiers" defaultValue={aq} onChange={handleQualifierClick} />
                                <label className="form-check-label" htmlFor={`qualifiers_${aq}`}>{aq}</label>
                            </div>
                        )
                    }                    
                </div>
                <div className="formGroup">
                    <label className="control-label" htmlFor="usage">Usage</label>
                    <input className="form-control" type="text" id="usage" onChange={event => setUsage(event.target.value)} />
                </div>
                <div className="formGroup">
                    <label className="control-label" htmlFor="criteria">Criteria</label>
                    <CriteriaEditor resultType={resultType} setCriteria={setCriteria}/>
                </div>
                <div className="form-group">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="isNullable" onChange={event => setIsNullable(event.target.checked)} />
                        <label className="form-check-label" htmlFor="isNullable">
                            Nullable
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="unit">Unit</label>
                    <select className="form-control" id="unit" disabled={!metricId || !availableUnits.length} onChange={event => setUnit(event.target.value)}>
                        <option value="">&nbsp;</option>
                        {availableUnits.map(au => <option key={au} value={au}>{au}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <div className="control-label">
                        <button className="btn btn-primary" onClick={submit}>Add</button>
                        <Link className="btn btn-outline-secondary" to={`/test-plans/${props.match.params.testPlanId}/edit`}>Cancel</Link>
                    </div>
                </div>
            </form>
        </>
    )
}