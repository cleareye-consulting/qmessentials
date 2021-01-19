using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Npgsql;
using QMEssentials.Models;

namespace QMEssentials.Repositories
{
    public class ConfigurationRepository : IConfigurationRepository
    {

        private readonly string configurationConnectionString;

        private DbConnection GetConnection()
        {
            return new NpgsqlConnection(configurationConnectionString);
        }

        private DbCommand GetDbCommand(string sql, DbConnection connection)
        {
            return new NpgsqlCommand(sql, (NpgsqlConnection)connection) { CommandType = System.Data.CommandType.Text };
        }

        private async Task<DbDataReader> GetDataReader(DbCommand command)
        {
            return await command.ExecuteReaderAsync();
        }

        public ConfigurationRepository(IConfiguration configuration)
        {
            configurationConnectionString = configuration.GetConnectionString("Configuration");
        }

        public Task<Product> SelectProduct(string productId)
        {
            throw new NotImplementedException();
        }

        public Task AddProduct(Product product)
        {
            throw new NotImplementedException();
        }

        public Task UpdateProduct(Product product)
        {
            throw new NotImplementedException();
        }

        public Task<Item> SelectItem(string itemId)
        {
            throw new NotImplementedException();
        }

        public Task<string> AddItem(Item item)
        {
            throw new NotImplementedException();
        }

        public Task ReplaceItem(Item item)
        {
            throw new NotImplementedException();
        }

        public Task RemoveItem(string itemId)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Product>> ListProducts(ProductCriteria? criteria)
        {
            using var cn = GetConnection();
            await cn.OpenAsync();
            var sql = "select ProductId, ProductName from Product where ProductId like ";
            
            using var cmd = GetDbCommand(sql, cn);
            using var reader = await GetDataReader(cmd);
            while (await reader.ReadAsync())
            {

            }
            throw new NotImplementedException();
        }

        Task<string> IConfigurationRepository.AddProduct(Product product)
        {
            throw new NotImplementedException();
        }

        public Task ReplaceProduct(Product product)
        {
            throw new NotImplementedException();
        }

        public Task RemoveProduct(string productId)
        {
            throw new NotImplementedException();
        }

        public Task<Lot> SelectLot(string lotId)
        {
            throw new NotImplementedException();
        }

        public Task<string> AddLot(Lot lot)
        {
            throw new NotImplementedException();
        }

        public Task ReplaceLot(Lot lot)
        {
            throw new NotImplementedException();
        }

        public Task RemoveLot(string lotId)
        {
            throw new NotImplementedException();
        }

        public Task<Metric> SelectMetric(string metricId)
        {
            throw new NotImplementedException();
        }

        public Task<string> AddMetric(Metric metric)
        {
            throw new NotImplementedException();
        }

        public Task ReplaceMetric(Metric metric)
        {
            throw new NotImplementedException();
        }

        public Task RemoveMetric(string metricId)
        {
            throw new NotImplementedException();
        }
    }
}