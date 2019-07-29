import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import './App.scss'
import Layout from './components/Layout'
import Home from './components/Home'
import MetricsList from './components/metrics/ListMetrics'
import MetricsCreate from './components/metrics/CreateMetric'
import MetricsEdit from './components/metrics/EditMetric'
import TestPlansList from './components/testPlans/ListTestPlans'
import TestPlansCreate from './components/testPlans/CreateTestPlan'
import TestPlansEdit from './components/testPlans/EditTestPlan'
import AuthProvider from './components/auth/AuthProvider'
import ChangePassword from './components/auth/ChangePassword'

export default () => {
  return (
      <BrowserRouter>
        <AuthProvider>          
          <Layout>            
            <Route path="/" exact component={Home} />
            <Route path="/change-password" exact component={ChangePassword}/>
            <Route path="/metrics" exact component={MetricsList} />
            <Route path="/metric/create" exact component={MetricsCreate} />
            <Route path="/metric/:id/edit" exact component={MetricsEdit} />
            <Route path="/test-plans" exact component={TestPlansList} />
            <Route path="/test-plans/create" exact component={TestPlansCreate} />
            <Route path="/test-plans/:id/edit" exact component={TestPlansEdit} />
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    )
}
