import React, { Component } from 'react'
import { Link} from 'react-router-dom'
import ApiConnector from '../../ApiConnector';

export default class Create extends Component {

    constructor(props) {
        super(props)
        
        this.state = {
            testPlan: {
                testPlanName: '',
                metrics: [],
                isActive: true //default to active for new metrics
            },
            testPlans: []
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        var value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
        var updated = this.state.testPlan;
        updated[event.target.name] = value;
        this.setState({
            testPlan: updated            
        })
    }

    async componentDidMount() {
        var api = new ApiConnector()
        const testPlans = await api.listTestPlans()
        this.setState({ testPlans: testPlans });
    }

    async handleSubmit(event) {
        event.preventDefault()
        var testPlan = this.state.testPlan;
        var api = new ApiConnector()
        await api.postTestPlan(testPlan)
        this.props.history.push('/test-plans')
    }

    render() {
        return (
            <React.Fragment>
                <h3>Create Test Plan</h3>
                <form className="form">
                    <div className="form-group">
                        <label className="control-label" htmlFor="testPlanName">Name</label>
                        <input className="form-control" type="text" id="testPlanName" name="testPlanName" onChange={this.handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="duplicateOfTestPlan">Duplicate of</label>
                        <select className="form-control" id="duplicateOfTestPlan" name="duplicateOfTestPlan" onChange={this.handleChange}>
                            <option value="0">None</option>
                            {
                                this.state.testPlans.map(testPlan =>
                                    <option key={testPlan._id} value={testPlan._id}>{testPlan.testPlanName}</option>
                                )
                            }
                        </select>
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