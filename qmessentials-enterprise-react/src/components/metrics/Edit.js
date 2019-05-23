import React, { Component } from 'react'
import { Link} from 'react-router-dom'
import ApiConnector from '../../ApiConnector';

export default class MetricEditor extends Component {

    constructor(props) {
        super(props)
        
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
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    async componentDidMount() {
        const id = this.props.match.params.id
        if (id) {
            var api = new ApiConnector()
            var metric = (await api.getMetric(id)).data
            this.setState({ metric: metric })
        }
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
        event.preventDefault()
        var api = new ApiConnector()
        await api.postMetric(this.state.metric)
        this.props.history.push('/metrics')
    }

    render() {
        return (
            <React.Fragment>
                <h2 className="subtitle">Metric Editor</h2>
                <form class="form">
                    <div className="form-group">
                        <label className="control-label" htmlFor="name">Name</label>
                        <input className="form-control" type="text" id="name" name="name" defaultValue={this.state.metric.name} onChange={this.handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="availableQualifiers">Available Qualifiers</label>
                        <input className="form-control" type="text" id="availableQualifiers" name="availableQualifiers" defaultValue={this.state.metric.availableQualifiers.join(' ')} data-isarray="true" onChange={this.handleChange}/>
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="availableUnits">Available Units</label>
                        <input className="form-control" type="text" id="availableUnits" name="availableUnits" defaultValue={this.state.metric.availableUnits.join(' ')} data-isarray="true" onChange={this.handleChange}/>
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="resultType">Result Type</label>
                        <select className="form-control" id="resultType" name="resultType" defaultValue={this.state.metric.resultType} onChange={this.handleChange}>
                            <option>Numeric</option>
                            <option>Character</option>
                            <option>DateTime</option>
                            <option>TimeSpan</option>
                            <option>Boolean</option>
                        </select>
                    </div>
                    <div className="form-group">        
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="hasMultipleResults" name="hasMultipleResults" defaultChecked={this.state.metric.hasMultipleValues} onChange={this.handleChange}/>
                            <label className="form-check-label" htmlFor="hasMultipleResults">
                                Has Multiple Results
                            </label>
                        </div>
                    </div>                    
                    <div className="form-group">
                        <label className="control-label" htmlFor="industryStandards">Industry Standards</label>
                        <textarea className="form-control" id="industryStandards" name="industryStandards" defaultValue={this.state.metric.industryStandards.join('\n')} data-isarray="true" onChange={this.handleChange}></textarea>
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="methodologyReferences">Methodology References</label>
                        <div className="control">
                            <textarea className="form-control" id="methodologyReferences" name="methodologyReferences" defaultValue={this.state.metric.methodologyReferences} data-isarray="true" onChange={this.handleChange}></textarea>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="control-label">
                            <button className="btn btn-primary" onClick={this.handleSubmit}>Submit</button>
                            <Link className="btn btn-default" to="/metrics">Cancel</Link>
                        </div>
                    </div>
                </form>
            </React.Fragment>
        )
    }

}