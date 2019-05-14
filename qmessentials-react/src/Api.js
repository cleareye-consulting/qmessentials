import axios from 'axios'

export default class Api {
    postMetric(metric) {        
        return axios.post(
            'https://localhost:5001/api/Metrics',
            metric
        )
    }
}