import React, { Component } from 'react'
import { Link} from 'react-router-dom'
import ApiConnector from '../../ApiConnector';

export default props => {

}


// export default class Edit extends Component {

//     constructor(props) {
//         super(props)
        
//         this.state = {
//             testPlan: {
//                 testPlanName: '',
//                 isActive: false,                
//             },
//             metrics: [],
//             testPlanMetrics: [],
//             testPlanMetricIdUnderEdit: null,
//             newTestPlanMetric: {
//                 _id: null,
//                 metricId: null,
//                 qualifiers: [],
//                 usage: '',
//                 criteria: {},
//                 units: '',
//                 isNullable: false,
//                 isActive: true                
//             }
//         }
//         this.handleChange = this.handleChange.bind(this)
//         this.handleChangeForTestPlanMetric = this.handleChangeForTestPlanMetric.bind(this)
//         this.handleSubmitForTestPlanMetric = this.handleSubmitForTestPlanMetric.bind(this)
//     }

//     async componentDidMount() {
//         const id = this.props.match.params.id
//         const api = new ApiConnector()
//         const metrics = await api.listMetrics({ isActive: true })
//         this.setState({metrics: metrics})
//         const testPlan = await api.getTestPlan(id)               
//         this.setState({
//             testPlan: testPlan
//         })                    
//         const testPlanMetrics = await api.listTestPlanMetrics({ testPlanId: id })
//         this.setState({
//             testPlanMetrics: testPlanMetrics
//         })                    
//     }

//     async handleChange(event) {
//         const value = event.target.type === "checkbox" ? event.target.checked : event.target.value
//         let updated = this.state.testPlan
//         updated[event.target.name] = value
//         this.setState({
//             testPlan: updated
//         })
//         updated._id = this.props.match.params.id
//         const api = new ApiConnector()
//         await api.postTestPlan(updated)
//     }

//     handleChangeForTestPlanMetric(event) {
//         const value = event.target.type === "checkbox" ? event.target.checked : event.target.value
//         if (this.state.testPlanMetricIdUnderEdit) {
//             let testPlanMetrics = this.state.testPlanMetrics
//             let index = testPlanMetrics.findIndex(tpm => tpm._id === this.state.testPlanMetricIdUnderEdit)
//             testPlanMetrics[index][event.target.name] = value
//             this.setState({
//                 testPlanMetrics: testPlanMetrics
//             })
//         }
//         else {
//             let newTestPlanMetric = this.state.newTestPlanMetric
//             newTestPlanMetric[event.target.name] = value
//             this.setState({
//                 newTestPlanMetric : newTestPlanMetric
//             })
//         }
//     }

//     async handleSubmitForTestPlanMetric() {
//         const api = new ApiConnector()
//         await api.postTestPlanMetric(this.state.testPlanMetricUnderEdit)
//         this.setState({testPlanMetricIdUnderEdit: null})
//     }

//     render() {
//         return (
//             <React.Fragment>
//                 <h3>Edit Test Plan</h3>
//                 <form className="form">
//                     <input type="hidden" id="_id" name="_id" defaultValue={this.props.match.params.id}/>
//                     <div className="form-group">
//                         <label className="control-label" htmlFor="testPlanName">Name</label>
//                         <input className="form-control" type="text" id="testPlanName" name="testPlanName" onChange={this.handleChange} defaultValue={this.state.testPlan.testPlanName} disabled={true} />
//                     </div>
//                     <div className="form-group">        
//                         <div className="form-check">
//                             <input className="form-check-input" type="checkbox" id="isActive" name="isActive" checked={this.state.testPlan.isActive} onChange={this.handleChange}/>
//                             <label className="form-check-label" htmlFor="isActive">
//                                 Active
//                             </label>
//                         </div>
//                     </div>                     
//                     <table className="table">
//                         <thead>
//                             <tr>
//                                 <th>Order</th>
//                                 <th>Metric</th>
//                                 <th>Qualifiers</th>
//                                 <th>Usage</th>
//                                 <th>Criteria</th>
//                                 <th>Units</th>
//                                 <th>Nullable</th>
//                                 <th>Active</th>
//                                 <th>&nbsp;</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {
//                                 this.state.testPlanMetrics.map(tpm => 
//                                     <tr key={tpm._id}>
//                                         {
//                                             this.state.testPlanMetricIdUnderEdit === tpm._id
//                                                 ? <React.Fragment>
//                                                     <td><input type="text" className="form-control" name="order" defaultValue={tpm.order} onChange={this.handleChangeForTestPlanMetric} /></td>
//                                                     <td>
//                                                         <select className="form-control" name="metricId" onChange={this.handleChangeForTestPlanMetric}>
//                                                             <option value="0">Select a metric...</option>
//                                                             {
//                                                                 this.state.metrics.map(metric => <option key={metric._id} value={metric._id} selected={metric._id === tpm.metricId} >{metric.metricName}</option>)
//                                                             }
//                                                         </select>
//                                                     </td>
//                                                     <td><input type="text" className="form-control" name="qualifiers" defaultValue={tpm.qualifiers} onChange={this.handleChangeForTestPlanMetric} /></td>
//                                                     <td><input type="text" className="form-control" name="usage" defaultValue={tpm.usage} onChange={this.handleChangeForTestPlanMetric} /></td>
//                                                     <td><input type="text" className="form-control" name="criteria" defaultValue={tpm.criteria} onChange={this.handleChangeForTestPlanMetric} /></td>
//                                                     <td><input type="text" className="form-control" name="units" defaultValue={tpm.units} onChange={this.handleChangeForTestPlanMetric} /></td>
//                                                     <td><input type="checkbox" className="checkbox" name="isNullable" checked={tpm.isNullable} onChange={this.handleChangeForTestPlanMetric} /></td>
//                                                     <td><input type="tcheckboxext" className="checkbox" name="isActive" checked={tpm.isActive} onChange={this.handleChangeForTestPlanMetric} /></td>
//                                                     <td><button type="button" className="btn btn-sm btn-outline-primary" onClick={this.handleSubmitForTestPlanMetric}>Update</button></td>
//                                                 </React.Fragment>
//                                                 : <React.Fragment>
//                                                     <td>{tpm.order}</td>
//                                                     <td>{tpm.qualifiers}</td>
//                                                     <td>{tpm.usage}</td>
//                                                     <td>{tpm.criteria}</td>
//                                                     <td>{tpm.units}</td>
//                                                     <td>{tpm.isNullable}</td>
//                                                     <td>{tpm.isActive}</td>
//                                                     <td><button type="button" className="btn btn-sm btn-outline-primary" data-testPlanMetricId={tpm._id}>Edit</button></td>
//                                                 </React.Fragment>
//                                         }
//                                     </tr>
//                                 )
//                             }
//                             {
//                                 this.state.testPlanMetricIdUnderEdit === null 
//                                     ? <tr>
//                                         <td><input type="text" className="form-control" name="order" onChange={this.handleChangeForTestPlanMetric} /></td>
//                                         <td>
//                                             <select className="form-control" name="metricId" onChange={this.handleChangeForTestPlanMetric}>
//                                                 <option value="0">Select a metric...</option>
//                                                 {
//                                                     this.state.metrics.map(metric => <option key={metric._id} value={metric._id}>{metric.metricName}</option>)
//                                                 }
//                                             </select>
//                                         </td>                                        
//                                         <td><input type="text" className="form-control" name="qualifiers" onChange={this.handleChangeForTestPlanMetric} /></td>
//                                         <td><input type="text" className="form-control" name="usage" onChange={this.handleChangeForTestPlanMetric} /></td>
//                                         <td><input type="text" className="form-control" name="criteria" onChange={this.handleChangeForTestPlanMetric} /></td>
//                                         <td><input type="text" className="form-control" name="units" onChange={this.handleChangeForTestPlanMetric} /></td>
//                                         <td><input type="checkbox" className="checkbox" name="isNullable" onChange={this.handleChangeForTestPlanMetric} /></td>
//                                         <td><input type="checkbox" className="checkbox" name="isActive" checked={true} disabled={true} /></td>                                        
//                                         <td><button type="button" className="btn btn-sm btn-outline-primary" onClick={this.handleSubmitForTestPlanMetric}>Add</button></td>
//                                     </tr>
//                                     : ''
//                             }
//                         </tbody>
//                     </table>
//                     <div className="form-group">
//                         <div className="control-label">
//                             <Link className="btn btn-default" to="/test-plans">Return to List</Link>
//                         </div>
//                     </div>
//                 </form>
//             </React.Fragment>
//         )
//     }

// }