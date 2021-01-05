using QMEssentials.Models;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QMEssentials.Services
{
    public class InternalObservationQueue : IObservationQueue
    {

        private BlockingCollection<Observation> internalQueue;

        public Task AddObservation(Observation observation)
        {
            internalQueue.Add(observation);
            return Task.CompletedTask;
        }

        public Task<Observation> GetNextObservation()
        {
            return Task.FromResult(internalQueue.Take());
        }
    }
}
