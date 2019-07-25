using System.Collections.Generic;
using System.Linq;

namespace QMEssentials.Reporting.Models
{
    internal class Lot
    {
        private IDictionary<string, Item> items = new Dictionary<string, Item>();
        private IDictionary<string, Metric<Lot>> metrics = new Dictionary<string, Metric<Lot>>();
        private IDictionary<string, ICollection<Item>> itemsByMetricName = new Dictionary<string, ICollection<Item>>();
        internal string LotNumber { get; set; }
        internal Product Product { get; set; }
        internal IDictionary<string, Item> Items => items;
        internal IDictionary<string, Metric<Lot>> Metrics => metrics;
        internal Item this[string itemId] => Items.ContainsKey(itemId) ? Items[itemId] : new Item { Lot = this, ItemId = itemId };
        internal void AddItem(Item item)
        {
            items.Add(item.ItemId, item);
            foreach (var metricName in item.Metrics.Keys)
            {
                var itemMetric = item.Metrics[metricName];
                if (itemsByMetricName.ContainsKey(metricName))
                {
                    itemsByMetricName[metricName].Add(item);
                }
                else
                {
                    itemsByMetricName.Add(metricName, new[] { item });
                }
                if (!metrics.ContainsKey(metricName))
                {
                    metrics.Add(
                        metricName,
                        new Metric<Lot>(this)
                        {
                            MetricName = metricName,
                            N = itemMetric.N,
                            Min = itemMetric.Min,
                            Max = itemMetric.Max,
                            Average = itemMetric.Average,
                            StandardDeviation = itemMetric.StandardDeviation,
                            Sum = itemMetric.Sum
                        });
                }
                else
                {
                    var allMetricsWithTheSameName = itemsByMetricName[metricName].Select(it => it.Metrics[metricName]);
                    metrics[item.ItemId] = new Metric<Lot>(this)
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
    }
}