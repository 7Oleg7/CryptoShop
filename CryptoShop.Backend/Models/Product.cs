using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CryptoShop.Backend.Models
{
    public class Product
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        
        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;
        
        [BsonElement("description")]
        public string Description { get; set; } = string.Empty;
        
        [BsonElement("price")]
        public decimal Price { get; set; }
        
        [BsonElement("imageUrl")]
        public string ImageUrl { get; set; } = string.Empty;
        
        [BsonElement("stockQuantity")]
        public int StockQuantity { get; set; }
        
        [BsonElement("category")]
        public string Category { get; set; } = "Uncategorized";
        
        [BsonElement("specifications")]
        public Dictionary<string, string> Specifications { get; set; } = new();
        
        [BsonElement("averageRating")]
        public double AverageRating { get; set; } = 0;
        
        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [BsonElement("updatedAt")]
        public DateTime? UpdatedAt { get; set; }
    }
}