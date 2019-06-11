import React, { Component } from 'react'
import { Link} from 'react-router-dom'
import ApiConnector from '../../ApiConnector';

export default class Create extends Component {

    constructor(props) {
        super(props)
        
        this.state = {
            metric: {
                metricName: '',
                availableQualifiers: [],
                availableUnits: [],
                resultType: 'Numeric',
                hasMultipleResults: false,
                industryStandards: [],
                methodologyReferences: [],
                isActive: true //default to active for new metrics
            }
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        var value =
            event.target.dataset.isarray
                ? event.target.type === "textarea"
                    ? event.target.value.split(/\n+/)
                    : event.target.value.split(/\s+/)                
                : event.target.type === "checkbox"
                    ? event.target.checked
                    : event.target.value;
        var metricUpdate = this.state.metric;
        metricUpdate[event.target.name] = value;
        this.setState({
            metric: metricUpdate
        })
    }

    async handleSubmit(event) {
        event.preventDefault()
        var metric = this.state.metric;
        var api = new ApiConnector()
        await api.postMetric(metric)
        this.props.history.push('/metrics')
    }

    render() {
        return (
            <React.Fragment>
                <h3>Create Metric</h3>
                <form className="form">
                    <div className="form-group">
                        <label className="control-label" htmlFor="metricName">Name</label>
                        <input className="form-control" type="text" id="metricName" name="metricName" onChange={this.handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="availableQualifiers">Available Qualifiers</label>
                        <input className="form-control" type="text" id="availableQualifiers" name="availableQualifiers" data-isarray="true" onChange={this.handleChange}/>
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="availableUnits">Available Units</label>
                        <input className="form-control" type="text" id="availableUnits" name="availableUnits" data-isarray="true" onChange={this.handleChange}/>
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="resultType">Result Type</label>
                        <select className="form-control" id="resultType" name="resultType" onChange={this.handleChange}>
                            <option>Numeric</option>
                            <option>Character</option>
                            <option>DateTime</option>
                            <option>TimeSpan</option>
                            <option>Boolean</option>
                        </select>
                    </div>
                    <div className="form-group">        
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="hasMultipleResults" name="hasMultipleResults"  onChange={this.handleChange}/>
                            <label className="form-check-label" htmlFor="hasMultipleResults">
                                Has Multiple Results
                            </label>
                        </div>
                    </div>                    
                    <div className="form-group">
                        <label className="control-label" htmlFor="industryStandards">Industry Standards</label>
                        <textarea className="form-control" id="industryStandards" name="industryStandards" data-isarray="true" onChange={this.handleChange}></textarea>
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="methodologyReferences">Methodology References</label>
                        <div className="control">
                            <textarea className="form-control" id="methodologyReferences" name="methodologyReferences" data-isarray="true" onChange={this.handleChange}></textarea>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="control-label">
                            <button className="btn btn-primary" onClick={this.handleSubmit}>Add</button>
                            <Link className="btn btn-default" to="/metrics">Cancel</Link>
                        </div>
                    </div>
                </form>
            </React.Fragment>
        )
    }

}