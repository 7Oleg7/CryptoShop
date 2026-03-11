using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CryptoShop.Backend.Models
{
    public class Review
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        
        [BsonElement("userId")]
        public string UserId { get; set; }
        
        [BsonElement("userName")]
        public string UserName { get; set; }
        
        [BsonElement("productId")]
        public string ProductId { get; set; }
        
        [BsonElement("rating")]
        public int Rating { get; set; }
        
        [BsonElement("comment")]
        public string Comment { get; set; }
        
        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}