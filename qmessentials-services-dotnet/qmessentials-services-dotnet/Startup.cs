using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;

namespace QMEssentials.Services
{
    public class Startup
    {

        private bool isQueueProcessor = false;
        private bool isConfigurationService = false;
        private bool isCalculationEngine = false;
        private bool isReportingService = false;
        private bool isSubscriptionProcessor = false;

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            isQueueProcessor = Configuration.GetSection("Services").GetValue<bool>("QueueProcessor");
            isConfigurationService = Configuration.GetSection("Services").GetValue<bool>("Configuration");
            isCalculationEngine = Configuration.GetSection("Services").GetValue<bool>("Calculation");
            isReportingService = Configuration.GetSection("Services").GetValue<bool>("Reporting");
            isSubscriptionProcessor = Configuration.GetSection("Services").GetValue<bool>("Subscriptions");
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            if (isQueueProcessor) {
                services.AddHostedService<QueueProcessor>(); 
            }

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "qmessentials_services_dotnet", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "qmessentials_services_dotnet v1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.Use(next => async context => {
                var endpoint = context.Request.Path.ToString();
                if (endpoint.StartsWith("/Configuration/", StringComparison.OrdinalIgnoreCase) && !isConfigurationService) {
                    return; //end execution here
                }
                if (endpoint.StartsWith("/Reporting/", StringComparison.OrdinalIgnoreCase) && !isReportingService) {
                    return; //end execution here
                }
                await next(context);
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
