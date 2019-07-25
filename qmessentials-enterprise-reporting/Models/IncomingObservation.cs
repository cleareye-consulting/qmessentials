namespace QMEssentials.Reporting.Models
{
    internal struct IncomingObservation
    {
        internal IncomingObservation(string productId, string lotNumber, string itemId, string metricName, double[] values)
        {
            ProductId = productId;
            LotNumber = lotNumber;
            ItemId = itemId;
            MetricName = metricName;
            Values = values;
        }

        internal string ProductId { get; private set; }
        internal string LotNumber { get; private set; }
        internal string ItemId { get; private set; }
        internal string MetricName { get; private set; }
        internal double[] Values { get; private set; }
    }
}