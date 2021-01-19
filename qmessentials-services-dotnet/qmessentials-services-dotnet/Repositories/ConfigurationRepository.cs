using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using QMEssentials.Models;

namespace QMEssentials.Repositories
{
    public class ConfigurationRepository : IConfigurationRepository
    {

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

        public Task<IEnumerable<Product>> ListProducts(ProductCriteria? criteria)
        {
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