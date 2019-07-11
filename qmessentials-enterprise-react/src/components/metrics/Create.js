import React, { useState } from 'react'
import { Link} from 'react-router-dom'
import Api from '../../ApiConnector'

export default props => {
    const [metricName, setMetricName] = useState('')
    const [availableQualifiers, setAvailableQualifiers] = useState([])
    const [availableUnits, setAvailableUnits] = useState([])
    const [resultType, setResultType] = useState('')
    const [hasMultipleResults, setHasMultipleResults] = useState(false)
    const [industryStandards, setIndustryStandards] = useState([])
    const [methodologyReferences, setMethodologyReferences] = useState([])

    const changeMetricName = event => setMetricName(event.target.value)
    const changeAvailableQualifiers = event => setAvailableQualifiers(event.target.value.split(/\s+/))
    const changeAvailableUnits = event => setAvailableUnits(event.target.value.split(/\s+/))
    const changeResultType = event => setResultType(event.target.value)
    const changeHasMultipleResults = event => setHasMultipleResults(event.target.checked)
    const changeIndustryStandards = event => setIndustryStandards(event.target.value.split(/\s+/))
    const changeMethodologyReferences = event => setMethodologyReferences(event.target.value.split(/\s+/))

    const submit = async event => {
        event.preventDefault()
        const metric = {
            metricName: metricName,
            availableQualifiers: availableQualifiers,
            availableUnits: availableUnits,
            resultType: resultType,
            hasMultipleResults: hasMultipleResults,
            industryStandards: industryStandards,
            methodologyReferences: methodologyReferences,
            isActive: true
        }
        const api = new Api()
        await api.postMetric(metric)
        props.history.push('/metrics')
    }

    return (
        <>
            <h3>Create Metric</h3>
            <form className="form">
                <div className="form-group">
                    <label className="control-label" htmlFor="metricName">Name</label>
                    <input className="form-control" type="text" id="metricName" name="metricName" onChange={changeMetricName} />
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="availableQualifiers">Available Qualifiers</label>
                    <input className="form-control" type="text" id="availableQualifiers" name="availableQualifiers" onChange={changeAvailableQualifiers} />
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="availableUnits">Available Units</label>
                    <input className="form-control" type="text" id="availableUnits" name="availableUnits" onChange={changeAvailableUnits} />
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="resultType">Result Type</label>
                    <select className="form-control" id="resultType" name="resultType" onChange={changeResultType}>
                        <option>Numeric</option>
                        <option>Character</option>
                        <option>DateTime</option>
                        <option>TimeSpan</option>
                        <option>Boolean</option>
                    </select>
                </div>
                <div className="form-group">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="hasMultipleResults" name="hasMultipleResults" onChange={changeHasMultipleResults} />
                        <label className="form-check-label" htmlFor="hasMultipleResults">
                            Has Multiple Results
                            </label>
                    </div>
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="industryStandards">Industry Standards</label>
                    <textarea className="form-control" id="industryStandards" name="industryStandards" onChange={changeIndustryStandards}></textarea>
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="methodologyReferences">Methodology References</label>
                    <div className="control">
                        <textarea className="form-control" id="methodologyReferences" name="methodologyReferences" onChange={changeMethodologyReferences}></textarea>
                    </div>
                </div>
                <div className="form-group">
                    <div className="control-label">
                        <button className="btn btn-primary" onClick={submit}>Add</button>
                        <Link className="btn btn-outline-secondary" to="/metrics">Cancel</Link>
                    </div>
                </div>
            </form>
        </>
    )

}