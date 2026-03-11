using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CryptoShop.Backend.Models
{
    public class Order
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        
        [BsonElement("userId")]
        public string UserId { get; set; }
        
        [BsonElement("orderDate")]
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        
        [BsonElement("totalAmount")]
        public decimal TotalAmount { get; set; }
        
        [BsonElement("status")]
        public string Status { get; set; } = "New";
        
        [BsonElement("shippingAddress")]
        public string ShippingAddress { get; set; }
        
        [BsonElement("contactPhone")]
        public string ContactPhone { get; set; }
        
        [BsonElement("contactName")]
        public string ContactName { get; set; }
        
        [BsonElement("transactionHash")]
        public string TransactionHash { get; set; }
        
        [BsonElement("items")]
        public List<OrderItem> Items { get; set; } = new();
    }
}