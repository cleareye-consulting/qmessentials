import React, { useState, useEffect } from 'react'
import { Link} from 'react-router-dom'
import ApiConnector from '../../ApiConnector';

export default props => {

    const [metricName, setMetricName] = useState('')
    const [availableQualifiers, setAvailableQualifiers] = useState([])
    const [availableUnits, setAvailableUnits] = useState([])
    const [resultType, setResultType] = useState('')
    const [hasMultipleResults, setHasMultipleResults] = useState(false)
    const [industryStandards, setIndustryStandards] = useState([])
    const [methodologyReferences, setMethodologyReferences] = useState([])
    const [isActive, setIsActive] = useState(false)

    const changeAvailableQualifiers = event => setAvailableQualifiers(event.target.value.split(/\s+/))
    const changeAvailableUnits = event => setAvailableUnits(event.target.value.split(/\s+/))
    const changeResultType = event => setResultType(event.target.value)
    const changeHasMultipleResults = event => setHasMultipleResults(event.target.checked)
    const changeIndustryStandards = event => setIndustryStandards(event.target.value.split(/\s+/))
    const changeMethodologyReferences = event => setMethodologyReferences(event.target.value.split(/\s+/))
    const changeIsActive = event => setIsActive(event.target.checked)

    useEffect(() => {
        (async () => {
            const id = props.match.params.id
            if (id) {
                var api = new ApiConnector()
                var metric = await api.getMetric(id)
                setMetricName(metric.metricName)
                setAvailableQualifiers(metric.availableQualifiers)
                setAvailableUnits(metric.availableUnits)
                setResultType(metric.resultType)
                setHasMultipleResults(metric.hasMultipleResults)
                setIndustryStandards(metric.industryStandards)
                setMethodologyReferences(metric.methodologyReferences)
                setIsActive(metric.isActive)
            }
        })()
    }, [props.match.params.id])

    const submit = async event => {
        event.preventDefault()
        const metric = {
            _id: props.match.params.id,
            metricName: metricName,
            availableQualifiers: availableQualifiers,
            availableUnits: availableUnits,
            resultType: resultType,
            hasMultipleResults: hasMultipleResults,
            industryStandards: industryStandards,
            methodologyReferences: methodologyReferences,
            isActive: isActive
        }
        var api = new ApiConnector()
        await api.postMetric(metric)
        props.history.push('/metrics')
    }

    return (
        <>
            <h3>Edit Metric</h3>
            <form className="form">
                <div className="form-group">
                    <label className="control-label" htmlFor="metricName">Name</label>
                    <input className="form-control" type="text" id="metricName" name="metricName" defaultValue={metricName} disabled={true} />
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="availableQualifiers">Available Qualifiers</label>
                    <input className="form-control" type="text" id="availableQualifiers" name="availableQualifiers" defaultValue={(availableQualifiers || []).join(' ')} onChange={changeAvailableQualifiers} />
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="availableUnits">Available Units</label>
                    <input className="form-control" type="text" id="availableUnits" name="availableUnits" defaultValue={(availableUnits || []).join(' ')} onChange={changeAvailableUnits} />
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="resultType">Result Type</label>
                    <select className="form-control" id="resultType" name="resultType" value={resultType} onChange={changeResultType}>
                        <option>Numeric</option>
                        <option>Character</option>
                        <option>DateTime</option>
                        <option>TimeSpan</option>
                        <option>Boolean</option>
                    </select>
                </div>
                <div className="form-group">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="hasMultipleResults" name="hasMultipleResults" checked={hasMultipleResults} onChange={changeHasMultipleResults} />
                        <label className="form-check-label" htmlFor="hasMultipleResults">
                            Has Multiple Results
                            </label>
                    </div>
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="industryStandards">Industry Standards</label>
                    <textarea className="form-control" id="industryStandards" name="industryStandards" value={(industryStandards || []).join('\n')} onChange={changeIndustryStandards}></textarea>
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="methodologyReferences">Methodology References</label>
                    <div className="control">
                        <textarea className="form-control" id="methodologyReferences" name="methodologyReferences" value={(methodologyReferences || []).join('\n')} onChange={changeMethodologyReferences}></textarea>
                    </div>
                </div>
                <div className="form-group">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="isActive" name="isActive" checked={isActive} onChange={changeIsActive} />
                        <label className="form-check-label" htmlFor="isActive">
                            Active
                            </label>
                    </div>
                </div>
                <div className="form-group">
                    <div className="control-label">
                        <button className="btn btn-primary" onClick={submit}>Save Changes</button>
                        <Link className="btn btn-outline-secondary" to="/metrics">Cancel</Link>
                    </div>
                </div>
            </form>
        </>
    )

}