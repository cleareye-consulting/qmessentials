import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Api from '../../ApiConnector'


export default class List extends Component {

    constructor() {
        super()
        this.state = {
            testPlans: []
        }
    }

    async componentDidMount() {
        const api = new Api()
        const testPlans = (await api.listTestPlans({isActive: true}))
        this.setState({ testPlans: testPlans })
    }

    render() {
        return (
            <React.Fragment>
                <h3 className="subtitle">Test Plans</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.testPlans.map(testPlan => 
                            <tr key={testPlan._id}>
                                <td><Link to={"/test-plans/" + testPlan._id + "/edit"}>{testPlan.testPlanName}</Link></td>
                            </tr>
                        )
                    }                        
                    </tbody>
                </table>
                <Link to="/test-plans/create">Add a test plan</Link>
            </React.Fragment>
        )
    }
}