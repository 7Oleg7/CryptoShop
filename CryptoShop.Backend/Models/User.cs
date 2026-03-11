using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CryptoShop.Backend.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        
        [BsonElement("email")]
        public string Email { get; set; } = string.Empty;
        
        [BsonElement("username")]
        public string Username { get; set; } = string.Empty;
        
        [BsonElement("passwordHash")]
        public string PasswordHash { get; set; } = string.Empty;
        
        [BsonElement("firstName")]
        public string? FirstName { get; set; }
        
        [BsonElement("lastName")]
        public string? LastName { get; set; }
        
        [BsonElement("phoneNumber")]
        public string? PhoneNumber { get; set; }
        
        [BsonElement("address")]
        public string? Address { get; set; }
        
        [BsonElement("role")]
        public string Role { get; set; } = "User";
        
        [BsonElement("isBlocked")]
        public bool IsBlocked { get; set; } = false;
        
        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [BsonElement("orderIds")]
        public List<string> OrderIds { get; set; } = new();
    }
}