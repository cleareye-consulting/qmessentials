using System;

namespace QMEssentials.Models
{
    public record Lot
    {
        public Lot(string lotId, string productId, string? customerIdentifier, DateTime createdDate, string lotStatus)
        {
            LotId = lotId;
            ProductId = productId;
            CustomerIdentifier = customerIdentifier;
            CreatedDate = createdDate;
            LotStatus = lotStatus;
        }

        public string LotId { get; }
        public string ProductId { get; }
        public string? CustomerIdentifier { get; }
        public DateTime CreatedDate { get; }
        public string LotStatus { get; }


    }



}