using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CryptoShop.Backend.Models
{
    public class OrderItem
    {
        [BsonElement("productId")]
        public string ProductId { get; set; }
        
        [BsonElement("productName")]
        public string ProductName { get; set; }
        
        [BsonElement("quantity")]
        public int Quantity { get; set; }
        
        [BsonElement("unitPrice")]
        public decimal UnitPrice { get; set; }
    }
}