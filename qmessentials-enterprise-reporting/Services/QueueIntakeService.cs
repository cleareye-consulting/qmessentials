using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Amazon.SQS;
using Amazon;
using Amazon.SQS.Model;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using QMEssentials.Reporting.Models;
using Newtonsoft.Json;
using Microsoft.Extensions.Logging;

namespace QMEssentials.Reporting.Services
{
    internal class QueueIntakeService : IHostedService, IDisposable
    {

        IAmazonSQS sqs;
        IConfiguration configuration;
        CalculationCache calculationCache;
        ReportingDatabaseContext databaseContext;
        ILogger<QueueIntakeService> logger;

        public QueueIntakeService(IConfiguration configuration, CalculationCache calculationCache, //ReportingDatabaseContext databaseContext,
            ILogger<QueueIntakeService> logger)
        {
            this.configuration = configuration;
            this.calculationCache = calculationCache;
            //this.databaseContext = databaseContext;
            this.logger = logger;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            logger.LogDebug("Queue Intake Service Started");
            sqs = new AmazonSQSClient();
            var url = configuration["QueueUrl"];
            await Task.Run(async () =>
            {
                while (!cancellationToken.IsCancellationRequested)
                {
                    var request = new ReceiveMessageRequest
                    {
                        MessageAttributeNames = new List<string>() { "All" },
                        QueueUrl = url,
                        WaitTimeSeconds = 20
                    };
                    logger.LogDebug("Checking for messages");
                    var response = await sqs.ReceiveMessageAsync(request);
                    logger.LogDebug("Message check completed");
                    logger.LogDebug($"Content Length: {response.ContentLength}");
                    logger.LogDebug($"{response.Messages.Count} messages received");
                    var intakeDataHelper = new IntakeDataHelper(calculationCache);//, databaseContext);            
                    foreach (var message in response.Messages)
                    {
                        logger.LogDebug("Parsing message");
                        logger.LogDebug($"Attribute count: {message.MessageAttributes.Keys.Count}");
                        var parsedMessage = ParseMessage(message);
                        if (parsedMessage.type == typeof(IncomingObservation))
                        {
                            intakeDataHelper.HandleIncomingObservation((IncomingObservation)parsedMessage.obj);
                        }
                        else
                        {
                            logger.LogWarning($"No handler for parsed message of type '{parsedMessage.type}'");
                        }
                        await sqs.DeleteMessageAsync(new DeleteMessageRequest { QueueUrl = url, ReceiptHandle = message.ReceiptHandle });
                    }
                }

            });
        }

        private (object obj, Type type) ParseMessage(Message message)
        {
            if (!message.MessageAttributes.ContainsKey("type"))
            {
                //Ignore
                logger.LogWarning("Untyped message received");
                return (null, typeof(object));
            }
            var messageType = message.MessageAttributes["type"].StringValue;
            if (messageType == "Observation")
            {
                var incomingObservation = JsonConvert.DeserializeObject<IncomingObservation>(message.Body);
                return (incomingObservation, typeof(IncomingObservation));
            }
            throw new ArgumentException("Unknown message type", nameof(message));
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }

        #region IDisposable Support
        private bool disposedValue = false; // To detect redundant calls

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    sqs?.Dispose();
                }

                // TODO: free unmanaged resources (unmanaged objects) and override a finalizer below.
                // TODO: set large fields to null.

                disposedValue = true;
            }
        }

        // TODO: override a finalizer only if Dispose(bool disposing) above has code to free unmanaged resources.
        // ~QueueIntakeService()
        // {
        //   // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
        //   Dispose(false);
        // }

        // This code added to correctly implement the disposable pattern.
        public void Dispose()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            Dispose(true);
            // TODO: uncomment the following line if the finalizer is overridden above.
            // GC.SuppressFinalize(this);
        }
        #endregion
    }
}