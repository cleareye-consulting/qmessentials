import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import './App.scss'
import Layout from './components/Layout'
import Home from './components/Home'
import ListMetrics from './components/metrics/ListMetrics'
import CreateMetric from './components/metrics/CreateMetric'
import EditMetric from './components/metrics/EditMetric'
import ListTestPlans from './components/testPlans/ListTestPlans'
import CreateTestPlan from './components/testPlans/CreateTestPlan'
import EditTestPlan from './components/testPlans/EditTestPlan'
import AuthProvider from './components/auth/AuthProvider'
import ChangePassword from './components/auth/ChangePassword'
import CreateTestPlanMetric from './components/testPlanMetrics/CreateTestPlanMetric';
import EditTestPlanMetric from './components/testPlanMetrics/EditTestPlanMetric';

export default () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Route path="/" exact component={Home} />
          <Route path="/change-password" exact component={ChangePassword} />
          <Route path="/metrics" exact component={ListMetrics} />
          <Route path="/metric/create" exact component={CreateMetric} />
          <Route path="/metric/:id/edit" exact component={EditMetric} />
          <Route path="/test-plans" exact component={ListTestPlans} />
          <Route path="/test-plans/create" exact component={CreateTestPlan} />
          <Route path="/test-plans/:id/edit" exact component={EditTestPlan} />
          <Route path="/test-plans/:testPlanId/metrics/create" exact component={CreateTestPlanMetric} />
          <Route path="/test-plans/:testPlanId/metrics/:metricId/edit" exact component={EditTestPlanMetric}/>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  )
}
