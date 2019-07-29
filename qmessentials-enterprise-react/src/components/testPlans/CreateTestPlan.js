import React, { useState, useEffect } from 'react'
import { Link} from 'react-router-dom'
import Api from '../../ApiConnector';

export default props => {
    const [testPlanName, setTestPlanName] = useState('')
    const [allTestPlans, setAllTestPlans] = useState([])
    const [duplicateOfTestPlanId, setDuplicateOfTestPlanId] = useState('')

    const changeTestPlanName = event => setTestPlanName(event.target.value)
    const changeDuplicateOfTestPlanId = event => setDuplicateOfTestPlanId(event.target.value)

    useEffect(() => {
        (async () => {
            const api = new Api()
            const testPlans = (await api.listTestPlans({ isActive: true }))
            setAllTestPlans(testPlans)
        })()
    }, [])

    const submit = async event => {
        event.preventDefault()
        let newTestPlan = {
            testPlanName: testPlanName,
            isActive: true,
        };
        var api = new Api()
        if (duplicateOfTestPlanId) {
            const originalTestPlan = await api.getTestPlan(duplicateOfTestPlanId);
            newTestPlan.metrics = originalTestPlan.metrics;
        }
        await api.postTestPlan(newTestPlan)
        props.history.push('/test-plans')
    }

    return (
        <>
            <h3>Create Test Plan</h3>
            <form className="form">
                <div className="form-group">
                    <label className="control-label" htmlFor="testPlanName">Name</label>
                    <input className="form-control" type="text" id="testPlanName" name="testPlanName" onChange={changeTestPlanName} />
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="duplicateOfTestPlanId">Duplicate of</label>
                    <select className="form-control" id="duplicateOfTestPlanId" name="duplicateOfTestPlanId" onChange={changeDuplicateOfTestPlanId}>
                        <option value="0">None</option>
                        {
                            allTestPlans.map(testPlan =>
                                <option key={testPlan._id} value={testPlan._id}>{testPlan.testPlanName}</option>
                            )
                        }
                    </select>
                </div>
                <div className="form-group">
                    <div className="control-label">
                        <button className="btn btn-primary" onClick={submit}>Add</button>
                        <Link className="btn btn-outline-secondary" to="/test-plans">Cancel</Link>
                    </div>
                </div>
            </form>
        </>
    )
}
