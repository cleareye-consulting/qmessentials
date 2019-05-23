import axios from 'axios'

export default class ApiConnector {
    async listMetrics(filter) {
        var metrics = await axios.get(process.env.REACT_APP_API_ENDPOINT + '/metrics', {
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

}