using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Moq;
using Xunit;
using QMEssentials.API;
using QMEssentials.API.Controllers;
using QMEssentials.API.Models;
using Microsoft.EntityFrameworkCore;

namespace QMEssentials.API.Test
{
    public class MetricsControllerTest
    {
        [Fact]
        public async Task CreateMetric()
        {
            var mockSet = new Mock<DbSet<Metric>>();
            var mockRepo = new Mock<IQMEssentialsContext>();
            mockRepo.Setup(repo => repo.Metrics).Returns(mockSet.Object);
            var controller = new MetricsController(mockRepo.Object);
            var metric = new Metric
            {
                Name = "Test Metric 1"
            };
            await controller.Post(metric);

        }
    }
}
