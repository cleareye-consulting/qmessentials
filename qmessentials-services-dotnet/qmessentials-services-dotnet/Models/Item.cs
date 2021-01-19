using System;

namespace QMEssentials.Models
{

    public record Item
    {
        public Item(string itemId, string lotId, DateTime createdDate, string itemStatus)
        {
            ItemId = itemId;
            LotId = lotId;
            CreatedDate = createdDate;
            ItemStatus = itemStatus;
        }

        public string ItemId { get; }
        public string LotId { get; }
        public DateTime CreatedDate { get; }
        public string ItemStatus { get; }
    }


}