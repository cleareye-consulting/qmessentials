using System;
using System.Collections.Generic;
using System.Linq;

namespace QMEssentials.Reporting.Models
{
    internal class Product
    {
        private IDictionary<string, Lot> lots = new Dictionary<string, Lot>();
        private IDictionary<string, Metric<Product>> metrics = new Dictionary<string, Metric<Product>>();
        private IDictionary<string, ICollection<Lot>> lotsByMetricName = new Dictionary<string, ICollection<Lot>>();
        internal string ProductId { get; set; }
        internal IDictionary<string, Lot> Lots => lots;
        internal IDictionary<string, Metric<Product>> Metrics => metrics;
        internal Lot this[string lotNumber] => lots.ContainsKey(lotNumber) ? lots[lotNumber] : new Lot { LotNumber = lotNumber, Product = this };

        internal void AddLot(Lot lot)
        {
            if (lot == null)
            {
                throw new ArgumentNullException(nameof(lot));
            }
            if (lots.ContainsKey(lot.LotNumber))
            {
                throw new ArgumentException("Lot already exists", nameof(lot));
            }
            lots.Add(lot.LotNumber, lot);
            foreach (var metricName in lot.Metrics.Keys)
            {
                var lotMetric = lot.Metrics[metricName];
                if (lotsByMetricName.ContainsKey(metricName))
                {
                    lotsByMetricName[metricName].Add(lot);
                }
                else
                {
                    lotsByMetricName.Add(metricName, new[] { lot });
                }
                if (!metrics.ContainsKey(metricName))
                {
                    metrics.Add(
                        metricName,
                        new Metric<Product>(this)
                        {
                            MetricName = metricName,
                            N = lotMetric.N,
                            Min = lotMetric.Min,
                            Max = lotMetric.Max,
                            Average = lotMetric.Average,
                            StandardDeviation = lotMetric.StandardDeviation,
                            Sum = lotMetric.Sum
                        });
                }
                else
                {
                    var allMetricsWithTheSameName = lotsByMetricName[metricName].Select(l => l.Metrics[metricName]);
                    metrics[lot.LotNumber] = new Metric<Product>(this)
                    {
                        MetricName = metricName,
                        N = allMetricsWithTheSameName.Sum(m => m.N),
                        Min = allMetricsWithTheSameName.Min(m => m.Min),
                        Max = allMetricsWithTheSameName.Max(m => m.Max),
                        Average =
                            allMetricsWithTheSameName.Sum(m => m.Sum) != 0
                            ? (double?)(allMetricsWithTheSameName.Sum(m => m.N) / allMetricsWithTheSameName.Sum(m => m.Sum))
                            : null,
                        Sum = allMetricsWithTheSameName.Sum(m => m.Sum)
                    };
                }

            }

        }

        internal void RemoveLot(string lotNumber)
        {
            if (lots.ContainsKey(lotNumber))
            {
                lots.Remove(lotNumber);
                foreach (var metricName in lotsByMetricName.Keys)
                {
                    var lotForMetric = lotsByMetricName[metricName].SingleOrDefault(l => l.LotNumber == lotNumber);
                    if (lotForMetric != null)
                    {
                        lotsByMetricName[metricName].Remove(lotForMetric);
                    }
                }
            }
        }

    }
}