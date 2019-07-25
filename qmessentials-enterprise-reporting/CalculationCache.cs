using System;
using System.Collections.Generic;
using System.Linq;
using QMEssentials.Reporting.Models;

namespace QMEssentials.Reporting
{

    internal class CalculationCache
    {

        internal Dictionary<string, Product> products;

        internal IDictionary<string, Product> Products => products;

        internal void ProcessIncomingObservation(IncomingObservation incomingObservation)
        {
            var product =
                Products.ContainsKey(incomingObservation.ProductId)
                ? Products[incomingObservation.ProductId]
                : new Product { ProductId = incomingObservation.ProductId };
            var lot = product[incomingObservation.LotNumber];
            var item = lot[incomingObservation.ItemId];
            var observation = new Observation { Item = item };
            var observationMetric = new Metric<Observation>(observation)
            {
                MetricName = incomingObservation.MetricName,
                N = incomingObservation.Values.Length,
                Min = incomingObservation.Values.Min(),
                Max = incomingObservation.Values.Max(),
                Average = incomingObservation.Values.Average(),
                Sum = incomingObservation.Values.Sum(),
            };
            observation.Metric = observationMetric;
            item.AddObservation(observation);
            lot.AddItem(item);
            product.AddLot(lot);
        }

        internal void ReloadProduct(string productId)
        {
            throw new NotImplementedException();
        }

        internal void ReloadLot(string lotNumber)
        {
            throw new NotImplementedException();
        }

        internal void UnloadLot(string lotNumber, string productId) => products[productId].RemoveLot(lotNumber);

    }

}