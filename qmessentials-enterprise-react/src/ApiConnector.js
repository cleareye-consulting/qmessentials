import axios from 'axios'

export default class ApiConnector {

    async logIn(login) {
        const token = await axios.post(process.env.REACT_APP_API_ENDPOINT + '/logins', login)        
        return token.data
    }

    async changePassword(userId, newPassword) {
        await axios.post(process.eventNames.REACT_APP_API_ENDPOINT + '/users', {userId: userId, password: newPassword})
    }

    async listMetrics(filter) {
        console.log('Auth header: ')
        console.log(axios.defaults.headers.common['Authorization']);
        const metrics = await axios.get(process.env.REACT_APP_API_ENDPOINT + '/metrics', {
            params: {
                filter: filter
            }
        })
        return metrics.data
    }

    async getMetric(id) {
        const list = await this.listMetrics({ _id: id })
        return list[0]
    }

    async postMetric(metric) {
        await axios.post(process.env.REACT_APP_API_ENDPOINT + '/metrics', metric)
    }

    async listTestPlans(filter) {
        const testPlans = await axios.get(process.env.REACT_APP_API_ENDPOINT + '/test-plans', {
            params: {
                filter: filter
            }
        })
        return testPlans.data
    }

    async getTestPlan(id) {
        const list = await this.listTestPlans({ _id: id })
        return list[0]
    }

    async postTestPlan(testPlan) {
        await axios.post(process.env.REACT_APP_API_ENDPOINT + '/test-plans', testPlan)
    }

    async listTestPlanMetrics(filter) {
        const testPlanMetrics = await axios.get(process.env.REACT_APP_API_ENDPOINT + '/test-plan-metrics', {
            params: {
                filter: filter
            }
        })
        return testPlanMetrics.data
    }

    async postTestPlanMetric(testPlanMetric) {
        await axios.post(process.env.REACT_APP_API_ENDPOINT + '/test-plan-metrics', testPlanMetric)
    }

}