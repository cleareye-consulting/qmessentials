using System.Collections.Generic;
using System.Linq;

namespace QMEssentials.Reporting.Models
{
    internal class Item
    {
        private ICollection<Observation> observations = new List<Observation>();
        private IDictionary<string, Metric<Item>> metrics = new Dictionary<string, Metric<Item>>();
        internal string ItemId { get; set; }
        internal Lot Lot { get; set; }
        internal IEnumerable<Observation> Observations => observations;
        internal IDictionary<string, Metric<Item>> Metrics => metrics;
        internal void AddObservation(Observation observation)
        {
            observations.Add(observation);
            if (!metrics.ContainsKey(observation.Metric.MetricName))
            {
                metrics.Add(
                    observation.Metric.MetricName,
                    new Metric<Item>(this)
                    {
                        MetricName = observation.Metric.MetricName,
                        N = observation.Metric.N,
                        Min = observation.Metric.Min,
                        Max = observation.Metric.Max,
                        Average = observation.Metric.Average,
                        StandardDeviation = observation.Metric.StandardDeviation,
                        Sum = observation.Metric.Sum
                    });
            }
            else
            {
                var observationsForMetric = observations.Where(obs => obs.Metric.MetricName == observation.Metric.MetricName);
                metrics[observation.Metric.MetricName] = new Metric<Item>(this)
                {
                    MetricName = observation.Metric.MetricName,
                    N = observationsForMetric.Sum(obs => obs.Metric.N),
                    Min = observationsForMetric.Min(obs => obs.Metric.Min),
                    Max = observationsForMetric.Max(obs => obs.Metric.Max),
                    Average =
                        observationsForMetric.Sum(obs => obs.Metric.Sum) != 0
                        ? (double?)(observationsForMetric.Sum(obs => obs.Metric.N) / observationsForMetric.Sum(obs => obs.Metric.Sum))
                        : null,
                    Sum = observationsForMetric.Sum(obs => obs.Metric.Sum)
                };
            }

        }

    }
}