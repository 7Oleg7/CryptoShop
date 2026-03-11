using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CryptoShop.Backend.Services;
using CryptoShop.Backend.Models;
using CryptoShop.Backend.DTOs;
using MongoDB.Driver;
using BCrypt.Net;

namespace CryptoShop.Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin,SuperAdmin")]
public class AdminController : ControllerBase
{
    private readonly MongoDbService _mongoDb;
    private readonly ILogger<AdminController> _logger;

    public AdminController(MongoDbService mongoDb, ILogger<AdminController> logger)
    {
        _mongoDb = mongoDb;
        _logger = logger;
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers([FromQuery] string? email = null)
    {
        try
        {
            var filter = Builders<User>.Filter.Empty;
            
            if (!string.IsNullOrWhiteSpace(email))
            {
                filter = Builders<User>.Filter.Regex(u => u.Email, new MongoDB.Bson.BsonRegularExpression(email, "i"));
            }

            var users = await _mongoDb.Users
                .Find(filter)
                .Project(u => new UserDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    Username = u.Username,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    PhoneNumber = u.PhoneNumber,
                    Address = u.Address,
                    Role = u.Role,
                    IsBlocked = u.IsBlocked
                })
                .ToListAsync();

            return Ok(users);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting users");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPost("user/{userId}/change-role")]
    public async Task<IActionResult> ChangeUserRole(string userId, [FromBody] string newRole)
    {
        try
        {
            var user = await _mongoDb.Users.Find(u => u.Id == userId).FirstOrDefaultAsync();
            if (user == null)
                return NotFound(new { message = "User not found" });

            user.Role = newRole;
            await _mongoDb.Users.ReplaceOneAsync(u => u.Id == userId, user);

            return Ok(new { message = $"User role updated to {newRole}" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error changing user role");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPost("user/{userId}/block")]
    public async Task<IActionResult> ToggleUserBlock(string userId)
    {
        try
        {
            var user = await _mongoDb.Users.Find(u => u.Id == userId).FirstOrDefaultAsync();
            if (user == null)
                return NotFound(new { message = "User not found" });

            user.IsBlocked = !user.IsBlocked;
            await _mongoDb.Users.ReplaceOneAsync(u => u.Id == userId, user);

            return Ok(new { isBlocked = user.IsBlocked });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error toggling user block");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpGet("products")]
    public async Task<IActionResult> GetProducts()
    {
        try
        {
            var products = await _mongoDb.Products.Find(_ => true).ToListAsync();
            return Ok(products);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting products");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPost("products")]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto createDto)
    {
        try
        {
            var product = new Product
            {
                Name = createDto.Name,
                Description = createDto.Description ?? "",
                Price = createDto.Price,
                ImageUrl = createDto.ImageUrl ?? "",
                StockQuantity = createDto.StockQuantity,
                Category = createDto.Category,
                Specifications = createDto.Specifications ?? new Dictionary<string, string>(),
                CreatedAt = DateTime.UtcNow
            };

            await _mongoDb.Products.InsertOneAsync(product);
            return Ok(product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating product");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPut("products/{productId}")]
    public async Task<IActionResult> UpdateProduct(string productId, [FromBody] UpdateProductDto updateDto)
    {
        try
        {
            var product = await _mongoDb.Products.Find(p => p.Id == productId).FirstOrDefaultAsync();
            if (product == null)
                return NotFound(new { message = "Product not found" });

            if (updateDto.Name != null)
                product.Name = updateDto.Name;
            if (updateDto.Description != null)
                product.Description = updateDto.Description;
            if (updateDto.Price.HasValue)
                product.Price = updateDto.Price.Value;
            if (updateDto.ImageUrl != null)
                product.ImageUrl = updateDto.ImageUrl;
            if (updateDto.StockQuantity.HasValue)
                product.StockQuantity = updateDto.StockQuantity.Value;
            if (updateDto.Category != null)
                product.Category = updateDto.Category;
            if (updateDto.Specifications != null)
                product.Specifications = updateDto.Specifications;

            product.UpdatedAt = DateTime.UtcNow;
            await _mongoDb.Products.ReplaceOneAsync(p => p.Id == productId, product);

            return Ok(new { message = "Product updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating product");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpDelete("products/{productId}")]
    public async Task<IActionResult> DeleteProduct(string productId)
    {
        try
        {
            var result = await _mongoDb.Products.DeleteOneAsync(p => p.Id == productId);
            
            if (result.DeletedCount == 0)
                return NotFound(new { message = "Product not found" });

            return Ok(new { message = "Product deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting product");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpGet("orders")]
    public async Task<IActionResult> GetOrders([FromQuery] string? email = null)
    {
        try
        {
            var orders = await _mongoDb.Orders
                .Find(_ => true)
                .SortByDescending(o => o.OrderDate)
                .ToListAsync();

            var orderDtos = new List<object>();
            
            foreach (var order in orders)
            {
                var user = await _mongoDb.Users.Find(u => u.Id == order.UserId).FirstOrDefaultAsync();
                
                orderDtos.Add(new
                {
                    order.Id,
                    order.OrderDate,
                    order.TotalAmount,
                    Status = order.Status,
                    order.ShippingAddress,
                    order.ContactPhone,
                    order.ContactName,
                    order.TransactionHash,
                    UserEmail = user?.Email,
                    Items = order.Items.Select(i => new
                    {
                        i.ProductId,
                        i.ProductName,
                        i.Quantity,
                        i.UnitPrice
                    })
                });
            }

            return Ok(orderDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting orders");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPut("orders/{orderId}/status")]
    public async Task<IActionResult> UpdateOrderStatus(string orderId, [FromBody] string status)
    {
        try
        {
            var order = await _mongoDb.Orders.Find(o => o.Id == orderId).FirstOrDefaultAsync();
            if (order == null)
                return NotFound(new { message = "Order not found" });

            order.Status = status;
            await _mongoDb.Orders.ReplaceOneAsync(o => o.Id == orderId, order);

            return Ok(new { message = "Order status updated" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating order status");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }
}