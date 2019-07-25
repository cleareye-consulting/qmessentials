using QMEssentials.Reporting.Models;

namespace QMEssentials.Reporting
{
    internal class IntakeDataHelper
    {

        private CalculationCache calculationCache;
        //private ReportingDatabaseContext databaseContext;

        internal IntakeDataHelper(CalculationCache calculationCache)//, ReportingDatabaseContext databaseContext)
        {
            this.calculationCache = calculationCache;
            //this.databaseContext = databaseContext;
        }

        internal async void HandleIncomingObservation(IncomingObservation incomingObservation)
        {
            calculationCache.ProcessIncomingObservation(incomingObservation);
            // await databaseContext.Observations.AddAsync(new ReportingDatabaseContext.Observation
            // {
            //     ItemId = incomingObservation.ItemId,
            //     MetricName = incomingObservation.MetricName,
            //     Values = incomingObservation.Values
            // });
            // await databaseContext.SaveChangesAsync();
        }

    }
}