namespace QMEssentials.Reporting.Models
{
    internal class Metric<T>
    {

        T Scope { get; set; }

        public Metric(T scope)
        {
            this.Scope = scope;
        }

        public string MetricName { get; set; }

        public double N { get; set; }
        public double? Min { get; set; }
        public double? Max { get; set; }
        public double? Average { get; set; }
        public double? StandardDeviation { get; set; }
        public double Sum { get; set; }

    }
}