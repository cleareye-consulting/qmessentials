using QMEssentials.Models;

namespace QMEssentials.Repositories
{
    public interface IReportingRepository
    {
        Task AddLotCalculations(LotCalculations lotCalculations);
    }
}