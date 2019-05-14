import axios from 'axios'

export default class Api {

    endpoint = ''

    constructor() {
        this.endpoint = process.env.NODE_API_ENDPOINT || 'https://localhost:5001/api/';
    }

    getMetrics(name) {
        return axios.get(this.endpoint + 'Metrics', { params: { name: name } })
    }

    postMetric(metric) {        
        return axios.post(this.endpoint + 'Metrics', metric)
    }

}