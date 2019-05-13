import React, { Component } from 'react'
import Api from './Api';

export default class MetricEditor extends Component {
    constructor() {
        super()
        this.state = {
            metric: {
                name: '',
                availableQualifiers: [],
                availableUnits: [],
                resultType: 'Numeric',
                hasMultipleValues: false,
                industryStandards: [],
                methdologyReferences: []
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        var value =
            event.target.dataset.isarray
                ? event.target.value.split(/\s+/)
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
        event.preventDefault();
        var api = new Api();
        await api.postMetric(this.state.metric);
    }

    render() {
        return (
            <React.Fragment>
                <h2 className="subtitle">Metric Editor</h2>
                <form>
                    <div className="field">
                        <label className="label" htmlFor="name">Name</label>
                        <div className="control">
                            <input className="input" type="text" id="name" name="name" onChange={this.handleChange} />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label" htmlFor="availableQualifiers">Available Qualifiers</label>
                        <div className="control">
                            <input className="input" type="text" id="availableQualifiers" name="availableQualifiers" data-isarray="true" onChange={this.handleChange}/>
                        </div>
                    </div>
                    <div className="field">
                        <label className="label" htmlFor="availableUnits">Available Units</label>
                        <div className="control">
                            <input className="input" type="text" id="availableUnits" name="availableUnits" data-isarray="true" onChange={this.handleChange}/>
                        </div>
                    </div>
                    <div className="field">
                        <label className="label" htmlFor="resultType">Result Type</label>
                        <div className="control">
                            <select className="select" id="resultType" name="resultType" onChange={this.handleChange}>
                                <option>Numeric</option>
                                <option>Character</option>
                                <option>DateTime</option>
                                <option>TimeSpan</option>
                                <option>Boolean</option>
                            </select>
                        </div>
                    </div>
                    <div className="field">                        
                        <label className="checkbox" htmlFor="hasMultipleValues">
                            <input type="checkbox" id="hasMultipleValues" name="hasMultipleValues" onChange={this.handleChange}/>
                            <span>Multiple Values</span>
                        </label>
                    </div>
                    <div className="field">
                        <label className="label" htmlFor="industryStandards">Industry Standards</label>
                        <div className="control">
                            <textarea className="textarea" id="industryStandards" name="industryStandards" data-isarray="true" onChange={this.handleChange}></textarea>
                        </div>
                    </div>
                    <div className="field">
                        <label className="label" htmlFor="methodologyReferences">Methodology References</label>
                        <div className="control">
                            <textarea className="textarea" id="methodologyReferences" name="methodologyReferences" data-isarray="true" onChange={this.handleChange}></textarea>
                        </div>
                    </div>
                    <div className="field is-grouped">
                        <div className="control">
                            <button className="button is-link" onClick={this.handleSubmit}>Submit</button>
                        </div>
                    </div>
                </form>
            </React.Fragment>
        )
    }

}