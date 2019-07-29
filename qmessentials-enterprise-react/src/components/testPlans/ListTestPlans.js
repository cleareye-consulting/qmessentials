import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Api from '../../ApiConnector'

export default () => {
    const [testPlans, setTestPlans] = useState([])
    useEffect(() => {
        (async () => {
            const api = new Api()
            const testPlans = (await api.listTestPlans({ isActive: true }))
            setTestPlans(testPlans)
        })()
    }, [])
    return (
        <>
            <h3 className="subtitle">Test Plans</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        testPlans.map(testPlan =>
                            <tr key={testPlan._id}>
                                <td><Link to={"/test-plans/" + testPlan._id + "/edit"}>{testPlan.testPlanName}</Link></td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
            <Link to="/test-plans/create">Add a test plan</Link>
        </>
    )
}

