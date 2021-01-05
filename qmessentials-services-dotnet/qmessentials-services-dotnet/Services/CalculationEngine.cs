using Microsoft.Extensions.Hosting;
using QMEssentials.Models;
using QMEssentials.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace QMEssentials.Services
{
    public class CalculationEngine : BackgroundService
    {
        private readonly IObservationQueue observationQueue;
        private readonly IObservationsRepository observationsRepository;
        private readonly IReportingRepository reportingRepository;

        public CalculationEngine(IObservationQueue observationQueue, IObservationsRepository observationsRepository, IReportingRepository reportingRepository)
        {
            this.observationQueue = observationQueue;
            this.observationsRepository = observationsRepository;
            this.reportingRepository = reportingRepository;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                var triggerObservation = await observationQueue.GetNextObservation();
                var allObservationsForLot =
                    await observationsRepository.ListObservations(new ObservationCriteria { LotIds = new[] { triggerObservation.LotId } });
                var lotCalcuations = GetLotCalculations(triggerObservation.LotId, allObservationsForLot);
                await reportingRepository.AddLotCalculations(lotCalcuations);
            }
        }

        private static LotCalculations GetLotCalculations(string lotId, IEnumerable<Observation> observations)
        {
            var metricCalculations = new List<MetricCalculations>();
            var metricTable = new Dictionary<string, IEnumerable<double>>();
            foreach (var observation in observations)
            {
                var valueAsList = new List<double> { observation.Value };
                if (metricTable.ContainsKey(observation.MetricId))
                {
                    metricTable[observation.MetricId] = metricTable[observation.MetricId].Concat(valueAsList);
                }
                else
                {
                    metricTable[observation.MetricId] = valueAsList;
                }
            }
            foreach (var metricId in metricTable.Keys)
            {
                var calculations = new MetricCalculations { MetricId = metricId };
                var metricValuesSorted = metricTable[metricId].OrderBy(v => v);
                foreach (var value in metricValuesSorted)
                {
                    calculations.Count += 1;
                    calculations.Sum += value;
                    if (value < (calculations.MinValue ?? double.MaxValue))
                    {
                        calculations.MinValue = value;
                    }
                    if (value > (calculations.MaxValue ?? double.MinValue))
                    {
                        calculations.MaxValue = value;
                    }
                }
                if (calculations.Count == null || calculations.Count == 0)
                {
                    throw new InvalidOperationException(); //should never get here
                }
                calculations.Average = (calculations.Sum ?? 0D) / calculations.Count;
                var firstQuartilePosition = (int)Math.Floor(calculations.Count.Value / 4D);
                calculations.FirstQuartile = metricValuesSorted.ElementAt(firstQuartilePosition);
                var medianPosition = (int)Math.Ceiling(calculations.Count.Value / 2D);
                calculations.Median = metricValuesSorted.ElementAt(medianPosition);
                var thirdQuartilePosition = (int)Math.Ceiling(calculations.Count.Value * 3D / 4D);
                calculations.ThirdQuartile = metricValuesSorted.ElementAt(thirdQuartilePosition);
                double sumOfSquaredDeviations = 0D;
                foreach (var value in metricValuesSorted)
                {
                    var deviation = value - calculations.Average.Value;
                    var square = Math.Pow(deviation, 2);
                    sumOfSquaredDeviations += square;
                }
                calculations.StandardDeviation = Math.Sqrt(sumOfSquaredDeviations);
                metricCalculations.Add(calculations);
            }
            return new LotCalculations { LotId = lotId, MetricCalculations = metricCalculations };
        }

    }
}
