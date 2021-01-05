using System.Threading.Tasks;
using QMEssentials.Models;

namespace QMEssentials.Services
{
    public interface IObservationQueue
    {
        Task AddObservation(Observation observation);
        Task<Observation> GetNextObservation();
    }
}