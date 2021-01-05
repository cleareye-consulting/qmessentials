using QMEssentials.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QMEssentials.Repositories
{
    public interface IObservationsRepository
    {

        Task<IEnumerable<Observation>> ListObservations(ObservationCriteria criteria);

        Task AddObservation(Observation observation);
    }
}
