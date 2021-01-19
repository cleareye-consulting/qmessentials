using System.Threading.Tasks;
using System.Linq;

using QMEssentials.Models;
using System.Collections.Generic;

namespace QMEssentials.Repositories
{
    public interface IConfigurationRepository
    {

        Task<Item> SelectItem(string itemId);

        Task<string> AddItem(Item item);

        Task ReplaceItem(Item item);

        Task RemoveItem(string itemId);

        Task<Product> SelectProduct(string productId);

        Task<IEnumerable<Product>> ListProducts(ProductCriteria? criteria);

        Task<string> AddProduct(Product product);

        Task ReplaceProduct(Product product);

        Task RemoveProduct(string productId);

        Task<Lot> SelectLot(string lotId);

        Task<string> AddLot(Lot lot);

        Task ReplaceLot(Lot lot);

        Task RemoveLot(string lotId);

        Task<Metric> SelectMetric(string metricId);

        Task<string> AddMetric(Metric metric);

        Task ReplaceMetric(Metric metric);

        Task RemoveMetric(string metricId);

    }
}