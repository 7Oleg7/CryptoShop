using MongoDB.Driver;
using MongoDB.Bson;
using CryptoShop.Backend.Models;
using CryptoShop.Backend.DTOs;

namespace CryptoShop.Backend.Services
{
    public class MongoDbService
    {
        private readonly IMongoDatabase _database;
        private readonly ILogger<MongoDbService> _logger;

        public MongoDbService(IConfiguration configuration, ILogger<MongoDbService> logger)
        {
            _logger = logger;
            
            try
            {
                var connectionString = configuration.GetConnectionString("MongoDb");
                var databaseName = configuration["MongoDb:DatabaseName"] ?? "olepedDb";
                                
                var settings = MongoClientSettings.FromConnectionString(connectionString);
                
                settings.SslSettings = new SslSettings
                {
                    CheckCertificateRevocation = false,
                    EnabledSslProtocols = System.Security.Authentication.SslProtocols.Tls12
                };
                
                settings.ConnectTimeout = TimeSpan.FromSeconds(30);
                settings.ServerSelectionTimeout = TimeSpan.FromSeconds(30);
                settings.MaxConnectionPoolSize = 100;
                
                var client = new MongoClient(settings);
                
                _database = client.GetDatabase(databaseName);
                
                var collections = _database.ListCollectionNames().ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Stack trace: {ex.StackTrace}");
                throw;
            }
        }

        public IMongoCollection<Product> Products => 
            _database.GetCollection<Product>("products");
        
        public IMongoCollection<User> Users => 
            _database.GetCollection<User>("users");
        
        public IMongoCollection<Order> Orders => 
            _database.GetCollection<Order>("orders");
        
        public IMongoCollection<Review> Reviews => 
            _database.GetCollection<Review>("reviews");
        
        public IMongoCollection<Category> Categories => 
            _database.GetCollection<Category>("categories");

        public async Task<List<Product>> GetProductsAsync()
        {
            try
            {
                return await Products.Find(_ => true).ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Ошибка получения продуктов: {ex.Message}");
                throw;
            }
        }

        public async Task<Product?> GetProductByIdAsync(string id)
        {
            if (!ObjectId.TryParse(id, out _))
                return null;
                
            return await Products.Find(p => p.Id == id).FirstOrDefaultAsync();
        }

        public async Task<Product> CreateProductAsync(Product product)
        {
            product.CreatedAt = DateTime.UtcNow;
            await Products.InsertOneAsync(product);
            return product;
        }

        public async Task<bool> UpdateProductAsync(string id, Product product)
        {
            if (!ObjectId.TryParse(id, out _))
                return false;
                
            product.UpdatedAt = DateTime.UtcNow;
            var result = await Products.ReplaceOneAsync(p => p.Id == id, product);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteProductAsync(string id)
        {
            if (!ObjectId.TryParse(id, out _))
                return false;
                
            var result = await Products.DeleteOneAsync(p => p.Id == id);
            return result.IsAcknowledged && result.DeletedCount > 0;
        }

        public async Task<List<Category>> GetCategoriesAsync()
        {
            return await Categories.Find(_ => true).ToListAsync();
        }

        public async Task<Category?> GetCategoryByIdAsync(string id)
        {
            if (!ObjectId.TryParse(id, out _))
                return null;
                
            return await Categories.Find(c => c.Id == id).FirstOrDefaultAsync();
        }

        public async Task<Category> CreateCategoryAsync(Category category)
        {
            await Categories.InsertOneAsync(category);
            return category;
        }

        public async Task<List<Order>> GetOrdersAsync()
        {
            return await Orders.Find(_ => true).SortByDescending(o => o.OrderDate).ToListAsync();
        }

        public async Task<List<Order>> GetUserOrdersAsync(string userId)
        {
            return await Orders.Find(o => o.UserId == userId)
                .SortByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        public async Task<Order?> GetOrderByIdAsync(string id)
        {
            if (!ObjectId.TryParse(id, out _))
                return null;
                
            return await Orders.Find(o => o.Id == id).FirstOrDefaultAsync();
        }

        public async Task<Order> CreateOrderAsync(Order order)
        {
            order.OrderDate = DateTime.UtcNow;
            order.Status = "New";
            await Orders.InsertOneAsync(order);
            
            var update = Builders<User>.Update.Push(u => u.OrderIds, order.Id);
            await Users.UpdateOneAsync(u => u.Id == order.UserId, update);
            
            return order;
        }

        public async Task<bool> UpdateOrderStatusAsync(string id, string status, string? transactionHash = null)
        {
            if (!ObjectId.TryParse(id, out _))
                return false;
                
            var update = Builders<Order>.Update.Set(o => o.Status, status);
            if (!string.IsNullOrEmpty(transactionHash))
            {
                update = update.Set(o => o.TransactionHash, transactionHash);
            }
            
            var result = await Orders.UpdateOneAsync(o => o.Id == id, update);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task<List<Review>> GetProductReviewsAsync(string productId)
        {
            return await Reviews.Find(r => r.ProductId == productId)
                .SortByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Review>> GetUserReviewsAsync(string userId)
        {
            return await Reviews.Find(r => r.UserId == userId)
                .SortByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<Review?> GetUserProductReviewAsync(string userId, string productId)
        {
            return await Reviews.Find(r => r.UserId == userId && r.ProductId == productId)
                .FirstOrDefaultAsync();
        }

        public async Task<Review> CreateReviewAsync(Review review)
        {
            review.CreatedAt = DateTime.UtcNow;
            await Reviews.InsertOneAsync(review);
            
            await UpdateProductAverageRatingAsync(review.ProductId);
            
            return review;
        }

        public async Task<bool> DeleteReviewAsync(string id)
        {
            if (!ObjectId.TryParse(id, out _))
                return false;
                
            var review = await GetReviewByIdAsync(id);
            if (review == null) return false;
            
            var result = await Reviews.DeleteOneAsync(r => r.Id == id);
            
            if (result.IsAcknowledged && result.DeletedCount > 0)
            {
                await UpdateProductAverageRatingAsync(review.ProductId);
                return true;
            }
            
            return false;
        }

        public async Task<Review?> GetReviewByIdAsync(string id)
        {
            if (!ObjectId.TryParse(id, out _))
                return null;
                
            return await Reviews.Find(r => r.Id == id).FirstOrDefaultAsync();
        }

        private async Task UpdateProductAverageRatingAsync(string productId)
        {
            var reviews = await GetProductReviewsAsync(productId);
            if (reviews.Any())
            {
                var average = reviews.Average(r => r.Rating);
                var update = Builders<Product>.Update.Set(p => p.AverageRating, average);
                await Products.UpdateOneAsync(p => p.Id == productId, update);
            }
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await Users.Find(u => u.Username == username).FirstOrDefaultAsync();
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await Users.Find(u => u.Email == email).FirstOrDefaultAsync();
        }

        public async Task<User?> GetUserByIdAsync(string id)
        {
            if (!ObjectId.TryParse(id, out _))
                return null;
                
            return await Users.Find(u => u.Id == id).FirstOrDefaultAsync();
        }

        public async Task<List<User>> GetUsersAsync()
        {
            return await Users.Find(_ => true).ToListAsync();
        }

        public async Task<bool> UpdateUserProfileAsync(string id, string? firstName, string? lastName, string? phoneNumber, string? address)
        {
            if (!ObjectId.TryParse(id, out _))
                return false;
                
            var update = Builders<User>.Update;
            var updates = new List<UpdateDefinition<User>>();
            
            if (firstName != null)
                updates.Add(update.Set(u => u.FirstName, firstName));
            if (lastName != null)
                updates.Add(update.Set(u => u.LastName, lastName));
            if (phoneNumber != null)
                updates.Add(update.Set(u => u.PhoneNumber, phoneNumber));
            if (address != null)
                updates.Add(update.Set(u => u.Address, address));
            
            if (updates.Count == 0)
                return true;
            
            var combinedUpdate = update.Combine(updates);
            var result = await Users.UpdateOneAsync(u => u.Id == id, combinedUpdate);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task<bool> ToggleUserBlockAsync(string id)
        {
            if (!ObjectId.TryParse(id, out _))
                return false;
                
            var user = await GetUserByIdAsync(id);
            if (user == null) return false;
            
            var update = Builders<User>.Update.Set(u => u.IsBlocked, !user.IsBlocked);
            var result = await Users.UpdateOneAsync(u => u.Id == id, update);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task<bool> UpdateUserRoleAsync(string id, string role)
        {
            if (!ObjectId.TryParse(id, out _))
                return false;
                
            var update = Builders<User>.Update.Set(u => u.Role, role);
            var result = await Users.UpdateOneAsync(u => u.Id == id, update);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }
    }
}