export default class Api {
    postMetric(metric) {
        return fetch(
            'https:localhost:5001/api/Metric',
            {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(metric)
            })

    }
}