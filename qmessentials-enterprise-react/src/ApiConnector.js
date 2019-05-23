import axios from 'axios'

export default class ApiConnector {
    async listMetrics() {
        var metrics = await axios.get(process.env.REACT_APP_API_ENDPOINT + '/metrics');
        return metrics.data;
    }

    async getMetric() {

    }

    async postMetric() {

    }

}