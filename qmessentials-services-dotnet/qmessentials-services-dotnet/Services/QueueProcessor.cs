using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace QMEssentials.Services
{
    public class QueueProcessor : BackgroundService
    {

        private readonly ILogger<QueueProcessor> logger;

        public QueueProcessor(ILogger<QueueProcessor> logger)
        {
            this.logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                logger.LogInformation("QueueProcessor running");
                await Task.Delay(TimeSpan.FromMinutes(5));
            }
        }
    }
}